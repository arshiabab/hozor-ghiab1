import Link from "next/link";
import Header from "@/components/Header";
import CourseForm from "@/components/CourseForm";
import { AttendanceBar } from "@/components/Stats";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeStats, faNumber } from "@/lib/stats";

export default async function Dashboard() {
  const { userId } = await requireUser();
  const courses = await prisma.course.findMany({
    where: { userId },
    include: { sessions: { select: { status: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
        <h1 className="text-2xl font-bold">درس‌های من</h1>
        <CourseForm />

        {courses.length === 0 ? (
          <p className="card text-center text-muted">هنوز درسی ثبت نکرده‌اید. اولین درس خود را اضافه کنید.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((c) => {
              const s = computeStats(c.sessions);
              return (
                <Link key={c.id} href={`/courses/${c.id}`} className="card block space-y-3 transition hover:border-primary">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-bold">{c.title}</h2>
                      {c.teacher && <p className="text-xs text-muted">استاد: {c.teacher}</p>}
                    </div>
                    <span className="text-lg font-bold text-primary">{faNumber(s.percent)}٪</span>
                  </div>
                  <AttendanceBar percent={s.percent} />
                  <div className="flex gap-4 text-xs text-muted">
                    <span>{faNumber(s.total)} جلسه</span>
                    <span className="text-present">{faNumber(s.present)} حاضر</span>
                    <span className="text-absent">{faNumber(s.absent)} غایب</span>
                    {s.cancelled > 0 && <span>{faNumber(s.cancelled)} تشکیل نشده</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
