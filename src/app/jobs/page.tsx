'use client';

import { useEffect, useState, useRef } from 'react';

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
  image?: string; // Nếu có trường hình ảnh
}

const DEFAULT_IMAGE = "/public/reparo-logo.png";

function ApplyModal({ open, onClose, onSubmit, job }: any) {
  const formRef = useRef<HTMLFormElement>(null);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>×</button>
        <h3 className="text-lg font-bold mb-4">Ứng tuyển: {job?.title}</h3>
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-3">
          <input name="name" placeholder="Họ tên" className="border p-2 rounded" required />
          <input name="email" placeholder="Email" className="border p-2 rounded" required type="email" />
          <input name="phone" placeholder="Số điện thoại" className="border p-2 rounded" required />
          <input name="cv" placeholder="Link CV (nếu có)" className="border p-2 rounded" />
          <textarea name="message" placeholder="Tin nhắn" className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded">Gửi ứng tuyển</button>
        </form>
      </div>
    </div>
  );
}

export default function AllJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [applyModal, setApplyModal] = useState<{open: boolean, job: any}>({open: false, job: null});
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const res = await fetch('/api/jobs');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setJobs(data.jobs || []);
        setPagination(data.pagination || {});
      } catch (err) {
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleApply = (job: any) => {
    setApplyModal({open: true, job});
  };

  const handleApplySubmit = async (e: any) => {
    e.preventDefault();
    setApplyLoading(true);
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      cv: form.cv.value,
      message: form.message.value,
      jobId: applyModal.job.id,
      hiringId: undefined,
    };
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setApplyLoading(false);
    if (res.ok) {
      alert('Ứng tuyển thành công!');
      setApplyModal({open: false, job: null});
    } else {
      alert('Ứng tuyển thất bại!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Tất cả việc làm</h1>
        <div className="text-center py-8">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tất cả việc làm</h1>
      <div className="mb-4 text-gray-600">
        Hiển thị {jobs.length} trong tổng số {pagination.total} việc làm
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map(job => (
          <div key={job.id} className="p-4 border rounded shadow flex flex-col items-center bg-white">
            <div className="font-semibold text-lg text-center">{job.title}</div>
            <div className="text-center">Công ty: {job.company}</div>
            <div className="text-center">Địa điểm: {job.location}</div>
            <div className="text-center">Loại: {job.type}</div>
            <div className="text-center">Lương: {job.salary || 'Thỏa thuận'}</div>
            <div className="text-center">Đăng ngày: {new Date(job.postedDate).toLocaleDateString()}</div>
            <div className="text-gray-600 mt-2 text-center">{job.description}</div>
            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleApply(job)}>
              Ứng tuyển
            </button>
          </div>
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Trang {pagination.page} / {pagination.totalPages}
          </p>
        </div>
      )}
      <ApplyModal open={applyModal.open} onClose={() => setApplyModal({open: false, job: null})} onSubmit={handleApplySubmit} job={applyModal.job} />
    </div>
  );
}