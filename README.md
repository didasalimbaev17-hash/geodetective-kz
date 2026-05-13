# GeoDetective KZ

**Образовательная веб-игра-расследование по географии для учеников 10–11 классов Казахстана.**

Ученик играет роль географа-аналитика: расследует экологические кейсы (Арал, Балхаш, Семей и др.), собирает улики (спутниковые снимки, графики, статистика), определяет проблему/страну/причину/последствия, выбирает решение — и наблюдает на динамической карте, как меняется регион. Текстовое объяснение оценивает ИИ (Claude API).

---

## Технологии

- **Frontend + Backend:** Next.js 15 (App Router) · React 19 · TypeScript
- **Стили:** Tailwind CSS · shadcn/ui · Framer Motion
- **Карты:** Leaflet · react-leaflet · flubber.js (SVG-морфинг)
- **Графики:** Recharts · D3
- **State:** XState (game FSM) · Zustand (UI)
- **БД:** Supabase (PostgreSQL + Auth + Storage + RLS) · Drizzle ORM
- **AI:** Anthropic Claude API (Sonnet 4.6)
- **i18n:** next-intl (kk default, ru secondary)
- **Деплой:** GitHub → Vercel + Supabase

---

## Локальный запуск

### 1. Установка

```bash
git clone https://github.com/<your-user>/geodetective-kz.git
cd geodetective-kz
npm install
```

### 2. Переменные окружения

```bash
cp .env.example .env.local
```

Заполни значения в `.env.local`:

- **Supabase:** создай проект на [supabase.com](https://supabase.com), скопируй URL и ключи из `Project Settings → API`.
- **DATABASE_URL:** из `Project Settings → Database → Connection string → URI` (используй pooler-вариант).
- **Anthropic:** получи ключ на [console.anthropic.com](https://console.anthropic.com).
- **AUTH_SECRET:** сгенерируй командой `openssl rand -base64 32`.

### 3. База данных

```bash
npm run db:push
```

Это применит схему Drizzle к Supabase и создаст таблицы (`profiles`, `scenarios`, `case_sessions`, `ai_evaluations`, `classrooms`, и т.д.).

После — выполни SQL из `drizzle/seed.sql` в Supabase SQL Editor чтобы залить кейс «Арал» и базовые RLS-политики.

### 4. Запуск

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000) — увидишь лендинг на казахском.

---

## Развёртывание (GitHub → Vercel)

### 1. Загрузить проект на GitHub

```bash
git init
git add .
git commit -m "initial commit"
gh repo create geodetective-kz --public --source=. --remote=origin --push
```

### 2. Подключить к Vercel

1. Зайди на [vercel.com/new](https://vercel.com/new) и импортируй репозиторий
2. Framework Preset: **Next.js** (определится автоматически)
3. Environment Variables — добавь все из `.env.example` (значения из своего `.env.local`)
4. **Deploy** — через 1-2 минуты публичная ссылка готова

Каждый `git push origin main` будет автоматически деплоить новую версию. Pull Request получает preview-ссылку.

### 3. Supabase production-настройка

- В Supabase Dashboard → `Authentication → URL Configuration` добавь Vercel URL в `Site URL` и `Redirect URLs`
- В `Authentication → Email Templates` локализуй письма на казахский (опционально)
- Включи RLS на всех таблицах (миграции включают политики автоматически)

---

## Структура проекта

```
src/
├── app/
│   ├── [locale]/              # i18n routing (kk/ru)
│   │   ├── (public)/          # landing, about
│   │   ├── auth/              # login, register
│   │   ├── student/           # dashboard, case/[id], profile
│   │   └── teacher/           # dashboard, classes, reviews
│   └── api/grade/             # Claude API grading endpoint
├── components/
│   ├── ui/                    # shadcn primitives (Button, Card, ...)
│   ├── game/                  # Briefing, Evidence, Investigation, ...
│   ├── map/                   # DynamicMap, EvidenceLayer
│   └── charts/                # Line, Bar, Heatmap
├── game/
│   └── caseMachine.ts         # XState FSM for case flow
├── schemas/
│   ├── case.schema.ts         # Zod scenario schema
│   └── ai.schema.ts           # Zod AI response schema
├── server/
│   ├── db/                    # Drizzle schema + queries
│   ├── auth/                  # Supabase server client
│   ├── ai/gradeEssay.ts       # Claude API integration
│   └── actions/               # Server Actions
├── data/cases/                # Seed scenario JSON (aral.json, ...)
├── i18n/                      # next-intl config
└── lib/                       # utils
```

---

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Dev-сервер на localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Запуск production-сборки |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript проверка |
| `npm run db:generate` | Генерация миграции из схемы |
| `npm run db:push` | Применить схему к БД |
| `npm run db:studio` | Drizzle Studio (GUI БД) |

---

## Roadmap

- [x] Этап 1: Скаффолд (auth, БД, i18n)
- [x] Этап 2: Игровой движок (XState, экраны кейса)
- [x] Этап 3: Симуляция (морфинг карты, анимация графиков)
- [x] Этап 4: AI-оценка (Claude API + рубрика)
- [ ] Этап 5: Кабинеты + геймификация (XP, бейджи, override)
- [ ] Этап 6: Конструктор кейсов + 5 готовых сценариев
- [ ] Этап 7: Полировка, accessibility, E2E-тесты

Текущий MVP включает: лендинг, аутентификацию с ролями, каталог кейсов, полный игровой цикл по кейсу «Арал теңізі», ИИ-оценку эссе, кабинет учителя (skeleton).

---

## Лицензия

MIT — дипломный проект, свободно используй и адаптируй для образовательных целей.
