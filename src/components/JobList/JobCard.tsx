import { Job } from '@/src/app/types/job';
import React, { useState } from 'react';
import Modal from '@/src/components/ui/Modal';

export default function JobCard({ job }: { job: Job }) {
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
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') ||
          document.cookie.match(/token=([^;]+)/)?.[1] ||
          ''
        : '';
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
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg text-blue-900 truncate">
              {job.title}
            </h4>
            <p className="text-gray-600 truncate">
              {job.company} - {job.location}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-sm text-white bg-blue-600 px-2 py-1 rounded">
                {job.type}
              </span>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {job.salary}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {(Array.isArray(job.requirements) ? job.requirements.slice(0, 2) : []).map((req, index) => (
            <span
              key={index}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
            >
              {req}
            </span>
          ))}
          {Array.isArray(job.requirements) && job.requirements.length > 2 && (
            <span className="text-xs text-gray-500">
              +{job.requirements.length - 2} yêu cầu khác
            </span>
          )}
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={handleApplyClick}
          className="w-full sm:w-auto text-sm bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 font-medium shadow"
        >
          Ứng tuyển
        </button>
        <a
          href={`/jobs/${job.id}`}
          className="w-full sm:w-auto text-sm text-blue-600 hover:text-blue-800 font-medium text-center bg-blue-50 rounded px-4 py-2"
        >
          Xem chi tiết →
        </a>
      </div>

      {/* Modal ứng tuyển */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-lg font-bold mb-4">Ứng tuyển: {job.title}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Họ tên" className="border p-2 rounded" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" className="border p-2 rounded" required />
          <input name="cv" value={form.cv} onChange={handleChange} placeholder="Link CV" className="border p-2 rounded" required />
          <div className="flex gap-2 mt-2 flex-col sm:flex-row">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50" disabled={submitting}>
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
