-- =====================================================================
-- KalaKart Seed Data: 9 Categories & 27 Realistic Handmade Craft Products
-- =====================================================================

-- Clean existing data if reseeding
delete from public.order_items;
delete from public.orders;
delete from public.cart_items;
delete from public.wishlist_items;
delete from public.reviews;
delete from public.product_images;
delete from public.products;
delete from public.categories;

-- ---------- CATEGORIES ----------
insert into public.categories (id, slug, name, description, image_url, sort_order, is_active) values
('c1000000-0000-0000-0000-000000000001', 'home-decor', 'Home Décor', 'Artisanal accents and earthen utility décor for mindful living spaces.', 'https://picsum.photos/seed/cat-home-decor/800/800', 1, true),
('c1000000-0000-0000-0000-000000000002', 'pottery-terracotta', 'Pottery & Terracotta', 'Hand-thrown unglazed clay and fired terracotta ware by traditional potters.', 'https://picsum.photos/seed/cat-pottery/800/800', 2, true),
('c1000000-0000-0000-0000-000000000003', 'woven-basketry', 'Woven & Basketry', 'Naturally woven sabai grass, bamboo, and golden jute utility baskets.', 'https://picsum.photos/seed/cat-woven/800/800', 3, true),
('c1000000-0000-0000-0000-000000000004', 'jewellery-accessories', 'Handmade Jewellery & Accessories', 'Terracotta, brass bead, and natural thread jewellery handcrafted with love.', 'https://picsum.photos/seed/cat-jewellery/800/800', 4, true),
('c1000000-0000-0000-0000-000000000005', 'paper-stationery', 'Paper Crafts & Stationery', 'Wood-free cotton rag paper journals, seed paper bookmarks, and gift tags.', 'https://picsum.photos/seed/cat-paper/800/800', 5, true),
('c1000000-0000-0000-0000-000000000006', 'wall-art-macrame', 'Wall Art & Macramé', 'Boho macramé knotting, wooden frames, and folk-painted wall hangings.', 'https://picsum.photos/seed/cat-wall-art/800/800', 6, true),
('c1000000-0000-0000-0000-000000000007', 'festive-gifting', 'Festive & Gifting', 'Hand-painted festive diyas, brass incense holders, and sustainable gift sets.', 'https://picsum.photos/seed/cat-festive/800/800', 7, true),
('c1000000-0000-0000-0000-000000000008', 'kids-toys', 'Wooden & Kids'' Crafts', 'Safe, natural vegetable-lacquered Channapatna wooden play toys and figurines.', 'https://picsum.photos/seed/cat-kids-toys/800/800', 8, true),
('c1000000-0000-0000-0000-000000000009', 'diy-kits', 'DIY Craft Kits', 'Beginner-friendly kits with raw materials to learn pottery, macramé, and block print.', 'https://picsum.photos/seed/cat-diy-kits/800/800', 9, true);

