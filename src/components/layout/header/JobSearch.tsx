'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface JobSearchProps {
  provinces?: string[];   // Cho phép optional, mặc định mảng rỗng
  jobTitles?: string[];   // Cho phép optional, mặc định mảng rỗng
}

export default function JobSearch({ provinces = [], jobTitles = [] }: JobSearchProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (!jobTitle && !selectedProvince) {
        setError('Vui lòng nhập tên công việc hoặc chọn tỉnh/thành phố');
        return;
      }

      if (jobTitle && jobTitle.length < 3) {
        setError('Tên công việc phải có ít nhất 3 ký tự');
        return;
      }

      // Kiểm tra độ dài tối thiểu cho tìm kiếm
      if (jobTitle && jobTitle.length < 2) {
        setError('Vui lòng nhập ít nhất 2 ký tự để tìm kiếm');
        return;
      }

      setSearching(true);
      setError('');

      const params = new URLSearchParams();
      if (jobTitle) params.append('search', jobTitle);
      if (selectedProvince) params.append('location', selectedProvince);

      // Lưu giá trị hiện tại để xóa sau khi chuyển trang
      const currentJobTitle = jobTitle;
      const currentProvince = selectedProvince;

      // Handle navigation and clear inputs
      const navigateAndClear = async () => {
        try {
          await router.push(`/search?${params.toString()}`);
          // Clear search inputs after successful navigation
          setJobTitle('');
          setSelectedProvince('');
        } catch (error) {
          console.error('Navigation error:', error);
        } finally {
          setSearching(false);
        }
      };
      
      void navigateAndClear();
    },
    [jobTitle, selectedProvince, jobTitles, router]
  );

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-sm p-2 gap-2">
        {/* Ô nhập tên công việc */}
        <input
          list="job-title-list"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Nhập tên công việc"
          className="px-4 py-2 border border-gray-200 rounded w-full sm:w-64 focus:outline-none"
        />
        <datalist id="job-title-list">
          {jobTitles.map((title) => (
            <option key={title} value={title} />
          ))}
        </datalist>

        {/* Ô chọn tỉnh/thành phố */}
        <input
          list="province-list"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          placeholder="Chọn hoặc gõ tỉnh/thành phố"
          className="px-4 py-2 border border-gray-200 rounded w-full sm:w-64 focus:outline-none"
        />
        <datalist id="province-list">
          {provinces.map((province) => (
            <option key={province} value={province} />
          ))}
        </datalist>

        {/* Nút tìm kiếm */}
        <button
          onClick={handleSearch}
          disabled={searching || (!jobTitle && !selectedProvince)}
          className={`px-4 py-2 min-w-[120px] ${
            searching || (!jobTitle && !selectedProvince)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded transition-colors`}
        >
          {searching ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 
                  0 0 5.373 0 12h4zm2 5.291A7.962 
                  7.962 0 014 12H0c0 3.042 1.135 
                  5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Tìm kiếm'
          )}
        </button>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
