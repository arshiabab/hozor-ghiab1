"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth";

export type FormState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length < 2) return { error: "نام باید حداقل ۲ حرف باشد." };
  if (!EMAIL_RE.test(email)) return { error: "ایمیل معتبر نیست." };
  if (password.length < 6) return { error: "رمز عبور باید حداقل ۶ کاراکتر باشد." };

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "این ایمیل قبلاً ثبت شده است." };

  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10) },
  });
  await createSession({ userId: user.id, name: user.name });
  redirect("/");
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "ایمیل یا رمز عبور اشتباه است." };
  }
  await createSession({ userId: user.id, name: user.name });
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
