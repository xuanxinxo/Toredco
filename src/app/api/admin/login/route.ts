import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '../../../../lib/auth';
import jwt from 'jsonwebtoken';

// Mock admin data - trong thực tế sẽ lấy từ database
const admins = [
  {
    id: 1,
    email: "admin@toredco.com",
    password: "$2a$10$hashedpassword", // Trong thực tế sẽ hash password
    name: "Admin TOREDCO",
    role: "admin",
    permissions: ["manage_jobs", "manage_freelancers", "manage_reviews", "manage_users"]
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/admin/login - Đăng nhập admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt:', { username, password: password ? '***' : 'empty' });

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate admin
    const user = authenticateAdmin(username, password);
    console.log('Authentication result:', user);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Tạo JWT token thực sự
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.userId,
          username: user.username,
          role: user.role
        },
        token
      },
      message: 'Login successful'
    });

    // Thêm CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
} 