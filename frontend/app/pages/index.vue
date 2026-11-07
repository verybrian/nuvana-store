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
    <div class="relative overflow-hidden rounded-2xl bg-[#0B1120] text-white px-8 md:px-16 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 mb-10 min-h-[320px]">
      <div class="max-w-lg z-10">
        <h1 class="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight font-heading">
          Endless electronics.<br /> Epic prices.
        </h1>
        <p class="mt-4 text-[15px] md:text-base text-slate-300">
          Browse the latest upgrades for your setup.
        </p>
        <button class="mt-6 rounded-full bg-white text-[#0B1120] px-7 py-3 text-sm font-bold hover:bg-slate-100 transition-colors">
          Shop now
        </button>
      </div>

      <div class="relative w-full md:w-[500px] h-[240px] flex items-center justify-center mt-8 md:mt-0">
        
        <div class="absolute w-32 h-44 md:w-40 md:h-52 bg-white rounded-xl shadow-2xl transform -rotate-12 -translate-x-16 md:-translate-x-20 overflow-hidden border-4 border-white z-10 p-2">
          <NuxtImg src="/images/hero-1.webp" alt="Product 1" class="w-full h-full object-contain mix-blend-multiply" />
        </div>
        
        <div class="absolute w-36 h-48 md:w-48 md:h-64 bg-white rounded-xl shadow-2xl transform rotate-0 z-20 overflow-hidden border-4 border-white p-2">
          <NuxtImg src="/images/hero-2.webp" alt="Product 2" class="w-full h-full object-contain mix-blend-multiply" />
        </div>
        
        <div class="absolute w-32 h-44 md:w-40 md:h-52 bg-white rounded-xl shadow-2xl transform rotate-12 translate-x-16 md:translate-x-20 overflow-hidden border-4 border-white z-10 p-2">
          <NuxtImg src="/images/hero-3.webp" alt="Product 3" class="w-full h-full object-contain mix-blend-multiply" />
        </div>
      </div>
    </div>

    <div v-if="!pending" class="flex items-center justify-between mb-6">
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