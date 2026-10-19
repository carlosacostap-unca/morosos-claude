const features = [
  {
    title: "Gestión de cobros",
    description:
      "Registrá y seguí los cobros pendientes, vencimientos y pagos recibidos en un solo lugar.",
    icon: "💳",
  },
  {
    title: "Control de morosos",
    description:
      "Identificá rápidamente a los deudores, el monto adeudado y los días de atraso.",
    icon: "⚠️",
  },
  {
    title: "Reportes y estadísticas",
    description:
      "Visualizá la evolución de la cobranza y tomá decisiones con información clara.",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-6 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-lg text-white">
            $
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cobros y Morosos
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-16 px-6 py-16">
        <section className="flex flex-col items-center gap-6 text-center">
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Ingresar al sistema
            </a>
            <a
              href="#funciones"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Conocer más
            </a>
          </div>
        </section>

        <section
          id="funciones"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-3xl" aria-hidden="true">
                {feature.icon}
              </span>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {feature.title}
              </h2>
              <p className="leading-7 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © CPCEC · Sistema de gestión de cobros y morosos
      </footer>
    </div>
  );
}
