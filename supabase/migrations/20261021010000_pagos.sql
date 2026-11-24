-- Pagos de cuotas: un pago por matriculado y período mensual
create table if not exists public.pagos (
  id               uuid primary key default gen_random_uuid(),
  matriculado_id   uuid not null references public.matriculados (id),
  periodo          date not null check (extract(day from periodo) = 1),
  monto            numeric(12, 2) not null check (monto > 0),
  fecha_pago       date not null default current_date,
  medio            text not null default 'efectivo'
                   check (medio in ('efectivo', 'transferencia', 'debito', 'otro')),
  observaciones    text,
  created_at       timestamptz not null default now(),
  unique (matriculado_id, periodo)
);

create index if not exists pagos_periodo_idx on public.pagos (periodo);

alter table public.pagos enable row level security;

create policy "Autenticados pueden ver pagos"
  on public.pagos for select to authenticated using (true);
create policy "Autenticados pueden crear pagos"
  on public.pagos for insert to authenticated with check (true);
