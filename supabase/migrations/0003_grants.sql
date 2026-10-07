-- =====================================================================
-- KalaKart: Role grants for anon + authenticated
-- Supabase requires explicit GRANT on tables so that RLS policies
-- are evaluated. Without grants the query is rejected before RLS runs.
-- =====================================================================

-- anon role: read-only on public tables
grant select on public.store_settings  to anon;
grant select on public.categories      to anon;
grant select on public.products        to anon;
grant select on public.product_images  to anon;
grant select on public.reviews         to anon;

-- authenticated role: public reads + own-data mutations
grant select on public.store_settings  to authenticated;
grant select on public.categories      to authenticated;
grant select on public.products        to authenticated;
grant select on public.product_images  to authenticated;
grant select on public.reviews         to authenticated;

grant select, insert, update, delete on public.profiles       to authenticated;
grant select, insert, update, delete on public.addresses      to authenticated;
grant select, insert, update, delete on public.cart_items     to authenticated;
grant select, insert, update, delete on public.wishlist_items to authenticated;
grant select                         on public.orders         to authenticated;
grant select                         on public.order_items    to authenticated;
grant select, insert, update, delete on public.reviews        to authenticated;

-- service_role: full access (bypass RLS is already granted by Supabase)
grant all privileges on public.store_settings  to service_role;
grant all privileges on public.profiles        to service_role;
grant all privileges on public.addresses       to service_role;
grant all privileges on public.categories      to service_role;
grant all privileges on public.products        to service_role;
grant all privileges on public.product_images  to service_role;
grant all privileges on public.cart_items      to service_role;
grant all privileges on public.wishlist_items  to service_role;
grant all privileges on public.orders          to service_role;
grant all privileges on public.order_items     to service_role;
grant all privileges on public.reviews         to service_role;
grant all privileges on public.ai_requests     to service_role;
