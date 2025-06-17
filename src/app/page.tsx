import HeroSection from '../components/hero/HeroSection';
import FeaturesSection from '../components/features/FeaturesSection';
import FreelancerList from '../components/freelancerList/FreelancerList';
import JobList from '../components/JobList/JobList';
import { HiringList } from '../components/hiringList/HiringList';
import { ReviewSection } from '../components/reviewSection/ReviewSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      
      {/* Grid section for Việc làm mới nhất and Ứng viên nổi bật */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-8">
        <div className="md:col-span-7">
          <JobList />
        </div>
        <div className="md:col-span-3">
          <FreelancerList />
        </div>
      </div>

      {/* Bottom section for Người tuyển đang cần and Đánh giá từ người dùng */}
      <div className="space-y-8">
        <HiringList />
        <ReviewSection />
      </div>
    </>
  );
}
