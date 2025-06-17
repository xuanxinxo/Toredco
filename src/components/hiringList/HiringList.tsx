import Link from 'next/link';

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
  }
];

export function HiringList() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold">Người tuyển đang cần</h3>
          <Link href="/hiring" className="text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {hirings.map((hiring) => (
            <div key={hiring.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-xl text-blue-900">{hiring.title}</h4>
                  <p className="text-gray-600 mt-1">{hiring.company} - {hiring.location}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
                      {hiring.type}
                    </span>
                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {hiring.salary}
                    </span>
                  </div>
                </div>
                <Link 
                  href={`/hiring/${hiring.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Xem chi tiết →
                </Link>
              </div>
              
              <p className="mt-4 text-gray-600 text-sm line-clamp-2">{hiring.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {hiring.requirements.slice(0, 2).map((req, index) => (
                  <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {req}
                  </span>
                ))}
                {hiring.requirements.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{hiring.requirements.length - 2} yêu cầu khác
                  </span>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>Đăng ngày: {new Date(hiring.postedDate).toLocaleDateString('vi-VN')}</span>
                <span>Hạn nộp: {new Date(hiring.deadline).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
