import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { getAdminFromRequest } from '../../../../lib/auth';

// GET /api/admin/jobs - Lấy danh sách việc làm (admin)
export async function GET(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    let filteredJobs = [...jobs];

    // Filter theo status
    if (status && status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }

    // Sort theo ngày đăng (mới nhất trước)
    filteredJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

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

// POST /api/admin/jobs - Tạo việc làm mới (admin)
export async function POST(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validation
    if (!body.title || !body.company || !body.location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'INSERT INTO jobs (title, company, location, type, salary, description, requirements, benefits, postedDate, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, "active")',
      [
        body.title,
        body.company,
        body.location,
        body.type,
        body.salary,
        body.description,
        JSON.stringify(body.requirements || []),
        JSON.stringify(body.benefits || []),
        body.deadline
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Job created successfully'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 