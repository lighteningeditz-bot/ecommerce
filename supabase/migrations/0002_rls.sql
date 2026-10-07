-- =====================================================================
-- KalaKart RLS policies: Data isolation and security
-- =====================================================================

alter table public.store_settings  enable row level security;
alter table public.profiles        enable row level security;
alter table public.addresses       enable row level security;
alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.cart_items      enable row level security;
alter table public.wishlist_items  enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.reviews         enable row level security;
alter table public.ai_requests     enable row level security;

-- store_settings: public read, admin write
create policy "settings_read_all"   on public.store_settings for select using (true);
create policy "settings_admin_write" on public.store_settings for update using (public.is_admin()) with check (public.is_admin());

-- profiles: own row read/update; admin read all
create policy "profiles_select_own"  on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own"  on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- addresses: strictly owner
create policy "addr_select_own" on public.addresses for select using (user_id = auth.uid() or public.is_admin());
create policy "addr_insert_own" on public.addresses for insert with check (user_id = auth.uid());
create policy "addr_update_own" on public.addresses for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "addr_delete_own" on public.addresses for delete using (user_id = auth.uid());

-- categories: public read of active; admin full
create policy "cat_select_public" on public.categories for select using (is_active or public.is_admin());
create policy "cat_admin_insert"  on public.categories for insert with check (public.is_admin());
create policy "cat_admin_update"  on public.categories for update using (public.is_admin()) with check (public.is_admin());
create policy "cat_admin_delete"  on public.categories for delete using (public.is_admin());

-- products: public read of published; admin full
create policy "prod_select_public" on public.products for select using (is_published or public.is_admin());
create policy "prod_admin_insert"  on public.products for insert with check (public.is_admin());
create policy "prod_admin_update"  on public.products for update using (public.is_admin()) with check (public.is_admin());
create policy "prod_admin_delete"  on public.products for delete using (public.is_admin());

-- product_images: public read where parent is published; admin write
create policy "img_select_public" on public.product_images for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.is_published or public.is_admin())));
create policy "img_admin_write" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

-- cart & wishlist: owner only
create policy "cart_owner_all" on public.cart_items     for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "wish_owner_all" on public.wishlist_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- orders: owner read; admin read/update; NO direct client inserts (use place_order via API)
create policy "orders_select_own_or_admin" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "orders_admin_update"        on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "order_items_select" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));

-- reviews: public read; authors manage their own (verified-purchase trigger enforces insert rule)
create policy "reviews_select_public" on public.reviews for select using (true);
create policy "reviews_insert_own"    on public.reviews for insert with check (user_id = auth.uid());
create policy "reviews_update_own"    on public.reviews for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reviews_delete_own"    on public.reviews for delete using (user_id = auth.uid() or public.is_admin());

-- ai_requests: no client access; admin read only (backend writes with service role)
create policy "ai_admin_read" on public.ai_requests for select using (public.is_admin());

-- storage: public read of product images; admin-only write
create policy "product_images_public_read" on storage.objects for select using (bucket_id = 'product-images');
create policy "product_images_admin_insert" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "product_images_admin_update" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());
create policy "product_images_admin_delete" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());
