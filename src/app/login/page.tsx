"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // Lưu token (demo: localStorage; tuỳ bạn đổi sang cookie)
        localStorage.setItem('token', data.token);
        setMessage('Đăng nhập thành công!');
        setTimeout(() => router.push('/'), 1000);
      } else if (data.errors) {
        const msg = Object.values<string[]>(data.errors).flat().join(' ');
        setMessage(msg);
      } else if (data.error) {
        setMessage(data.error);
      } else {
        setMessage('Lỗi không xác định');
      }
    } catch (err) {
      setMessage('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image src="/bg-login.jpg" alt="Background" fill className="object-cover" />
      </div>

      <form onSubmit={handleLogin} className="relative z-10 flex flex-col md:flex-row bg-gray-800 bg-opacity-90 rounded-xl shadow-2xl p-8 md:p-12 max-w-4xl w-full mx-4">
        {/* Left: form */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center space-y-6">
          <h2 className="text-4xl font-bold text-center">Login</h2>
          {message && <p className="text-center text-red-400">{message}</p>}

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              {showPassword ? <Image src="/icons/eye-slash.svg" alt="Hide" width={20} height={20} /> : <Image src="/icons/eye.svg" alt="Show" width={20} height={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xl transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Login'}
          </button>
        </div>

        {/* Right: banner */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg md:rounded-l-none md:ml-4 mt-8 md:mt-0">
          <h2 className="text-4xl italic font-semibold leading-relaxed">
            Chào mừng bạn đã <br /> đến với Toredco nơi <br /> không làm bạn thất <br /> vọng
          </h2>
        </div>
      </form>
    </div>
  );
}
