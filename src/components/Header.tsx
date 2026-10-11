import Link from "next/link";
import { logout } from "@/actions/auth";
import { requireUser } from "@/lib/auth";

export default async function Header() {
  const { name } = await requireUser();
  return (
    <header className="no-print border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-base font-bold text-primary">حضورغیاب</Link>
          <Link href="/" className="hover:text-primary">درس‌ها</Link>
          <Link href="/report" className="hover:text-primary">گزارش ترم</Link>
        </nav>
        <form action={logout} className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted sm:inline">{name}</span>
          <button className="btn-ghost py-1.5">خروج</button>
        </form>
      </div>
    </header>
  );
}
