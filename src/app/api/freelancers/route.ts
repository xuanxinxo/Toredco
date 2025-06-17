import { NextRequest, NextResponse } from 'next/server';

// Mock data - trong thực tế sẽ lấy từ database
const freelancers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    skill: "Thiết kế",
    exp: "2 năm",
    avatar: "/avatars/user1.jpg",
    rating: 4.8,
    completedJobs: 15,
    description: "Chuyên thiết kế UI/UX cho website và ứng dụng di động, có kinh nghiệm với Figma và Adobe XD. Đã hoàn thành hơn 50 dự án cho các khách hàng trong và ngoài nước.",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Photoshop", "Illustrator"],
    portfolio: ["Dự án A", "Dự án B", "Dự án C"],
    hourlyRate: "500k-800k",
    availability: "available",
    location: "Đà Nẵng",
    education: "Đại học Kiến trúc Đà Nẵng",
    languages: ["Tiếng Việt", "Tiếng Anh"],
    certifications: ["Google UX Design", "Adobe Certified Expert"]
  },
  {
    id: 2,
    name: "Trần Thị B",
    skill: "Pha chế",
    exp: "1 năm",
    avatar: "/avatars/user2.jpg",
    rating: 4.5,
    completedJobs: 8,
    description: "Chuyên pha chế các loại cà phê và trà sữa, có chứng chỉ barista chuyên nghiệp. Có kinh nghiệm làm việc tại các quán cafe cao cấp.",
    skills: ["Barista", "Latte Art", "Menu Development", "Customer Service"],
    portfolio: ["Quán Cafe X", "Quán Trà Y"],
    hourlyRate: "200k-300k",
    availability: "available",
    location: "Hải Châu",
    education: "Trường Cao đẳng Du lịch Đà Nẵng",
    languages: ["Tiếng Việt"],
    certifications: ["Barista Professional", "Food Safety"]
  }
];

// GET /api/freelancers - Lấy danh sách freelancers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skill = searchParams.get('skill');
    const location = searchParams.get('location');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const search = searchParams.get('search');

    let filteredFreelancers = [...freelancers];

    // Filter theo skill
    if (skill) {
      filteredFreelancers = filteredFreelancers.filter(f => 
        f.skill.toLowerCase().includes(skill.toLowerCase()) ||
        f.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    // Filter theo location
    if (location) {
      filteredFreelancers = filteredFreelancers.filter(f => 
        f.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter theo rating
    if (minRating > 0) {
      filteredFreelancers = filteredFreelancers.filter(f => f.rating >= minRating);
    }

    // Search theo name hoặc description
    if (search) {
      filteredFreelancers = filteredFreelancers.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort theo rating (cao nhất trước)
    filteredFreelancers.sort((a, b) => b.rating - a.rating);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFreelancers = filteredFreelancers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedFreelancers,
      pagination: {
        page,
        limit,
        total: filteredFreelancers.length,
        totalPages: Math.ceil(filteredFreelancers.length / limit)
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/freelancers - Tạo freelancer mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.name || !body.skill || !body.description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newFreelancer = {
      id: freelancers.length + 1,
      ...body,
      rating: 0,
      completedJobs: 0,
      availability: 'available',
      createdAt: new Date().toISOString()
    };

    // Trong thực tế, lưu vào database
    freelancers.push(newFreelancer);

    return NextResponse.json({
      success: true,
      data: newFreelancer,
      message: 'Freelancer created successfully'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 