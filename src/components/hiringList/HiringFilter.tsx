import React from 'react';

const filters = [
  { label: 'Lọc theo khu vực', icon: '📍' },
  { label: 'Cấp cao', icon: '⭐' },
  { label: 'Lao động phổ thông', icon: '🛠️' },
  { label: 'Nhân viên part-time', icon: '⏰' },
];

export default function HiringFilter() {
  return (
    <div className="w-full flex flex-col items-center mt-8 mb-8">
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filters.map((filter, idx) => (
          <button
            key={filter.label}
            className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl px-4 py-6 shadow-sm hover:shadow-md hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{filter.icon}</span>
            <span className="font-semibold text-gray-700 group-hover:text-blue-600 text-sm text-center">
              {filter.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 