"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface NewJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  status: string;
  postedDate?: string;
  deadline?: string;
}

export default function AdminNewJobs() {
  const [jobs, setJobs] = useState<NewJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadJobs();
  }, [filter]);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/admin/newjobs?status=${filter}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setJobs(json.data);
      } else {
        setError("Không thể tải danh sách việc làm");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa việc làm này?")) return;
    try {
      const res = await fetch(`/api/admin/newjobs/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setJobs(jobs.filter(j => j.id !== id));
        alert("Đã xóa thành công!");
      } else {
        alert("Xóa thất bại: " + json.message);
      }
    } catch {
      alert("Có lỗi khi xóa việc làm");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 mr-4">← Quay lại Dashboard</Link>
          <h1 className="text-xl font-bold">Quản lý việc làm TopNew</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="mr-2 font-medium">Lọc theo trạng thái:</label>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <Link href="/admin/jobnew/create" className="bg-blue-600 text-white px-4 py-2 rounded">+ Đăng việc TopNew</Link>
        </div>
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : jobs.length === 0 ? (
          <div>Không có việc làm nào.</div>
        ) : (
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Tiêu đề</th>
                <th className="p-2 text-left">Công ty</th>
                <th className="p-2 text-left">Địa điểm</th>
                <th className="p-2 text-left">Loại</th>
                <th className="p-2 text-left">Lương</th>
                <th className="p-2 text-left">Trạng thái</th>
                <th className="p-2 text-left">Hạn nộp</th>
                <th className="p-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-b">
                  <td className="p-2 font-semibold">{job.title}</td>
                  <td className="p-2">{job.company}</td>
                  <td className="p-2">{job.location}</td>
                  <td className="p-2">{job.type}</td>
                  <td className="p-2">{job.salary || 'Thỏa thuận'}</td>
                  <td className="p-2 capitalize">{job.status}</td>
                  <td className="p-2">{job.deadline ? new Date(job.deadline).toLocaleDateString() : ''}</td>
                  <td className="p-2">
                    <button className="text-red-600 hover:underline mr-2" onClick={() => handleDelete(job.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
} 