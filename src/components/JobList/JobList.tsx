import Link from 'next/link';

const jobs = [
  { 
    id: 1,
    title: "Nhân viên bán hàng", 
    company: "Cửa hàng ABC", 
    location: "Đà Nẵng", 
    type: "Full-time",
    salary: "8-12 triệu",
    description: "Tìm nhân viên bán hàng có kinh nghiệm, giao tiếp tốt, nhiệt tình với khách hàng...",
    requirements: ["Kinh nghiệm 1 năm trở lên", "Kỹ năng giao tiếp tốt", "Ngoại hình ưa nhìn"],
    benefits: ["Lương thưởng hấp dẫn", "Được đào tạo", "Có cơ hội thăng tiến"]
  },
  { 
    id: 2,
    title: "Phục vụ quán cà phê", 
    company: "Cafe 123", 
    location: "Hải Châu", 
    type: "Part-time",
    salary: "15-20k/giờ",
    description: "Tìm nhân viên phục vụ làm việc ca sáng hoặc ca tối, có thể làm cuối tuần...",
    requirements: ["Nhanh nhẹn, hoạt bát", "Có thể làm ca tối", "Ưu tiên sinh viên"],
    benefits: ["Lương theo giờ", "Được đào tạo", "Môi trường trẻ trung"]
  },
  // Thêm các job khác tương tự...
];

export default function JobList() {
  return (
    <section className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Việc làm mới nhất</h3>
        <Link href="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
          Xem tất cả →
        </Link>
      </div>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg text-blue-900">{job.title}</h4>
                <p className="text-gray-600">{job.company} - {job.location}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-sm text-white bg-blue-600 px-2 py-1 rounded">{job.type}</span>
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{job.salary}</span>
                </div>
              </div>
              <Link 
                href={`/jobs/${job.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Xem chi tiết →
              </Link>
            </div>
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">{job.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.requirements.slice(0, 2).map((req, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {req}
                </span>
              ))}
              {job.requirements.length > 2 && (
                <span className="text-xs text-gray-500">+{job.requirements.length - 2} yêu cầu khác</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
