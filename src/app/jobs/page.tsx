'use client';

import { useEffect, useState } from 'react';

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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Tất cả việc làm</h1>
        <div className="text-center py-8">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tất cả việc làm</h1>
      <div className="mb-4 text-gray-600">
        Hiển thị {jobs.length} trong tổng số {pagination.total} việc làm
      </div>
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job.id} className="p-4 border rounded shadow">
            <div className="font-semibold text-lg">{job.title}</div>
            <div>Công ty: {job.company} | Địa điểm: {job.location} | Loại: {job.type}</div>
            <div>Lương: {job.salary || 'Thỏa thuận'}</div>
            <div>Đăng ngày: {new Date(job.postedDate).toLocaleDateString()}</div>
            <div className="text-gray-600 mt-2">{job.description}</div>
          </li>
        ))}
      </ul>
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