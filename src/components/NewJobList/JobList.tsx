"use client";

import { Job } from "@/src/app/types/job";
import JobCard from "@/src/components/JobList/JobCard";
import Link from "next/link";
import { useState, useEffect } from "react";


import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

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

  /* Keen-Slider: 1 slide, tự chạy 3 giây */
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    drag: false,
    slides: { perView: 1 },
  });

  useEffect(() => {
    if (!instanceRef.current) return;
    const timer = setInterval(() => instanceRef.current?.next(), 3000);
    return () => clearInterval(timer);
  }, [instanceRef]);

  /* Gọi API / lấy mock data */
  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch('/api/newjobs?limit=5');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      if (json.jobs && Array.isArray(json.jobs)) {
        setJobs(json.jobs.slice(0, limit));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      // Không sử dụng mock data để đảm bảo chỉ hiển thị jobs đã phê duyệt
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  /* ───────────── Loading ───────────── */
  if (loading) {
    return (
      <section className="h-full">
        <Header />
        <div className="grid gap-4">
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

  /* ───────────── Error ───────────── */
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

  /* ───────────── UI chính ───────────── */
  return (
    <section className="h-full">
      {limit === 3 && <Header />}

      <div ref={sliderRef} className={containerClassName}>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có việc làm nào được đăngssssssssssssssss
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </section>
  );
}

/* ───────────── Sub-component Header ───────────── */
function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold">Việc làm mới nhất nè các bạn ơi </h3>
      <Link
        href="/jobs"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Xem tất cả →
      </Link>
    </div>
  );
}
