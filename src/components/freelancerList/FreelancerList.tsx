'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Freelancer {
  id: number;
  name: string;
  skill: string;
  exp: string;
  avatar: string;
  rating: number;
  completedJobs: number;
  description: string;
  skills: string[];
  portfolio: string[];
  avgRating?: number;
  reviewCount?: number;
}

// Dữ liệu mẫu
const freelancers: Freelancer[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    skill: "Thiết kế",
    exp: "2 năm",
    avatar: "/avatars/user1.jpg",
    rating: 4.8,
    completedJobs: 15,
    description: "Chuyên thiết kế UI/UX cho website và ứng dụng di động, có kinh nghiệm với Figma và Adobe XD...",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Photoshop"],
    portfolio: ["Dự án A", "Dự án B", "Dự án C"]
  },
  {
    id: 2,
    name: "Trần Thị B",
    skill: "Pha chế",
    exp: "1 năm",
    avatar: "/avatars/user2.jpg",
    rating: 4.5,
    completedJobs: 8,
    description: "Chuyên pha chế các loại cà phê và trà sữa, có chứng chỉ barista chuyên nghiệp...",
    skills: ["Barista", "Latte Art", "Menu Development"],
    portfolio: ["Quán Cafe X", "Quán Trà Y"]
  }
];

export default function FreelancerList() {
  const [freelancersWithAvg, setFreelancersWithAvg] = useState<Freelancer[]>(freelancers);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        const reviews = data.data || [];

        // Gom rating theo userId
        const freelancerRatings: Record<number, number[]> = {};
        reviews.forEach((r: { userId: number; rating: number }) => {
          if (!freelancerRatings[r.userId]) freelancerRatings[r.userId] = [];
          freelancerRatings[r.userId].push(r.rating);
        });

        const result = freelancers.map(f => {
          const ratings = freelancerRatings[f.id] || [];
          const avgRating = ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : f.rating;
          return {
            ...f,
            avgRating,
            reviewCount: ratings.length
          };
        }).sort((a, b) => b.avgRating! - a.avgRating!); // sắp xếp theo điểm trung bình

        setFreelancersWithAvg(result);
      } catch (error) {
        console.error("Lỗi khi fetch /api/reviews:", error);
        setFreelancersWithAvg(freelancers);
      }
    }

    fetchReviews();
  }, []);

  return (
    <section className="h-full bg-gray-50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Ứng viên nổi bật</h3>
        <Link href="/freelancers" className="text-blue-600 hover:text-blue-800 font-medium">
          Xem tất cả →
        </Link>
      </div>

      <div className="grid gap-4">
        {freelancersWithAvg.map(freelancer => (
          <div
            key={freelancer.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {freelancer.avatar ? (
                    <Image
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {freelancer.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900">{freelancer.name}</h4>
                  <p className="text-sm text-gray-600">
                    {freelancer.skill} - {freelancer.exp} kinh nghiệm
                  </p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.round(freelancer.avgRating ?? freelancer.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      {(freelancer.avgRating ?? freelancer.rating).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({freelancer.reviewCount ?? 0} đánh giá)
                    </span>
                    <span className="text-sm text-gray-500">
                      ({freelancer.completedJobs} dự án)
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/freelancers/${freelancer.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Xem chi tiết →
              </Link>
            </div>

            <p className="mt-3 text-gray-600 text-sm line-clamp-2">
              {freelancer.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {freelancer.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {freelancer.skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{freelancer.skills.length - 3} kỹ năng khác
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
