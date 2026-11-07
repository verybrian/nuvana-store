<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Product } from '~/types/product'

const cart = useCartStore()
const router = useRouter()
const route = useRoute()
const { getProducts } = useApi()

onMounted(() => cart.load())

const searchCategory = ref('All Categories')
const categories = ['All Categories', 'Phones', 'Laptops', 'Audio', 'Tablets', 'Monitors', 'Accessories']

watch(() => route.query.category, (newCat) => {
  searchCategory.value = newCat ? String(newCat) : 'All Categories'
}, { immediate: true })

watch(searchCategory, (newVal) => {
  const query = { ...route.query }
  if (newVal === 'All Categories') {
    delete query.category
  } else {
    query.category = newVal
  }
  router.push({ path: '/', query })
})

const searchQuery = ref('')
const isSearchFocused = ref(false)
const allProducts = ref<Product[]>([])

const isMobileSearchOpen = ref(false)

onMounted(async () => {
  try {
    allProducts.value = await getProducts()
  } catch (e) {}
})

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  return allProducts.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    const matchesCategory = searchCategory.value === 'All Categories' || p.category === searchCategory.value
    return matchesSearch && matchesCategory
  }).slice(0, 5)
})

function goToProduct(slug: string) {
  isSearchFocused.value = false
  isMobileSearchOpen.value = false
  searchQuery.value = ''
  router.push(`/products/${slug}`)
}

function handleSearch() {
  if (!searchQuery.value.trim()) return
  isSearchFocused.value = false
  isMobileSearchOpen.value = false
  router.push({ path: '/', query: { ...route.query, search: searchQuery.value.trim() } })
}

