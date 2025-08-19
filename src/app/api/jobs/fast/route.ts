import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// Cache configuration
const CACHE_TTL = 60 * 1000; // 1 minute in-memory cache
const CDN_CACHE_MAX_AGE = 60; // 1 minute CDN cache
const CDN_SW_MAX_AGE = 300; // 5 minutes stale-while-revalidate

// In-memory cache
const cache = new Map<string, { 
  data: any; 
  timestamp: number;
  etag: string;
}>();

// Only select the fields we need
const JOB_SELECT_FIELDS = {
  id: true,
  title: true,
  company: true,
  location: true,
  type: true,
  salary: true,
  postedDate: true,
  img: true
};

// Generate ETag for cache validation
function generateETag(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('Received request:', request.url);
    const searchParams = request.nextUrl.searchParams;
    const search = (searchParams.get('search') || '').trim();
    const type = (searchParams.get('type') || '').trim();
    const location = (searchParams.get('location') || '').trim();
    
    // Create a cache key
    const cacheKey = JSON.stringify({ search, type, location });
    const ifNoneMatch = request.headers.get('if-none-match');
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      // Return 304 Not Modified if ETag matches
      if (ifNoneMatch === cachedData.etag) {
        return new NextResponse(null, { 
          status: 304,
          headers: {
            'Cache-Control': `public, max-age=${CDN_CACHE_MAX_AGE}, s-maxage=${CDN_CACHE_MAX_AGE}, stale-while-revalidate=${CDN_SW_MAX_AGE}`,
            'ETag': cachedData.etag,
            'X-Cache': 'HIT'
          }
        });
      }
      
      // Return cached data if still valid
      if ((Date.now() - cachedData.timestamp) < CACHE_TTL) {
        return NextResponse.json({
          ...cachedData.data,
          cached: true,
          executionTime: Date.now() - startTime
        }, {
          headers: {
            'Cache-Control': `public, max-age=${CDN_CACHE_MAX_AGE}, s-maxage=${CDN_CACHE_MAX_AGE}, stale-while-revalidate=${CDN_SW_MAX_AGE}`,
            'ETag': cachedData.etag,
            'X-Cache': 'HIT'
          }
        });
      }
    }

    // Log search parameters for debugging
    console.log('Search parameters:', { search, type, location });
    
    // Build optimized query
    const where: any = { status: 'active' };
    
    // Tìm kiếm chính xác theo tiêu đề công việc
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      // Sử dụng equals thay vì contains để tìm kiếm chính xác
      where.title = { 
        equals: searchTerm,
        mode: 'insensitive'
      };
      console.log('Searching for exact title:', searchTerm);
    }
    
    // Thêm điều kiện lọc theo loại công việc
    if (type && type !== 'all') {
      where.type = type;
      console.log('Filtering by type:', type);
    }
    
    // Thêm điều kiện lọc theo địa điểm
    if (location && location !== 'all') {
      where.location = { 
        contains: location, 
        mode: 'insensitive' 
      };
      console.log('Filtering by location:', location);
    }

    // Execute query with optimized settings
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10; // Match the frontend's expected page size
    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        select: JOB_SELECT_FIELDS,
        orderBy: { postedDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.job.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    
    const result = {
      jobs,
      total,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      executionTime: Date.now() - startTime
    };
    
    // Simplified response without ETag to avoid header size issues
    const response = NextResponse.json(result);
    
    // Set minimal cache headers
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Error in fast jobs API:', error);
    console.error('Error details:', {
      name: errorName,
      message: errorMessage,
      stack: errorStack
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  }
}