-- ---------- PRODUCTS ----------
insert into public.products (
  id, category_id, slug, title, short_description, description, highlights, tags,
  materials, dimensions, care_instructions, maker_story,
  price_inr, compare_at_price_inr, stock_qty, sku, is_published, avg_rating, review_count, seo_title, seo_description
) values
-- 1. Home Décor
(
  'p1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'bamboo-tea-light-lantern',
  'Handwoven Bamboo Tea Light Lantern',
  'Intricately woven bamboo cage lantern creating soft ambient shadow patterns.',
  'Crafted from sustainably sourced Assam bamboo by rural cane artisans, this tea light lantern brings a warm, earthy atmosphere to any room. When lit with a small tealight or fairy string light, the woven lattice casts gentle lattice shadows across walls.',
  array['Sustainably harvested bamboo', 'Includes glass tea light holder', 'Lightweight & sturdy lattice work'],
  array['bamboo', 'lantern', 'lighting', 'eco-friendly', 'minimal', 'home decor'],
  'Assam river bamboo, natural lacquer',
  '15 cm x 15 cm x 20 cm',
  'Wipe clean with dry soft cloth. Keep away from continuous moisture.',
  'Handmade by Biren Das and his cooperative of 8 bamboo weavers in rural Barpeta, Assam.',
  249.00, 349.00, 35, 'HD-BAM-01', true, 4.8, 12,
  'Handwoven Bamboo Tea Light Lantern | KalaKart',
  'Eco-friendly bamboo tea light lantern handcrafted in Assam. Affordable home décor under ₹250.'
),
(
  'p1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000001',
  'embroidered-cotton-coasters-set-4',
  'Embroidered Kantha Coasters (Set of 4)',
  'Layered upcycled cotton fabric with traditional running Kantha hand embroidery.',
  'Every coaster in this set of four tells a story of zero-waste textile artistry. Made from layered pure cotton scraps joined with rhythmic Bengali Kantha stitch work, they protect surfaces with heritage charm.',
  array['Set of 4 reversible coasters', 'Pure breathable cotton layers', 'Machine washable on gentle cycle'],
  array['cotton', 'kantha', 'kitchen', 'dining', 'tableware', 'textiles'],
  '100% Upcycled Cotton, cotton embroidery thread',
  '10 cm x 10 cm',
  'Gentle hand wash or mild machine cycle. Lay flat to dry.',
  'Embroidered by women artisans from the Shantiniketan artisan cluster in West Bengal.',
  149.00, 199.00, 50, 'HD-COA-02', true, 4.6, 8,
  'Kantha Embroidered Cotton Coasters Set of 4 | KalaKart',
  'Authentic Kantha hand-stitched coasters under ₹150. Upcycled eco-friendly tableware.'
),
(
  'p1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000001',
  'carved-sheesham-incense-tower',
  'Carved Sheesham Wood Incense Tower',
  'Perforated wooden incense stick burner that catches ashes cleanly inside.',
  'Hand-carved from seasoned Indian Sheesham wood with brass inlay filigree. Holds up to 4 agarbatti sticks simultaneously while the perforated trellis allows scented smoke to disperse peacefully.',
  array['Perforated lattice chimney', 'Holds 4 sticks + 1 dhoop cone', 'Clean ash collector base'],
  array['sheesham', 'wood', 'incense', 'spiritual', 'living', 'traditional'],
  'Seasoned Sheesham Wood, Brass inlay pins',
  '8 cm x 8 cm x 30 cm',
  'Dust with a dry microfibre brush. Occasionally polish with a drop of coconut oil.',
  'Crafted by generational wood carvers in Saharanpur, Uttar Pradesh.',
  329.00, 449.00, 28, 'HD-INC-03', true, 4.9, 15,
  'Carved Sheesham Wood Incense Tower | KalaKart',
  'Hand-carved wooden incense burner tower. Keeps your prayer or living area clean and aromatic.'
),

-- 2. Pottery & Terracotta
(
  'p1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000002',
  'terracotta-indoor-planter-pot',
  'Earthen Terracotta Indoor Planter Pot',
  'Porous natural clay planter designed for healthy root breathing and succulents.',
  'Turned by hand on a traditional foot-spun potter''s wheel and kiln-fired using firewood husk. The porous clay breathes naturally, evaporating excess moisture to prevent succulent and houseplant root rot.',
  array['Porous natural aeration', 'Built-in bottom drainage hole', 'Includes matching terracotta saucer'],
  array['terracotta', 'plants', 'gardening', 'pottery', 'clay', 'minimal'],
  'Natural riverbed red clay',
  '14 cm diameter x 13 cm height',
  'Rinse with plain water. Avoid harsh synthetic chemical detergents.',
  'Hand-thrown by Ramesh Prajapati and family in Kumhar Colony, New Delhi.',
  129.00, 179.00, 60, 'PT-PLT-01', true, 4.7, 19,
  'Handmade Terracotta Indoor Planter Pot | KalaKart',
  'Natural red terracotta planter pot with saucer. Breathable clay for healthy plants under ₹150.'
),
(
  'p1000000-0000-0000-0000-000000000005',
  'c1000000-0000-0000-0000-000000000002',
  'hand-painted-terracotta-kulhad-set',
  'Hand-Painted Clay Kulhad Chai Cups (Set of 2)',
  'Traditional clay tea cups hand-embellished with folk floral motifs.',
  'Sip your morning masala chai with the beloved scent of moist earth (sondhi khushboo). Made from natural clay and painted on the rim with lead-free earth pigments for safe daily beverage use.',
  array['Set of 2 chai kulhads', 'Food-safe kiln fired', 'Adds earthy note to hot tea'],
  array['pottery', 'tea', 'kitchen', 'kulhad', 'traditional', 'dining'],
  'Food-grade river clay, natural mineral paints',
  '7 cm diameter x 8 cm height (150 ml capacity each)',
  'Hand wash with warm water and soft sponge. Not microwave safe.',
  'Created by artisan potters in Alwar, Rajasthan continuing century-old clay culinary traditions.',
  99.00, 149.00, 45, 'PT-KUL-02', true, 4.5, 10,
  'Clay Kulhad Chai Cups Set of 2 | KalaKart',
  'Traditional handmade clay tea cups under ₹100. Relish authentic Indian chai flavour.'
),
(
  'p1000000-0000-0000-0000-000000000006',
  'c1000000-0000-0000-0000-000000000002',
  'terracotta-water-carafe-with-cup',
  'Cooling Terracotta Water Carafe with Tumbler',
  'Traditional natural evaporative cooling jug for refreshing, alkaline water.',
  'An ancestral hydration staple. The micro-porous walls cool drinking water naturally by 3 to 5 degrees without electricity while balancing water pH with essential earth minerals. Comes with a snug lid tumbler.',
  array['Cools water naturally without power', 'Includes 200ml lid tumbler', '1.2 Litre capacity'],
  array['terracotta', 'water', 'kitchen', 'eco-friendly', 'health', 'traditional'],
  '100% natural micaceous clay',
  '16 cm diameter x 24 cm height',
  'Rinse before first use with lemon water. Air dry completely once a week.',
  'Molded and wood-fired by Master Craftsman Mohan Lal in Gorakhpur, UP.',
  399.00, 550.00, 20, 'PT-CAR-03', true, 4.9, 14,
  'Natural Terracotta Water Carafe with Tumbler | KalaKart',
  'Handcrafted natural cooling clay water bottle jug. Traditional wellness under ₹400.'
),

