-- Datos de demostración para Supabase local. Período de referencia: noviembre de 2026.
begin;

create temporary table seed_matriculados on commit drop as
with perfiles(desde, hasta, estado, perfil) as (
  values
    (1,  20, 'activo',     'al_dia'),
    (21, 35, 'activo',     'intermitente'),
    (36, 42, 'activo',     'varios_pendientes'),
    (43, 45, 'activo',     'alta_reciente'),
    (46, 55, 'suspendido', 'suspendido'),
    (56, 58, 'baja',       'baja_con_pagos'),
    (59, 60, 'baja',       'baja_sin_pagos')
), personas as (
  select numero, estado, perfil, lpad(numero::text, 4, '0') as codigo
  from perfiles
  cross join lateral generate_series(desde, hasta) as serie(numero)
)
select
  numero,
  perfil,
  ('f17c2026-0000-4000-8000-' || lpad(numero::text, 12, '0'))::uuid as id,
  'DEMO-' || codigo as numero_matricula,
  (array['Acosta', 'Benítez', 'Campos', 'Díaz', 'Ferrer', 'Gómez',
         'Luna', 'Molina', 'Paz', 'Quiroga', 'Ríos', 'Vega'])[(numero - 1) % 12 + 1] as apellido,
  (array['Ana', 'Bruno', 'Clara', 'Diego', 'Elena'])[(numero - 1) / 12 + 1] as nombre,
  'DEMO-DNI-' || codigo as dni,
  'matriculado.' || codigo || '@example.com' as email,
  (array['Catamarca', 'Córdoba', 'La Rioja', 'Salta', 'Tucumán'])[(numero - 1) % 5 + 1] as localidad,
  case
    when perfil = 'alta_reciente' then (date '2026-09-10' + (numero - 43) * interval '1 month')::date
    else date '2024-11-15'
  end as fecha_matriculacion,
  estado
from personas;

insert into public.matriculados
  (id, numero_matricula, apellido, nombre, dni, email, localidad, fecha_matriculacion, estado)
select id, numero_matricula, apellido, nombre, dni, email, localidad, fecha_matriculacion, estado
from pg_temp.seed_matriculados
on conflict (id) do nothing;

-- Una coincidencia de UUID solo es válida si también identifica a la matrícula de prueba.
do $$
begin
  if exists (
    select 1
    from pg_temp.seed_matriculados as ejemplo
    join public.matriculados as matriculado on matriculado.id = ejemplo.id
    where matriculado.numero_matricula <> ejemplo.numero_matricula
       or matriculado.dni <> ejemplo.dni
  ) then
    raise exception 'Un identificador del conjunto de demostración pertenece a otro matriculado';
  end if;
end;
$$;

with meses as (
  select indice, (date '2024-12-01' + indice * interval '1 month')::date as periodo
  from generate_series(0, 23) as serie(indice)
)
insert into public.pagos (matriculado_id, periodo, monto, fecha_pago, medio, observaciones)
select
  matriculado.id,
  mes.periodo,
  15000 + 350 * mes.indice + 125 * (matriculado.numero % 8)
    + 0.25 * ((matriculado.numero + mes.indice) % 4),
  case
    when matriculado.numero = 21 and mes.periodo = date '2026-11-01' then date '2026-10-28'
    when matriculado.numero = 22 and mes.periodo = date '2025-12-01' then date '2026-01-07'
    else mes.periodo + 10 + matriculado.numero % 8
  end,
  (array['efectivo', 'transferencia', 'debito', 'otro'])[(matriculado.numero + mes.indice) % 4 + 1],
  case
    when matriculado.numero = 21 and mes.periodo = date '2026-11-01' then 'Demostración: pago anticipado'
    when matriculado.numero = 22 and mes.periodo = date '2025-12-01' then 'Demostración: pago tardío'
  end
from pg_temp.seed_matriculados as matriculado
cross join meses as mes
where mes.periodo >= date_trunc('month', matriculado.fecha_matriculacion)::date
  and case matriculado.perfil
    when 'al_dia' then true
    when 'intermitente' then (mes.indice + matriculado.numero) % 2 = 0
    when 'varios_pendientes' then (mes.indice + matriculado.numero) % 8 = 0
    when 'alta_reciente' then mes.indice < 23
    when 'suspendido' then (mes.indice + matriculado.numero) % 6 = 0
    when 'baja_con_pagos' then mes.indice < 5
    else false
  end
on conflict (matriculado_id, periodo) do nothing;

commit;
