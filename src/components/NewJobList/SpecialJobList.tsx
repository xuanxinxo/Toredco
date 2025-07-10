import React, { useEffect, useState } from 'react';

interface SpecialJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string | number;
  tags?: string[];
  isRemote?: boolean;
  createdAt?: string;
}

export default function SpecialJobList() {
  const [jobs, setJobs] = useState<SpecialJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      setError('');
      // Đổi endpoint này thành API bạn muốn lấy 4 job đặc biệt
      const res = await fetch('/api/admin/newjobs/custom');
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setJobs(json.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {jobs.map(job => (
        <div key={job._id} className="border p-4 rounded-lg shadow-sm bg-white flex flex-col h-full">
          <h4 className="font-semibold text-lg text-blue-900 truncate">{job.title}</h4>
          <p className="text-gray-600">{job.company} - {job.location}</p>
          <div className="mt-2 flex gap-2">
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{job.salary}</span>
            {job.isRemote && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Remote</span>}
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {job.tags.map((tag, idx) => (
                <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{tag}</span>
              ))}
            </div>
          )}
          {job.createdAt && (
            <div className="mt-2 text-xs text-gray-400">Ngày tạo: {new Date(job.createdAt).toLocaleDateString('vi-VN')}</div>
          )}
        </div>
      ))}
    </div>
  );
} 