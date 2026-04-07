# AGENTS.md

## Cursor Cloud specific instructions

This repository contains **two independent frontend applications** with no shared backend or database.

### Services

| App | Location | Port | Dev Command |
|---|---|---|---|
| 企业报告生成系统 (React + Vite) | `React/` | 3000 | `npm run dev` |
| 管理后台 (Umi Max + Ant Design) | `umi-antd-admin/` | 8000 | `HUSKY=0 pnpm dev` |

### Key notes

- **No backend required.** Both apps use mock/in-memory data. The umi-antd-admin app uses `umi-plugin-mock` for API simulation.
- **Husky:** The umi-antd-admin project has husky configured, but `.git` is at the repo root, not in `umi-antd-admin/`. Use `HUSKY=0` when running install or dev commands in `umi-antd-admin/` to skip husky errors.
- **Lint:** React app: `npm run lint` (runs `tsc --noEmit`). The umi-antd-admin project has no dedicated lint script; `npx tsc --noEmit` will show expected errors for auto-generated `umi` module types.
- **Build:** React app: `npm run build`. Umi app: `pnpm build`.
- **登录跳转:** 登录成功后自动跳转到 `/#/dashboard`（数据概览页）。Mock 凭据: `admin` / `123456`。
- **GEMINI_API_KEY:** The React app optionally uses Google Gemini AI for report generation, but currently uses simulated generation (setTimeout). The API key is not required for development.
- **pnpm lockfile:** The umi-antd-admin `pnpm-lock.yaml` may be incompatible with the installed pnpm version; pnpm will regenerate it automatically on install.
