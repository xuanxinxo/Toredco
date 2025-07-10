'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Hiring {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
}

const initialForm = {
  title: '',
  company: '',
  location: '',
  type: '',
  salary: '',
  deadline: '',
};

export default function AdminHiringPage() {
  const [hirings, setHirings] = useState<Hiring[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/hirings')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHirings(data.data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/hirings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      setShowForm(false);
      setForm(initialForm);
      // Reload list
      setLoading(true);
      fetch('/api/hirings')
        .then(res => res.json())
        .then(data => {
          if (data.success) setHirings(data.data);
          setLoading(false);
        });
    } else {
      alert('Đăng Hiring thất bại!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Hiring</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowForm(!showForm)}
        >
          + Đăng Hiring mới
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Tiêu đề" className="border p-2 rounded" required />
          <input name="company" value={form.company} onChange={handleChange} placeholder="Công ty" className="border p-2 rounded" required />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Địa điểm" className="border p-2 rounded" required />
          <input name="type" value={form.type} onChange={handleChange} placeholder="Loại" className="border p-2 rounded" required />
          <input name="salary" value={form.salary} onChange={handleChange} placeholder="Lương" className="border p-2 rounded" required />
          <input name="deadline" value={form.deadline} onChange={handleChange} placeholder="Hạn nộp (YYYY-MM-DD)" className="border p-2 rounded" required />
          <div className="col-span-2 flex gap-2 mt-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={submitting}>
              {submitting ? 'Đang đăng...' : 'Đăng Hiring'}
            </button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowForm(false)}>
              Hủy
            </button>
          </div>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lương</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn nộp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Đang tải...</td></tr>
            ) : hirings.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">Không có Hiring nào</td></tr>
            ) : (
              hirings.map(hiring => (
                <tr key={hiring.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{hiring.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hiring.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hiring.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hiring.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hiring.salary}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hiring.deadline ? new Date(hiring.deadline).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:underline mr-2">Sửa</button>
                    <button className="text-red-600 hover:underline">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 