-- 3. Woven & Basketry
(
  'p1000000-0000-0000-0000-000000000007',
  'c1000000-0000-0000-0000-000000000003',
  'round-sabai-grass-storage-basket',
  'Round Sabai Grass Storage Basket with Lid',
  'Sturdy natural grass basket woven with contrasting cotton thread accents.',
  'Sabai grass is renowned across Odisha for its high tensile strength and natural golden sheen. This basket is tightly coiled and fitted with a snug lid, perfect for storing rotis, jewellery, sewing kits, or keys.',
  array['Tightly braided Sabai grass', 'Fitted removable lid', 'Biodegradable & lightweight'],
  array['basketry', 'sabai grass', 'storage', 'eco-friendly', 'kitchen', 'minimal'],
  'Wild Sabai Grass, natural cotton twine',
  '20 cm diameter x 12 cm height',
  'Keep in dry ventilated areas. Sun dry if accidentally exposed to water.',
  'Hand-coiled by women artisans of Mayurbhanj district, Odisha.',
  349.00, 499.00, 25, 'WB-SAB-01', true, 4.8, 9,
  'Sabai Grass Storage Basket with Lid | KalaKart',
  'Eco-friendly handcrafted Sabai grass basket with lid. Sustainable storage under ₹350.'
),
(
  'p1000000-0000-0000-0000-000000000008',
  'c1000000-0000-0000-0000-000000000003',
  'braided-jute-table-planter-basket',
  'Braided Golden Jute Table Planter Cover',
  'Rustic woven jute sleeve that wraps nursery plastic pots in natural charm.',
  'Instantly elevate your indoor desk plants. Made from 100% biodegradable golden Bengal jute rope hand-stitched into a firm cylinder that conceals plain nursery pots seamlessly.',
  array['Waterproof inner lining', 'Fits standard 4 to 5 inch nursery pots', 'Foldable & durable'],
  array['jute', 'plants', 'planter', 'woven', 'desk', 'eco-friendly'],
  '100% Natural Jute, waterproof recycled PE liner',
  '13 cm diameter x 14 cm height',
  'Spot clean with a damp sponge. Do not soak in water.',
  'Hand-braided by women self-help collectives in Hooghly, West Bengal.',
  179.00, 249.00, 40, 'WB-JUT-02', true, 4.6, 11,
  'Braided Jute Planter Basket Cover | KalaKart',
  'Handmade jute planter basket cover for indoor plants. Budget home styling under ₹199.'
),
(
  'p1000000-0000-0000-0000-000000000009',
  'c1000000-0000-0000-0000-000000000003',
  'shallow-bamboo-fruit-serving-tray',
  'Shallow Handwoven Bamboo Fruit Tray',
  'Breathable fruit and bread basket woven from fine bamboo splints.',
  'Keep fruits, garlic, or bread fresh with optimum natural airflow. Hand-split bamboo reeds are woven into a sleek, wide-rim shallow basket with a firm smoked-bamboo rim.',
  array['Natural airflow keeps produce fresh', 'Smoked bamboo rim prevents warping', 'Easy to clean'],
  array['bamboo', 'tray', 'kitchen', 'dining', 'dining', 'tableware'],
  'Assam bamboo splits',
  '26 cm diameter x 6 cm height',
  'Wipe with clean damp cloth. Dry immediately in a ventilated spot.',
  'Crafted by tribal cane crafters in Tripura.',
  199.00, 279.00, 30, 'WB-FRU-03', true, 4.7, 7,
  'Handwoven Bamboo Fruit Serving Tray | KalaKart',
  'Artisanal bamboo bread and fruit basket tray under ₹200. Breathable and rustic.'
),

