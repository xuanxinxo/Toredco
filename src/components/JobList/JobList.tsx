'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

/* ───────────────────────────────────────────────────── */
/* Kiểu dữ liệu & mock                                  */
/* ───────────────────────────────────────────────────── */
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  status: string;
  image?: string;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Nhân viên bán hàng',
    company: 'Shop ABC',
    location: 'Đà Nẵng',
    type: 'Full-time',
    salary: '8-12 triệu',
    description: 'Bán hàng tại cửa hàng thời trang, tư vấn khách, sắp xếp hàng hóa...',
    requirements: ['Kinh nghiệm 1 năm', 'Giao tiếp tốt', 'Ngoại hình ưa nhìn'],
    benefits: ['Lương + thưởng', 'Đào tạo', 'Môi trường năng động'],
    postedDate: '2024-06-01',
    deadline: '2024-06-30',
    status: 'active',
    image: '/img/img.jpg',
  },
  {
    id: 2,
    title: 'Nhân viên IT',
    company: 'Tech Solutions',
    location: 'Hà Nội',
    type: 'Full-time',
    salary: '20-30 triệu',
    description: 'Phát triển phần mềm, bảo trì hệ thống, hỗ trợ kỹ thuật...',
    requirements: ['React/Node.js', 'Kinh nghiệm 2 năm', 'Làm việc nhóm'],
    benefits: ['Lương cạnh tranh', 'Bảo hiểm', 'Remote linh hoạt'],
    postedDate: '2024-06-02',
    deadline: '2024-06-28',
    status: 'active',
    image: '/img/ava.jpg',
  },
  {
    id: 3,
    title: 'Nhân viên marketing',
    company: 'Agency Pro',
    location: 'Hồ Chí Minh',
    type: 'Part-time',
    salary: '5-8 triệu',
    description: 'Quản lý chiến dịch quảng cáo, viết content, phân tích dữ liệu...',
    requirements: ['Kinh nghiệm 1 năm', 'Content marketing', 'Phân tích số liệu'],
    benefits: ['Thưởng hiệu suất', 'Đào tạo', 'Cơ hội thăng tiến'],
    postedDate: '2024-06-03',
    deadline: '2024-06-25',
    status: 'active',
    image: '/img/cf.jpg',
  },
];

/* ───────────────────────────────────────────────────── */
/* Component chính                                       */
/* ───────────────────────────────────────────────────── */
export default function JobList() {
  const [jobs, setJobs]   = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* Keen Slider: 1 slide / view, loop */
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    drag: false,
    slides: { perView: 1 },
  });

  /* Auto-slide 3 giây */
  useEffect(() => {
    if (!instanceRef.current) return;
    const timer = setInterval(() => instanceRef.current?.next(), 3000);
    return () => clearInterval(timer);
  }, [instanceRef]);

  /* Gọi API lấy dữ liệu */
  useEffect(() => { loadJobs(); }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs?limit=6&status=active');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      } else {
        setJobs([]);
        setError('Không thể tải danh sách việc làm');
      }
    } catch (error) {
      setJobs([]);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }

  /* ───────────── Skeleton ───────────── */
  if (loading) {
    return (
      <section className="h-full">
        <Header />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border p-4 rounded-lg bg-white animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 w-20 rounded" />
                <div className="h-6 bg-gray-200 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ───────────── Error ───────────── */
  if (error) {
    return (
      <section className="h-full">
        <Header />
        <p className="text-center py-8 text-gray-500">
          {error}{' '}
          <button
            onClick={loadJobs}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Thử lại
          </button>
        </p>
      </section>
    );
  }

  /* ───────────── UI Chính ───────────── */
  return (
    <section className="h-full">
      <Header />
      <div className="relative overflow-hidden">
        <div ref={sliderRef} className="keen-slider">
          {jobs.map(job => (
            <div
              key={job.id}
              className="keen-slider__slide border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              {job.image && (
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}

              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg text-blue-900">
                    {job.title}
                  </h4>
                  <p className="text-gray-600">
                    {job.company} – {job.location}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-sm text-white bg-blue-600 px-2 py-1 rounded">
                      {job.type}
                    </span>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {job.salary}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Xem chi tiết →
                </Link>
              </div>

              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                {job.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {job.requirements.slice(0, 2).map((req, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  >
                    {req}
                  </span>
                ))}
                {job.requirements.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{job.requirements.length - 2} yêu cầu khác
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Nút điều hướng – xoá nếu không muốn dùng */}
        {jobs.length > 1 && (
          <>
            <button
              aria-label="Trước"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 text-blue-600 rounded-full shadow p-2"
              onClick={() => instanceRef.current?.prev()}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              aria-label="Sau"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 text-blue-600 rounded-full shadow p-2"
              onClick={() => instanceRef.current?.next()}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────── */
/* Header sub-component                                 */
/* ───────────────────────────────────────────────────── */
function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
      <Link href="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
        Xem tất cả →
      </Link>
    </div>
  );
}
