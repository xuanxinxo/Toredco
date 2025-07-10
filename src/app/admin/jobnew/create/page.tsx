'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateJob() {
  const router = useRouter();

  /** -------------------- State -------------------- */
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',       // sẽ ép về number trước khi gửi
    tags: [''],       // nhập động
    isRemote: false   // công tắc bật / tắt
  });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  /** -------------------- Auth check -------------------- */
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) router.push('/admin/login');
  }, [router]);

  /** -------------------- Helpers -------------------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((t, i) => (i === idx ? value : t))
    }));
  };

  const addTag = () =>
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));

  const removeTag = (idx: number) =>
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== idx)
    }));

  /** -------------------- Submit -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/newjobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          salary: Number(formData.salary) || 0,
          tags: formData.tags.filter(t => t.trim() !== '')
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/admin/newjobs'), 2000);
      } else setError(data.message || 'Đã có lỗi xảy ra');
    } catch {
      setError('Đã có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  /** -------------------- UI -------------------- */
  if (success)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">
            Tạo việc làm thành công!
          </h2>
          <p className="text-gray-600">
            Đang chuyển hướng về trang quản lý...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 flex items-center h-16">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← Quay lại
          </button>
          <h1 className="text-xl font-bold">Đăng việc làm mới</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* ---- BASIC FIELDS ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['title', 'company', 'location'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {field} *
                </label>
                <input
                  required
                  type="text"
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">
                Mức lương *
              </label>
              <input
                required
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600"
              />
              <label htmlFor="isRemote" className="text-sm font-medium">
                Remote
              </label>
            </div>
          </div>

          {/* ---- TAGS ---- */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (kỹ năng / từ khóa)
            </label>
            {formData.tags.map((tag, idx) => (
              <div key={idx} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={e => handleTagChange(idx, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: React, NodeJS"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              + Thêm tag
            </button>
          </div>

          {/* ---- ACTIONS ---- */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang tạo...' : 'Tạo việc làm'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
