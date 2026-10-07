-- =====================================================================
-- KalaKart schema: PostgreSQL 15 / Supabase
-- =====================================================================
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------- ENUMS ----------
do $$ begin
  create type user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending','confirmed','packed','shipped','delivered','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('cod');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('unpaid','paid','refunded');
exception when duplicate_object then null; end $$;

-- ---------- HELPERS ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- STORE SETTINGS ----------
create table if not exists public.store_settings (
  id                      smallint primary key default 1 check (id = 1),
  max_listing_price_inr   integer not null default 2500 check (max_listing_price_inr > 0),
  free_shipping_threshold integer not null default 499 check (free_shipping_threshold >= 0),
  flat_shipping_inr       integer not null default 40  check (flat_shipping_inr >= 0),
  updated_at              timestamptz not null default now()
);
insert into public.store_settings (id) values (1) on conflict do nothing;

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text check (phone is null or phone ~ '^[6-9][0-9]{9}$'),
  role        user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup (role is ALWAYS customer here)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin check used by RLS policies
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- Prevent users from escalating their own role
create or replace function public.prevent_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin()
     and coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role' then
    raise exception 'Role cannot be changed by this user';
  end if;
  return new;
end $$;
create trigger trg_profiles_role_guard before update on public.profiles
  for each row execute function public.prevent_role_change();

-- ---------- ADDRESSES ----------
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  full_name   text not null check (char_length(full_name) between 2 and 100),
  phone       text not null check (phone ~ '^[6-9][0-9]{9}$'),
  line1       text not null check (char_length(line1) between 3 and 200),
  line2       text check (line2 is null or char_length(line2) <= 200),
  city        text not null check (char_length(city) between 2 and 80),
  state       text not null check (char_length(state) between 2 and 80),
  pincode     text not null check (pincode ~ '^[0-9]{6}$'),
  is_default  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_addresses_user on public.addresses(user_id);
create unique index if not exists uq_addresses_one_default
  on public.addresses(user_id) where is_default;
create trigger trg_addresses_updated before update on public.addresses
  for each row execute function public.set_updated_at();

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null check (char_length(name) between 2 and 80),
  description text,
  image_url   text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_categories_updated before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  category_id      uuid not null references public.categories(id) on delete restrict,
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null check (char_length(title) between 3 and 140),
  short_description text check (short_description is null or char_length(short_description) <= 200),
  description      text not null,
  highlights       text[] not null default '{}',
  tags             text[] not null default '{}',
  materials        text,
  dimensions       text,
  care_instructions text,
  maker_story      text,
  price_inr        numeric(10,2) not null check (price_inr > 0 and price_inr <= 2500),
  compare_at_price_inr numeric(10,2) check (compare_at_price_inr is null or compare_at_price_inr > price_inr),
  stock_qty        integer not null default 0 check (stock_qty >= 0),
  sku              text unique,
  is_published     boolean not null default false,
  avg_rating       numeric(3,2) not null default 0 check (avg_rating between 0 and 5),
  review_count     integer not null default 0 check (review_count >= 0),
  ai_review_summary jsonb,
  ai_review_summary_count integer not null default 0,
  seo_title        text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description  text check (seo_description is null or char_length(seo_description) <= 160),
  search_vector    tsvector,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_published_price on public.products(is_published, price_inr);
create index if not exists idx_products_created on public.products(created_at desc);
create index if not exists idx_products_search on public.products using gin(search_vector);
create index if not exists idx_products_title_trgm on public.products using gin(title gin_trgm_ops);
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- Populate search_vector via trigger (generated columns can't use to_tsvector on Supabase)
create or replace function public.products_search_vector_update()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.title,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(new.tags,' '),'')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.short_description,'')), 'C') ||
    setweight(to_tsvector('simple', coalesce(new.materials,'')), 'D');
  return new;
end $$;
create trigger trg_products_search_vector
  before insert or update on public.products
  for each row execute function public.products_search_vector_update();

-- ---------- PRODUCT IMAGES ----------
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,
  alt_text    text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_product_images_product on public.product_images(product_id, sort_order);

-- ---------- CART ----------
create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  quantity    integer not null check (quantity between 1 and 20),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, product_id)
);
create index if not exists idx_cart_user on public.cart_items(user_id);
create trigger trg_cart_updated before update on public.cart_items
  for each row execute function public.set_updated_at();

