This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## OpenSpec

Las especificaciones de [acceso](openspec/specs/acceso/spec.md), [matriculados](openspec/specs/matriculados/spec.md) y [pagos de cuotas](openspec/specs/pagos-de-cuotas/spec.md) describen el comportamiento vigente de Cobros y Morosos. Las propuestas de cambio se guardan en `openspec/changes/`.

En Codex, usá `$openspec-propose` para preparar la propuesta, `$openspec-apply-change` para implementarla y `$openspec-archive-change` cuando esté terminada.

Desde la raíz del proyecto, podés validar todas las especificaciones y propuestas con la misma versión de la CLI que se usó para configurar el repositorio.

```bash
npx --yes @fission-ai/openspec@1.13.0 validate --all --strict
```

## Datos de demostración

Con Docker y la CLI de Supabase activos, ejecutá estos comandos desde una copia de desarrollo del repositorio. Corré `supabase init` si todavía falta `supabase/config.toml`. En el primer arranque, Supabase aplica las migraciones y carga [supabase/seed.sql](supabase/seed.sql). [Guía de Supabase para cargar datos de prueba](https://supabase.com/docs/guides/local-development/seeding-your-database)

```bash
supabase start
supabase status
```

Para reconstruir una base de desarrollo descartable que ya está iniciada, usá `supabase db reset --local`. Este comando reemplaza sus datos con las migraciones y la carga de prueba.

En `.env.local` de esa copia, usá la URL de la API y la clave pública locales que muestra `supabase status` como `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Instalá las dependencias con `npm ci`, ejecutá `npm run dev` e ingresá con una cuenta del entorno local.

En una base recién preparada hay **70 matriculados** y **739 pagos** de diciembre de 2024 a noviembre de 2026. En **Pagos**, elegí **noviembre de 2026**. El resumen esperado muestra **31 cuotas pagadas de 64**, **33 pendientes** y **$727.935,00 cobrados**.

| Caso | Cómo encontrarlo |
| --- | --- |
| Búsqueda y selección en lote | En noviembre de 2026, buscá `Vega` y activá `Solo pendientes`. Aparecen `DEMO-0024`, `DEMO-0036` y `DEMO-0048`. |
| Alta reciente | El historial de `DEMO-0045` muestra noviembre de 2026 como pendiente. |
| Pago anticipado | En `DEMO-0021`, la cuota de noviembre de 2026 figura pagada el 28/10/2026. |
| Pago tardío y cambio de año | En `DEMO-0022`, la cuota de diciembre de 2025 figura pagada el 07/01/2026. |
| Bajas con y sin historial | En 2025, `DEMO-0056` muestra sus pagos históricos y `DEMO-0059` muestra el historial vacío. |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