-- 4. Handmade Jewellery & Accessories
(
  'p1000000-0000-0000-0000-000000000010',
  'c1000000-0000-0000-0000-000000000004',
  'hand-painted-terracotta-jhumkas',
  'Hand-Painted Terracotta Lotus Jhumkas',
  'Featherlight terracotta dome earrings hand-painted in festive crimson and gold.',
  'Hand-shaped from purified clay and kiln baked until resonant, these statement jhumkas feature delicate lotus petal relief work. Surprisingly lightweight on the ears for all-day festive comfort.',
  array['Lightweight on earlobes', 'Lead & nickel free brass hooks', 'Water-resistant acrylic finish'],
  array['jewellery', 'terracotta', 'earrings', 'festive', 'traditional', 'fashion'],
  'Terracotta Clay, brass fish hooks, cotton thread tassels',
  '5.5 cm length x 2.8 cm dome diameter',
  'Store in a cotton pouch. Avoid spraying perfumes or deodorants directly.',
  'Handcrafted by Mamata Sen, a miniature terracotta jewellery artisan from Nadia, Bengal.',
  199.00, 299.00, 40, 'JA-JHM-01', true, 4.9, 23,
  'Hand-Painted Terracotta Lotus Jhumkas | KalaKart',
  'Festive handcrafted terracotta jhumka earrings under ₹200. Lightweight and skin-friendly.'
),
(
  'p1000000-0000-0000-0000-000000000011',
  'c1000000-0000-0000-0000-000000000004',
  'beaded-glass-seed-choker-necklace',
  'Tribal Glass Seed Bead Floral Choker',
  'Intricately woven micro-glass seed bead collar necklace with adjustable closure.',
  'Featuring vibrant folk floral patterns inspired by indigenous beadwork. Hundreds of micro glass beads are strung on multi-ply nylon thread and finished with an adjustable cotton cord knot.',
  array['Adjustable cord fits any neck size', 'Skin-friendly no-metal back', 'Vibrant non-fading glass beads'],
  array['jewellery', 'necklace', 'beaded', 'boho', 'fashion', 'accessories'],
  'Czech seed beads, wax-coated cotton thread',
  '32 cm bead length + 20 cm adjustable tie cord',
  'Wipe with soft cloth. Keep away from excessive alcohol or sprays.',
  'Beaded by women self-reliance guilds in Nagaland.',
  279.00, 399.00, 22, 'JA-CHK-02', true, 4.6, 9,
  'Tribal Glass Seed Bead Floral Choker | KalaKart',
  'Vibrant handmade seed bead choker necklace under ₹300. Boho handmade jewellery.'
),
(
  'p1000000-0000-0000-0000-000000000012',
  'c1000000-0000-0000-0000-000000000004',
  'brass-ghungroo-adjustable-anklet',
  'Handcrafted Brass Ghungroo Thread Payal',
  'Sweetly chiming recycled brass ghungroo beads strung on black braided thread.',
  'An everyday lucky black cord payal (anklet) embellished with artisanal hand-cast solid brass ghungroos that emit a gentle musical chime with each step.',
  array['Sweet soothing chime sound', 'Adjustable sliding knot clasp', 'Pure brass beads resist corrosion'],
  array['jewellery', 'anklet', 'brass', 'spiritual', 'traditional', 'accessories'],
  'Cast Brass bells, durable braided cotton thread',
  '26 cm maximum adjustable circumference',
  'Can be worn daily. Dry thoroughly if exposed to water.',
  'Crafted by bell-metal artisans in Bastar, Chhattisgarh.',
  149.00, 220.00, 35, 'JA-ANK-03', true, 4.8, 16,
  'Handcrafted Brass Ghungroo Thread Payal | KalaKart',
  'Traditional chiming brass ghungroo anklet payal under ₹150. Beautiful and durable.'
),

