import HeroSection from '../components/hero/HeroSection';
import FeaturesSection from '../components/features/FeaturesSection';
import FreelancerList from '../components/freelancerList/FreelancerList';
import JobList from '../components/JobList/JobList';
import { HiringList } from '../components/hiringList/HiringList';
import ReviewRankingTable from '../components/reviewSection/ReviewSection';

import Banner from '../components/Banner/Banner';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Banner />
      <HeroSection />
      <FeaturesSection />
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-8">
        <div className="md:col-span-7">
          <JobList />
        </div>
        <div className="md:col-span-3">
          <FreelancerList />
        </div>
      </div>
      <div>
        <HiringList />
      </div>
      <div className="space-y-8">
        <ReviewRankingTable />
      </div>
    
    </>
  );
}
