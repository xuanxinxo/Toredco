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
    </div>
  );
}
