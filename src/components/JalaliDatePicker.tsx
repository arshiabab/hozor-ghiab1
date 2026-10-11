"use client";

import { useEffect, useRef, useState } from "react";
import { jalaaliMonthLength, toGregorian, toJalaali } from "jalaali-js";

const MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];
const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

type JDate = { jy: number; jm: number; jd: number };

const fa = (n: number) => n.toLocaleString("fa-IR", { useGrouping: false });
const today = (): JDate => {
  const d = new Date();
  return toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
};
const toIso = ({ jy, jm, jd }: JDate) => {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
};
const same = (a: JDate | null, b: JDate) => !!a && a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;

/** Jalali calendar picker. Submits the selected day as a Gregorian ISO date (YYYY-MM-DD). */
export default function JalaliDatePicker({ name, id }: { name: string; id?: string }) {
  const [value, setValue] = useState<JDate | null>(today);
  const [view, setView] = useState(() => ({ jy: today().jy, jm: today().jm }));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const shiftMonth = (delta: number) =>
    setView(({ jy, jm }) => {
      const m = jm + delta;
      return m < 1 ? { jy: jy - 1, jm: 12 } : m > 12 ? { jy: jy + 1, jm: 1 } : { jy, jm: m };
    });

  const pick = (d: JDate | null) => {
    setValue(d);
    setOpen(false);
  };

  // Saturday-first offset of the 1st day of the viewed month
  const first = toGregorian(view.jy, view.jm, 1);
  const offset = (new Date(first.gy, first.gm - 1, first.gd).getDay() + 1) % 7;
  const days = jalaaliMonthLength(view.jy, view.jm);
  const t = today();

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value ? toIso(value) : ""} />
      <button
        id={id}
        type="button"
        onClick={() => {
          if (!open && value) setView({ jy: value.jy, jm: value.jm });
          setOpen((o) => !o);
        }}
        className="input text-right"
      >
        {value ? `${fa(value.jd)} ${MONTHS[value.jm - 1]} ${fa(value.jy)}` : <span className="text-muted">بدون تاریخ</span>}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-72 rounded-xl border border-border bg-card p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} className="btn-ghost px-2 py-1" aria-label="ماه قبل">›</button>
            <span className="text-sm font-bold">{MONTHS[view.jm - 1]} {fa(view.jy)}</span>
            <button type="button" onClick={() => shiftMonth(1)} className="btn-ghost px-2 py-1" aria-label="ماه بعد">‹</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 text-muted">{w}</span>
            ))}
            {Array.from({ length: offset }, (_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const d = { ...view, jd: i + 1 };
              const selected = same(value, d);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(d)}
                  className={`cursor-pointer rounded-lg py-1.5 ${
                    selected ? "bg-primary text-white" : same(t, d) ? "border border-primary text-primary" : "hover:bg-background"
                  }`}
                >
                  {fa(i + 1)}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <button type="button" onClick={() => pick(t)} className="cursor-pointer text-primary">امروز</button>
            <button type="button" onClick={() => pick(null)} className="cursor-pointer text-muted">بدون تاریخ</button>
          </div>
        </div>
      )}
    </div>
  );
}
