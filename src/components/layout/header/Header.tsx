'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-r from-blue-900 to-blue-800'
      }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start mb-4 md:mb-0">
            <h1 className={`text-4xl font-extrabold tracking-widest ${isScrolled ? 'text-blue-900' : 'text-white'
              } transition-colors duration-300`}>
              VIECLAB
            </h1>
            <p className={`text-base font-semibold uppercase tracking-wide ${isScrolled ? 'text-blue-800' : 'text-white'
              }`}>
              Powered By <span className="font-bold">TOREDCO</span>
            </p>
            <p className={`text-sm ${isScrolled ? 'text-blue-700' : 'text-white'
              }`}>
              Nền Tảng Kết Nối Minh Bạch
            </p>
          </Link>


          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <Link href="/jobs" className={`nav-link ${isScrolled ? 'text-gray-700 hover:text-blue-900' : 'text-gray-200 hover:text-white'
              } transition-colors duration-300 relative group`}>
              Tìm việc làm
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/hiring" className={`nav-link ${isScrolled ? 'text-gray-700 hover:text-blue-900' : 'text-gray-200 hover:text-white'
              } transition-colors duration-300 relative group`}>
              Tìm người làm
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/post-job" className={`nav-link ${isScrolled ? 'text-gray-700 hover:text-blue-900' : 'text-gray-200 hover:text-white'
              } transition-colors duration-300 relative group`}>
              Đăng việc
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/reviews" className={`nav-link ${isScrolled ? 'text-gray-700 hover:text-blue-900' : 'text-gray-200 hover:text-white'
              } transition-colors duration-300 relative group`}>
              Đánh giá
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-4">
            <Link href="/login">
              <button className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${isScrolled
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'bg-white text-blue-900 hover:bg-gray-100'
                }`}>
                Đăng nhập
              </button>
            </Link>
            <Link href="/register">
              <button className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${isScrolled
                  ? 'border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white'
                  : 'border-2 border-white text-white hover:bg-white hover:text-blue-900'
                }`}>
                Đăng ký
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 