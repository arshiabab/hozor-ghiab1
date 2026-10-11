"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-ghost no-print">
      چاپ / PDF
    </button>
  );
}