-- 5. Paper Crafts & Stationery
(
  'p1000000-0000-0000-0000-000000000013',
  'c1000000-0000-0000-0000-000000000005',
  'handmade-cotton-rag-deckle-journal',
  'Cotton Rag Deckle-Edge Handbound Journal',
  'Tree-free unruled cotton paper diary bound in raw unbleached kora cotton fabric.',
  'Crafted from 100% upcycled cotton textile cuttings pulp without cutting a single tree. The pages feature authentic feathered deckle edges and take fountain pen ink, watercolour, and sketches with zero bleed.',
  array['100% tree-free cotton rag paper', 'Authentic raw deckle edges', '80 pages (160 sides) of 150 GSM'],
  array['paper', 'stationery', 'journal', 'reading', 'eco-friendly', 'art'],
  'Upcycled Cotton rag paper, unbleached kora cotton binding',
  '18 cm x 13 cm (A5 size approx)',
  'Keep in a moisture-free bookshelf.',
  'Hand-sheeted by craft paper makers in Sanganer, Jaipur.',
  249.00, 350.00, 40, 'PS-JRN-01', true, 4.9, 31,
  'Cotton Rag Deckle-Edge Handbound Journal | KalaKart',
  'Tree-free handmade cotton paper notebook under ₹250. Ideal for sketching and journaling.'
),
(
  'p1000000-0000-0000-0000-000000000014',
  'c1000000-0000-0000-0000-000000000005',
  'plantable-seed-paper-bookmarks-set-5',
  'Plantable Wildflower Seed Bookmarks (Set of 5)',
  'Biodegradable bookmarks embedded with live basil and marigold seeds.',
  'Celebrate your reading journey and give back to the soil! Once done, plant the bookmark under a layer of potting soil, water gently, and watch basil herbs and marigold flowers bloom in 10 days.',
  array['Set of 5 plantable bookmarks', 'Embedded with non-GMO seeds', 'Hand-painted reading quotes'],
  array['paper', 'stationery', 'bookmark', 'reading', 'plants', 'eco-friendly'],
  'Seed-embedded handmade cotton paper, jute tassel',
  '15 cm x 5 cm each',
  'Store dry until ready to read or sow.',
  'Handmade by a green social enterprise in Auroville, Tamil Nadu.',
  89.00, 129.00, 75, 'PS-BMK-02', true, 4.8, 22,
  'Plantable Wildflower Seed Bookmarks Set of 5 | KalaKart',
  'Zero-waste plantable seed bookmarks under ₹99. Blooms into marigold and basil herbs.'
),
(
  'p1000000-0000-0000-0000-000000000015',
  'c1000000-0000-0000-0000-000000000005',
  'block-printed-gift-tags-envelopes-set',
  'Block-Printed Shagun Envelopes (Pack of 6)',
  'Handmade paper festive money envelopes stamped with wooden floral blocks.',
  'Elevate your festive gifting with artisanal elegance. Each envelope is hand-deckled and stamped using hand-carved teak wood blocks and metallic gold ink.',
  array['Pack of 6 shagun envelopes', 'Fits all Indian currency notes flat', 'Hand-carved wooden block print'],
  array['paper', 'stationery', 'festive', 'envelopes', 'gifting', 'traditional'],
  'Recycled cotton handmade paper, eco pigment ink',
  '19 cm x 9 cm',
  'Keep in envelope sleeve until use.',
  'Hand-printed by master block carvers in Bagru, Rajasthan.',
  99.00, 149.00, 60, 'PS-ENV-03', true, 4.7, 18,
  'Block-Printed Festive Shagun Envelopes Pack of 6 | KalaKart',
  'Traditional handmade block printed money envelopes under ₹100. Perfect for festive gifting.'
),

-- 6. Wall Art & Macramé
(
  'p1000000-0000-0000-0000-000000000016',
  'c1000000-0000-0000-0000-000000000006',
  'boho-macrame-feather-wall-hanging',
  'Boho Hand-Knotted Macramé Feather Wall Hanging',
  'Soft combed cotton cord feathers suspended from a natural fallen branch dowel.',
  'Add tactile warmth and Scandinavian-Boho aesthetics to your bedroom or work nook. Hand-knotted with 3-ply unbleached cotton cord and carefully brushed into plush textured leaves.',
  array['Pure unbleached cotton cord', 'Natural reclaimed wooden dowel', 'Ready to hang cord loop'],
  array['macrame', 'wall art', 'home decor', 'boho', 'minimal', 'craft'],
  '100% natural cotton cord, neem wood dowel',
  '35 cm width x 45 cm drop length',
  'Gently comb the feathers with a wide-tooth comb once hung.',
  'Knotted by Sunita Devi, an independent macramé artist based in Rishikesh.',
  399.00, 599.00, 20, 'WM-MAC-01', true, 4.8, 17,
  'Boho Macrame Feather Wall Hanging | KalaKart',
  'Handcrafted cotton macramé wall hanging under ₹400. Warm boho bedroom wall accent.'
),
(
  'p1000000-0000-0000-0000-000000000017',
  'c1000000-0000-0000-0000-000000000006',
  'miniature-madhubani-tree-of-life-frame',
  'Framed Miniature Madhubani Tree of Life',
  'Hand-painted Mithila folk art rendered on handmade paper with fine nib pens.',
  'The Tree of Life symbolizes abundance, interconnected roots, and harmony with nature. Painted using natural vegetable dyes and fine bamboo nibs in the Kachni line-drawing style of Madhubani.',
  array['Authentic Madhubani line art', 'Natural glass-front wooden frame', 'Tabletop stand and wall hook included'],
  array['wall art', 'madhubani', 'painting', 'traditional', 'art', 'spiritual'],
  'Handmade cotton sheet, natural ink, pine wood frame',
  '18 cm x 18 cm x 2 cm',
  'Wipe frame glass with dry microfibre cloth.',
  'Painted by Pushpa Kumari in Jitwarpur village, Madhubani district, Bihar.',
  449.00, 650.00, 15, 'WM-MAD-02', true, 5.0, 12,
  'Framed Miniature Madhubani Tree of Life | KalaKart',
  'Original hand-painted Madhubani folk art framed under ₹450. Heritage Indian home décor.'
),
(
  'p1000000-0000-0000-0000-000000000018',
  'c1000000-0000-0000-0000-000000000006',
  'hanging-macrame-plant-holder',
  'Hand-Knotted Cotton Macramé Plant Hanger',
  'Strong knotted ceiling hanger that cradles planters up to 8 inches securely.',
  'Free up desk space and turn your trailing money plant or pothos into floating greenery. Hand-knotted with heavy-duty twisted cotton rope and reinforced with a sturdy wooden hanging ring.',
  array['Supports pots from 4 to 8 inches', 'Heavy duty 4mm twisted cotton rope', 'Strong wooden ceiling ring'],
  array['macrame', 'plants', 'hanging', 'gardening', 'home decor', 'boho'],
  '4mm Natural Cotton Rope, Solid beech wood ring',
  '90 cm total hanging length',
  'Spot clean or soak in mild soap water. Air dry in shade.',
  'Crafted by a women''s handicraft cooperative in Dehradun, Uttarakhand.',
  199.00, 299.00, 35, 'WM-PLT-03', true, 4.7, 24,
  'Hand-Knotted Cotton Macrame Plant Hanger | KalaKart',
  'Sturdy handmade macramé plant hanger under ₹200. Transform your indoor plants.'
),

