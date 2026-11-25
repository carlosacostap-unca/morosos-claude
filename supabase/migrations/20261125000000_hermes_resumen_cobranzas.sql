begin;

create role hermes_cobranzas_lector nologin noinherit;

create schema hermes_cobranzas;
revoke all on schema hermes_cobranzas from public;
grant usage on schema hermes_cobranzas to hermes_cobranzas_lector;

create function hermes_cobranzas.resumen_mensual(p_periodo date)
returns table (matriculados integer, pagadas integer, pendientes integer, cobrado_ars text)
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select count(*)::integer,
         count(p.id)::integer,
         (count(*) - count(p.id))::integer,
         coalesce(sum(p.monto), 0)::numeric(20, 2)::text
  from public.matriculados as m
  left join public.pagos as p on p.matriculado_id = m.id and p.periodo = p_periodo
  where m.estado in ('activo', 'suspendido')
  having p_periodo >= date '2026-03-01' and extract(day from p_periodo) = 1;
$$;

revoke all on function hermes_cobranzas.resumen_mensual(date) from public, anon, authenticated;
grant execute on function hermes_cobranzas.resumen_mensual(date) to hermes_cobranzas_lector;

commit;
