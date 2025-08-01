'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import HiringFilter from './HiringFilter';
import ApplyForm from './ApplyForm';

export function HiringList() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8); // 👈 hiển thị 8 ứng viên đầu

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch('/api/candidates');
        const json = await res.json();
        if (json.success) {
          setCandidates(json.data);
        } else {
          setError('Không thể tải dữ liệu');
        }
      } catch (e) {
        setError('Có lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);

  if (loading) return <div className="text-center py-20 text-lg">Đang tải...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <section className="w-full bg-white py-16">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Tiêu đề */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3">Danh sách ứng viên</h2>
          <p className="text-gray-600 text-lg">Hồ sơ ứng viên mới nhất</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {candidates.slice(0, visibleCount).map((candidate, index) => {
            const hiring = candidate.hiring;
            return (
              <div
                key={candidate.id}
                className="relative bg-gradient-to-r from-blue-200 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 p-6">
                  {hiring?.img && (
                    <img src={hiring.img} alt={`${hiring?.company} logo`} className="h-12 w-auto mb-4 object-contain" />
                  )}
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{candidate.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">📧 Email: {candidate.email}</p>
                  <p className="text-sm text-gray-600 mb-3">📞 Phone: {candidate.phone}</p>

                  {hiring && (
                    <>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
                          {hiring.type}
                        </span>
                        <span className="text-sm bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded-full font-medium">
                          💰 {hiring.salary}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-3 mb-4">{candidate.message}</p>

                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">📋 Yêu cầu chính:</h5>
                        <div className="flex flex-wrap gap-2">
                          {hiring.requirements.slice(0, 2).map((req: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-md border border-gray-300"
                            >
                              {req}
                            </span>
                          ))}
                          {hiring.requirements.length > 2 && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-300">
                              +{hiring.requirements.length - 2} yêu cầu khác
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span>📅 {new Date(hiring.postedDate).toLocaleDateString('vi-VN')}</span>
                        <span>⏰ {new Date(hiring.deadline).toLocaleDateString('vi-VN')}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <Link
                          href={`/hiring/${hiring.id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Chi tiết →
                        </Link>
                        <button
                          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                          onClick={() => setShowApplyModal(hiring.id)}
                        >
                          Ứng tuyển
                        </button>
                      </div>

                      {showApplyModal === hiring.id && (
                        <ApplyForm hiringId={hiring.id} onClose={() => setShowApplyModal(null)} />
                      )}
                    </>
                  )}

                  {candidate.cv && (
                    <div className="mt-3">
                      <a
                        href={candidate.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        📄 Xem CV
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nút xem thêm nếu còn ứng viên */}
        {/* {visibleCount < candidates.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount(visibleCount + 4)}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Xem thêm
            </button>
          </div>
        )} */}

        {/* Nút xem tất cả */}
        <div className="text-center mt-12">
          <Link
            href="/#"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Xem tất cả các ứng viên tại đây nhé
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Bộ lọc */}
        <div className="mt-16">
          <HiringFilter />
        </div>
      </div>
    </section>
  );
}
