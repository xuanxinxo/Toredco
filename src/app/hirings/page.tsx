"use client";
import { useEffect, useState } from "react";

interface JobNew {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  status: string;
  postedDate?: string;
  deadline?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
}

export default function HiringsJobNewList() {
  const [jobs, setJobs] = useState<JobNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState<string|null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', cv: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/hirings?status=approved");
      const json = await res.json();
      if (Array.isArray(json.jobs)) {
        setJobs(json.jobs);
      } else {
        setError("Không thể tải danh sách việc làm mới");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent, jobId: string) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, jobId }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      setMessage('Ứng tuyển thành công!');
      setShowModal(null);
      setForm({ name: '', email: '', phone: '', cv: '' });
    } else {
      setMessage('Ứng tuyển thất bại!');
    }
  };

  const handleApplyClick = (jobId: string) => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || (document.cookie.match(/token=([^;]+)/)?.[1] ?? '')) : '';
    if (!token) {
      alert('Bạn cần đăng nhập để ứng tuyển!');
      window.location.href = '/login';
      return;
    }
    setShowModal(jobId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <header className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
          <a href="/" className="mr-4 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium transition-colors">← Quay lại</a>
          <h1 className="text-2xl font-bold text-blue-700">Danh sách việc làm mới (JobNew)</h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="text-center text-lg text-blue-600">Đang tải...</div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500">Không có việc làm mới nào.</div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, visibleCount).map(job => (
              <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full border border-blue-100 hover:shadow-2xl transition-shadow">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-blue-800 mb-1 truncate">{job.title}</h2>
                  <div className="text-gray-600 mb-2">{job.company} - {job.location}</div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-white bg-blue-600 px-2 py-1 rounded">{job.type}</span>
                    <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">{job.salary || 'Thỏa thuận'}</span>
                    {job.status && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{job.status}</span>}
                  </div>
                  {job.description && <p className="text-gray-700 text-sm mb-2 line-clamp-2">{job.description}</p>}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-2">
                      <span className="font-semibold text-xs text-gray-700">Yêu cầu:</span>
                      <ul className="list-disc list-inside text-xs text-gray-600">
                        {job.requirements.slice(0, 2).map((req, i) => <li key={i}>{req}</li>)}
                        {job.requirements.length > 2 && <li>+{job.requirements.length - 2} yêu cầu khác</li>}
                      </ul>
                    </div>
                  )}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="mb-2">
                      <span className="font-semibold text-xs text-gray-700">Quyền lợi:</span>
                      <ul className="list-disc list-inside text-xs text-gray-600">
                        {job.benefits.slice(0, 2).map((b, i) => <li key={i}>{b}</li>)}
                        {job.benefits.length > 2 && <li>+{job.benefits.length - 2} quyền lợi khác</li>}
                      </ul>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                    {job.deadline && <span>Hạn nộp: {new Date(job.deadline).toLocaleDateString()}</span>}
                    {job.postedDate && <span>Ngày đăng: {new Date(job.postedDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <button
                  className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-600 transition-colors"
                  onClick={() => { handleApplyClick(job.id); setMessage(''); }}
                >
                  Ứng tuyển
                </button>
                {showModal === job.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(null)}>&times;</button>
                      <h2 className="text-xl font-bold mb-4 text-blue-700">Ứng tuyển: {job.title}</h2>
                      <form onSubmit={e => handleSubmit(e, job.id)} className="flex flex-col gap-3">
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Họ tên" className="border p-2 rounded" required />
                        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" className="border p-2 rounded" required />
                        <input name="cv" value={form.cv} onChange={handleChange} placeholder="Link CV" className="border p-2 rounded" required />
                        <div className="flex gap-2 mt-2">
                          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={submitting}>
                            {submitting ? 'Đang gửi...' : 'Gửi ứng tuyển'}
                          </button>
                          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowModal(null)}>
                            Hủy
                          </button>
                        </div>
                      </form>
                      {message && <div className="mt-2 text-center text-sm text-green-700">{message}</div>}
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
           {visibleCount < jobs.length && (
             <div className="flex justify-center mt-8">
               <button
                 className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
                 onClick={() => setVisibleCount(v => v + 4)}
               >
                 Xem thêm
               </button>
             </div>
           )}
          </>
        )}
      </main>
    </div>
  );
} 