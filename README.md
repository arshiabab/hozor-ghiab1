# حضورغیاب

وب‌اپلیکیشن مدیریت حضور و غیاب دانشجو — Next.js + Prisma (PostgreSQL) + JWT.

## امکانات
- ثبت‌نام / ورود با JWT (کوکی httpOnly، امضای HS256 با `jose`، رمز هش‌شده با bcrypt)
- تعریف درس‌ها و ثبت جلسات هر درس با وضعیت «حاضر»، «غایب» یا «تشکیل نشد» (+ تاریخ شمسی و یادداشت)
- جلسات تشکیل‌نشده در آمار و درصد حضور حساب نمی‌شوند
- انتخاب تاریخ با تقویم جلالی (`src/components/JalaliDatePicker.tsx`)
- تغییر وضعیت جلسه با یک کلیک، حذف جلسه/درس
- محاسبه خودکار تعداد جلسات، حضور، غیبت و درصد حضور برای هر درس
- گزارش پایان ترم برای همه درس‌ها (قابل چاپ / ذخیره به PDF)

## اجرا
```bash
docker compose up -d   # PostgreSQL محلی روی پورت 5440
npm install
cp .env.example .env   # مقدار JWT_SECRET را عوض کنید
npx prisma migrate dev
npm run dev
```

## ساختار
| مسیر | توضیح |
|---|---|
| `prisma/schema.prisma` | مدل‌های `User`، `Course`، `ClassSession` |
| `src/lib/jwt.ts` | ساخت و اعتبارسنجی توکن JWT |
| `src/lib/auth.ts` | مدیریت کوکی نشست و `requireUser()` |
| `src/proxy.ts` | هدایت کاربر واردنشده به `/login` |
| `src/actions/` | Server Actionها (احراز هویت، درس، جلسه) |
| `src/lib/stats.ts` | محاسبه آمار حضور و غیاب |
| `src/app/` | صفحات: داشبورد، صفحه درس، گزارش ترم، ورود/ثبت‌نام |

تمام کوئری‌ها با `userId` کاربر واردشده فیلتر می‌شوند، پس هر کاربر فقط به داده‌های خودش دسترسی دارد.

## انتشار روی Vercel
1. پروژه را در Vercel import کنید.
2. از تب Storage یک دیتابیس Neon (Postgres) بسازید و به پروژه وصل کنید؛ `DATABASE_URL` و `DATABASE_URL_UNPOOLED` خودکار ست می‌شوند.
3. متغیر `JWT_SECRET` را دستی اضافه کنید (`openssl rand -hex 32`).
4. Deploy کنید. اسکریپت build خودش `prisma migrate deploy` را اجرا می‌کند و جدول‌ها ساخته می‌شوند.
