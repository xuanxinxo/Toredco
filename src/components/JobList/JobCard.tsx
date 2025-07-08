    import { Job } from '@/src/app/types/job';
    import Link from 'next/link';
    import React from 'react'

    export default function JobCard({ job }: { job: Job }) {
    return (
        <div
        key={job.id}
        className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
        >
        <div className="flex justify-between items-start">
            <div>
            <h4 className="font-semibold text-lg text-blue-900 truncate">{job.title}</h4>
            <p className="text-gray-600">
                {job.company} - {job.location}
            </p>
            <div className="mt-2 flex gap-2">
                <span className="text-sm text-white bg-blue-600 px-2 py-1 rounded">
                {job.type}
                </span>
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {job.salary}
                </span>
            </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Link
                href={`/jobs/${job.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Xem chi tiết →
              </Link>
              <Link
                href={`/jobs/${job.id}`}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-medium transition-colors"
              >
                Ứng tuyển
              </Link>
            </div>
        </div>
        <p className="mt-2 text-gray-600 text-sm truncate">
            {job.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
            {job.requirements.slice(0, 2).map((req, index) => (
            <span
                key={index}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
            >
                {req}
            </span>
            ))}
            {job.requirements.length > 2 && (
            <span className="text-xs text-gray-500">
                +{job.requirements.length - 2} yêu cầu khác
            </span>
            )}
        </div>
        </div>
    );
    }
