"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { Job } from "../jobs/page";
import { SuspenseBoundary } from "@/src/components/SuspenseBoundary";
export default function SearchResultsPage() {
  return (
    <SuspenseBoundary>
      <SearchContent />
    </SuspenseBoundary>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jobTitle = searchParams.get("search") || "";
  const province = searchParams.get("location") || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNoJobsMessage, setShowNoJobsMessage] = useState(false);
  const [applyModal, setApplyModal] = useState<{ open: boolean; job: Job | null }>({
    open: false,
    job: null,
  });

  // Gửi form ứng tuyển
  const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      cv: formData.get('cv') as string,
      message: formData.get('message') as string,
      jobId: applyModal.job?.id,
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Ứng tuyển thất bại!");

      alert("Ứng tuyển thành công!");
      setApplyModal({ open: false, job: null });
      form.reset();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra!");
    }
  };

  // Lấy dữ liệu jobs từ API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      setShowNoJobsMessage(false);

      try {
        const params = new URLSearchParams();
        if (jobTitle) {
          params.append("search", jobTitle);
        }
        if (province) params.append("location", province);

        const res = await fetch(`/api/jobs?${params.toString()}`);
        if (!res.ok) throw new Error("Không thể kết nối đến máy chủ");

        const text = await res.text();
        if (!text) {
          setJobs([]);
          setShowNoJobsMessage(true);
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }

        if (!data.jobs || !Array.isArray(data.jobs) || data.jobs.length === 0) {
          setJobs([]);
          setShowNoJobsMessage(true);
          return;
        }

        setJobs(data.jobs);
        setShowNoJobsMessage(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
        setError(errorMessage);
        setJobs([]);
        setShowNoJobsMessage(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobTitle, province]);

  // Clear the no jobs message when navigating away
  useEffect(() => {
    return () => {
      setShowNoJobsMessage(false);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10">
      {error ? (
        // Trạng thái lỗi
        <div className="text-center py-12">
          <div className="text-red-600 bg-red-100 p-4 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => {
                setError("");
                router.push("/search");
              }}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : loading ? (
        // Trạng thái loading
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
          {jobTitle && <p className="mt-2 text-sm text-gray-500">Từ khóa: "{jobTitle}"</p>}
          {province && <p className="mt-2 text-sm text-gray-500">Tỉnh/Thành phố: {province}</p>}
        </div>
      ) : (
        <>
          {/* Modal ứng tuyển */}
          {applyModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <button
                  className="absolute top-3 right-3 text-gray-500 text-xl hover:text-red-500"
                  onClick={() => setApplyModal({ open: false, job: null })}
                >
                  ×
                </button>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Ứng tuyển: {applyModal.job?.title}
                </h3>
                <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
                  <input name="name" placeholder="Họ tên" className="border p-2 rounded" required />
                  <input name="email" placeholder="Email" className="border p-2 rounded" required type="email" />
                  <input name="phone" placeholder="Số điện thoại" className="border p-2 rounded" required />
                  <input name="cv" placeholder="Link CV (nếu có)" className="border p-2 rounded" />
                  <textarea name="message" placeholder="Lời nhắn (tùy chọn)" className="border p-2 rounded h-32" />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Gửi đơn
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Danh sách jobs */}
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Không tìm thấy việc làm phù hợp
                {jobTitle && ` với "${jobTitle}"`}
                {province && ` tại ${province}`}
              </p>
              <Link href="/jobs" className="mt-4 text-blue-600 hover:underline font-semibold">
                Xem tất cả việc làm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-700">Công ty: {job.company}</p>
                    <p className="text-sm text-gray-600">Địa điểm: {job.location}</p>
                    <p className="text-sm text-gray-600">Loại hình: {job.type}</p>
                    <p className="text-sm text-gray-600">Lương: {job.salary || "Thỏa thuận"}</p>
                    {job.postedDate && (
                      <p className="text-sm text-gray-400">
                        Đăng ngày: {new Date(job.postedDate).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{job.description}</p>

                    {job.img && (
                      <div className="w-24 h-24 mt-3 bg-white rounded-md shadow-sm overflow-hidden">
                        <img src={job.img} alt={`${job.company} logo`} className="w-full h-full object-contain" />
                      </div>
                    )}

                    <button
                      onClick={() => setApplyModal({ open: true, job })}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-4 py-2 rounded hover:scale-105 transition-all font-semibold"
                    >
                      Ứng tuyển
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
