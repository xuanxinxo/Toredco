"use client";

import { Job } from "@/src/app/types/job";
import JobCard from "@/src/components/JobList/JobCard";
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

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/jobs?limit=5");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      if (json.jobs && Array.isArray(json.jobs)) {
        setJobs(json.jobs.slice(0, limit));
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

  if (loading) {
    return (
      <section>
        <Header />
        <div className="grid gap-4 max-w-3xl mx-auto px-4">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="border p-4 rounded-lg shadow-sm bg-white animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-6 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="h-full">
        <Header />
        <div className="text-center py-8 text-gray-500">
          {error}
          <button
            onClick={loadJobs}
            className="ml-2 text-blue-600 underline hover:text-blue-800"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full">
      <Header />

      <div className={`grid gap-4 max-w-3xl mx-auto px-4 ${containerClassName}`}>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có việc làm nào được đăng
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id}>
              <JobCard job={job} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* ───────────── Sub-component Header ───────────── */
function Header() {
  return (
    <div className="flex justify-between items-center mb-4 max-w-3xl mx-auto px-4">
      <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
      <Link
        href="/jobs"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Xem tất cả →
      </Link>
    </div>
  );
}
