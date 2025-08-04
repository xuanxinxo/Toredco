'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  postedDate: string;
  img?: string;
}

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
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>
          &times;
        </button>
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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const router = useRouter();

  const jobsPerPage = 6;
  const bgImages = ['/img/slide-1.png', '/img/slide-2.png'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs?limit=16&status=active');
        const data = await response.json();
        if (data.jobs) {
          setJobs(data.jobs.slice(0, 16));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % 2);
    }, 25000);
    return () => clearInterval(timer);
  }, []);

  const handleApplyJob = (job: Job) => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token') || (document.cookie.match(/token=([^;]+)/)?.[1] ?? '')
      : '';
    if (!token) {
      alert('Bạn cần đăng nhập để ứng tuyển!');
      router.push('/login');
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="w-full mt-14">
        <div className="text-center py-10 text-gray-500 animate-pulse">Đang tải việc làm...</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="w-full mt-14">
        <div className="text-center py-10 text-gray-500">Hiện chưa có việc làm nào phù hợp.</div>
      </div>
    );
  }

  const currentJobs = jobs.slice(currentPage * jobsPerPage, (currentPage + 1) * jobsPerPage);

  return (
    <div className="w-full bg-gray-50 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 opacity-20 blur-sm"
        style={{ backgroundImage: `url(${bgImages[currentPage]})` }}
      />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Việc làm nổi bật</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border rounded-2xl p-6 shadow-lg hover:shadow-xl transition relative flex flex-col h-full overflow-hidden transform hover:-translate-y-1 duration-300"
              >
                <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                  <div className="flex items-start gap-3">
                    <img
                      src={job.img || "/img/job-icon.svg"}
                      alt="Logo"
                      className="w-16 h-16 object-contain shrink-0"
                    />
                    <h3 className="text-lg font-semibold text-blue-700 line-clamp-2">{job.title}</h3>
                  </div>
                  <p className="text-gray-700 text-base">{job.company}</p>
                  <p className="text-blue-600 text-base font-medium">{job.salary}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
                <div className="flex justify-between items-center mt-4 text-xs">
                  <span className="text-gray-500">{new Date(job.postedDate).toLocaleDateString("vi-VN")}</span>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApplyJob(job)}
                      className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 whitespace-nowrap"
                    >
                      Ứng tuyển
                    </button>
                    <Link
                      href={`/banner/${job.id}`}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 whitespace-nowrap"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>


              </div>
            ))}
          </div>


          <div className="flex justify-center mt-6 space-x-2">
            {[0, 1].map((i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${i === currentPage ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => setCurrentPage(i)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link href={`/jobs?page=${currentPage + 1}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              Xem thêm việc làm →
            </Link>
          </div>
        </div>
      </div>

      <ApplyModal open={showApplyModal} onClose={() => setShowApplyModal(false)} job={selectedJob} />
    </div>
  );
}
