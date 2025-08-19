'use client';

import React, { useEffect, useRef, useState } from 'react';
import HeroSection from '../components/hero/HeroSection';
import FeaturesSection from '../components/features/FeaturesSection';
import JobList from '../components/JobList/JobList';
import { HiringList } from '../components/hiringList/HiringList';
import ReviewRankingTable from '../components/reviewSection/ReviewSection';
import CarouselJob from "@/src/components/Banner/CarouselJob";
import Marquee from '@/src/components/Banner/Marquee';
import SpecialJobList from '../components/NewJobList/SpecialJobList';
import NewJobList from '../components/NewJobList/NewJobList';
import NewsSection from '../components/NewsSection';
import LogoSupport from '../components/Banner/LogoSuport';

export default function Home() {
  const [showMiddle, setShowMiddle] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const middleRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = middleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowMiddle(true);
        io.disconnect();
      }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowBottom(true);
        io.disconnect();
      }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="mb-10 px-4 md:px-6 lg:px-8">
        <HeroSection />
      </div>

      {/* Banner + JobList (70/30) */}
      <div className="mb-12 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          {/* 70% */}
          <div className="md:col-span-7">
            <CarouselJob />
          </div>

          {/* 30% */}
          <div className="md:col-span-3">
            <JobList limit={4} containerClassName="grid gap-2" />
          </div>
        </div>
      </div>


      {/* Logo Support */}
      <div className="mb-12 px-4 md:px-6 lg:px-8">
        <LogoSupport />
      </div>

      {/* Lazy mount middle sections when in view */}
      <div ref={middleRef} />
      {showMiddle && (
        <div className="mb-12 px-4 md:px-6 lg:px-8 space-y-12">
          <NewJobList
            limit={4}
            containerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          />
          <Marquee />
          <HiringList />
        </div>
      )}

      {/* Lazy mount bottom sections when in view */}
      <div ref={bottomRef} />
      {showBottom && (
        <div className="mb-12 px-4 md:px-6 lg:px-8 space-y-12">
          <NewsSection />
          <ReviewRankingTable />
        </div>
      )}
    </>
  );
}
