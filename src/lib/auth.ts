import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock admin users - trong thực tế sẽ lấy từ database
const adminUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // Trong thực tế sẽ hash password
    role: 'admin'
  }
];

export interface AdminUser {
  userId: number;
  username: string;
  role: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Verify admin token (mock implementation)
export function verifyAdminToken(token: string): AdminUser | null {
  try {
    // Trong thực tế sẽ verify JWT token
    // Đây là mock implementation
    if (token === 'mock-admin-token') {
      return {
        userId: 1,
        username: 'admin',
        role: 'admin'
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Get user from request (từ cookie hoặc header)
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  try {
    // Thử lấy từ cookie trước
    const token = request.cookies.get('token')?.value;
    
    if (token) {
      return verifyToken(token);
    }

    // Thử lấy từ Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return verifyToken(token);
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Get admin user from request
export function getAdminFromRequest(request: NextRequest): AdminUser | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyAdminToken(token);
}

// Authenticate admin user
export function authenticateAdmin(username: string, password: string): AdminUser | null {
  const user = adminUsers.find(u => u.username === username && u.password === password);
  
  if (user) {
    return {
      userId: user.id,
      username: user.username,
      role: user.role
    };
  }
  
  return null;
}

// Middleware để check authentication
export function requireAuth(request: NextRequest): JWTPayload {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

// Middleware để check role
export function requireRole(request: NextRequest, roles: string[]): JWTPayload {
  const user = requireAuth(request);
  if (!roles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
} 