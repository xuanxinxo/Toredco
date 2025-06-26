'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  status: string;
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs?limit=6&status=active');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      } else {
        setJobs([]);
        setError('Không thể tải danh sách việc làm');
      }
    } catch (error) {
      setJobs([]);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm bg-white animate-pulse">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả →
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          {error}
          <button 
            onClick={loadJobs}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
        <Link href="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
          Xem tất cả →
        </Link>
      </div>
      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có việc làm nào được đăng
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg text-blue-900">{job.title}</h4>
                  <p className="text-gray-600">{job.company} - {job.location}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-sm text-white bg-blue-600 px-2 py-1 rounded">{job.type}</span>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{job.salary}</span>
                  </div>
                </div>
                <Link 
                  href={`/jobs/${job.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Xem chi tiết →
                </Link>
              </div>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">{job.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.requirements.slice(0, 2).map((req, index) => (
                  <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {req}
                  </span>
                ))}
                {job.requirements.length > 2 && (
                  <span className="text-xs text-gray-500">+{job.requirements.length - 2} yêu cầu khác</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
