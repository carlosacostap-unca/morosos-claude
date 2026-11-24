import Link from "next/link";
import { logout } from "./login/actions";

const links = [
  { href: "/matriculados", label: "Matriculados" },
  { href: "/pagos", label: "Pagos" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo CPCEC" className="h-full w-full object-contain" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cobros y Morosos
          </span>
        </Link>
        <nav className="ml-auto flex gap-1 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {l.label}
            </Link>
          ))}
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full px-4 py-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Salir
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
