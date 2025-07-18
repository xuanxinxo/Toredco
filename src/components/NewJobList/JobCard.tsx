import { Job } from '@/src/app/types/job';
import React, { useState } from 'react';
import Modal from '@/src/components/ui/Modal';

interface NewJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type?: string;
  salary: string;
  tags: string[];
  isRemote?: boolean;
  description?: string;
  requirements: string[];
  benefits: string[];
  deadline?: string;
  status?: string;
  postedDate?: string;
  createdAt?: string;
}

export default function JobCard({ job }: { job: NewJob }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', cv: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, jobId: job.id }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      setMessage('Ứng tuyển thành công!');
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', cv: '' });
    } else {
      setMessage('Ứng tuyển thất bại!');
    }
  };

  const handleApplyClick = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || (document.cookie.match(/token=([^;]+)/)?.[1] ?? '')) : '';
    if (!token) {
      alert('Bạn cần đăng nhập để ứng tuyển!');
      window.location.href = '/login';
      return;
    }
    setShowModal(true);
  };

  return (
    <div
      key={job.id}
      className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full"
    >
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-lg text-blue-900 truncate">{job.title}</h4>
            <p className="text-gray-600">{job.company} - {job.location}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {job.type && <span className="text-sm text-white bg-blue-600 px-2 py-1 rounded">{job.type}</span>}
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{job.salary}</span>
              {job.isRemote && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Remote</span>}
              {job.status && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{job.status}</span>}
              {job.tags && job.tags.map((tag, idx) => (
                <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        {job.description && <p className="mt-2 text-gray-600 text-sm">{job.description}</p>}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mt-2">
            <span className="font-semibold text-xs text-gray-700">Yêu cầu:</span>
            <ul className="list-disc list-inside text-xs text-gray-600">
              {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
          </div>
        )}
        {job.benefits && job.benefits.length > 0 && (
          <div className="mt-2">
            <span className="font-semibold text-xs text-gray-700">Quyền lợi:</span>
            <ul className="list-disc list-inside text-xs text-gray-600">
              {job.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
          {job.deadline && <span>Hạn nộp: {new Date(job.deadline).toLocaleDateString()}</span>}
          {job.postedDate && <span>Ngày đăng: {new Date(job.postedDate).toLocaleDateString()}</span>}
        </div>
      </div>
      <div className="flex flex-row gap-2 items-stretch mt-4">
        <button
          className="flex-1 text-sm bg-green-700 text-white px-4 py-2 min-w-[100px] text-center rounded hover:bg-green-700 font-medium transition-colors whitespace-nowrap overflow-hidden text-ellipsis shadow-md"
          onClick={handleApplyClick}
        >
          Ứng tuyển
        </button>
        <a
          href={`/jobs/${job.id}`}
          className="flex-1 text-sm text-blue-600 hover:text-blue-800 font-medium text-center bg-blue-50 rounded px-4 py-2 min-w-[100px]"
        >
          Xem chi tiết →
        </a>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-lg font-bold mb-4">Ứng tuyển: {job.title}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Họ tên" className="border p-2 rounded" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" className="border p-2 rounded" required />
          <input name="cv" value={form.cv} onChange={handleChange} placeholder="Link CV" className="border p-2 rounded" required />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi ứng tuyển'}
            </button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowModal(false)}>
              Hủy
            </button>
          </div>
        </form>
        {message && <div className="mt-2 text-center text-sm text-green-700">{message}</div>}
      </Modal>
    </div>
  );
}
