import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';
// Cache the job listings for 60 seconds to reduce database load
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build optimized search conditions
    const where = {
      status: 'active',
      ...(search && {
        title: {
          contains: search.trim(),
          mode: 'insensitive'
        }
      }),
      ...(type && { type }),
      ...(location && {
        location: { 
          contains: location.trim(),
          mode: 'insensitive' 
        }
      })
    };

    // Optimize the query by only selecting fields needed for the listing
    const selectFields = {
      id: true,
      title: true,
      company: true,
      location: true,
      type: true,
      salary: true,
      deadline: true,
      postedDate: true,
      img: true
    };

    // Use a transaction to run queries in parallel
    const [jobs, totalJobs] = await prisma.$transaction([
      prisma.job.findMany({
        where,
        select: selectFields,
        orderBy: { postedDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.job.count({ where })
    ]);

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
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      benefits,
      deadline,
    } = await req.json();

    // Validate required fields
    if (!title || !company || !location || !type || !salary || !description || !deadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        requirements: requirements ?? [],
        benefits: benefits ?? [],
        deadline: new Date(deadline),
        status: 'pending', // Mặc định là pending, cần admin phê duyệt
        postedDate: new Date(),
      },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}