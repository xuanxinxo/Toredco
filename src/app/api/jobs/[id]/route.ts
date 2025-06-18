import { NextRequest, NextResponse } from 'next/server';
import pool from '@/src/lib/db'; // import đúng kết nối DB

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);

    const [rows]: any = await pool.query(
      'SELECT * FROM jobs WHERE id = ? AND status = "active"',
      [jobId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    const job = {
      ...rows[0],
      requirements: rows[0].requirements ? JSON.parse(rows[0].requirements) : [],
      benefits: rows[0].benefits ? JSON.parse(rows[0].benefits) : [],
    };

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
