# Avito Deal Hunter

Личная панель мониторинга объявлений и поиска выгодных предложений.

## Стек
- Next.js 16 App Router + TypeScript
- Supabase Auth (cookie-based SSR) + PostgreSQL + RLS
- Tailwind-like custom CSS (без runtime UI зависимости)
- Telegram Bot API (серверный endpoint добавим после настройки бота)

## Быстрый запуск
1. Установить Node.js 20.9+.
2. `npm install`
3. Скопировать `.env.example` в `.env.local`.
4. Заполнить URL и Publishable Key Supabase.
5. Выполнить `supabase/schema.sql` в SQL Editor проекта.
6. В Supabase Auth → URL Configuration добавить `http://localhost:3000`.
7. `npm run dev`

Пока `NEXT_PUBLIC_USE_SUPABASE=false`, интерфейс работает на демонстрационных данных.
Для включения Supabase установите `NEXT_PUBLIC_USE_SUPABASE=true`, перезапустите сервер и зарегистрируйте первого пользователя через форму входа.

## Структура
- `app/` — страницы и API routes
- `lib/supabase/` — browser/server clients и session proxy
- `lib/data.ts` — загрузка данных (demo/Supabase)
- `supabase/schema.sql` — таблицы, индексы, RLS
- `types/` — доменные типы

## Источник объявлений
В MVP слой получения данных отделён от интерфейса. Подключайте только разрешённый API/поставщика данных, на использование которого у вас есть право. Не обходите CAPTCHA, авторизацию, rate limits или технические ограничения Avito. Адаптер источника должен нормализовать объявления в модель `Listing` и передавать их в серверный ingestion-процесс.

## Безопасность
- В браузере используется только publishable key.
- Secret/service-role key не нужен фронтенду и не должен попадать в `NEXT_PUBLIC_*`.
- Все пользовательские таблицы защищены RLS.
- Telegram bot token хранится только в серверных переменных окружения.
- Первый пользователь создаётся через Supabase Auth; доступ к таблицам ограничивается `auth.uid()`.

## Публикация
Создайте публичный репозиторий `avito-deal-hunter` на GitHub, затем:
```bash
git init
git add .
git commit -m "Initial Avito Deal Hunter MVP"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/avito-deal-hunter.git
git push -u origin main
```
Подключите репозиторий в Vercel и задайте те же env vars из `.env.example`.
