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
    <div className="border p-4 rounded-lg shadow-sm bg-white flex flex-col justify-between h-full">
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-lg text-blue-900 truncate">
              {job.title}
            </h4>
            <p className="text-gray-600 truncate">
              {job.company} - {job.location}
            </p>
          </div>
          {job.img && (
            <img
              src={job.img}
              alt={`${job.company} logo`}
              className="h-10 w-10 object-contain rounded"
            />
          )}
        </div>

        <div className="flex gap-2 flex-wrap mt-2">
          {job.type && (
            <span className="text-xs text-white bg-blue-600 px-2 py-1 rounded">
              {job.type}
            </span>
          )}
          {job.salary && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {job.salary}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {(Array.isArray(job.requirements) ? job.requirements.slice(0, 2) : []).map((req, i) => (
            <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {req}
            </span>
          ))}
          {Array.isArray(job.requirements) && job.requirements.length > 2 && (
            <span className="text-xs text-gray-500">
              +{job.requirements.length - 2} yêu cầu khác
            </span>
          )}
        </div>
      </div>

      {/* Nút bấm */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={onApply}
          className="w-full sm:w-auto text-sm bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 font-medium text-center"
        >
          Ứng tuyển
        </button>
        <Link
          href={`/jobs/${job.id}`}
          className="w-full sm:w-auto text-sm text-blue-600 hover:text-blue-800 font-medium text-center bg-blue-50 rounded px-4 py-2"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
}
