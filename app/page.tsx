import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-6 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo CPCEC" className="h-full w-full object-contain" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cobros y Morosos
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          Sistema de gestión
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Bienvenido al sistema de gestión de cobros y morosos
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Administrá tus cobranzas, controlá a los deudores y mantené las
          cuentas al día de forma simple y ordenada.
        </p>
        <Link
          href="/matriculados"
          className="flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Entrar a la aplicación
        </Link>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © CPCEC · Sistema de gestión de cobros y morosos
      </footer>
    </div>
  );
}
