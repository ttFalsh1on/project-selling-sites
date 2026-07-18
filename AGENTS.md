# Проект

Frontend: React + TypeScript + Vite. Бэкенд — **Flex** (SiteForge), локальный проект
на этом же компьютере: `E:/бэкенд/examples/siteforge`.

## Подключение к бэкенду

- Фронтенд общается с Flex через пакеты `@flex/client` и `@flex/react`
  (см. `src/hooks/useApi.ts`, `src/providers/FlexAuthProvider.tsx`).
- URL бэкенда берётся из переменной окружения `VITE_FLEX_URL`
  (локально `http://localhost:3210`, см. `.env.local` / `.env.example`).
- Список серверных функций (пути `module:function`) — в `src/api/paths.ts`.

## Запуск

```bash
# 1. Локальный Flex-бэкенд (порт 3210)
npm run dev:backend

# 2. Фронтенд
npm run dev
```

Реализация серверных функций (auth, profiles, services, reviews, cms, theme,
navItems, admins, seed) находится в `E:/бэкенд/examples/siteforge/src/functions`.
