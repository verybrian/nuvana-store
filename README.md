# Nuvana Electronics Storefront

## 1. Introduction
An e-commerce storefront built with Nuxt 3, NestJS, and PostgreSQL. It was built in hours as a take-home assignment for Nuvana. The goal was to build a fast, SEO-friendly store with a functional cart and a simulated checkout flow.

## 2. Summary of Key Decisions

- **Cloudflare R2 for Images:** Product images are hosted on Cloudflare R2 rather than in the database. This mimics a real production setup and allows for fast global CDN delivery without bloating the database.
- **PostgreSQL + TypeORM:** I chose Postgres because it is a relational database I am highly familiar with and it matches Nuvana's stack. Using a `jsonb` column for the `specs` field allows each product to have dynamic technical specifications without needing a complex Entity-Attribute-Value schema.
- **Pinia for Cart State:** I used Pinia with a `localStorage` sync to manage the cart. This was the cleanest way to handle the cart's persistence across page reloads and allowed the header badge to update reactively across the entire app.
- **Nuxt 3 (SSR & SEO):** I used Nuxt for Server-Side Rendering. SSR ensures that product pages are pre-rendered with their meta tags and JSON-LD data, making them instantly crawlable by search engines.
- **No UI Library:** I intentionally avoided component libraries and built the design system purely with Tailwind CSS. This kept the JS bundle small and allowed for exact control over the minimalist UI.

## 3. SEO Implementation
To fulfill the SEO requirements of the brief, the following was implemented:
- **Server-Side Rendering:** Pages are rendered on the server, ensuring crawlers see the full HTML immediately.
- **Dynamic Meta & Open Graph:** Product pages dynamically inject titles, descriptions, and OG images for social sharing.
- **Structured Data (JSON-LD):** Product pages include `application/ld+json` schema for `Product`, including price, currency, and availability.
- **Semantic HTML & Clean URLs:** Used slug-based routing (e.g., `/products/iphone-15-pro`) and proper heading hierarchies.
- **Performance:** Used `<NuxtImg>` for WebP conversion, lazy loading, and responsive image sizing.

## 4. Future Improvements
Given more time and a production environment, I would add the following:
- **Account Functionality**
- **Bidding System**
- **Delivery Fee Calculation:** A checkout that calculates delivery fees dynamically based on the user's location rather than a flat rate.
