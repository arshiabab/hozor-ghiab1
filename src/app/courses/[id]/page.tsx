import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SessionForm from "@/components/SessionForm";
import { StatGrid } from "@/components/Stats";
import { deleteCourse, deleteSession, setSessionStatus } from "@/actions/courses";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AttendanceStatus } from "@prisma/client";
import { STATUS_LABELS, computeStats, faNumber, formatFaDate } from "@/lib/stats";

const STATUSES: AttendanceStatus[] = ["PRESENT", "ABSENT", "CANCELLED"];
const STATUS_STYLES: Record<AttendanceStatus, string> = {
  PRESENT: "bg-present/15 text-present",
  ABSENT: "bg-absent/15 text-absent",
  CANCELLED: "bg-border text-foreground",
};

export default async function CoursePage({ params }: PageProps<"/courses/[id]">) {
  const { userId } = await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const course = await prisma.course.findFirst({
    where: { id, userId },
    include: { sessions: { orderBy: { number: "asc" } } },
  });
  if (!course) notFound();

  const stats = computeStats(course.sessions);
  const nextNumber = (course.sessions.at(-1)?.number ?? 0) + 1;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/" className="text-sm text-muted hover:text-primary">→ بازگشت به درس‌ها</Link>
            <h1 className="mt-1 text-2xl font-bold">{course.title}</h1>
            {course.teacher && <p className="text-sm text-muted">استاد: {course.teacher}</p>}
          </div>
          <form action={deleteCourse.bind(null, course.id)}>
            <button className="btn-ghost text-absent">حذف درس</button>
          </form>
        </div>

        <StatGrid stats={stats} />
        <SessionForm courseId={course.id} nextNumber={faNumber(nextNumber)} />

        <section className="card overflow-x-auto p-0">
          {course.sessions.length === 0 ? (
            <p className="p-5 text-center text-muted">هنوز جلسه‌ای ثبت نشده است.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="p-3 text-right font-medium">جلسه</th>
                  <th className="p-3 text-right font-medium">تاریخ</th>
                  <th className="p-3 text-right font-medium">وضعیت</th>
                  <th className="p-3 text-right font-medium">یادداشت</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {course.sessions.map((s) => {
                  return (
                    <tr key={s.id} className={`border-b border-border last:border-0 ${s.status === "CANCELLED" ? "opacity-60" : ""}`}>
                      <td className="p-3 font-medium">جلسه {faNumber(s.number)}</td>
                      <td className="p-3 text-muted">{formatFaDate(s.date)}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {STATUSES.map((st) => (
                            <form key={st} action={setSessionStatus.bind(null, s.id, st)}>
                              <button
                                disabled={s.status === st}
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  s.status === st ? STATUS_STYLES[st] : "cursor-pointer text-muted hover:bg-background"
                                }`}
                              >
                                {STATUS_LABELS[st]}
                              </button>
                            </form>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-muted">{s.note ?? "—"}</td>
                      <td className="p-3 text-left">
                        <form action={deleteSession.bind(null, s.id)}>
                          <button className="cursor-pointer text-xs text-muted hover:text-absent">حذف</button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}
