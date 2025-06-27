'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export interface Job {
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
    async function loadJobs() {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs?limit=6&status=active');
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setJobs(data.data);
        } else {
          setError('Không thể tải danh sách việc làm');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Việc làm mới nhất</h2>
      {jobs.length === 0 ? (
        <div>Chưa có việc làm nào được đăng</div>
      ) : (
        <ul>
          {jobs.map(job => (
            <li key={job.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold text-blue-900">{job.title}</h3>
              <div>{job.company} - {job.location}</div>
              <div>{job.type} | {job.salary}</div>
              <div className="text-gray-600">{job.description}</div>
              <div>
                <b>Yêu cầu:</b> {Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements}
              </div>
              <div>
                <b>Quyền lợi:</b> {Array.isArray(job.benefits) ? job.benefits.join(', ') : job.benefits}
              </div>
              <div>
                <b>Hạn nộp:</b> {job.deadline}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
