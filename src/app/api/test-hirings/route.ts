import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, count: 0, data: [] });
    }
    const hirings = await prisma.hiring.findMany({
      take: 5,
      orderBy: { postedDate: 'desc' }
    });
    
    return NextResponse.json({ 
      success: true, 
      count: hirings.length,
      data: hirings 
    });
  } catch (error) {
    console.error('Error fetching hirings:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error fetching hirings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 