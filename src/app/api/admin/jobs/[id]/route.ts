import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import { getAdminFromRequest } from '../../../../../lib/auth';

// PUT /api/admin/jobs/[id] - Cập nhật việc làm
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const jobId = params.id;
    const body = await request.json();

    // Build dynamic update query
    const fields = [];
    const values = [];
    for (const key of Object.keys(body)) {
      fields.push(`${key} = ?`);
      values.push(
        key === 'requirements' || key === 'benefits'
          ? JSON.stringify(body[key])
          : body[key]
      );
    }
    values.push(jobId);

    await pool.query(
      `UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/jobs/[id] - Xóa việc làm (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const jobId = params.id;
    await pool.query('UPDATE jobs SET status = "deleted" WHERE id = ?', [jobId]);
    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 