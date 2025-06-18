import { NextRequest, NextResponse } from 'next/server';
import pool from '@/src/lib/db';
import { ResultSetHeader } from 'mysql2'; // ✅ import ở đây

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.company || !body.location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const postedDate = new Date().toISOString().split('T')[0];
    const status = 'active';

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO jobs (title, company, location, requirements, benefits, postedDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        body.title,
        body.company,
        body.location,
        JSON.stringify(body.requirements || []),
        JSON.stringify(body.benefits || []),
        postedDate,
        status,
      ]
    );

    const insertId = result.insertId;

    const newJob = {
      id: insertId,
      ...body,
      postedDate,
      status,
    };

    return NextResponse.json({
      success: true,
      data: newJob,
      message: 'Job created successfully',
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
