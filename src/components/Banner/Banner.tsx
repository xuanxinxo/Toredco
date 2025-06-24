'use client';

import React, { useState, useEffect } from 'react';

const images = [
  '/img/cf.jpg',
  '/img/img.jpg'
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {  
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // 3 giây đổi hình
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 md:h-[340px] lg:h-[420px] bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 rounded-lg shadow mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
      {/* Carousel hình ảnh */}
      <div className="absolute inset-0 w-full h-full z-0">
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Banner ${idx + 1}`}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-700 ${current === idx ? 'opacity-100' : 'opacity-0'}`}
            style={{ zIndex: current === idx ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-blue-700/60" />
      </div>
      {/* Nội dung banner */}
      <div className="relative z-10 flex-1 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">Chào mừng bạn đến với ViecLab!</h2>
        <p className="text-lg md:text-2xl lg:text-3xl font-medium drop-shadow">Nền tảng kết nối việc làm nhanh chóng, uy tín và miễn phí cho mọi người.</p>
      </div>
      <a
        href="/register"
        className="relative z-10 mt-6 md:mt-0 bg-white text-blue-700 font-semibold px-8 py-4 text-lg md:text-xl rounded-lg shadow hover:bg-blue-50 transition"
      >
        Đăng ký ngay
      </a>
    </div>
  );
} 