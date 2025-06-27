'use client';

import { useEffect, useState } from 'react';

type Review = {
  id: number;
  category: 'talent' | 'company';
  name: string;
  rating: 3 | 4 | 5;
  ava?: string;
  dob?: string;
  experience?: number;
  hometown?: string;
  avatar?: string;
};

const RANKS = [5, 4, 3] as const;

export default function ReviewRankingTable() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/reviews');
      const json = await res.json();
      setReviews(json.data as Review[]);
    })();
  }, []);

  const getTop = (cat: Review['category'], star: 3 | 4 | 5) =>
    reviews
      .filter((r) => r.category === cat && r.rating === star)
      .slice(0, 3);

  const padToThree = (arr: Review[]) => {
    const clone = [...arr];
    while (clone.length < 3) clone.push({ id: -Date.now() + clone.length, name: '', category: 'talent', rating: 3 });
    return clone;
  };

  const getStarColor = (star: number) => {
    switch (star) {
      case 5: return 'text-yellow-500';
      case 4: return 'text-orange-500';
      case 3: return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStarBg = (star: number) => {
    switch (star) {
      case 5: return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 4: return 'bg-gradient-to-br from-orange-400 to-orange-600';
      case 3: return 'bg-gradient-to-br from-blue-400 to-blue-600';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Bảng Xếp Hạng Sao
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Khám phá những nhân tài và doanh nghiệp xuất sắc nhất được đánh giá bởi cộng đồng fmfmfmfmfmf
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-purple-600">
                <th className="py-6 text-xl font-bold text-white border-r border-white/20">
                  <div className="flex items-center justify-center gap-2">
                    <span>👥 NHÂN SỰ</span>
                  </div>
                </th>
                <th className="py-6 text-xl font-bold text-white">
                  <div className="flex items-center justify-center gap-2">
                    <span>🏢 DOANH NGHIỆP</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {RANKS.map((star, index) => (
                <tr key={star} className={`${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-blue-50/50 transition-colors duration-300`}>
                  <td className="p-6 align-top border-r border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-full ${getStarBg(star)} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-lg">★</span>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-800">
                          Xếp hạng {star} sao
                        </p>
                        <p className="text-sm text-gray-500">Top performers</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {padToThree(getTop('talent', star)).map((r, idx) =>
                        r.name ? (
                          <div
                            key={r.id}
                            className={`group relative border border-gray-200 rounded-xl p-4 text-left shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 overflow-hidden ${getStarBg(star)}`}
                            style={{
                              animationDelay: `${idx * 100}ms`,
                              animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="relative">
                                  <img
                                    src={r.avatar || '/img/ava.jpg'}
                                    alt={r.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {r.name}
                                  </h4>
                                  <div className="flex items-center gap-1">
                                    {[...Array(star)].map((_, i) => (
                                      <span key={i} className={`text-sm ${getStarColor(star)}`}>★</span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">📅</span>
                                  <span>
                                    {r.dob
                                      ? new Date(r.dob).toLocaleDateString('vi-VN')
                                      : 'Chưa cập nhật'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">💼</span>
                                  <span>{r.experience || 0} năm kinh nghiệm</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs">📍</span>
                                  <span>{r.hometown || 'Chưa cập nhật'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={r.id}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-sm text-gray-400 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">📝</div>
                              <div>Đang trống</div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-full ${getStarBg(star)} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-lg">★</span>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-800">
                          Xếp hạng {star} sao
                        </p>
                        <p className="text-sm text-gray-500">Top companies</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {padToThree(getTop('company', star)).map((r, idx) =>
                        r.name ? (
                          <div
                            key={r.id}
                            className={`group relative border border-gray-200 rounded-xl p-4 text-gray-800 font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 overflow-hidden ${getStarBg(star)}`}
                            style={{
                              animationDelay: `${idx * 100}ms`,
                              animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-24 mb-2">
                              <img
                                src={r.avatar || '/img/ava.jpg'}
                                alt={r.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mb-2"
                              />
                              <div className="text-center">
                                <div className="text-lg font-bold group-hover:text-purple-600 transition-colors">
                                  {r.name}
                                </div>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                  {[...Array(star)].map((_, i) => (
                                    <span key={i} className={`text-sm ${getStarColor(star)}`}>★</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={r.id}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-sm text-gray-400 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">🏢</div>
                              <div>Đang trống</div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </section>
  );
}
