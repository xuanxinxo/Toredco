import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { getAdminFromRequest } from '../../../../lib/auth';

// GET /api/admin/jobs - Lấy danh sách việc làm (admin)
export async function GET(request: NextRequest) {
  try {
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = 'SELECT * FROM jobs';
    const params: any[] = [];
    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY postedDate DESC';

    const [rows] = await pool.query(query, params);
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