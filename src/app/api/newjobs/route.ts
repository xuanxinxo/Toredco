

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: NextRequest) {
  try {
      console.log('MONGODB_URI:', process.env.MONGODB_URI);
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';

    console.log('Fetching newjobs with params:', { page, limit, search, type, location });

    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active'
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { company: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (type) {
      where.type = type;
    }

    if (location) {
      where.location = { contains: location };
    }

    // Lấy tổng số việc làm
    const totalJobs = await prisma.newJob.count({ where });

    // Lấy danh sách việc làm với phân trang
    const jobs = await prisma.newJob.findMany({
      where,
      orderBy: { postedDate: 'desc' },
      skip,
      take: limit,
    });

    console.log(`Found ${jobs.length} newjobs out of ${totalJobs} total`);
    
    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total: totalJobs,
        totalPages: Math.ceil(totalJobs / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching newjobs:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
} 