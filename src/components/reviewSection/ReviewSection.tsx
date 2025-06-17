import Link from 'next/link';
import Image from 'next/image';

const reviews = [
  { 
    id: 1,
    name: "Mai H.",
    avatar: "/avatars/review1.jpg",
    role: "Chủ quán cafe",
    rating: 5,
    date: "2024-02-15",
    comment: "Ứng dụng rất dễ dùng và hiệu quả trong việc tìm nhân sự! Tôi đã tìm được 3 nhân viên phù hợp chỉ sau 2 ngày đăng tin. Giao diện thân thiện, thao tác đơn giản, và đặc biệt là có nhiều ứng viên chất lượng.",
    likes: 12,
    verified: true
  },
  { 
    id: 2,
    name: "Thành N.",
    avatar: "/avatars/review2.jpg",
    role: "Freelancer",
    rating: 5,
    date: "2024-02-18",
    comment: "Tìm được việc chỉ sau 2 ngày đăng ký, tuyệt vời! Quy trình đơn giản, nhanh chóng, và đặc biệt là có nhiều cơ hội việc làm phù hợp với kỹ năng của tôi. Cảm ơn TOREDCO đã tạo ra nền tảng hữu ích này!",
    likes: 8,
    verified: true
  },
  { 
    id: 3,
    name: "Lan P.",
    avatar: "/avatars/review3.jpg",
    role: "Nhà tuyển dụng",
    rating: 4,
    date: "2024-02-20",
    comment: "Nền tảng rất chuyên nghiệp, giúp tôi tiết kiệm thời gian trong việc tuyển dụng. Hệ thống lọc ứng viên thông minh, dễ dàng tìm được người phù hợp với yêu cầu công việc.",
    likes: 5,
    verified: true
  }
];

export function ReviewSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold">Đánh giá từ người dùng</h3>
            <p className="text-gray-600 mt-1">Những chia sẻ từ người dùng đã sử dụng TOREDCO</p>
          </div>
          <Link href="/reviews" className="text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {review.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-blue-900">{review.name}</h4>
                      <p className="text-sm text-gray-600">{review.role}</p>
                    </div>
                    {review.verified && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        Đã xác minh
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-gray-600 text-sm line-clamp-3">{review.comment}</p>

              <div className="mt-4 flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {new Date(review.date).toLocaleDateString('vi-VN')}
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-gray-500 hover:text-blue-600 transition-colors">
                    <span className="mr-1">👍</span>
                    {review.likes}
                  </button>
                  <Link 
                    href={`/reviews/${review.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/reviews/write"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Viết đánh giá của bạn
          </Link>
        </div>
      </div>
    </section>
  );
}