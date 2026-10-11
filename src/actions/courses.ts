"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AttendanceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { parseStatus } from "@/lib/stats";

export type FormState = { error?: string; ok?: boolean } | undefined;

async function ownCourse(courseId: number, userId: number) {
  const course = await prisma.course.findFirst({ where: { id: courseId, userId } });
  if (!course) throw new Error("Course not found");
  return course;
}

export async function createCourse(_: FormState, formData: FormData): Promise<FormState> {
  const { userId } = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const teacher = String(formData.get("teacher") ?? "").trim();
  if (!title) return { error: "نام درس را وارد کنید." };

  await prisma.course.create({ data: { title, teacher: teacher || null, userId } });
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCourse(courseId: number) {
  const { userId } = await requireUser();
  await prisma.course.deleteMany({ where: { id: courseId, userId } });
  revalidatePath("/");
  redirect("/");
}

export async function createSession(
  courseId: number,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await requireUser();
  await ownCourse(courseId, userId);

  const status = parseStatus(formData.get("status"));
  const dateRaw = String(formData.get("date") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? new Date(`${dateRaw}T12:00:00Z`) : null;
  if (date && isNaN(date.getTime())) return { error: "تاریخ معتبر نیست." };

  const last = await prisma.classSession.findFirst({
    where: { courseId },
    orderBy: { number: "desc" },
  });
  await prisma.classSession.create({
    data: { courseId, number: (last?.number ?? 0) + 1, status, date, note: note || null },
  });
  revalidatePath(`/courses/${courseId}`);
  return { ok: true };
}

export async function setSessionStatus(sessionId: number, status: AttendanceStatus) {
  const { userId } = await requireUser();
  const s = await prisma.classSession.findFirst({
    where: { id: sessionId, course: { userId } },
  });
  if (!s) throw new Error("Session not found");
  await prisma.classSession.update({ where: { id: s.id }, data: { status } });
  revalidatePath(`/courses/${s.courseId}`);
}

export async function deleteSession(sessionId: number) {
  const { userId } = await requireUser();
  const s = await prisma.classSession.findFirst({
    where: { id: sessionId, course: { userId } },
  });
  if (!s) return;
  await prisma.classSession.delete({ where: { id: s.id } });
  revalidatePath(`/courses/${s.courseId}`);
}
