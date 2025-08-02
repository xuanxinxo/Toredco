"use client";

import { Job } from "@/src/app/types/job";
import JobCard from "@/src/components/JobList/JobCard";
import JobApplyModal from "@/src/components/JobApplyModal"; // nhớ import
import Link from "next/link";
import { useState, useEffect } from "react";

interface JobListProps {
  limit?: number;
  containerClassName?: string;
}

export default function JobList({
  limit = 3,
  containerClassName = "",
}: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // ✅ thêm modal control

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/hirings?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setJobs(json.data.slice(0, limit));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="h-full w-full">
      <Header />

      <div className={`grid gap-4 max-w-4xl w-full mx-auto px-4 ${containerClassName}`}>
        {loading &&
          [...Array(limit)].map((_, i) => (
            <div key={i} className="border p-4 rounded-lg shadow-sm bg-white animate-pulse">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-6 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}

        {!loading && error && (
          <div className="text-center py-8 text-gray-500">
            {error}
            <button
              onClick={loadJobs}
              className="ml-2 text-blue-600 underline hover:text-blue-800"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Chưa có việc làm nào được đăng
          </div>
        )}

        {!loading &&
          !error &&
          jobs.map((job) => (
            <div
              className="transition-transform transform hover:-translate-y-1 hover:shadow-lg duration-300"
              key={job.id}
            >
              <JobCard job={job} onApply={() => setSelectedJob(job)} />
            </div>
          ))}
      </div>

      {selectedJob && (
        <JobApplyModal
          open={true}
          onClose={() => setSelectedJob(null)}
          job={selectedJob}
        />
      )}
    </section>
  );
}

function Header() {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 max-w-4xl mx-auto px-4">
      <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
      <Link
        href="/hirings"
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        Xem tất cả →
      </Link>
    </div>

  );
}
