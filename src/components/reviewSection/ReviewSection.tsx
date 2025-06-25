'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function ReviewSection() {
  const [groupedReviews, setGroupedReviews] = useState<Record<string, any[]>>({});
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        const reviews = data?.data || [];

        // Nhóm theo category
        const groups: Record<string, any[]> = {};
        reviews.forEach((r: any) => {
          if (!groups[r.category]) groups[r.category] = [];
          groups[r.category].push(r);
        });

        // Sắp xếp từng nhóm theo rating giảm dần
        for (const category in groups) {
          groups[category].sort((a, b) => b.rating - a.rating);
        }

        setGroupedReviews(groups);
        setCategories(Object.keys(groups));
      } catch (error) {
        console.error('Lỗi khi tải đánh giá:', error);
      }
    }

    fetchReviews();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold">Bảng xếp hạng đánh giá theo hạng mục</h3>
            <p className="text-gray-600 mt-1">Xếp hạng sao từ các doanh nghiệp và freelancer</p>
          </div>
          <Link href="/reviews" className="text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả →
          </Link>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-10">
            <h4 className="text-xl font-semibold mb-4 capitalize">
              {category === 'employer' ? 'Doanh nghiệp' : 'Freelancer'}
            </h4>

            <div className="grid md:grid-cols-3 gap-6">
              {groupedReviews[category]?.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {review.name?.charAt(0) || '?'}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-blue-900">{review.name}</h4>
                          <p className="text-sm text-gray-600">{review.role}</p>
                        </div>
                        {review.verified && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            Đã xác minh
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600 text-sm line-clamp-3">{review.comment}</p>

                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {review.date ? new Date(review.date).toLocaleDateString('vi-VN') : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-500 hover:text-blue-600 transition-colors">
                        <span className="mr-1">👍</span>
                        {review.likes}
                      </button>
                      <Link
                        href={`/reviews/${review.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Xem thêm
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* <div className="mt-8 text-center">
          <Link
            href="/reviews/write"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Viết đánh giá của bạn
          </Link>
        </div> */}
      </div>
    </section>
  );
}
