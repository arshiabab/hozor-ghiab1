import Header from "@/components/Header";
import PrintButton from "@/components/PrintButton";
import { AttendanceBar } from "@/components/Stats";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeStats, faNumber } from "@/lib/stats";

export default async function ReportPage() {
  const { userId, name } = await requireUser();
  const courses = await prisma.course.findMany({
    where: { userId },
    include: { sessions: { select: { status: true } } },
    orderBy: { title: "asc" },
  });

  const rows = courses.map((c) => ({ ...c, stats: computeStats(c.sessions) }));
  const overall = computeStats(courses.flatMap((c) => c.sessions));

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">گزارش پایان ترم</h1>
            <p className="text-sm text-muted">{name}</p>
          </div>
          <PrintButton />
        </div>

        <section className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="p-3 text-right font-medium">درس</th>
                <th className="p-3 text-center font-medium">جلسات برگزارشده</th>
                <th className="p-3 text-center font-medium">حضور</th>
                <th className="p-3 text-center font-medium">غیبت</th>
                <th className="p-3 text-center font-medium">تشکیل نشده</th>
                <th className="w-40 p-3 text-right font-medium">درصد حضور</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="p-5 text-center text-muted">درسی ثبت نشده است.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3 text-center">{faNumber(r.stats.total)}</td>
                  <td className="p-3 text-center text-present">{faNumber(r.stats.present)}</td>
                  <td className="p-3 text-center text-absent">{faNumber(r.stats.absent)}</td>
                  <td className="p-3 text-center text-muted">{faNumber(r.stats.cancelled)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-10 font-bold">{faNumber(r.stats.percent)}٪</span>
                      <AttendanceBar percent={r.stats.percent} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot className="font-bold">
                <tr>
                  <td className="p-3">مجموع</td>
                  <td className="p-3 text-center">{faNumber(overall.total)}</td>
                  <td className="p-3 text-center text-present">{faNumber(overall.present)}</td>
                  <td className="p-3 text-center text-absent">{faNumber(overall.absent)}</td>
                  <td className="p-3 text-center text-muted">{faNumber(overall.cancelled)}</td>
                  <td className="p-3">{faNumber(overall.percent)}٪</td>
                </tr>
              </tfoot>
            )}
          </table>
        </section>
      </main>
    </>
  );
}
