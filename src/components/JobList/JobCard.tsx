"use client";

import { Job } from "@/src/app/types/job";
import Link from "next/link";

export default function JobCard({
  job,
  onApply,
}: {
  job: Job;
  onApply: () => void;
}) {
  return (
    <div className="border p-3 rounded-lg shadow-sm bg-white w-full max-w-full overflow-hidden">
      {/* Nội dung chính */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        {/* Thông tin việc làm */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm sm:text-base text-blue-900 break-words line-clamp-1">
            {job.title}
          </h4>
          <p className="text-gray-600 text-xs truncate">
            {job.company} - {job.location}
          </p>

          {/* Tags */}
          <div className="flex gap-1 flex-wrap mt-1">
            {job.type && (
              <span className="text-[10px] text-white bg-blue-600 px-1.5 py-0.5 rounded">
                {job.type}
              </span>
            )}
            {job.salary && (
              <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                {job.salary}
              </span>
            )}
          </div>

          <p className="text-gray-700 text-xs mt-1 line-clamp-1">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-1 mt-1">
            {(Array.isArray(job.requirements)
              ? job.requirements.slice(0, 1)
              : []
            ).map((req, i) => (
              <span
                key={i}
                className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
              >
                {req}
              </span>
            ))}
            {Array.isArray(job.requirements) && job.requirements.length > 1 && (
              <span className="text-[10px] text-gray-500">
                +{job.requirements.length - 1} yêu cầu khác
              </span>
            )}
          </div>
        </div>

        {job.img && (
          <div className="flex-shrink-0 w-12 h-12 sm:ml-3">
            <img
              src={job.img}
              alt={`${job.company} logo`}
              className="w-full h-full object-contain rounded-md border"
            />
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex flex-col sm:flex-row gap-2 mt-3">
        <button
          onClick={onApply}
          className="w-full sm:w-auto text-xs bg-green-700 text-white px-3 py-1.5 rounded hover:bg-green-800 font-medium text-center"
        >
          Ứng tuyển
        </button>
        <Link
          href={`/detailjobs/${job.id}`}
          className="w-full sm:w-auto text-xs text-blue-600 hover:text-blue-800 font-medium text-center bg-blue-50 rounded px-3 py-1.5"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
}
