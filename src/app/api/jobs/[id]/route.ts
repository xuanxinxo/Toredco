import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { title, description } = await req.json();
  const job = await prisma.job.update({
    where: { id },
    data: { title, description },
  });
  return NextResponse.json(job);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}