function onBlur() {
  setTimeout(() => { isSearchFocused.value = false }, 200)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
    <div class="bg-slate-900 text-white text-[11px] sm:text-xs py-2">
      <div class="mx-auto max-w-[1400px] px-4 flex items-center justify-between">

        <div class="flex items-center gap-4">
          <a href="tel:+254700000000" class="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span class="hidden sm:inline">+254 700 000 000</span>
            <span class="sm:hidden">Call Us</span>
          </a>
          <span class="hidden sm:inline text-slate-700">|</span>
          <span class="hidden sm:flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Deliver to: Nairobi
          </span>
        </div>

        <div class="hidden md:flex gap-3 items-center">
          <span class="text-slate-300">Get 10% Off on Your First Order</span>
          <a href="#products" class="font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
            Shop Now
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>

        <div class="flex items-center gap-4 text-slate-300">
          <a href="#" class="hover:text-white transition-colors">Track Order</a>
          <span class="hidden sm:inline text-slate-700">|</span>
          <a href="#" class="hidden sm:inline hover:text-white transition-colors">Help Center</a>
        </div>

      </div>
    </div>

    <header class="border-b border-slate-200 bg-white pt-4 pb-3 sticky top-0 z-50 relative">
      <div class="mx-auto max-w-[1400px] px-4 flex items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="shrink-0 flex items-center">
            <img src="/images/logo.png" alt="Nuvana" class="h-10 w-auto object-contain" />
          </NuxtLink>
        </div>

        <div class="hidden md:flex flex-1 max-w-5xl items-center gap-3">
          <div class="relative flex-1">
            <div class="flex items-stretch rounded-full border-2 border-slate-900 bg-white h-11 relative z-50">
              <div class="flex-1 flex items-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  v-model="searchQuery"
                  @focus="isSearchFocused = true"
                  @blur="onBlur"
                  @keyup.enter="handleSearch"
                  placeholder="Search for anything"
                  class="w-full bg-transparent border-none outline-none text-sm placeholder-slate-500"
                />
              </div>

              <div class="flex items-center border-l border-slate-300 relative">
                <select
                  v-model="searchCategory"
                  class="h-full bg-transparent border-none outline-none text-sm text-slate-700 pl-4 pr-10 cursor-pointer appearance-none"
                  style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.65rem;"
                >
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
            </div>

            <div
              v-if="isSearchFocused && searchQuery.trim().length > 0"
              class="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 z-40 pt-2 pb-2"
            >
              <div class="absolute -top-2 left-8 w-4 h-4 bg-white border-t border-l border-slate-100 transform rotate-45"></div>

              <div v-if="searchResults.length > 0" class="flex flex-col relative z-10">
                <button
                  v-for="p in searchResults"
                  :key="p.id"
                  @click="goToProduct(p.slug)"
                  class="group w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="h-12 w-12 shrink-0 bg-[#f6f6f6] rounded-lg overflow-hidden">
                      <NuxtImg :src="p.imageUrl" class="h-full w-full object-cover mix-blend-multiply" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-slate-900 truncate">{{ p.name }}</p>
                      <p class="text-xs text-slate-500">{{ p.category }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 shrink-0 ml-4">
                    <div class="text-sm font-bold text-slate-900">
                      {{ new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p.price) }}
                    </div>
                    <svg class="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              <div v-else class="relative z-10 px-5 py-6 text-center text-sm text-slate-500">
                No results found for "{{ searchQuery }}"
              </div>
            </div>
          </div>

          <button
            @click="handleSearch"
            class="rounded-full bg-orange-600 px-8 h-11 text-sm font-bold text-white hover:bg-orange-700 transition-colors shrink-0"
          >
            Search
          </button>
        </div>

        <div class="flex items-center gap-4 sm:gap-6 shrink-0">

          <button
            @click="isMobileSearchOpen = !isMobileSearchOpen"
            class="md:hidden flex items-center text-slate-700 hover:text-orange-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button class="flex items-center gap-2 text-sm font-medium hover:text-orange-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="hidden sm:inline">Account</span>
          </button>

          <NuxtLink to="/cart" class="flex items-center gap-2 text-sm font-medium hover:text-orange-600 transition-colors">
            <div class="relative flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span
                v-if="cart.count > 0"
                class="absolute -top-2 -right-2.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white"
              >
                {{ cart.count }}
              </span>
            </div>
            <span class="hidden sm:inline">Cart</span>
          </NuxtLink>
        </div>
      </div>

      <div
        v-if="isMobileSearchOpen"
        class="absolute top-full left-0 right-0 bg-white border-b border-slate-200 px-4 py-4 md:hidden shadow-lg z-50"
      >
        <div class="relative">
          <div class="flex items-stretch rounded-full border-2 border-slate-900 bg-white h-11">
            <div class="flex-1 flex items-center px-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                placeholder="Search products..."
                class="w-full bg-transparent border-none outline-none text-sm placeholder-slate-500"
              />
            </div>

            <div class="flex items-center border-l border-slate-300 relative">
              <select
                v-model="searchCategory"
                class="h-full bg-transparent border-none outline-none text-sm text-slate-700 pl-3 pr-8 cursor-pointer appearance-none"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 0.65rem;"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div v-if="searchQuery.trim().length > 0" class="mt-3 bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div v-if="searchResults.length > 0" class="flex flex-col">
              <button
                v-for="p in searchResults"
                :key="p.id"
                @click="goToProduct(p.slug)"
                class="w-full flex items-center gap-3 px-3 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 text-left"
              >
                <div class="h-10 w-10 shrink-0 bg-[#f6f6f6] rounded overflow-hidden">
                  <NuxtImg :src="p.imageUrl" class="h-full w-full object-cover mix-blend-multiply" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-900 truncate">{{ p.name }}</p>
                </div>
                <div class="text-sm font-bold text-slate-900">
                  {{ new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p.price) }}
                </div>
              </button>
            </div>
            <div v-else class="px-4 py-6 text-center text-sm text-slate-500">
              No results found for "{{ searchQuery }}"
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-white border-t border-slate-200 mt-16 pb-12 pt-10">
      <div class="mx-auto max-w-[1400px] px-4">

        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          <div>
            <h3 class="text-sm font-bold text-slate-900 mb-4">Shop</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">All Categories</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">New Arrivals</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Best Sellers</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Deals & Offers</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-slate-900 mb-4">Sell</h3>
            <ul class="space-y-3 mb-8">
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Start Selling</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Business Accounts</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Seller Center</a></li>
            </ul>

            <h3 class="text-sm font-bold text-slate-900 mb-4">Tools & Apps</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Developers</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Security Center</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-slate-900 mb-4">About Nuvana</h3>
            <ul class="space-y-3 mb-8">
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Company Info</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">News & Blog</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Careers</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Advertise with us</a></li>
            </ul>

            <h3 class="text-sm font-bold text-slate-900 mb-4">Stay Connected</h3>
            <ul class="space-y-3">
              <li>
                <a href="#" class="flex items-center gap-2 text-[13px] text-slate-600 hover:underline hover:text-slate-900">
                  <svg class="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center gap-2 text-[13px] text-slate-600 hover:underline hover:text-slate-900">
                  <svg class="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-slate-900 mb-4">Help & Contact</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Contact Us</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Shipping & Delivery</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Returns & Refunds</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Warranty Info</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-slate-900 mb-4">Payment Methods</h3>
            <ul class="space-y-3 mb-8">
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">M-Pesa</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Visa & Mastercard</a></li>
            </ul>

            <h3 class="text-sm font-bold text-slate-900 mb-4">Trust & Safety</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Buyer Protection</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Privacy Policy</a></li>
              <li><a href="#" class="text-[13px] text-slate-600 hover:underline hover:text-slate-900">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div class="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center gap-2 text-[12px] text-slate-600">
          <p>Copyright © {{ new Date().getFullYear() }} Nuvana Inc. All Rights Reserved.</p>
          <div class="flex flex-wrap gap-x-4 gap-y-2 md:ml-2">
            <a href="#" class="hover:underline hover:text-blue-700">Accessibility</a>
            <a href="#" class="hover:underline hover:text-blue-700">User Agreement</a>
            <a href="#" class="hover:underline hover:text-blue-700">Privacy</a>
            <a href="#" class="hover:underline hover:text-blue-700">Consumer Health Data</a>
            <a href="#" class="hover:underline hover:text-blue-700">Payments Terms of Use</a>
            <a href="#" class="hover:underline hover:text-blue-700">Cookies</a>
            <a href="#" class="flex items-center gap-1 hover:underline hover:text-blue-700">
              Your Privacy Choices
              <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  </div>
</template>