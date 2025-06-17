'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleRegister = () => {
    // Simulate successful registration
    // In a real application, you would send user data to a server here
    router.push('/'); // Redirect to home page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      {/* Background with particles/stars */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/bg-login.jpg" // Reuse the same background image for consistency
          alt="Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row bg-gray-800 bg-opacity-90 rounded-xl shadow-2xl p-8 md:p-12 max-w-4xl w-full mx-4">
        {/* Left Section: Register Form */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-center mb-8">Register</h2>

          <div className="flex flex-col space-y-4 mb-6">
            <button className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg text-lg transition duration-300">
              <Image src="/icons/google.svg" alt="Google Logo" width={24} height={24} className="mr-3" />
              Sign Up with Google
            </button>
            <button className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg text-lg transition duration-300">
              <Image src="/icons/facebook-white.svg" alt="Facebook Logo" width={24} height={24} className="mr-3" />
              Sign Up with Facebook
            </button>
          </div>

          <div className="text-center text-gray-500 mb-6">Or</div>

          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-lg font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  className="w-full p-3 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <Image src="/icons/eye-slash.svg" alt="Hide Password" width={20} height={20} />
                  ) : (
                    <Image src="/icons/eye.svg" alt="Show Password" width={20} height={20} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-lg font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  placeholder="Confirm your password"
                  className="w-full p-3 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <Image src="/icons/eye-slash.svg" alt="Hide Password" width={20} height={20} />
                  ) : (
                    <Image src="/icons/eye.svg" alt="Show Password" width={20} height={20} />
                  )}
                </button>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-xl transition duration-300"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>

        {/* Right Section: Welcome Message (reusing from login) */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg md:rounded-l-none md:ml-4 mt-8 md:mt-0">
          <h2 className="text-4xl italic font-semibold leading-relaxed">
            Chào mừng bạn đã <br />
            đến với Toredco nơi <br />
            không làm bạn thất <br />
            vọng
          </h2>
        </div>
      </div>
    </div>
  );
} 