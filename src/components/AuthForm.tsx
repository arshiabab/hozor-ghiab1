"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register } from "@/actions/auth";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [state, action, pending] = useActionState(isLogin ? login : register, undefined);

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <form action={action} className="card w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-primary">حضورغیاب</h1>
          <p className="mt-1 text-sm text-muted">{isLogin ? "ورود به حساب" : "ساخت حساب جدید"}</p>
        </div>
        {!isLogin && (
          <div>
            <label className="label" htmlFor="name">نام</label>
            <input className="input" id="name" name="name" required />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">ایمیل</label>
          <input className="input" id="email" name="email" type="email" dir="ltr" required />
        </div>
        <div>
          <label className="label" htmlFor="password">رمز عبور</label>
          <input className="input" id="password" name="password" type="password" dir="ltr" required />
        </div>
        {state?.error && <p className="text-sm text-absent">{state.error}</p>}
        <button className="btn-primary w-full" disabled={pending}>
          {pending ? "..." : isLogin ? "ورود" : "ثبت‌نام"}
        </button>
        <p className="text-center text-sm text-muted">
          {isLogin ? "حساب ندارید؟ " : "حساب دارید؟ "}
          <Link className="text-primary" href={isLogin ? "/register" : "/login"}>
            {isLogin ? "ثبت‌نام کنید" : "وارد شوید"}
          </Link>
        </p>
      </form>
    </main>
  );
}
