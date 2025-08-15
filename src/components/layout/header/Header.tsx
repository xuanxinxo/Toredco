'use client';
import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import JobSearch from './JobSearch';
import AuthModal from '../../auth/AuthModal';
import { provinces } from './data';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    const isLoggedInFlag = localStorage.getItem('isLoggedIn');
    const currentPath = window.location.pathname;
    const hasCompletedAuth = localStorage.getItem('hasCompletedAuth');

    if (!hasVisited && isLoggedInFlag !== 'true' && !hasCompletedAuth && !currentPath.startsWith('/register') && !currentPath.startsWith('/login')) {
      setShowAuthModal(true);
      localStorage.setItem('hasVisited', 'true');
    }

    if (hasVisited && isLoggedInFlag !== 'true' && !hasCompletedAuth && !currentPath.startsWith('/register') && !currentPath.startsWith('/login')) {
      setShowAuthModal(true);
    }
  }, []);

  useEffect(() => {
    const updateLoginState = () => {
      const token = localStorage.getItem('token');
      const flag = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(!!token || flag);
    };
    updateLoginState();
    window.addEventListener('storage', updateLoginState);
    return () => window.removeEventListener('storage', updateLoginState);
  }, []);

  useEffect(() => {
    setShowAuthModal(false);
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'false');
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href);
  };

  const linkBase = isScrolled ? 'text-gray-700 hover:text-blue-900' : 'text-gray-200 hover:text-white';
  const activeClasses = 'font-semibold underline underline-offset-8 decoration-2';

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-r from-blue-900 to-blue-800'}`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo + Mobile toggle */}
          <div className="flex w-full md:w-auto items-center justify-between mb-4 md:mb-0">
            <Link href="/" className="flex flex-col items-start">
              <h1 className={`text-4xl font-extrabold tracking-widest ${isScrolled ? 'text-blue-900' : 'text-white'} transition-colors duration-300`}>
                VIECLAB
              </h1>
              <p className={`text-base font-semibold uppercase tracking-wide ${isScrolled ? 'text-blue-800' : 'text-white'}`}>
                Powered By <span className="font-bold">TOREDCO</span>
              </p>
              <p className={`text-sm ${isScrolled ? 'text-blue-700' : 'text-white'}`}>
                Nền Tảng Kết Nối Minh Bạch
              </p>
            </Link>
            <button
              className={`md:hidden px-3 py-2 rounded ${isScrolled ? 'text-blue-900' : 'text-white'} border border-transparent hover:border-current`}
              onClick={() => setIsMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <Link href="/jobs" className={`${linkBase} transition-colors duration-300 relative ${isActive('/jobs') ? activeClasses : ''}`}>
              Tìm việc làm
            </Link>
            <Link href="/jobnew" className={`${linkBase} transition-colors duration-300 relative ${isActive('/jobnew') ? activeClasses : ''}`}>
              Việc mới
            </Link>
            <Link href="/hirings" className={`${linkBase} transition-colors duration-300 relative ${isActive('/hirings') ? activeClasses : ''}`}>
              Tuyển dụng
            </Link>
            <Link href="/news" className={`${linkBase} transition-colors duration-300 relative ${isActive('/news') ? activeClasses : ''}`}>
              Tin tức
            </Link>
          </div>

          {/* Search + actions */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <JobSearch provinces={provinces} />
            </div>

            {isLoggedIn ? (
              <div className="flex gap-3">
                <Link href="/admin">
                  <button className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-white text-blue-900 hover:bg-gray-100'}`}>
                    Quản trị
                  </button>
                </Link>
                <button onClick={handleLogout} className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white' : 'border-2 border-white text-white hover:bg-white hover:text-blue-900'}`}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-white text-blue-900 hover:bg-gray-100'}`}>
                    Đăng nhập
                  </button>
                </Link>
                <Link href="/register">
                  <button className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white' : 'border-2 border-white text-white hover:bg-white hover:text-blue-900'}`}>
                    Đăng ký
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 w-full">
              <div className="flex flex-col gap-3">
                <Link href="/jobs" onClick={() => setIsMenuOpen(false)} className="text-white">Tìm việc làm</Link>
                <Link href="/jobnew" onClick={() => setIsMenuOpen(false)} className="text-white">Việc mới</Link>
                <Link href="/hirings" onClick={() => setIsMenuOpen(false)} className="text-white">Tuyển dụng</Link>
                <Link href="/news" onClick={() => setIsMenuOpen(false)} className="text-white">Tin tức</Link>
                {isLoggedIn ? (
                  <>
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-white">Quản trị</Link>
                    <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="text-left text-white">Đăng xuất</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-white">Đăng nhập</Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-white">Đăng ký</Link>
                  </>
                )}
              </div>
            </div>
          )}

          {/* First-visit auth modal */}
          <Suspense fallback={null}>
            <AuthModal isOpen={showAuthModal} />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}