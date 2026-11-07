<script setup lang="ts">
import { computed, ref } from 'vue'

const route = useRoute()
const { getProduct, getProducts } = useApi()
const cart = useCartStore()

const { data: product, error, pending } = await useAsyncData(
  () => `product-${route.params.slug}`,
  () => getProduct(route.params.slug as string),
  { getCachedData: () => undefined },
)

if (!pending.value && error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

if (!pending.value && error.value) {
  throw createError({ statusCode: 503, statusMessage: 'Could not load product' })
}

const { data: allProducts } = await useAsyncData(
  'related-products',
  () => getProducts(),
  { getCachedData: () => undefined }
)

const relatedProducts = computed(() => {
  if (!product.value || !allProducts.value) return []
  return allProducts.value
    .filter(p => p.category === product.value!.category && p.id !== product.value!.id)
    .slice(0, 4)
})

const price = computed(() =>
  product.value
    ? new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(product.value.price)
    : ''
)

const colors = [
  { name: 'Black', hex: '#111111' },
  { name: 'Silver', hex: '#e5e7eb' },
  { name: 'Grey', hex: '#6b7280' },
]

const selectedColor = ref(colors[Math.floor(Math.random() * colors.length)])

const quantity = ref(1)
const isInCart = computed(() =>
  product.value ? cart.lines.some(line => line.id === product.value!.id) : false,
)

function incrementQty() {
  if (quantity.value < 10) quantity.value++
}

function decrementQty() {
  if (quantity.value > 1) quantity.value--
}

function handleAddToCart() {
  if (!product.value) return
  cart.add(product.value, quantity.value)
}

const SPECS_PREVIEW_COUNT = 6
const showAllSpecs = ref(false)
const specEntries = computed(() => Object.entries(product.value?.specs ?? {}))
const visibleSpecs = computed(() =>
  showAllSpecs.value ? specEntries.value : specEntries.value.slice(0, SPECS_PREVIEW_COUNT),
)

useSeoMeta({
  title: () => product.value ? `${product.value.name} — Nuvana` : 'Product',
  description: () => product.value?.description.slice(0, 160) ?? '',
})
</script>

<template>
  <div class="mx-auto max-w-[1300px] px-4 py-8 md:py-16 font-sans text-slate-900">

    <nav v-if="product && !pending" aria-label="Breadcrumb" class="mb-6 text-sm">
      <ol class="flex flex-wrap items-center gap-2 text-slate-500">
        <li>
          <NuxtLink to="/" class="hover:text-orange-600 hover:underline transition-colors">Home</NuxtLink>
        </li>
        <li aria-hidden="true">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </li>
        <li>
          <NuxtLink :to="`/?category=${product.category}`" class="hover:text-orange-600 hover:underline transition-colors">
            {{ product.category }}
          </NuxtLink>
        </li>
        <li aria-hidden="true">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </li>
        <li class="font-medium text-slate-900" aria-current="page">{{ product.name }}</li>
      </ol>
    </nav>

    <div v-if="pending" class="grid gap-12 md:grid-cols-2 animate-pulse">
      <div class="aspect-square bg-slate-100"></div>
      <div class="space-y-6 pt-4">
        <div class="h-8 bg-slate-100 w-3/4"></div>
        <div class="h-6 bg-slate-100 w-1/4"></div>
        <div class="h-12 bg-slate-100 w-full mt-10"></div>
      </div>
    </div>

    <div v-else-if="product" class="grid items-start gap-10 md:gap-16 md:grid-cols-[1.2fr_1fr]">

      <div class="self-start md:sticky md:top-8">
        <div class="aspect-square w-full max-w-[700px] overflow-hidden rounded-2xl bg-[#f6f6f6]">
          <NuxtImg
            :src="product.imageUrl"
            :alt="product.name"
            width="1000"
            height="1000"
            format="webp"
            class="h-full w-full object-cover mix-blend-multiply"
          />
        </div>
      </div>

      <div class="flex flex-col md:pt-4">

        <h1 class="text-2xl md:text-[28px] font-medium leading-tight mb-2">
          {{ product.name }}
        </h1>
        <p class="text-lg font-medium">{{ price }}</p>
        <p class="mt-1 text-xs" :class="product.inStock ? 'text-emerald-600' : 'text-red-600'">
          {{ product.inStock ? 'In stock' : 'Out of stock' }}
        </p>

        <hr class="my-5 border-slate-200" />

        <div class="mb-6">
          <p class="text-xs text-slate-600 mb-3">
            Select Color: <span class="font-medium text-slate-900">{{ selectedColor.name }}</span>
          </p>
          <div class="flex items-center gap-3" role="radiogroup" aria-label="Color">
            <button
              v-for="c in colors"
              :key="c.hex"
              type="button"
              role="radio"
              :aria-checked="selectedColor.hex === c.hex"
              :aria-label="c.name"
              :title="c.name"
              @click="selectedColor = c"
              class="h-7 w-7 rounded-full p-[3px] border transition-colors"
              :class="selectedColor.hex === c.hex ? 'border-slate-900' : 'border-transparent hover:border-slate-300'"
            >
              <span class="block h-full w-full rounded-full border border-black/10" :style="{ backgroundColor: c.hex }"></span>
            </button>
          </div>
        </div>

        <div class="mb-6">
          <p class="text-xs text-slate-600 mb-3">Quantity</p>
          <div class="flex items-stretch gap-3">
            <div class="flex items-center justify-between border border-slate-300 h-12 w-32 px-3 shrink-0">
              <button
                type="button"
                @click="decrementQty"
                :disabled="quantity <= 1"
                aria-label="Decrease quantity"
                class="text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
              </button>
              <span class="text-sm font-medium tabular-nums">{{ String(quantity).padStart(2, '0') }}</span>
              <button
                type="button"
                @click="incrementQty"
                :disabled="quantity >= 10"
                aria-label="Increase quantity"
                class="text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>

            <NuxtLink
              v-if="isInCart"
              to="/cart"
              class="flex-1 h-12 flex items-center justify-center bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              View cart
            </NuxtLink>
            <button
              v-else
              type="button"
              @click="handleAddToCart"
              :disabled="!product.inStock"
              class="flex-1 h-12 bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to cart
            </button>
          </div>
        </div>

        <p class="text-sm text-slate-600 leading-relaxed mb-8">
          {{ product.description }}
        </p>

        <section v-if="specEntries.length" class="mb-8">
          <dl class="text-sm">
            <div
              v-for="[key, value] in visibleSpecs"
              :key="key"
              class="grid grid-cols-[38%_1fr] gap-4 py-2"
            >
              <dt class="font-bold text-slate-900 capitalize">{{ key }}</dt>
              <dd class="text-slate-700">{{ value }}</dd>
            </div>
          </dl>
          <button
            v-if="specEntries.length > SPECS_PREVIEW_COUNT"
            type="button"
            @click="showAllSpecs = !showAllSpecs"
            :aria-expanded="showAllSpecs"
            class="mt-3 inline-flex items-center gap-1 text-sm text-sky-700 hover:text-orange-700 hover:underline"
          >
            <svg class="w-4 h-4 text-slate-900 transition-transform" :class="showAllSpecs ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
            {{ showAllSpecs ? 'See less' : 'See more' }}
          </button>
        </section>

        <div class="border-t border-slate-200">
          <details class="group border-b border-slate-200 py-5">
            <summary class="flex justify-between items-center font-medium text-[15px] list-none cursor-pointer">
              Shipping &amp; Returns
              <svg class="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div class="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                We deliver across Kenya. Orders placed before 2 PM on a business day are dispatched the same day.
                Nairobi deliveries usually arrive within 1 to 2 business days, and other major towns within 2 to 4 business days.
                Remote areas may take a little longer, and you will get tracking details by SMS and email once your order ships.
              </p>
              <p>
                Shipping is free on orders over KES 50,000. Smaller orders are charged a flat delivery fee that is shown at checkout
                before you pay. You can also choose to collect your order from our pickup point at no cost.
              </p>
            </div>
          </details>

          <details class="group border-b border-slate-200 py-5">
            <summary class="flex justify-between items-center font-medium text-[15px] list-none cursor-pointer">
              Warranty
              <svg class="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div class="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                Every Nuvana product is covered by a 1 year limited warranty that starts on the date of delivery.
                It covers manufacturing defects and hardware failures that happen under normal use, and we will repair or replace
                the item at no cost to you.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>

    <div v-if="relatedProducts.length > 0" class="mt-24 pt-10 border-t border-slate-200">
      <h2 class="text-2xl font-medium tracking-tight mb-8">Similar items</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard v-for="p in relatedProducts" :key="p.id" :product="p" />
      </div>
    </div>

  </div>
</template>