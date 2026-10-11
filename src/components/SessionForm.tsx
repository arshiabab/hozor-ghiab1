"use client";

import { useActionState, useEffect, useRef } from "react";
import { createSession } from "@/actions/courses";
import JalaliDatePicker from "./JalaliDatePicker";

export default function SessionForm({ courseId, nextNumber }: { courseId: number; nextNumber: string }) {
  const [state, action, pending] = useActionState(createSession.bind(null, courseId), undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="card space-y-3">
      <h2 className="font-bold">ثبت جلسه {nextNumber}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="date">تاریخ جلسه</label>
          <JalaliDatePicker id="date" name="date" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="note">یادداشت (اختیاری)</label>
          <input className="input" id="note" name="note" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button name="status" value="PRESENT" className="btn bg-present text-white hover:opacity-90" disabled={pending}>
          ✓ حاضر بودم
        </button>
        <button name="status" value="ABSENT" className="btn bg-absent text-white hover:opacity-90" disabled={pending}>
          ✗ غایب بودم
        </button>
        <button name="status" value="CANCELLED" className="btn-ghost text-muted" disabled={pending}>
          کلاس تشکیل نشد
        </button>
        {state?.error && <p className="text-sm text-absent">{state.error}</p>}
      </div>
    </form>
  );
}
