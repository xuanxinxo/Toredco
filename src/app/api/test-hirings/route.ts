import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
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