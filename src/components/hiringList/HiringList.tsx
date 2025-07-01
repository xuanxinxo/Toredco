'use client';
import Link from 'next/link';
import HiringFilter from './HiringFilter';

const hirings = [
  { 
    id: 1,
    title: "Tìm đầu bếp", 
    company: "Nhà hàng XYZ", 
    location: "Đà Nẵng",
    type: "Full-time",
    salary: "15-20 triệu",
    description: "Cần đầu bếp có tay nghề cao, làm việc ca tối. Ưu tiên người có kinh nghiệm tại nhà hàng khách sạn 4-5 sao...",
    requirements: [
      "Kinh nghiệm 3 năm trở lên",
      "Có chứng chỉ nghề bếp",
      "Thành thạo các món Á-Âu",
      "Có khả năng quản lý nhân viên"
    ],
    benefits: [
      "Lương thưởng hấp dẫn",
      "Bảo hiểm đầy đủ",
      "Được đào tạo nâng cao",
      "Cơ hội thăng tiến"
    ],
    postedDate: "2024-02-20",
    deadline: "2024-03-20"
  },
  { 
    id: 2,
    title: "Tìm nhân viên chạy bàn", 
    company: "Quán ăn 456", 
    location: "Hải Châu",
    type: "Part-time",
    salary: "15-20k/giờ",
    description: "Ưu tiên sinh viên làm part-time cuối tuần. Cần người nhanh nhẹn, hoạt bát, có khả năng giao tiếp tốt...",
    requirements: [
      "Ngoại hình ưa nhìn",
      "Giao tiếp tốt",
      "Có thể làm ca tối",
      "Ưu tiên sinh viên"
    ],
    benefits: [
      "Lương theo giờ",
      "Được đào tạo",
      "Môi trường trẻ trung",
      "Thưởng theo doanh số"
    ],
    postedDate: "2024-02-19",
    deadline: "2024-03-05"
  },
  { 
    id: 3,
    title: "Tìm nhân viên bán hàng", 
    company: "Shop thời trang ABC", 
    location: "Sơn Trà",
    type: "Full-time",
    salary: "8-12 triệu",
    description: "Cần nhân viên bán hàng có kinh nghiệm trong lĩnh vực thời trang. Có khả năng tư vấn và chăm sóc khách hàng...",
    requirements: [
      "Kinh nghiệm bán hàng 1 năm",
      "Ngoại hình ưa nhìn",
      "Kỹ năng giao tiếp tốt",
      "Có kiến thức về thời trang"
    ],
    benefits: [
      "Lương cơ bản + hoa hồng",
      "Được đào tạo sản phẩm",
      "Môi trường làm việc năng động",
      "Thưởng theo doanh số"
    ],
    postedDate: "2024-02-18",
    deadline: "2024-03-15"
  },
  { 
    id: 4,
    title: "Tìm nhân viên IT", 
    company: "Công ty Tech Solutions", 
    location: "Liên Chiểu",
    type: "Full-time",
    salary: "20-35 triệu",
    description: "Tuyển dụng lập trình viên Frontend/Backend có kinh nghiệm với React, Node.js. Làm việc trong môi trường startup...",
    requirements: [
      "Kinh nghiệm 2-3 năm",
      "Thành thạo React/Node.js",
      "Có portfolio projects",
      "Khả năng làm việc nhóm"
    ],
    benefits: [
      "Lương cạnh tranh",
      "Bảo hiểm đầy đủ",
      "Remote work linh hoạt",
      "Stock options"
    ],
    postedDate: "2024-02-17",
    deadline: "2024-03-25"
  },
  { 
    id: 5,
    title: "Tìm nhân viên marketing", 
    company: "Agency Digital Pro", 
    location: "Cẩm Lệ",
    type: "Full-time",
    salary: "12-18 triệu",
    description: "Tuyển dụng chuyên viên marketing digital có kinh nghiệm quản lý Facebook Ads, Google Ads và content marketing...",
    requirements: [
      "Kinh nghiệm marketing 2 năm",
      "Thành thạo Facebook/Google Ads",
      "Có portfolio campaigns",
      "Kỹ năng phân tích dữ liệu"
    ],
    benefits: [
      "Lương + thưởng performance",
      "Được training liên tục",
      "Môi trường sáng tạo",
      "Cơ hội thăng tiến nhanh"
    ],
    postedDate: "2024-02-16",
    deadline: "2024-03-10"
  }
];

export function HiringList() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 bg-black bg-opacity-10 p-6 rounded-lg shadow-lg">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Người tuyển đang cần
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl">
            Khám phá những cơ hội việc làm hấp dẫn từ các doanh nghiệp uy tín
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {hirings.slice(0, 3).map((hiring, index) => (
            <div 
              key={hiring.id} 
              className="group relative bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                      {hiring.title}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">🏢</span>
                      <span className="font-medium">{hiring.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">📍</span>
                      <span>{hiring.location}</span>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <span className="text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 rounded-full font-medium shadow-md">
                        {hiring.type}
                      </span>
                      <span className="text-sm text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">
                        💰 {hiring.salary}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/hiring/${hiring.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                  >
                    Chi tiết →
                  </Link>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {hiring.description}
                </p>
                
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs">📋</span>
                    Yêu cầu chính:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {hiring.requirements.slice(0, 2).map((req, idx) => (
                      <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                        {req}
                      </span>
                    ))}
                    {hiring.requirements.length > 2 && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                        +{hiring.requirements.length - 2} yêu cầu khác
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">📅</span>
                    <span>Đăng: {new Date(hiring.postedDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">⏰</span>
                    <span>Hạn: {new Date(hiring.deadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/hiring" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Xem tất cả cơ hội việc làm
            <span className="text-lg">→</span>
          </Link>
        </div>
        <HiringFilter />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