-- ---------- WISHLIST ----------
create table if not exists public.wishlist_items (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique default ('KK-' || to_char(now(),'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6))),
  user_id         uuid not null references public.profiles(id) on delete restrict,
  status          order_status not null default 'pending',
  payment_method  payment_method not null default 'cod',
  payment_status  payment_status not null default 'unpaid',
  subtotal_inr    numeric(10,2) not null check (subtotal_inr >= 0),
  shipping_inr    numeric(10,2) not null check (shipping_inr >= 0),
  total_inr       numeric(10,2) not null check (total_inr >= 0),
  ship_full_name  text not null,
  ship_phone      text not null,
  ship_line1      text not null,
  ship_line2      text,
  ship_city       text not null,
  ship_state      text not null,
  ship_pincode    text not null,
  customer_note   text check (customer_note is null or char_length(customer_note) <= 300),
  placed_at       timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_orders_user on public.orders(user_id, placed_at desc);
create index if not exists idx_orders_status on public.orders(status, placed_at desc);
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  product_id     uuid not null references public.products(id) on delete restrict,
  title_snapshot text not null,
  image_snapshot text,
  unit_price_inr numeric(10,2) not null check (unit_price_inr > 0),
  quantity       integer not null check (quantity > 0),
  line_total_inr numeric(10,2) not null check (line_total_inr > 0)
);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ---------- REVIEWS ----------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  title       text check (title is null or char_length(title) <= 100),
  body        text check (body is null or char_length(body) <= 1000),
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists idx_reviews_product on public.reviews(product_id, created_at desc);

-- Keep product rating aggregates in sync
create or replace function public.refresh_product_rating()
returns trigger language plpgsql security definer set search_path = public as $$
declare pid uuid := coalesce(new.product_id, old.product_id);
begin
  update public.products p set
    avg_rating   = coalesce((select round(avg(rating)::numeric, 2) from public.reviews where product_id = pid), 0),
    review_count = (select count(*) from public.reviews where product_id = pid)
  where p.id = pid;
  return null;
end $$;
create trigger trg_reviews_aggregate
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_product_rating();

-- Only buyers with a DELIVERED order may review
create or replace function public.enforce_verified_review()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.orders o
    join public.order_items oi on oi.order_id = o.id
    where o.user_id = new.user_id and oi.product_id = new.product_id and o.status = 'delivered'
  ) then
    raise exception 'Only customers with a delivered order can review this product';
  end if;
  return new;
end $$;
create trigger trg_reviews_verified before insert on public.reviews
  for each row execute function public.enforce_verified_review();

-- ---------- AI USAGE LOG ----------
create table if not exists public.ai_requests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references public.profiles(id) on delete set null,
  feature        text not null check (feature in ('gift_advisor','product_qa','listing_generator','review_summary')),
  model          text not null,
  input_json     jsonb not null,
  output_json    jsonb,
  status         text not null check (status in ('success','validation_error','provider_error','blocked')),
  latency_ms     integer,
  prompt_tokens  integer,
  output_tokens  integer,
  created_at     timestamptz not null default now()
);
create index if not exists idx_ai_requests_user on public.ai_requests(user_id, created_at desc);
create index if not exists idx_ai_requests_feature on public.ai_requests(feature, created_at desc);

-- ---------- ATOMIC ORDER PLACEMENT ----------
create or replace function public.place_order(
  p_user_id uuid,
  p_address_id uuid,
  p_note text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_settings public.store_settings%rowtype;
  v_addr public.addresses%rowtype;
  v_order_id uuid;
  v_subtotal numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  r record;
begin
  select * into v_settings from public.store_settings where id = 1;
  select * into v_addr from public.addresses where id = p_address_id and user_id = p_user_id;
  if not found then raise exception 'Address not found'; end if;

  if not exists (select 1 from public.cart_items where user_id = p_user_id) then
    raise exception 'Cart is empty';
  end if;

  -- lock product rows and validate stock/publish state
  for r in
    select ci.product_id, ci.quantity, p.title, p.price_inr, p.stock_qty, p.is_published
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.user_id = p_user_id
    for update of p
  loop
    if not r.is_published then raise exception 'Product "%" is no longer available', r.title; end if;
    if r.stock_qty < r.quantity then raise exception 'Only % left of "%"', r.stock_qty, r.title; end if;
    v_subtotal := v_subtotal + (r.price_inr * r.quantity);
  end loop;

  v_shipping := case when v_subtotal >= v_settings.free_shipping_threshold then 0 else v_settings.flat_shipping_inr end;

  insert into public.orders (user_id, subtotal_inr, shipping_inr, total_inr,
    ship_full_name, ship_phone, ship_line1, ship_line2, ship_city, ship_state, ship_pincode, customer_note)
  values (p_user_id, v_subtotal, v_shipping, v_subtotal + v_shipping,
    v_addr.full_name, v_addr.phone, v_addr.line1, v_addr.line2, v_addr.city, v_addr.state, v_addr.pincode, p_note)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, title_snapshot, image_snapshot, unit_price_inr, quantity, line_total_inr)
  select v_order_id, p.id, p.title,
         (select url from public.product_images pi where pi.product_id = p.id order by sort_order limit 1),
         p.price_inr, ci.quantity, p.price_inr * ci.quantity
  from public.cart_items ci join public.products p on p.id = ci.product_id
  where ci.user_id = p_user_id;

  update public.products p set stock_qty = p.stock_qty - ci.quantity
  from public.cart_items ci where ci.product_id = p.id and ci.user_id = p_user_id;

  delete from public.cart_items where user_id = p_user_id;
  return v_order_id;
end $$;

revoke all on function public.place_order(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.place_order(uuid, uuid, text) to service_role;

-- ---------- CANCEL ORDER + RESTOCK ----------
create or replace function public.cancel_order(p_order_id uuid, p_actor uuid, p_is_admin boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if not p_is_admin and v_order.user_id <> p_actor then raise exception 'Not allowed'; end if;
  if v_order.status not in ('pending','confirmed') and not p_is_admin then
    raise exception 'Order can no longer be cancelled';
  end if;
  if v_order.status = 'cancelled' then return; end if;
  update public.products p set stock_qty = p.stock_qty + oi.quantity
    from public.order_items oi where oi.order_id = p_order_id and oi.product_id = p.id;
  update public.orders set status = 'cancelled' where id = p_order_id;
end $$;

revoke all on function public.cancel_order(uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function public.cancel_order(uuid, uuid, boolean) to service_role;

-- ---------- STORAGE BUCKET ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
