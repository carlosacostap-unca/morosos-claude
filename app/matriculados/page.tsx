import { Suspense } from "react";
import { SiteHeader } from "../site-header";
import { MatriculadosList } from "./matriculados-list";

export default function MatriculadosPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Matriculados
          </h1>
          <Suspense
            fallback={
              <p className="text-zinc-600 dark:text-zinc-400">
                Cargando matriculados…
              </p>
            }
          >
            <MatriculadosList />
          </Suspense>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © CPCEC · Sistema de gestión de cobros y morosos
      </footer>
    </div>
  );
}
