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
      include: { 
        hiring: true,
      },
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
            // If not found in Job, try NewJob table
            try {
              newJob = await prisma.newJob.findUnique({
                where: { id: app.jobId },
                select: { id: true, title: true, company: true }
              });
            } catch (e2) {
              console.error("Error fetching job data:", e2);
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