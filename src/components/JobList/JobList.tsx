"use client";
import { Job } from "@/src/app/types/job";
import JobCard from "@/src/components/JobList/JobCard";
import { mockJobs } from "@/src/data";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function JobList({
  limit = 3,
  containerClassName,
}: {
  limit: number;
  containerClassName: string;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // const response = await fetch('/api/jobs?limit=6&status=active');
      // const data = await response.json();

      // if (data.success) {
      //   setJobs(data.data);
      // } else {
      //   setError('Không thể tải danh sách việc làm');
      // }
      const slicedJobs = mockJobs.slice(0, limit);
      setJobs(slicedJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <section className="h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Việc làm nổi bật</h3>
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm bg-white animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          {error}
          <button
            onClick={loadJobs}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full">
      {limit === 3 && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
      )}

      <div className={containerClassName}>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có việc làm nào được đăng
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </section>
  );
}
