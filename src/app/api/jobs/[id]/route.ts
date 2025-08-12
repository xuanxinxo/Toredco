import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const formData = await req.formData();

    // Get form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('img') as File | null;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    let imageUrl = '';

    if (image) {
      try {
        // Validate image type
        if (!image.type.startsWith('image/')) {
          return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
        }

        // Validate image size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (image.size > maxSize) {
          return NextResponse.json({ error: 'Image size exceeds 5MB limit' }, { status: 400 });
        }

        // Create uploads directory
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = image.name.split('.').pop();
        const fileName = `${uniqueSuffix}.${fileExtension}`;
        const filePath = join(uploadDir, fileName);

        // Convert and save image
        const buffer = Buffer.from(await image.arrayBuffer());
        await writeFile(filePath, buffer);

        // Store relative path
        imageUrl = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    // Update job
    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        description,
        img: imageUrl || undefined,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}
