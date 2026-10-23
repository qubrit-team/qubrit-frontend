# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run preview` — serve the built bundle

There is no test framework configured.

## Backend

Qubrit is a learning platform; this is the React 19 + Vite (plain JavaScript, no TypeScript) frontend. It needs the `qubrit-backend` server running at `VITE_API_URL` (default `http://localhost:8080`; copy `.env.example` to `.env` to override).

## Architecture

- **No router library.** `src/App.jsx` holds a `{ page, params }` state and a `PAGES` map (login, signup, forgot, home, classroom, search, create, my, solve). Every page receives `onNavigate(page, params)` and `params` as props. To add a screen: create the page in `src/pages/`, register it in `PAGES`, and navigate with `onNavigate`. The initial page is `home` if a token exists, otherwise `login`.
- **API layer (`src/api/`).** All calls go through `request()` in `http.js`, which prefixes `VITE_API_URL`, adds JSON headers and the `Bearer` token, and throws `ApiError` (`status 0` = server unreachable). Use `describeError(err)` to get the user-facing Korean message. Domain modules (`auth.js`, `sets.js`, `subjects.js`, `attempts.js`) are thin wrappers over `request`.
- **Auth token storage.** `setToken(token, persist)` stores the token in `localStorage` when "auto login" is checked, otherwise `sessionStorage`; `getToken()` reads both.
- **Layout.** Main-tab pages (home, classroom, search, create, my) wrap content in `components/MainLayout` (TopBar + BottomNav). Auth pages and the solve flow are standalone screens.
- **Styling.** Plain CSS, not modules or CSS-in-JS: shared styles in `src/styles/global.css` and `components.css`, plus one CSS file per page named after it (e.g. `SolvePage.css`).
- `src/utils/` holds small helpers (password rules, time formatting, mascot).

## Conventions

- Branches: `feature/<name>` or `fix/<name>` off `main`; never push directly to `main` (PRs only).
- Commit messages: `[Feat]:: ...`, `[Fix]:: ...`, `[Docs]:: ...`, `[Refactor]:: ...`, `[Chore]:: ...` (see `CONTRIBUTING.md`).
- UI text and code comments are written in Korean.

## Figma MCP
- **MCP Rules**: 요청을 받으면 컴포넌트로 분리 할 수 있는 요소에 대해서 네이밍을 만들고 그 요소가 왜 필요한지에 대해서 사용자에게 검증을 받아. 또한, 컴포넌트를 만들게 된다면 src/styles에 css 파일을 해당 컴포넌트 명으로 작성.