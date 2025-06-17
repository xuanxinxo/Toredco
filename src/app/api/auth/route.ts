import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock data - trong thực tế sẽ lấy từ database
const users = [
  {
    id: 1,
    email: "admin@toredco.com",
    password: "$2a$10$hashedpassword", // Trong thực tế sẽ hash password
    name: "Admin",
    role: "admin",
    verified: true
  },
  {
    id: 2,
    email: "user@example.com",
    password: "$2a$10$hashedpassword",
    name: "Nguyễn Văn A",
    role: "user",
    verified: true
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/auth/login - Đăng nhập
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Tìm user
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password (trong thực tế sẽ dùng bcrypt.compare)
    // const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = password === 'password'; // Mock for demo

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Tạo response
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified
        },
        token
      },
      message: 'Login successful'
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 