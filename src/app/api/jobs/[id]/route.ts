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
    description: "Tìm nhân viên bán hàng có kinh nghiệm, giao tiếp tốt, nhiệt tình với khách hàng. Công việc bao gồm tư vấn sản phẩm, chăm sóc khách hàng, và đạt chỉ tiêu bán hàng.",
    requirements: [
      "Kinh nghiệm 1 năm trở lên trong lĩnh vực bán hàng",
      "Kỹ năng giao tiếp tốt, thuyết phục khách hàng",
      "Ngoại hình ưa nhìn, thân thiện",
      "Có khả năng làm việc theo ca",
      "Biết sử dụng máy tính cơ bản"
    ],
    benefits: [
      "Lương thưởng hấp dẫn theo doanh số",
      "Được đào tạo kỹ năng bán hàng",
      "Có cơ hội thăng tiến lên vị trí quản lý",
      "Bảo hiểm xã hội đầy đủ",
      "Thưởng tháng 13"
    ],
    postedDate: "2024-02-20",
    deadline: "2024-03-20",
    status: "active",
    contact: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "hr@abc.com"
    },
    companyInfo: {
      description: "Cửa hàng ABC là chuỗi bán lẻ hàng đầu tại Đà Nẵng",
      address: "123 Nguyễn Văn Linh, Đà Nẵng",
      website: "www.abc.com"
    }
  }
];

// GET /api/jobs/[id] - Lấy chi tiết việc làm
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);
    const job = jobs.find(j => j.id === jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id] - Cập nhật việc làm
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);
    const body = await request.json();
    
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    // Update job
    jobs[jobIndex] = { ...jobs[jobIndex], ...body };

    return NextResponse.json({
      success: true,
      data: jobs[jobIndex],
      message: 'Job updated successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Xóa việc làm
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    // Soft delete - chỉ thay đổi status
    jobs[jobIndex].status = 'deleted';

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 