-- 7. Festive & Gifting
(
  'p1000000-0000-0000-0000-000000000019',
  'c1000000-0000-0000-0000-000000000007',
  'hand-painted-terracotta-diyas-set-4',
  'Hand-Painted Floral Terracotta Diyas (Set of 4)',
  'Traditional clay oil lamps hand-painted with cheerful festive patterns.',
  'Brighten your entryway for Diwali, Pujas, or evening meditation. Handcrafted from unglazed terracotta, each diya is decorated with non-toxic bright acrylic colours and gold liner beads.',
  array['Set of 4 festive diyas', 'Deep oil well for 4+ hours burn', 'Stable flat base'],
  array['festive', 'diwali', 'diyas', 'terracotta', 'spiritual', 'gifting'],
  'Fired Terracotta Clay, acrylic water paints',
  '8 cm diameter x 3.5 cm height each',
  'Wipe with a slightly damp cloth after oil use.',
  'Molded and hand-painted by artisan women in Kumhartoli, Kolkata.',
  99.00, 149.00, 80, 'FG-DIYA-01', true, 4.9, 42,
  'Hand-Painted Festive Terracotta Diyas Set of 4 | KalaKart',
  'Handcrafted decorative clay diyas under ₹100. Ideal for Diwali and festive prayer.'
),
(
  'p1000000-0000-0000-0000-000000000020',
  'c1000000-0000-0000-0000-000000000007',
  'natural-soy-wax-terracotta-candle',
  'Aromatherapy Soy Wax Terracotta Candle (Mogra)',
  'Pure soy wax infused with night-blooming jasmine essential oil in reusable clay pot.',
  'Clean burning and completely paraffin-free. The hand-poured candle fills the room with the divine, calming aroma of fresh Mogra (Indian Jasmine). The clay container can be reused as a planter once burnt out.',
  array['100% natural soy wax & cotton wick', 'Infused with Mogra essential oil', '25+ hours clean burn time'],
  array['candle', 'festive', 'gifting', 'home decor', 'spiritual', 'relaxing'],
  'Pure Soy Wax, Mogra essential oil, Handcrafted terracotta bowl',
  '9 cm diameter x 6 cm height',
  'Trim wick to 5mm before every lighting. Burn for 2-3 hours at a time.',
  'Poured in small batches by artisan candle makers in Varanasi, Uttar Pradesh.',
  249.00, 349.00, 30, 'FG-CND-02', true, 4.8, 19,
  'Aromatherapy Mogra Soy Wax Terracotta Candle | KalaKart',
  'Hand-poured pure soy wax candle in clay pot under ₹250. Soothing floral fragrance.'
),
(
  'p1000000-0000-0000-0000-000000000021',
  'c1000000-0000-0000-0000-000000000007',
  'brass-kamal-dhoop-cone-holder',
  'Cast Brass Blooming Lotus Dhoop Incense Holder',
  'Solid brass miniature lotus flower burner for incense sticks and dhoop cones.',
  'Cast in solid brass using ancestral sand casting techniques, this compact lotus flower features a central dhoop cone pedestal and multiple petal holes to anchor thin agarbatti incense sticks.',
  array['Solid cast brass construction', 'Dual-use: holds cones & sticks', 'Compact spiritual desk accessory'],
  array['brass', 'festive', 'spiritual', 'incense', 'traditional', 'gifting'],
  '100% Solid Brass',
  '6.5 cm diameter x 3 cm height',
  'Polish with Pitambari powder or lemon rind to restore golden luster.',
  'Cast by hereditary brass braziers in Moradabad, Uttar Pradesh.',
  179.00, 249.00, 45, 'FG-BRS-03', true, 4.7, 15,
  'Cast Brass Blooming Lotus Dhoop Incense Holder | KalaKart',
  'Solid brass lotus incense burner under ₹199. Timeless pooja and gifting essential.'
),

