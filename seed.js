/**
 * RE-GEN Database Seed Script
 * ─────────────────────────────────────────────────
 * Populates your Supabase database with realistic
 * mock hardware marketplace data.
 *
 * Usage:
 *   node seed.js
 *
 * Requires a configured .env with:
 *   SUPABASE_URL
 *   SUPABASE_ROLE_KEY   ← service role key (bypasses RLS)
 * ─────────────────────────────────────────────────
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ROLE_KEY
);

// ─── Colour helpers ───────────────────────────────
const c = {
    cyan:   t => `\x1b[36m${t}\x1b[0m`,
    green:  t => `\x1b[32m${t}\x1b[0m`,
    yellow: t => `\x1b[33m${t}\x1b[0m`,
    red:    t => `\x1b[31m${t}\x1b[0m`,
    bold:   t => `\x1b[1m${t}\x1b[0m`,
};

const log  = (msg) => console.log(c.cyan(`  ▸ ${msg}`));
const ok   = (msg) => console.log(c.green(`  ✔ ${msg}`));
const warn = (msg) => console.log(c.yellow(`  ⚠ ${msg}`));
const fail = (msg) => console.log(c.red(`  ✖ ${msg}`));

// ─── Seed Data ────────────────────────────────────

const categories = [
    { name: "CPU",         slug: "cpu" },
    { name: "GPU",         slug: "gpu" },
    { name: "RAM",         slug: "ram" },
    { name: "PSU",         slug: "psu" },
    { name: "Motherboard", slug: "motherboard" },
    { name: "Storage",     slug: "storage" },
    { name: "Cooling",     slug: "cooling" },
];

// NOTE: These are inserted via the Supabase Auth admin API,
// then their UUIDs are used for products & swaps.
const usersToSeed = [
    { email: "farida@regen.io",  password: "regen123!", full_name: "Farida Hassan",  role: "user",  eco_score: 78 },
    { email: "omar@regen.io",    password: "regen123!", full_name: "Omar Khalil",     role: "user",  eco_score: 64 },
    { email: "sara@regen.io",    password: "regen123!", full_name: "Sara Nasser",     role: "user",  eco_score: 87 },
    { email: "youssef@regen.io", password: "regen123!", full_name: "Youssef Badr",   role: "user",  eco_score: 55 },
];

const buildProducts = (catMap, userMap) => [
    {
        name: "RTX 4070 Ti",
        description: "Nvidia Ada Lovelace architecture. Professionally cleaned and tested. Zero artifacting at 4K.",
        price: 18500,
        image_url: "https://d2jdgazzki9vjm.cloudfront.net/imgp/computer/rtx-4070-ti-super-gallery-d.png",
        category_id: catMap["GPU"],
        eco_score: 81,
        health_score: 94,
        quality: "Excellent",
        stock_quantity: 1,
        is_swap: true,
        status: "approved",
        user_id: userMap["farida@regen.io"],
    },
    {
        name: "Intel Core i9-13900K",
        description: "8 P-Cores + 16 E-Cores. Used for 8 months. Runs at 5.8GHz boost.",
        price: 24000,
        image_url: "https://www.techpowerup.com/img/2a0A7mGnSuA7Kq6U.jpg",
        category_id: catMap["CPU"],
        eco_score: 76,
        health_score: 88,
        quality: "Very Good",
        stock_quantity: 1,
        is_swap: true,
        status: "approved",
        user_id: userMap["omar@regen.io"],
    },
    {
        name: "32GB DDR5-6000 RAM Kit",
        description: "Corsair Dominator Titanium 2x16GB. XMP 3.0 profile verified.",
        price: 7800,
        image_url: "https://asset.msi.com/resize/image/global/product/product_165839574099a1e2f85f4f0aad5cd4b7ec4c7cb0.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
        category_id: catMap["RAM"],
        eco_score: 90,
        health_score: 99,
        quality: "Excellent",
        stock_quantity: 2,
        is_swap: false,
        status: "approved",
        user_id: userMap["sara@regen.io"],
    },
    {
        name: "ASUS ROG STRIX X670E-E",
        description: "AM5 flagship board. 18+2 power stages, WiFi 6E, PCIe 5.0 M.2 slots.",
        price: 22000,
        image_url: "https://dlcdnwebimgs.asus.com/gain/6D1A5F9E-E0B1-4A15-8D48-12A892B2D43A/w1000/h732",
        category_id: catMap["Motherboard"],
        eco_score: 68,
        health_score: 92,
        quality: "Very Good",
        stock_quantity: 1,
        is_swap: true,
        status: "approved",
        user_id: userMap["youssef@regen.io"],
    },
    {
        name: "Seasonic FOCUS GX-1000W",
        description: "80+ Gold rated. Fully modular. Used in a workstation build, low wear.",
        price: 5500,
        image_url: "https://seasonic.com/components/com_virtuemart/shop_image/product/FOCUS_GX_1000.png",
        category_id: catMap["PSU"],
        eco_score: 85,
        health_score: 97,
        quality: "Excellent",
        stock_quantity: 1,
        is_swap: false,
        status: "approved",
        user_id: userMap["farida@regen.io"],
    },
    {
        name: "Samsung 990 Pro 2TB NVMe",
        description: "PCIe 4.0 M.2 SSD. Sequential reads up to 7,450 MB/s. 8 months of use.",
        price: 9200,
        image_url: "https://images.samsung.com/is/image/samsung/p6pim/levant/mz-v9p2t0bw/gallery/levant-990-pro-nvme-ssd-mz-v9p2t0bw-537247037?$684_547_PNG$",
        category_id: catMap["Storage"],
        eco_score: 88,
        health_score: 95,
        quality: "Excellent",
        stock_quantity: 1,
        is_swap: true,
        status: "approved",
        user_id: userMap["omar@regen.io"],
    },
    {
        name: "Noctua NH-D15 Chromax Black",
        description: "Dual-tower CPU cooler. Chromax black edition. Fits all LGA1700 and AM5 sockets.",
        price: 3200,
        image_url: "https://noctua.at/pub/media/catalog/product/n/h/nh-d15-chromax.black_1.jpg",
        category_id: catMap["Cooling"],
        eco_score: 93,
        health_score: 100,
        quality: "Like New",
        stock_quantity: 1,
        is_swap: false,
        status: "approved",
        user_id: userMap["sara@regen.io"],
    },
    {
        name: "AMD Ryzen 9 7950X",
        description: "16-core Zen4 flagship. Runs cool with a 360mm AIO. Box included.",
        price: 29000,
        image_url: "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2602819-ryzen-9-7950x-PIB.png",
        category_id: catMap["CPU"],
        eco_score: 72,
        health_score: 91,
        quality: "Very Good",
        stock_quantity: 1,
        is_swap: true,
        status: "approved",
        user_id: userMap["youssef@regen.io"],
    },
    {
        name: "RX 7900 XTX",
        description: "AMD RDNA3. 24GB GDDR6. Tested extensively at 4K ultra. Minor fan noise.",
        price: 32000,
        image_url: "https://www.amd.com/content/dam/amd/en/images/products/graphics/rdna3/2602434-amd-radeon-rx-7900-series-pib.png",
        category_id: catMap["GPU"],
        eco_score: 70,
        health_score: 86,
        quality: "Good",
        stock_quantity: 1,
        is_swap: true,
        status: "pending",
        user_id: userMap["omar@regen.io"],
    },
    {
        name: "Corsair RM1000x SHIFT",
        description: "1000W 80+ Gold. Unique slide-intake design. 12VHPWR ready for RTX 40-series.",
        price: 6800,
        image_url: "https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020253-EU-RM1000x-SHIFT-Gallery-01.png",
        category_id: catMap["PSU"],
        eco_score: 80,
        health_score: 99,
        quality: "Excellent",
        stock_quantity: 1,
        is_swap: false,
        status: "approved",
        user_id: userMap["farida@regen.io"],
    },
];

// ─── Helpers ──────────────────────────────────────

async function upsertCategories() {
    log("Seeding categories...");
    const { data, error } = await supabase
        .from("categories")
        .upsert(categories, { onConflict: "slug" })
        .select();
    if (error) { fail(`Categories: ${error.message}`); return {}; }
    const map = {};
    data.forEach(c => { map[c.name] = c.id; });
    ok(`Inserted ${data.length} categories`);
    return map;
}

async function createUsers() {
    log("Creating auth users...");
    const userMap = {};

    for (const u of usersToSeed) {
        // Try to create via admin API
        const { data, error } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
            user_metadata: { full_name: u.full_name },
        });

        if (error && error.message.includes("already registered")) {
            warn(`${u.email} already exists — fetching id...`);
            const { data: list } = await supabase.auth.admin.listUsers();
            const existing = list?.users?.find(usr => usr.email === u.email);
            if (existing) userMap[u.email] = existing.id;
        } else if (error) {
            fail(`${u.email}: ${error.message}`);
        } else {
            userMap[u.email] = data.user.id;
            ok(`Created user ${u.full_name} (${u.email})`);

            // Upsert into public profiles table
            await supabase.from("profiles").upsert({
                id: data.user.id,
                full_name: u.full_name,
                email: u.email,
                role: u.role,
                eco_score: u.eco_score,
            }, { onConflict: "id" });
        }
    }
    return userMap;
}

async function upsertProducts(catMap, userMap) {
    log("Seeding products...");
    const products = buildProducts(catMap, userMap);
    const { data, error } = await supabase
        .from("products")
        .upsert(products, { onConflict: "name" })
        .select();
    if (error) { fail(`Products: ${error.message}`); return []; }
    ok(`Inserted ${data.length} products`);
    return data;
}

async function upsertOrders(userMap) {
    log("Seeding orders...");
    const orders = [
        {
            user_id: userMap["sara@regen.io"],
            total_amount: 7800,
            shipping_address: "15 Tahrir Square, Cairo, Egypt",
            status: "completed",
        },
        {
            user_id: userMap["farida@regen.io"],
            total_amount: 5500,
            shipping_address: "88 Corniche St, Alexandria, Egypt",
            status: "processing",
        },
        {
            user_id: userMap["omar@regen.io"],
            total_amount: 9200,
            shipping_address: "42 El-Nasr Road, New Cairo, Egypt",
            status: "shipped",
        },
    ];
    const { data, error } = await supabase.from("orders").insert(orders).select();
    if (error) { fail(`Orders: ${error.message}`); return; }
    ok(`Inserted ${data.length} orders`);
}

async function upsertSwaps(products, userMap) {
    if (products.length < 4) { warn("Not enough products to seed swaps."); return; }
    log("Seeding swaps...");

    const swaps = [
        {
            user_id: userMap["farida@regen.io"],
            offered_item_id: products[0].id,
            desired_item_id: products[7]?.id || products[1].id,
            status: "pending",
            shipping_status: "pending",
            delivery_status: "pending",
        },
        {
            user_id: userMap["omar@regen.io"],
            offered_item_id: products[5].id,
            desired_item_id: products[2].id,
            status: "accepted",
            shipping_status: "shipped",
            delivery_status: "pending",
        },
        {
            user_id: userMap["youssef@regen.io"],
            offered_item_id: products[3].id,
            desired_item_id: products[1].id,
            status: "completed",
            shipping_status: "delivered",
            delivery_status: "completed",
        },
    ];

    const { data, error } = await supabase.from("swaps").insert(swaps).select();
    if (error) { fail(`Swaps: ${error.message}`); return; }
    ok(`Inserted ${data.length} swaps`);
}

// ─── Main ─────────────────────────────────────────

async function seed() {
    console.log("\n" + c.bold(c.cyan("═══════════════════════════════════")));
    console.log(c.bold(c.cyan("   RE-GEN Database Seed Script")));
    console.log(c.bold(c.cyan("═══════════════════════════════════")) + "\n");

    const catMap  = await upsertCategories();
    const userMap = await createUsers();
    const products = await upsertProducts(catMap, userMap);
    await upsertOrders(userMap);
    await upsertSwaps(products, userMap);

    console.log("\n" + c.green(c.bold("  ✔ Seed complete! Database is populated.\n")));
}

seed().catch(err => {
    fail(`Unexpected error: ${err.message}`);
    process.exit(1);
});
