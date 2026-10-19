-- Tabla de matriculados
create table if not exists public.matriculados (
  id                  uuid primary key default gen_random_uuid(),
  numero_matricula    text not null unique,
  apellido            text not null,
  nombre              text not null,
  dni                 text not null unique,
  cuit                text unique,
  email               text,
  telefono            text,
  domicilio           text,
  localidad           text,
  fecha_matriculacion date not null default current_date,
  estado              text not null default 'activo'
                      check (estado in ('activo', 'suspendido', 'baja')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists matriculados_apellido_nombre_idx
  on public.matriculados (apellido, nombre);
create index if not exists matriculados_estado_idx
  on public.matriculados (estado);

-- Mantiene updated_at actualizado
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists matriculados_set_updated_at on public.matriculados;
create trigger matriculados_set_updated_at
  before update on public.matriculados
  for each row execute function public.set_updated_at();

-- Seguridad: solo usuarios autenticados acceden a los datos
alter table public.matriculados enable row level security;

create policy "Autenticados pueden ver matriculados"
  on public.matriculados for select to authenticated using (true);
create policy "Autenticados pueden crear matriculados"
  on public.matriculados for insert to authenticated with check (true);
create policy "Autenticados pueden editar matriculados"
  on public.matriculados for update to authenticated using (true) with check (true);
create policy "Autenticados pueden eliminar matriculados"
  on public.matriculados for delete to authenticated using (true);

-- Datos sintéticos (ficticios)
insert into public.matriculados
  (numero_matricula, apellido, nombre, dni, cuit, email, telefono, domicilio, localidad, fecha_matriculacion, estado)
values
  ('MP-1001', 'González',  'María Laura',   '20111222', '27-20111222-4', 'maria.gonzalez@example.com',  '+54 11 5550-0101', 'Av. Corrientes 1234',  'Buenos Aires', '2008-03-14', 'activo'),
  ('MP-1002', 'Rodríguez', 'Juan Pablo',    '22333444', '20-22333444-1', 'juan.rodriguez@example.com',  '+54 11 5550-0102', 'Calle Mitre 450',      'Avellaneda',   '2010-07-22', 'activo'),
  ('MP-1003', 'Fernández', 'Lucía Beatriz', '25444555', '27-25444555-9', 'lucia.fernandez@example.com', '+54 351 555-0103', 'Bv. San Juan 880',     'Córdoba',      '2012-05-09', 'activo'),
  ('MP-1004', 'López',     'Carlos Alberto','18555666', '20-18555666-7', 'carlos.lopez@example.com',    '+54 341 555-0104', 'Calle Sarmiento 77',   'Rosario',      '2003-11-30', 'suspendido'),
  ('MP-1005', 'Martínez',  'Ana Sofía',     '30666777', '27-30666777-2', 'ana.martinez@example.com',    '+54 261 555-0105', 'Av. San Martín 305',   'Mendoza',      '2015-02-18', 'activo'),
  ('MP-1006', 'Pérez',     'Diego Martín',  '28777888', '20-28777888-5', 'diego.perez@example.com',     '+54 381 555-0106', 'Calle 24 de Septiembre 912', 'San Miguel de Tucumán', '2013-09-04', 'activo'),
  ('MP-1007', 'Sánchez',   'Valeria Inés',  '33888999', '27-33888999-0', 'valeria.sanchez@example.com', '+54 223 555-0107', 'Av. Independencia 2100','Mar del Plata','2018-06-27', 'activo'),
  ('MP-1008', 'Romero',    'Héctor Daniel', '16999000', '20-16999000-3', 'hector.romero@example.com',   '+54 299 555-0108', 'Calle Roca 56',        'Neuquén',      '1999-04-12', 'baja'),
  ('MP-1009', 'Díaz',      'Camila Rocío',  '35101202', '27-35101202-6', 'camila.diaz@example.com',     '+54 379 555-0109', 'Calle Junín 640',      'Corrientes',   '2020-10-15', 'activo'),
  ('MP-1010', 'Torres',    'Nicolás Esteban','31202303','20-31202303-8', 'nicolas.torres@example.com',  '+54 388 555-0110', 'Av. Bolivia 1500',     'San Salvador de Jujuy', '2016-08-01', 'suspendido')
on conflict (numero_matricula) do nothing;
