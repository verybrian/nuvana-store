<script setup lang="ts">
import { computed } from 'vue'

const { getProducts } = useApi()
const route = useRoute()
const router = useRouter()

const { data: products, pending, error } = await useAsyncData(
  'products',
  () => getProducts(),
  { getCachedData: () => undefined }
)

const activeCategory = computed(() => route.query.category ? String(route.query.category) : 'All')
const searchKeyword = computed(() => route.query.search ? String(route.query.search).toLowerCase() : '')

const visible = computed(() => {
  let result = products.value ?? []

  if (activeCategory.value !== 'All') {
    result = result.filter(p => p.category === activeCategory.value)
  }

  if (searchKeyword.value) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchKeyword.value) ||
      p.description.toLowerCase().includes(searchKeyword.value)
    )
  }

  return result
})

useSeoMeta({
  title: () => {
    if (searchKeyword.value) return `Search: ${route.query.search} — Nuvana Electronics`
    if (activeCategory.value !== 'All') return `${activeCategory.value} — Nuvana Electronics`
    return 'Nuvana Electronics — Phones, Laptops, Audio & More'
  },
  description: 'Shop the latest electronics in Kenya. Fast delivery, M-Pesa accepted, and a 1-year warranty on all products.'
})

function clearFilters() {
  router.push({ path: '/' })
}
</script>

<template>
  <div class="mx-auto max-w-[1400px] px-4 py-8">
    <div class="relative overflow-hidden rounded-2xl bg-[#4a0f2c] text-white px-10 md:px-16 py-8 md:py-10 md:min-h-[280px] flex flex-col md:flex-row items-center justify-between gap-4 mb-8 font-sans">
      <div class="max-w-lg">
        <h1 class="text-[32px] md:text-4xl font-semibold leading-[1.15] tracking-tight font-heading">
          Upgrade your tech.<br class="hidden md:block" /> Save up to 10%.
        </h1>
        <p class="mt-2 text-[15px] text-white/90">
          Get exclusive discounts on top smartphones, laptops, and audio gear.
        </p>
        <button class="mt-4 rounded-full bg-[#fbd5ea] text-[#4a0f2c] px-5 py-2 text-sm font-semibold hover:bg-white transition-colors">
          Shop the sale
        </button>
        <p class="mt-12 text-xs text-white/80 underline cursor-pointer hover:text-white">
          Ends Nov 30. Max KES 10,000 off. Use code: TECH10.
        </p>
      </div>

      <div class="relative w-full md:w-[600px] h-[200px] md:h-[240px] flex items-center justify-center md:justify-end">
        <NuxtImg
          src="/images/hero-cards.webp"
          alt="Promotional offers"
          class="h-full w-full object-contain object-right md:translate-x-12 md:scale-[2.1] origin-right"
        />
      </div>
    </div>

    <div
      v-if="!pending"
      class="flex items-center justify-between mb-6"
    >
      <p class="text-sm text-slate-500">
        Showing {{ visible.length }} {{ visible.length === 1 ? 'item' : 'items' }}
        <span v-if="activeCategory !== 'All'" class="font-medium text-slate-900">in {{ activeCategory }}</span>
        <span v-if="searchKeyword" class="font-medium text-slate-900">for "{{ route.query.search }}"</span>
      </p>
      <button
        v-if="activeCategory !== 'All' || searchKeyword"
        @click="clearFilters"
        class="text-sm text-orange-600 hover:text-orange-700 hover:underline font-medium"
      >
        Clear filter
      </button>
    </div>

    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="h-80 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      Could not load products. Please try again.
    </div>

    <div v-else-if="visible.length === 0" class="py-20 text-center">
      <h2 class="text-2xl font-bold mb-2">No products found</h2>
      <p class="text-slate-500 mb-6">We couldn't find anything matching your search.</p>
      <button @click="clearFilters" class="rounded-full bg-orange-600 px-6 py-2 text-white font-medium hover:bg-orange-700">
        View all products
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard v-for="p in visible" :key="p.id" :product="p" />
    </div>
  </div>
</template>