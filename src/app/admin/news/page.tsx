'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  date: string;
  image?: string;
  link?: string;
}

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.news) {
        setNews(data.news);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (newsId: string) => {
    if (confirm('Bạn có chắc muốn xóa tin tức này?')) {
      try {
        const response = await fetch('/api/news', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newsId })
        });
        
        if (response.ok) {
          setNews(prev => prev.filter(item => item._id !== newsId));
          alert('Xóa tin tức thành công!');
        } else {
          alert('Có lỗi xảy ra khi xóa tin tức');
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Có lỗi xảy ra khi xóa tin tức');
      }
    }
  };

  const handleEdit = (news: NewsItem) => {
    setEditingNews(news);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedNews: NewsItem) => {
    try {
      // Cập nhật state ngay lập tức để UI responsive
      setNews(prev => prev.map(item => 
        item._id === updatedNews._id ? updatedNews : item
      ));
      setShowEditModal(false);
      setEditingNews(null);
      alert('Cập nhật tin tức thành công!');
    } catch (error) {
      console.error('Error updating news:', error);
      alert('Có lỗi xảy ra khi cập nhật tin tức');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                ← Quay lại Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
            </div>
            <Link
              href="/admin/news/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Đăng tin tức mới
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{new Date(item.date).toLocaleDateString('vi-VN')}</span>
                  {item.link && (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Xem nguồn
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Chưa có tin tức nào</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingNews && (
        <EditNewsModal
          news={editingNews}
          onClose={() => {
            setShowEditModal(false);
            setEditingNews(null);
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

// Edit Modal Component
function EditNewsModal({ 
  news, 
  onClose, 
  onUpdate 
}: { 
  news: NewsItem; 
  onClose: () => void; 
  onUpdate: (news: NewsItem) => void;
}) {
  const [formData, setFormData] = useState({
    title: news.title,
    summary: news.summary,
    date: news.date,
    link: news.link || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (imageFile) {
        // Nếu có ảnh mới, upload trước
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('summary', formData.summary);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('link', formData.link);
        formDataToSend.append('image', imageFile);
        
        const response = await fetch(`/api/news/${news._id}`, {
          method: 'PUT',
          body: formDataToSend,
        });
        
        if (response.ok) {
          const result = await response.json();
          onUpdate(result.news);
        } else {
          alert('Có lỗi xảy ra khi cập nhật tin tức');
        }
      } else {
        // Nếu không có ảnh mới, chỉ cập nhật text
        const response = await fetch(`/api/news/${news._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          const result = await response.json();
          onUpdate(result.news);
        } else {
          alert('Có lỗi xảy ra khi cập nhật tin tức');
        }
      }
    } catch (error) {
      console.error('Error updating news:', error);
      alert('Có lỗi xảy ra khi cập nhật tin tức');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
        return;
      }
      setImageFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Sửa tin tức</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tóm tắt
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày đăng
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link nguồn (tùy chọn)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thay đổi hình ảnh (tùy chọn)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">
              Hỗ trợ: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </p>
            {imageFile && (
              <div className="mt-2">
                <p className="text-sm text-green-600">✓ Đã chọn: {imageFile.name}</p>
              </div>
            )}
            {news.image && !imageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Ảnh hiện tại: {news.image.split('/').pop()}</p>
              </div>
            )}
          </div>
          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
