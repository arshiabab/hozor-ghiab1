import { faNumber, type AttendanceStats } from "@/lib/stats";

export function AttendanceBar({ percent }: { percent: number }) {
  const color = percent >= 75 ? "bg-present" : percent >= 50 ? "bg-amber-500" : "bg-absent";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function StatGrid({ stats }: { stats: AttendanceStats }) {
  const items = [
    { label: "جلسات برگزارشده", value: faNumber(stats.total), cls: "" },
    { label: "حاضر", value: faNumber(stats.present), cls: "text-present" },
    { label: "غایب", value: faNumber(stats.absent), cls: "text-absent" },
    { label: "تشکیل نشده", value: faNumber(stats.cancelled), cls: "text-muted" },
    { label: "درصد حضور", value: `${faNumber(stats.percent)}٪`, cls: "text-primary" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((i) => (
        <div key={i.label} className="card p-4 text-center">
          <div className="text-xs text-muted">{i.label}</div>
          <div className={`mt-1 text-2xl font-bold ${i.cls}`}>{i.value}</div>
        </div>
      ))}
    </div>
  );
}
