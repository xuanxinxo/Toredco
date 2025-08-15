'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';


interface JobSearchProps {
  provinces: string[];
}

export default function JobSearch({ provinces }: JobSearchProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  // Fetch suggestions (debounced)
  const fetchSuggestions = useMemo(
    () => debounce(async (q: string) => {
      try {
        if (!q) {
          setSuggestions([]);
          return;
        }
        const params = new URLSearchParams();
        params.set('search', q);
        params.set('limit', '8');
        const res = await fetch(`/api/jobs?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        const titles = Array.isArray(data.jobs)
          ? Array.from(new Set<string>(data.jobs.map((j: any) => j.title).filter(Boolean)))
          : [];
        setSuggestions(titles);
      } catch {
        setSuggestions([]);
      }
    }, 200),
    []
  );

  useEffect(() => {
    fetchSuggestions(jobTitle);
  }, [jobTitle, fetchSuggestions]);

  const topSuggestion = useMemo(() => {
    if (!jobTitle || suggestions.length === 0) return '';
    const lower = jobTitle.toLowerCase();
    const exactStart = suggestions.find(s => s.toLowerCase().startsWith(lower));
    return exactStart || suggestions[0] || '';
  }, [jobTitle, suggestions]);

  const acceptHint = () => {
    if (topSuggestion) setJobTitle(topSuggestion);
  };

  const debouncedSearch = useMemo(
    () => debounce((opts?: { exact?: boolean; titleOverride?: string }) => {
      const titleToSearch = (opts?.titleOverride ?? jobTitle).trim();
      if (!titleToSearch && !selectedProvince) {
        setError('Vui lòng nhập tên công việc hoặc chọn tỉnh/thành phố');
        return;
      }
      if (titleToSearch && titleToSearch.length < 1) {
        setError('Nhập ít nhất 1 ký tự');
        return;
      }
      setSearching(true);
      setError('');

      const params = new URLSearchParams();
      if (titleToSearch) params.append('search', titleToSearch);
      if (opts?.exact) params.append('exact', '1');
      if (selectedProvince) params.append('location', selectedProvince);

      router.push(`/search?${params.toString()}`);
    }, 300),
    [jobTitle, selectedProvince, router]
  );

  const handleSearch = () => {
    debouncedSearch();
  };

  const handleSelectSuggestion = (title: string) => {
    setJobTitle(title);
    debouncedSearch({ exact: true, titleOverride: title });
  };

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-sm p-2 gap-2">
        {/* Ô nhập tên công việc với gợi ý */}
        <div className="relative w-full sm:w-64">
          {/* Ghost hint */}
          {topSuggestion && (
            <div className="absolute inset-0 pointer-events-none px-4 py-2 text-gray-400 whitespace-nowrap overflow-hidden">
              <span className="invisible">{jobTitle}</span>
              <span>{topSuggestion.slice(jobTitle.length)}</span>
            </div>
          )}
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => {
              setJobTitle(e.target.value);
              if (searching) setSearching(false);
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Tab' || e.key === 'ArrowRight') && topSuggestion) {
                e.preventDefault();
                acceptHint();
              }
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Nhập tên công việc (ví dụ: nhân viên phục vụ)"
            className="px-4 py-2 border border-gray-200 rounded w-full bg-transparent focus:outline-none"
          />
          {/* Dropdown suggestions */}
          {jobTitle && suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded shadow-sm max-h-56 overflow-auto">
              {suggestions.slice(0, 8).map((title) => (
                <li
                  key={title}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelectSuggestion(title)}
                >
                  {title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ô chọn tỉnh/thành phố có thể gõ lọc */}
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
