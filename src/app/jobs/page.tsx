"use client";

export const dynamic = "force-dynamic";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  deadline?: string;
  status: string;
  postedDate: string;
  img?: string;
}

function ApplyModal({ open, onClose, onSubmit, job }: any) {
  const formRef = useRef<HTMLFormElement>(null);
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 text-xl hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Ứng tuyển: {job?.title}
        </h3>
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
          <input name="name" placeholder="Họ tên" className="border p-2 rounded" required />
          <input name="email" placeholder="Email" className="border p-2 rounded" required type="email" />
          <input name="phone" placeholder="Số điện thoại" className="border p-2 rounded" required />
          <input name="cv" placeholder="Link CV (nếu có)" className="border p-2 rounded" />
          <textarea name="message" placeholder="Tin nhắn" className="border p-2 rounded" rows={4} />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded font-semibold hover:shadow-lg transition-all"
          >
            Gửi ứng tuyển
          </button>
        </form>
      </div>
    </div>
  );
}

export function AllJobsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });

  const [applyModal, setApplyModal] = useState<{ open: boolean; job: any }>({
    open: false,
    job: null,
  });

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    setPagination((prev) => ({ ...prev, page: currentPage }));
  }, [searchParams]);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs?page=${pagination.page}&limit=${pagination.limit}`);
        const data = await res.json();
        setJobs(data.jobs || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      } catch (error) {
        console.error("Lỗi khi tải jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [pagination.page, pagination.limit]);

  const handleApply = (job: Job) => {
    setApplyModal({ open: true, job });
  };

  const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.name as any).value,
      email: (form.email as any).value,
      phone: (form.phone as any).value,
      cv: (form.cv as any).value,
      message: (form.message as any).value,
      jobId: applyModal.job.id,
    };
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      alert("Ứng tuyển thành công!");
      setApplyModal({ open: false, job: null });
    } else {
      alert("Ứng tuyển thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-left">Tất cả việc làm</h1>
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-all"
        >
          ← Quay lại
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
          Danh sách việc làm nổi bật
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md p-5 flex flex-col justify-between"
          >
            <div className="flex gap-4 items-start">
              {/* Bên trái: Thông tin công việc */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-600 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-700 mb-1">Công ty: {job.company}</p>
                <p className="text-sm text-gray-600">Địa điểm: {job.location}</p>
                <p className="text-sm text-gray-600">Loại hình: {job.type}</p>
                <p className="text-sm text-gray-600">Lương: {job.salary || "Thỏa thuận"}</p>
                <p className="text-sm text-gray-400">
                  Đăng ngày: {new Date(job.postedDate).toLocaleDateString("vi-VN")}
                </p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{job.description}</p>
              </div>

              {/* Bên phải: Hình ảnh */}
              {job.img && (
                <div className="w-24 h-24 bg-white rounded-md shadow-sm overflow-hidden">
                  <img
                    src={job.img}
                    alt={`${job.company} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => handleApply(job)}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-4 py-2 rounded hover:scale-105 transition-all font-semibold"
            >
              Ứng tuyển
            </button>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <>
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => router.push(`/jobs?page=${pagination.page - 1}`)}
            >
              {"<"} Trước
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`px-3 py-1 rounded ${p === pagination.page ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                onClick={() => router.push(`/jobs?page=${p}`)}
              >
                {p}
              </button>
            ))}

            <button
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => router.push(`/jobs?page=${pagination.page + 1}`)}
            >
              Tiếp {">"}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Trang {pagination.page} / {pagination.totalPages}
          </div>
        </>
      )}

      <ApplyModal
        open={applyModal.open}
        onClose={() => setApplyModal({ open: false, job: null })}
        onSubmit={handleApplySubmit}
        job={applyModal.job}
      />
    </div>
  );
}

// 👇 Đây là component chính được export (bọc <Suspense>)
export default function JobsPageWrapper() {
  return (
    <Suspense fallback={<div>Đang tải việc làm...</div>}>
      <AllJobsPageContent />
    </Suspense>
  );
}
