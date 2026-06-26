# Supabase: миграции, OAuth, логи

## Миграции базы данных

Схема БД версионируется через Supabase CLI. SQL-файлы лежат в `supabase/migrations/`; CLI отслеживает, какие из них уже применены к удалённому проекту, в таблице `supabase_migrations.schema_migrations`.

При `supabase db push` выполняются только миграции, которых ещё нет в этой таблице. Если всё уже накатано, команда завершается без изменений.

В `package.json` есть обёртки: `db:link` (привязка к проекту), `db:push` / `db:push:dry` (применение / dry-run), `db:migrations` (список локальных vs remote).

### Две базы

| | Dev (локальная) | Prod |
|--|-----------------|------|
| Подключение фронта | `.env` → `VITE_SUPABASE_*` | Vercel env |
| Миграции | все файлы из `supabase/migrations/` уже применены | `001` была выполнена вручную в SQL Editor; `002`–`008` — через CLI |
| CLI `db:link` | может быть привязана dev-база | для prod — отдельная привязка и синхронизация истории (см. ниже) |

`.env` не используется в GitHub Actions. Workflow миграций смотрит только на секреты репозитория и всегда работает с проектом, чей ref указан в `SUPABASE_PROJECT_ID`.

### CI при push в `main`

Workflow `.github/workflows/supabase-migrations.yml` запускается на каждый push в `main` и вручную через Actions → Run workflow.

Перед запуском в GitHub → Settings → Secrets and variables → Actions заданы:

| Secret | Откуда |
| ------ | ------ |
| `SUPABASE_ACCESS_TOKEN` | [Account Tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_ID` | Ref проекта из URL dashboard (`https://supabase.com/dashboard/project/<ref>`) |
| `SUPABASE_DB_PASSWORD` | Project → Settings → Database → password |

В CI: checkout → `supabase link` по `SUPABASE_PROJECT_ID` → `supabase db push`. Накатываются только pending-миграции.

### Первичная синхронизация prod (миграция `001`)

На prod `001_notes.sql` изначально выполнялась вручную в SQL Editor. CLI об этом не знает: для неё в `schema_migrations` нет записи, и без синхронизации `db push` попытается применить `001` повторно.

Однократно для prod: привязка CLI к prod-проекту (ref и database password), затем `supabase migration repair --status applied 001`. `repair` только обновляет учёт в `schema_migrations`, SQL не выполняет. После этого `migration list` показывает `001` как applied, `002`–`008` — как pending; их накатывает либо локальный `db push`, либо CI после merge в `main`.

### Добавление новой миграции

Новый файл создаётся через `supabase migration new <name>` в `supabase/migrations/<timestamp>_<name>.sql`. После merge в `main` CI применяет его к prod; до merge можно проверить локально через `db:push` на привязанном проекте.

### Порядок миграций

| Файл | Содержание |
| ---- | ---------- |
| `001_notes.sql` | Таблица notes, RLS, RPC edit token |
| `002_notes_title.sql` | `title`, удаление `theme`, обновление RPC |
| `003_profiles.sql` | Профили, `theme_preference`, trigger на signup |
| `004_indexable.sql` | `indexable boolean default false`, обновление RPC |
| `005_remove_b_side_theme.sql` | Удаление `b-side` из `theme_preference` |
| `006_locale_preference.sql` | `locale_preference` (`system` / `en` / `ru`) в profiles |
| `007_anonymous_expiry.sql` | `expires_at` для анонимных заметок |
| `008_delete_note_by_token.sql` | RPC `delete_note_by_token` |

---

## Расшифровка типичных логов

### LOG — норма

| Сообщение | Значение |
| --------- | -------- |
| `connection authorized: user=authenticator ... PostgREST` | API-запросы с фронта |
| `connection authenticated: identity="postgres"` | Dashboard, SQL Editor, CLI |
| `connection authenticated: user="pgbouncer"` | Пул соединений |

### ERROR — `supabase_migrations.schema_migrations does not exist`

Появляется при первом `db push` до инициализации CLI — таблица создаётся автоматически. Если миграции уже гоняли вручную, нужна синхронизация через `migration repair`.

### ERROR — migration history mismatch

CLI подсказывает команду `migration repair`. Сверка: `npm run db:migrations` — локальные файлы vs remote.

---

## OAuth (GitHub / Google)

В **Authentication → Providers** включены провайдеры с Client ID/Secret.

**URL Configuration:**
- Site URL: `http://localhost:5173` (dev) и production URL
- Redirect: `http://localhost:5173/dashboard` и `https://your-domain.vercel.app/dashboard`

Фронт читает `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` из `.env`.
