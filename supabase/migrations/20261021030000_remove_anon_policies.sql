-- La app ahora usa login (Supabase Auth): se eliminan los accesos anónimos temporales.
drop policy if exists "Anon puede crear matriculados" on public.matriculados;
drop policy if exists "Anon puede editar matriculados" on public.matriculados;
drop policy if exists "Lectura pública temporal de matriculados" on public.matriculados;
drop policy if exists "Anon puede ver pagos" on public.pagos;
drop policy if exists "Anon puede crear pagos" on public.pagos;
