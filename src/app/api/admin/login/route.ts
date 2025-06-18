import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '../../../../lib/auth';

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

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate admin
    const user = authenticateAdmin(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Trong thực tế sẽ tạo JWT token
    // Đây là mock token
    const token = 'mock-admin-token';

    return NextResponse.json({
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

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 