-- 8. Wooden & Kids' Crafts
(
  'p1000000-0000-0000-0000-000000000022',
  'c1000000-0000-0000-0000-000000000008',
  'channapatna-wooden-spinning-tops-pair',
  'Channapatna Wooden Spinning Tops (Pair)',
  'Traditional lacquered ivory-wood spinning tops colored with organic vegetable dyes.',
  'Relive nostalgic childhood fun! Lathe-turned from soft Wrightia tinctoria (Aale mara) ivory wood and buffed to a glossy mirror finish using natural lac and non-toxic vegetable dyes (turmeric, indigo, kumkum).',
  array['100% non-toxic vegetable lacquer', 'Safe rounded baby-friendly edges', 'Smooth extended spin duration'],
  array['toys', 'wooden', 'kids', 'traditional', 'channapatna', 'eco-friendly'],
  'Seasoned Wrightia Tinctoria Wood, natural vegetable lac',
  '6 cm diameter x 8 cm height each',
  'Wipe with clean dry cloth. Do not soak in water.',
  'Crafted by GI-tagged Channapatna toy artisans in the toy town of Karnataka.',
  119.00, 169.00, 50, 'KT-TOP-01', true, 4.9, 28,
  'Channapatna Wooden Spinning Tops Pair | KalaKart',
  'Authentic non-toxic Channapatna wooden spinning tops under ₹120. Safe kids craft toys.'
),
(
  'p1000000-0000-0000-0000-000000000023',
  'c1000000-0000-0000-0000-000000000008',
  'wooden-animal-stacking-puzzle-rings',
  'Wooden Balancing Owl Rocker & Ring Stacker',
  'Montessori-inspired wooden stacking rings topped with a cheerful hand-turned owl.',
  'Stimulates fine motor skills, hand-eye coordination, and color recognition for toddlers. Smooth ivory wood finished with food-grade seed oil and natural lac colors.',
  array['Montessori sensory development', '5 smooth graduated rings + base', 'Zero sharp edges, 100% splinter-free'],
  array['toys', 'wooden', 'kids', 'montessori', 'channapatna', 'gifting'],
  'Hale wood (Ivory wood), organic lac resin dye',
  '10 cm diameter x 16 cm height',
  'Wipe with a damp towel and dry thoroughly.',
  'Crafted by master lathe turners in Channapatna, Karnataka.',
  349.00, 480.00, 25, 'KT-STK-02', true, 4.8, 14,
  'Channapatna Wooden Stacking Rings Toy | KalaKart',
  'Safe organic wooden stacking toy for toddlers under ₹350. Non-toxic vegetable dyes.'
),
(
  'p1000000-0000-0000-0000-000000000024',
  'c1000000-0000-0000-0000-000000000008',
  'wooden-pocket-catapult-gulel',
  'Hand-Carved Wooden Slingshot with Wool Felt Balls',
  'Traditional smooth rosewood slingshot paired with 10 soft woolen indoor target balls.',
  'A classic outdoor game modernized for safe indoor family target practice. Hand-shaped from a single natural wooden Y-branch with heavy-duty latex bands and soft felted wool pom-pom balls that won''t damage furniture.',
  array['Includes 10 soft colorful wool felt balls', 'Smooth contoured ergonomic grip', 'Fun safe motor coordination game'],
  array['toys', 'wooden', 'kids', 'games', 'traditional', 'handcrafted'],
  'Natural Sheesham wood fork, natural latex tubing, 100% wool felt balls',
  '18 cm x 9 cm x 2.5 cm',
  'Inspect elastic band periodically for wear.',
  'Carved by folk toy artisans in Saharanpur, Uttar Pradesh.',
  179.00, 249.00, 30, 'KT-CAT-03', true, 4.6, 11,
  'Hand-Carved Wooden Slingshot with Felt Balls | KalaKart',
  'Handmade wooden slingshot with soft wool balls under ₹199. Safe indoor/outdoor kids fun.'
),

