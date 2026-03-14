-- Valuation requests table
create table if not exists public.valuation_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  address text not null,
  bydel_id uuid references public.bydeler(id),
  request_type text check (request_type in ('verdivurdering', 'salgstilbud')) not null,
  message text,
  status text check (status in ('ny', 'kontaktet', 'fullfort')) default 'ny',
  created_at timestamptz default now()
);

alter table public.valuation_requests enable row level security;

create policy "Alle kan sende forespørsel"
  on public.valuation_requests for insert
  with check (true);

create policy "Kun admin kan lese forespørsler"
  on public.valuation_requests for select
  to authenticated
  using (true);

create policy "Kun admin kan oppdatere forespørsler"
  on public.valuation_requests for update
  to authenticated
  using (true);

-- Seed data
insert into public.valuation_requests (name, email, phone, address, bydel_id, request_type, message, status) values
  ('Ola Nordmann', 'ola@example.com', '91234567', 'Munkegata 5', (select id from bydeler where slug = 'midtbyen'), 'verdivurdering', 'Lurer på verdien av 3-roms leilighet, 72 kvm', 'ny'),
  ('Kari Hansen', 'kari@example.com', null, 'Byåsveien 44', (select id from bydeler where slug = 'byasen'), 'salgstilbud', null, 'kontaktet'),
  ('Per Johansen', 'per@example.com', '98765432', 'Ranheimsveien 12B', (select id from bydeler where slug = 'ranheim'), 'verdivurdering', 'Rekkehus fra 1985, nylig oppusset', 'ny');
