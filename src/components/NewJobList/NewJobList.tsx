"use client";

import { Job } from "@/src/app/types/job";
import JobCard from "@/src/components/JobList/JobCard";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import JobCardNew from "./JobCardNew";
// import NewJobApplyModal from "../NewJobApplyModal";

interface NewJobListProps {
  limit?: number;
  containerClassName?: string;
}

export default function NewJobList({
  limit = 3,
  containerClassName = "",
}: NewJobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/newjobs?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

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
      <section className="h-full">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="border p-4 rounded-lg shadow-sm bg-white animate-pulse min-h-[260px]"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-2">
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
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${containerClassName}`}
      >
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 col-span-full">
            Chưa có việc làm nào được đăng
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="h-full">
              <JobCardNew job={job} />
              {/* <NewJobApplyModal open={showModal === job._id} onClose={() => setShowModal(null)} job={job} /> */}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 mt-5 px-4">
      <h3 className="text-2xl font-bold text-center sm:text-left">
        Việc này cũng mới 
      </h3>
      <Link
        href="/jobnew"
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        Xem tất cả việc làm mới →
      </Link>
    </div>

  );
}