-- 9. DIY Craft Kits
(
  'p1000000-0000-0000-0000-000000000025',
  'c1000000-0000-0000-0000-000000000009',
  'beginner-air-dry-clay-pottery-kit',
  'Beginner Air-Dry Terracotta Pottery DIY Kit',
  'Complete home pottery kit with natural air-dry terracotta clay, 5 wooden tools, and sealant.',
  'No kiln or oven required! Includes 1 kg of non-toxic air-dry terracotta clay, 5 double-ended wooden sculpting tools, a sponge, water-resistant matte sealant, and an illustrated step-by-step maker booklet to shape bowls, coasters, and pots.',
  array['1 kg premium air-dry terracotta clay', '5 double-ended boxwood tools', 'Water-resistant acrylic varnish & paints'],
  array['diy kit', 'pottery', 'clay', 'hobby', 'kids', 'art'],
  'Natural Air-dry clay, wooden tools, water-based acrylic paint pots',
  'Box: 24 cm x 18 cm x 8 cm (1.2 kg weight)',
  'Store unused clay wrapped in plastic airtight bag.',
  'Curated in collaboration with traditional potters to make clay arts accessible to everyone.',
  349.00, 499.00, 30, 'DK-POT-01', true, 4.9, 36,
  'Air-Dry Terracotta Pottery DIY Kit | KalaKart',
  'All-in-one home pottery craft kit under ₹350. Sculpt pots and dishes with air-dry clay.'
),
(
  'p1000000-0000-0000-0000-000000000026',
  'c1000000-0000-0000-0000-000000000009',
  'hand-block-printing-starter-kit',
  'Hand Block Printing Fabric DIY Starter Kit',
  'Authentic hand-carved Sheesham wooden blocks with non-toxic textile colors and tote bag.',
  'Discover the meditative craft of Bagru and Sanganer block printing. Includes 2 hand-carved wooden stamps (floral buta and geometric border), 3 washable textile paint pots, sponge stamper, and 1 blank cotton tote bag to customize.',
  array['2 hand-carved Sheesham wood printing blocks', 'Includes 1 blank pre-washed cotton tote bag', '3 vibrant fabric paint jars (50ml each)'],
  array['diy kit', 'block print', 'textiles', 'hobby', 'art', 'traditional'],
  'Carved Sheesham wood blocks, non-toxic fabric acrylic paints, 100% cotton canvas tote',
  'Box: 22 cm x 16 cm x 6 cm',
  'Wash wooden blocks immediately after painting to prevent paint drying in crevices.',
  'Blocks carved by hereditary artisan block-makers of Sanganer, Rajasthan.',
  299.00, 420.00, 25, 'DK-BLK-02', true, 4.8, 17,
  'Block Printing Fabric DIY Starter Kit | KalaKart',
  'Create custom printed tote bags at home under ₹300. Authentic carved wood blocks.'
),
(
  'p1000000-0000-0000-0000-000000000027',
  'c1000000-0000-0000-0000-000000000009',
  'diy-macrame-plant-hanger-starter-kit',
  'DIY Macramé Plant Hanger Craft Kit for Beginners',
  'Pre-measured premium cotton cord, wooden ring, beads, and photo guide.',
  'Create your very first boho plant hanger in under 60 minutes! Features 30 meters of smooth 3-ply cotton cord pre-cut to length, a natural beech wood hanging ring, 6 polished wooden beads, and a clear knot-by-knot beginner photo booklet.',
  array['Pre-measured 3mm braided cotton rope', 'Solid beechwood ring + 6 drilled wooden beads', 'Detailed step-by-step illustrated manual'],
  array['diy kit', 'macrame', 'hobby', 'plants', 'boho', 'craft'],
  'Natural Cotton Cord, Beech wood ring, lotus wood beads',
  'Box: 20 cm x 15 cm x 5 cm',
  'Keep cotton cord dry until knotted.',
  'Created by macramé artisans to share the therapeutic joy of knotting.',
  229.00, 329.00, 35, 'DK-MAC-03', true, 4.7, 19,
  'DIY Macrame Plant Hanger Craft Kit | KalaKart',
  'Complete beginner macramé craft kit under ₹250. Knot your own hanging planter.'
);

-- ---------- PRODUCT IMAGES ----------
insert into public.product_images (product_id, url, alt_text, sort_order)
select id, 'https://picsum.photos/seed/' || slug || '/800/800', title || ' - Primary Angle', 1
from public.products;

insert into public.product_images (product_id, url, alt_text, sort_order)
select id, 'https://picsum.photos/seed/' || slug || '-detail/800/800', title || ' - Close-up Craft Detail', 2
from public.products;
