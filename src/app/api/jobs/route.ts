import { NextRequest, NextResponse } from 'next/server';

// Mock data - trong thực tế sẽ lấy từ database
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
    benefits: ["Lương thưởng hấp dẫn", "Được đào tạo", "Có cơ hội thăng tiến"],
    postedDate: "2024-02-20",
    deadline: "2024-03-20",
    status: "active"
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
    benefits: ["Lương theo giờ", "Được đào tạo", "Môi trường trẻ trung"],
    postedDate: "2024-02-19",
    deadline: "2024-03-05",
    status: "active"
  }
];

// GET /api/jobs - Lấy danh sách việc làm
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    let filteredJobs = [...jobs];

    // Filter theo type
    if (type) {
      filteredJobs = filteredJobs.filter(job => job.type === type);
    }

    // Filter theo location
    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Search theo title hoặc company
    if (search) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedJobs,
      pagination: {
        page,
        limit,
        total: filteredJobs.length,
        totalPages: Math.ceil(filteredJobs.length / limit)
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Tạo việc làm mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.title || !body.company || !body.location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newJob = {
      id: jobs.length + 1,
      ...body,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    // Trong thực tế, lưu vào database
    jobs.push(newJob);

    return NextResponse.json({
      success: true,
      data: newJob,
      message: 'Job created successfully'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 