'use client';
import HeroSection from '../components/hero/HeroSection';
import FeaturesSection from '../components/features/FeaturesSection';
import JobList from '../components/JobList/JobList';
import { HiringList } from '../components/hiringList/HiringList';
// import ReviewRankingTable, { ReviewSection } from '../components/reviewSection/ReviewSection';
import ReviewRankingTable from '../components/reviewSection/ReviewSection';

// import Banner from '../components/Banner/Banner';
import CarouselJob from "@/src/components/Banner/CarouselJob";
import Marquee from '@/src/components/Banner/Marquee';
import SpecialJobList from '../components/NewJobList/SpecialJobList';
import NewJobList from '../components/NewJobList/NewJobList';
import NewsSection from '../components/NewsSection';
import LogoSupport from '../components/Banner/LogoSuport';
export default function Home() {
  return (
    <>
      <div className='mb-8'>
        <HeroSection />
      </div>
      <div className="m grid grid-cols-1 md:grid-cols-10 gap-6 mb-8">
        <div className="md:col-span-7">
          <CarouselJob />
        </div>
        <div className="md:col-span-3">
          <JobList limit={2} containerClassName="grid gap-2" />
        </div>
      </div>
      <div className="space-y-8">
        <LogoSupport />
      </div>
      <div className="space-y-8">
        <NewJobList
          limit={4}
          containerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        />
        <Marquee />
        <HiringList />
      </div>
      <div className="space-y-8">
        <NewsSection />
        <ReviewRankingTable />
      </div>

    </>
  );
}
