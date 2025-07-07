import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching latest jobs...');
    
    // Lấy 5 việc làm mới nhất
    const newJobs = await prisma.job.findMany({
      orderBy: { postedDate: 'desc' },
      take: 5,
      where: {
        status: 'active'
      }
    });
    
    console.log(`Found ${newJobs.length} latest jobs`);
    return NextResponse.json(newJobs);
  } catch (error) {
    console.error('Error fetching latest jobs:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 