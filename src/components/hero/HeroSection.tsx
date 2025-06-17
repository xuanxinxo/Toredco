'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const images = [
    "/img/img.jpg",
    "/img/abu.jpg",
    "/img/cf.jpg",

  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
     <section className="bg-cyan-50 py-16 text-center">
      <h2 className="text-3xl font-bold text-cyan-700">Nền tảng kết nối việc làm hiệu quả</h2>
      <p className="mt-4 text-gray-600">Tìm việc nhanh chóng, tuyển dụng dễ dàng</p>
    </section>
  );
} 