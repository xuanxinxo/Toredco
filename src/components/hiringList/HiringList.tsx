'use client';
import Link from 'next/link';
import HiringFilter from './HiringFilter';
import { useEffect, useState } from 'react';
import ApplyForm from './ApplyForm';

export function HiringList() {
  const [hirings, setHirings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState<string|null>(null);

  useEffect(() => {
    async function fetchHirings() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/hirings');
        const json = await res.json();
        if (json.success) {
          setHirings(json.data);
        } else {
          setError('Không thể tải dữ liệu');
        }
      } catch (e) {
        setError('Có lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }
    fetchHirings();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 bg-black bg-opacity-10 p-6 rounded-lg shadow-lg">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Người tuyển đang cần
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl">
            Khám phá những cơ hội việc làm hấp dẫn từ các doanh nghiệp uy tín
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {hirings.slice(0, 3).map((hiring, index) => (
            <div 
              key={hiring.id} 
              className="group relative bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                      {hiring.title}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">🏢</span>
                      <span className="font-medium">{hiring.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">📍</span>
                      <span>{hiring.location}</span>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <span className="text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 rounded-full font-medium shadow-md">
                        {hiring.type}
                      </span>
                      <span className="text-sm text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">
                        💰 {hiring.salary}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/hiring/${hiring.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                  >
                    Chi tiết →
                  </Link>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {hiring.description}
                </p>
                
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs">📋</span>
                    Yêu cầu chính:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {hiring.requirements.slice(0, 2).map((req, idx) => (
                      <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                        {req}
                      </span>
                    ))}
                    {hiring.requirements.length > 2 && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                        +{hiring.requirements.length - 2} yêu cầu khác
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">📅</span>
                    <span>Đăng: {new Date(hiring.postedDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">⏰</span>
                    <span>Hạn: {new Date(hiring.deadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setShowApplyModal(hiring.id)}
                >
                  Ứng tuyển
                </button>
              </div>
              {showApplyModal === hiring.id && (
                <ApplyForm hiringId={hiring.id} onClose={() => setShowApplyModal(null)} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/hirings" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Xem tất cả cơ hội việc làm
            <span className="text-lg">→</span>
          </Link>
        </div>
        <HiringFilter />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
