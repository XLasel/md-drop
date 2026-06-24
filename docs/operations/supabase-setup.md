# Supabase: логи, миграции, OAuth

## Расшифровка типичных логов

### LOG — норма

| Сообщение | Значение |
|-----------|----------|
| `connection authorized: user=authenticator ... PostgREST` | API-запросы с фронта |
| `connection authenticated: identity="postgres"` | Dashboard, SQL Editor, CLI |
| `connection authenticated: user="pgbouncer"` | Пул соединений |

### ERROR — `supabase_migrations.schema_migrations does not exist`

Появляется при `supabase db push` без инициализации CLI-трекинга. **Не блокирует приложение**, если SQL из `supabase/migrations/` уже выполнен вручную через SQL Editor.

**Пути:**

- **Pet / solo:** SQL Editor → копировать каждую миграцию
- **Команда:** `supabase init` → `supabase link` → `supabase db push`

## OAuth (GitHub / Google)

1. **Authentication → Providers** — включить, вставить Client ID/Secret
2. **URL Configuration:**
   - Site URL: `http://localhost:5173`
   - Redirect: `http://localhost:5173/dashboard` (+ production URL)
3. `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Порядок миграций

| Файл | Содержание |
|------|------------|
| `001_notes.sql` | Таблица notes, RLS, RPC edit token |
| `002_notes_title.sql` | `title`, удаление `theme`, обновление RPC |
| `003_profiles.sql` | Профили, `theme_preference`, trigger на signup |
| `004_indexable.sql` | `indexable boolean default false`, обновление RPC |
| `005_remove_b_side_theme.sql` | Удаление `b-side` из `theme_preference` |
| `006_locale_preference.sql` | `locale_preference` (`system` / `en` / `ru`) в profiles |
