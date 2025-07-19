"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  postedDate: string;
}

const bgImages = [
  "/img/slide-1.png",
  "/img/slide-3.png",
  "/img/slide-2.png",
  "/img/slide-4.png",
];

function ApplyModal({ open, onClose, job }: { open: boolean; onClose: () => void; job: Job | null }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', cv: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) {
      setForm({ name: '', email: '', phone: '', cv: '', message: '' });
      setMessage('');
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, jobId: job?.id }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      setMessage('Ứng tuyển thành công!');
      setForm({ name: '', email: '', phone: '', cv: '', message: '' });
      setTimeout(() => onClose(), 1200);
    } else {
      setMessage('Ứng tuyển thất bại!');
    }
  };

  if (!open || !job) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold mb-4 text-blue-700">Ứng tuyển: {job.title}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Họ tên" className="border p-2 rounded" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" className="border p-2 rounded" required />
          <input name="cv" value={form.cv} onChange={handleChange} placeholder="Link CV" className="border p-2 rounded" required />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tin nhắn" className="border p-2 rounded" rows={3} />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi ứng tuyển'}
            </button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
        {message && <div className="mt-2 text-center text-sm text-green-700">{message}</div>}
      </div>
    </div>
  );
}

export default function CarouselJob() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const router = useRouter();

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs?limit=4&status=active');
        const data = await response.json();
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const nextSlide = () => {
    if (jobs.length > 0) {
      setCurrent((prev) => (prev === jobs.length - 1 ? 0 : prev + 1));
    }
  };

  useEffect(() => {
    if (jobs.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [jobs]);

  const handleApplyJob = (jobId: string) => {
    // Kiểm tra token đăng nhập (cookie hoặc localStorage)
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || (document.cookie.match(/token=([^;]+)/)?.[1] ?? '')) : '';
    if (!token) {
      alert('Bạn cần đăng nhập để ứng tuyển!');
      router.push('/login');
      return;
    }
    setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="relative w-full mt-14">
        <div className="w-full aspect-[16/9] bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Đang tải việc làm...</div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="relative w-full mt-14">
        <div className="w-full aspect-[16/9] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có việc làm</h3>
            <p className="text-gray-500">Hãy quay lại sau để xem các cơ hội mới</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mt-14">
      <section className="w-full">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
          {jobs.map((job, index) => {
            const bgSrc = bgImages[index % bgImages.length];
            return (
              <div
                key={job.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {/* Hình nền mờ */}
                <Image
                  src={bgSrc}
                  alt="background"
                  fill
                  className="object-cover opacity-40"
                  priority={index === 0}
                />
                {/* Lớp phủ gradient tối */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
                {/* Nội dung việc làm */}
                <div className="absolute inset-0 flex items-center justify-start z-20 p-8 md:p-12">
                  <div className="max-w-2xl text-white">
                    <div className="mb-4">
                      <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
                        {job.type}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                      {job.title}
                    </h2>
                    <div className="flex items-center mb-4 text-blue-200">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{job.company}</span>
                    </div>
                    <div className="flex items-center mb-4 text-blue-200">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center mb-6 text-yellow-300">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{job.salary}</span>
                    </div>
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
                      >
                        Xem chi tiết
                      </button>
                      <button 
                        onClick={() => handleApplyJob(job.id)}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Ứng tuyển ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {jobs.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
          {jobs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                current === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
      {/* Modal ứng tuyển */}
      <ApplyModal open={showApplyModal} onClose={() => setShowApplyModal(false)} job={jobs[current]} />
    </div>
  );
}
