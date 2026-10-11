import type { AttendanceStatus } from "@prisma/client";

export type AttendanceStats = {
  /** Sessions actually held (cancelled ones excluded) */
  total: number;
  present: number;
  absent: number;
  cancelled: number;
  percent: number;
};

export function computeStats(sessions: { status: AttendanceStatus }[]): AttendanceStats {
  const count = (st: AttendanceStatus) => sessions.filter((s) => s.status === st).length;
  const present = count("PRESENT");
  const absent = count("ABSENT");
  const cancelled = count("CANCELLED");
  const total = present + absent;
  const percent = total === 0 ? 0 : Math.round((present / total) * 100);
  return { total, present, absent, cancelled, percent };
}

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: "حاضر",
  ABSENT: "غایب",
  CANCELLED: "تشکیل نشد",
};

export function parseStatus(v: FormDataEntryValue | null): AttendanceStatus {
  return v === "ABSENT" || v === "CANCELLED" ? v : "PRESENT";
}

export const faNumber = (n: number) => n.toLocaleString("fa-IR");

export function formatFaDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "medium", timeZone: "Asia/Tehran" }).format(d);
}
