import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const { jobId, hiringId, name, email, phone, message, cv } = await req.json();
    if (!jobId && !hiringId) {
      return NextResponse.json({ success: false, message: 'Thiếu jobId hoặc hiringId' }, { status: 400 });
    }
    const application = await prisma.application.create({
      data: {
        jobId: jobId || undefined,
        hiringId: hiringId || undefined,
        name,
        email,
        phone,
        message,
        cv,
        createdAt: new Date(),
      },
    });
    return NextResponse.json({ success: true, data: application });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      // include: { hiring: true }, // Đã xóa dòng này để tránh lỗi
    });

    // Fetch job and newJob data for each application
    const applicationsWithJobData = await Promise.all(
      applications.map(async (app) => {
        let job = null;
        let newJob = null;

        if (app.jobId) {
          // Try to find in Job table first
          try {
            job = await prisma.job.findUnique({
              where: { id: app.jobId },
              select: { id: true, title: true, company: true }
            });
          } catch (e) {
            job = null;
          }
          // Nếu không tìm thấy ở Job, thử ở NewJob
          if (!job) {
            try {
              newJob = await prisma.newJob.findUnique({
                where: { id: app.jobId },
                select: { id: true, title: true, company: true }
              });
            } catch (e2) {
              newJob = null;
            }
          }
        }

        return {
          ...app,
          job,
          newJob
        };
      })
    );

    return NextResponse.json({ success: true, data: applicationsWithJobData });
  } catch (err) {
    console.error("Error fetching applications:", err);
    return NextResponse.json({ success: false, message: "Lỗi server" }, { status: 500 });
  }
} 