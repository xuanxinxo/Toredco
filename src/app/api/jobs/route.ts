import { NextRequest, NextResponse } from 'next/server';
// import pool from '../../../../lib/db';
import pool from '@/src/lib/db';

// GET /api/jobs - Lấy danh sách việc làm
export async function GET(request: NextRequest) {
  try {
    // Lấy danh sách việc làm status=active
    const [rows] = await pool.query('SELECT * FROM jobs WHERE status = "active" ORDER BY postedDate DESC');
    const jobs = Array.isArray(rows)
      ? rows.map((job: any) => ({
          ...job,
          requirements: job.requirements ? JSON.parse(job.requirements) : [],
          benefits: job.benefits ? JSON.parse(job.benefits) : [],
        }))
      : [];
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
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