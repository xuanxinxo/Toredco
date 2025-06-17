import Link from 'next/link';

const freelancers = [
  { 
    id: 1,
    name: "Nguyễn Văn A", 
    skill: "Thiết kế", 
    exp: "2 năm",
    avatar: "/avatars/user1.jpg",
    rating: 4.8,
    completedJobs: 15,
    description: "Chuyên thiết kế UI/UX cho website và ứng dụng di động, có kinh nghiệm với Figma và Adobe XD...",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Photoshop"],
    portfolio: ["Dự án A", "Dự án B", "Dự án C"]
  },
  { 
    id: 2,
    name: "Trần Thị B", 
    skill: "Pha chế", 
    exp: "1 năm",
    avatar: "/avatars/user2.jpg",
    rating: 4.5,
    completedJobs: 8,
    description: "Chuyên pha chế các loại cà phê và trà sữa, có chứng chỉ barista chuyên nghiệp...",
    skills: ["Barista", "Latte Art", "Menu Development"],
    portfolio: ["Quán Cafe X", "Quán Trà Y"]
  },
  // Thêm các freelancer khác...
];

export default function FreelancerList() {
  return (
    <section className="h-full bg-gray-50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Ứng viên nổi bật</h3>
        <Link href="/freelancers" className="text-blue-600 hover:text-blue-800 font-medium">
          Xem tất cả →
        </Link>
      </div>
      <div className="grid gap-4">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {/* Thêm avatar sau */}
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {freelancer.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">{freelancer.name}</h4>
                  <p className="text-sm text-gray-600">{freelancer.skill} - {freelancer.exp} kinh nghiệm</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">{freelancer.rating}</span>
                    <span className="text-sm text-gray-500">({freelancer.completedJobs} dự án)</span>
                  </div>
                </div>
              </div>
              <Link 
                href={`/freelancers/${freelancer.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Xem chi tiết →
              </Link>
            </div>
            <p className="mt-3 text-gray-600 text-sm line-clamp-2">{freelancer.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {freelancer.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
              {freelancer.skills.length > 3 && (
                <span className="text-xs text-gray-500">+{freelancer.skills.length - 3} kỹ năng khác</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}