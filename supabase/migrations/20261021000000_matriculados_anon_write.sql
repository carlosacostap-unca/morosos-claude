-- TEMPORAL: permite alta y edición de matriculados sin login.
-- Cualquiera con la clave pública puede escribir. Reemplazar por Supabase Auth.
create policy "Anon puede crear matriculados"
  on public.matriculados for insert to anon with check (true);
create policy "Anon puede editar matriculados"
  on public.matriculados for update to anon using (true) with check (true);
