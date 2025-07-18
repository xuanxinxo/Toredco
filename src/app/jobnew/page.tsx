'use client';

import { useEffect, useState } from 'react';

interface NewJob {
  id: string;
  benefits: string[];
  company: string;
  createdAt: string;
  deadline: string;
  description: string;
  isRemote: boolean;
  location: string;
  postedDate: string;
  requirements: string[];
  salary: string;
  status: string;
  tags: string[];
  title: string;
  type: string;
}

export default function NewJobsPage() {
  const [jobs, setJobs] = useState<NewJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const res = await fetch('/api/newjobs');
        if (!res.ok) throw new Error('Lỗi khi tải dữ liệu');
        const data = await res.json();
        setJobs(data.jobs || []);
        setPagination(data.pagination || {});
      } catch (err) {
        console.error('Error loading newjobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Tất cả việc làm mới</h1>
        <div className="text-center py-8">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tất cả việc làm mới</h1>
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
            <div className="text-gray-600 mt-2 text-center line-clamp-3">{job.description}</div>
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {job.tags && job.tags.map((tag, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
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
    </div>
  );
}

