"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCourse } from "@/actions/courses";

export default function CourseForm() {
  const [state, action, pending] = useActionState(createCourse, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="card flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="label" htmlFor="title">نام درس</label>
        <input className="input" id="title" name="title" placeholder="مثلاً پایگاه داده" required />
      </div>
      <div className="flex-1">
        <label className="label" htmlFor="teacher">استاد (اختیاری)</label>
        <input className="input" id="teacher" name="teacher" />
      </div>
      <button className="btn-primary" disabled={pending}>افزودن درس</button>
      {state?.error && <p className="text-sm text-absent">{state.error}</p>}
    </form>
  );
}
