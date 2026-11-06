"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const typeorm_1 = require("typeorm");
const product_entity_js_1 = require("./products/product.entity.js");
const products = [
    { slug: 'iphone-15-pro-256gb', name: 'iPhone 15 Pro 256GB', category: 'Phones',
        price: 189999, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&q=80',
        description: 'Titanium flagship with the A17 Pro chip, 48MP main camera and USB-C.',
        specs: { RAM: '8GB', Storage: '256GB', Display: '6.1" Super Retina XDR', Chip: 'A17 Pro' } },
    { slug: 'samsung-galaxy-s24-ultra', name: 'Samsung Galaxy S24 Ultra', category: 'Phones',
        price: 164999, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80',
        description: '6.8" QHD+ AMOLED, Snapdragon 8 Gen 3, 200MP camera and S Pen.',
        specs: { RAM: '12GB', Storage: '512GB', Display: '6.8" QHD+', Camera: '200MP' } },
    { slug: 'macbook-air-m3-13', name: 'MacBook Air 13" M3', category: 'Laptops',
        price: 154999, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
        description: 'Fanless 13-inch laptop with the M3 chip, 18-hour battery and Liquid Retina display.',
        specs: { RAM: '8GB', Storage: '256GB SSD', Chip: 'Apple M3', Battery: '18h' } },
    { slug: 'dell-xps-13-plus', name: 'Dell XPS 13 Plus', category: 'Laptops',
        price: 134999, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=80',
        description: 'Edge-to-edge keyboard, InfinityEdge display and 13th-gen Intel Core i7.',
        specs: { RAM: '16GB', Storage: '512GB SSD', CPU: 'Intel Core i7-1360P', Display: '13.4" FHD+' } },
    { slug: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5 Headphones', category: 'Audio',
        price: 39999, imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80',
        description: 'Industry-leading noise cancelling with 30-hour battery and multipoint pairing.',
        specs: { Type: 'Over-ear', Battery: '30h', ANC: 'Yes', Connectivity: 'Bluetooth 5.2' } },
    { slug: 'airpods-pro-2', name: 'AirPods Pro (2nd gen)', category: 'Audio',
        price: 29999, imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1200&q=80',
        description: 'Adaptive noise cancellation, USB-C charging case and personalised spatial audio.',
        specs: { Type: 'In-ear', Battery: '6h (30h with case)', ANC: 'Yes', Chip: 'H2' } },
    { slug: 'ipad-air-11-m2', name: 'iPad Air 11" M2', category: 'Tablets',
        price: 89999, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=80',
        description: 'M2-powered tablet with Liquid Retina display and Apple Pencil Pro support.',
        specs: { RAM: '8GB', Storage: '128GB', Display: '11" Liquid Retina', Chip: 'Apple M2' } },
    { slug: 'samsung-odyssey-g7', name: 'Samsung Odyssey G7 32"', category: 'Monitors',
        price: 74999, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=80',
        description: '1000R curved QHD gaming monitor with 240Hz refresh and 1ms response.',
        specs: { Size: '32"', Resolution: '2560x1440', Refresh: '240Hz', Panel: 'VA' } },
    { slug: 'logitech-mx-master-3s', name: 'Logitech MX Master 3S', category: 'Accessories',
        price: 12999, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200&q=80',
        description: '8K DPI quiet-click wireless mouse with MagSpeed scroll and multi-device flow.',
        specs: { DPI: '8000', Connectivity: 'Bluetooth + Bolt', Battery: '70 days', Buttons: '7' } },
    { slug: 'anker-737-powerbank', name: 'Anker 737 Power Bank', category: 'Accessories',
        price: 14999, imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&q=80',
        description: '24,000mAh 140W power bank with smart display, charges a laptop and phone together.',
        specs: { Capacity: '24000mAh', Output: '140W', Ports: '2x USB-C, 1x USB-A', Display: 'Yes' } },
];
async function run() {
    const ds = new typeorm_1.DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [product_entity_js_1.Product],
        synchronize: true,
        ssl: process.env.DATABASE_URL?.includes('render.com')
            ? { rejectUnauthorized: false }
            : false,
    });
    await ds.initialize();
    const repo = ds.getRepository(product_entity_js_1.Product);
    for (const p of products) {
        await repo.upsert(p, ['slug']);
    }
    console.log(`Seeded ${products.length} products`);
    await ds.destroy();
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map