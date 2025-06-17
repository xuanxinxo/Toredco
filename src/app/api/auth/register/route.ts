import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Mock data - trong thực tế sẽ lấy từ database
let users = [
  {
    id: 1,
    email: "admin@toredco.com",
    password: "$2a$10$hashedpassword",
    name: "Admin",
    role: "admin",
    verified: true
  }
];

// POST /api/auth/register - Đăng ký
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role = 'user' } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Email, password and name are required' },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
      verified: false,
      createdAt: new Date().toISOString()
    };

    // Trong thực tế, lưu vào database
    users.push(newUser);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          verified: newUser.verified
        }
      },
      message: 'Registration successful'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 