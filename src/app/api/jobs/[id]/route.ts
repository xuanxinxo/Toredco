import { NextRequest, NextResponse } from 'next/server';
import { jobs } from '../route';

// GET /api/jobs/[id] - Lấy chi tiết việc làm
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);
    const job = jobs.find(j => j.id === jobId && j.status === 'active');
    
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