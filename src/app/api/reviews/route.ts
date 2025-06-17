import { NextRequest, NextResponse } from 'next/server';

// Mock data - trong thực tế sẽ lấy từ database
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
    verified: true,
    userId: 1,
    jobId: 1,
    helpful: 8,
    category: "employer"
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
    verified: true,
    userId: 2,
    jobId: 2,
    helpful: 5,
    category: "freelancer"
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
    verified: true,
    userId: 3,
    jobId: 3,
    helpful: 3,
    category: "employer"
  }
];

// GET /api/reviews - Lấy danh sách reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = parseInt(searchParams.get('rating') || '0');
    const category = searchParams.get('category');
    const verified = searchParams.get('verified');

    let filteredReviews = [...reviews];

    // Filter theo rating
    if (rating > 0) {
      filteredReviews = filteredReviews.filter(r => r.rating >= rating);
    }

    // Filter theo category
    if (category) {
      filteredReviews = filteredReviews.filter(r => r.category === category);
    }

    // Filter theo verified
    if (verified === 'true') {
      filteredReviews = filteredReviews.filter(r => r.verified);
    }

    // Sort theo date (mới nhất trước)
    filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

    // Tính toán thống kê
    const totalReviews = filteredReviews.length;
    const avgRating = filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const ratingDistribution = {
      5: filteredReviews.filter(r => r.rating === 5).length,
      4: filteredReviews.filter(r => r.rating === 4).length,
      3: filteredReviews.filter(r => r.rating === 3).length,
      2: filteredReviews.filter(r => r.rating === 2).length,
      1: filteredReviews.filter(r => r.rating === 1).length
    };

    return NextResponse.json({
      success: true,
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        totalPages: Math.ceil(totalReviews / limit)
      },
      stats: {
        averageRating: avgRating,
        totalReviews,
        ratingDistribution
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Tạo review mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.name || !body.rating || !body.comment) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const newReview = {
      id: reviews.length + 1,
      ...body,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      helpful: 0,
      verified: false,
      createdAt: new Date().toISOString()
    };

    // Trong thực tế, lưu vào database
    reviews.push(newReview);

    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review created successfully'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 