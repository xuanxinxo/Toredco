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
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: [''],
    benefits: [''],
    deadline: '',
    tags: [''],
    isRemote: false
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field: 'tags' | 'requirements' | 'benefits', idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => (i === idx ? value : item))
    }));
  };

  const addArrayItem = (field: 'tags' | 'requirements' | 'benefits') =>
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] as string[]), ''] }));

  const removeArrayItem = (field: 'tags' | 'requirements' | 'benefits', idx: number) =>
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== idx)
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
          salary: formData.salary || 'Thỏa thuận',
          tags: formData.tags.filter(t => t.trim() !== ''),
          requirements: formData.requirements.filter(r => r.trim() !== ''),
          benefits: formData.benefits.filter(b => b.trim() !== '')
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
          <p className="text-gray-600 mb-4">
            Việc làm đã được tạo với trạng thái "Chờ duyệt".
          </p>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            <p className="text-sm">
              <strong>Lưu ý:</strong> Việc làm cần được admin phê duyệt trước khi hiển thị trên website.
            </p>
          </div>
          <p className="text-gray-600 mt-4">
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
        {/* Thông báo về quy trình phê duyệt */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Quy trình phê duyệt</h3>
              <div className="mt-2 text-sm">
                <p>Việc làm mới sẽ được tạo với trạng thái "Chờ duyệt". Admin cần phê duyệt trước khi việc làm được hiển thị trên website.</p>
              </div>
            </div>
          </div>
        </div>

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
                  {field === 'title' ? 'Tiêu đề việc làm' : 
                   field === 'company' ? 'Công ty' : 'Địa điểm'} *
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
                Loại việc làm *
              </label>
              <select
                required
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mức lương
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="VD: 15-20 triệu VND"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Hạn nộp hồ sơ *
              </label>
              <input
                required
                type="date"
                name="deadline"
                value={formData.deadline}
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
            </div>
          </div>

          {/* ---- DESCRIPTION ---- */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mô tả công việc *
            </label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
            />
          </div>

          {/* ---- REQUIREMENTS ---- */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Yêu cầu công việc
            </label>
            {formData.requirements.map((req, idx) => (
              <div key={idx} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={e => handleArrayChange('requirements', idx, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Kinh nghiệm 2+ năm với React"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', idx)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              + Thêm yêu cầu
            </button>
          </div>

          {/* ---- BENEFITS ---- */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Quyền lợi
            </label>
            {formData.benefits.map((benefit, idx) => (
              <div key={idx} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={e => handleArrayChange('benefits', idx, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Bảo hiểm sức khỏe, thưởng dự án"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', idx)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('benefits')}
              className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              + Thêm quyền lợi
            </button>
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
                  onChange={e => handleArrayChange('tags', idx, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: React, NodeJS"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tags', idx)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
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
