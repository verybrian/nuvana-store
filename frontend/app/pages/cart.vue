<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const cart = useCartStore()
const checkingOut = ref(false)
const done = ref(false)
const orderRef = ref('')

onMounted(() => cart.load())

const fmt = (n: number, currency = 'KES') =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

const discountCode = ref('')
const appliedDiscount = ref(false)
const discountError = ref('')

function applyDiscount() {
  discountError.value = ''
  if (discountCode.value.trim().toUpperCase() === 'TECH10') {
    appliedDiscount.value = true
  } else {
    appliedDiscount.value = false
    discountError.value = 'Invalid code'
  }
}

function removeDiscount() {
  appliedDiscount.value = false
  discountCode.value = ''
  discountError.value = ''
}

const discountAmount = computed(() => appliedDiscount.value ? cart.subtotal * 0.10 : 0)
const shipping = computed(() => {
  if (cart.subtotal === 0) return 0
  return cart.subtotal > 50000 ? 0 : 500
})
const total = computed(() => cart.subtotal - discountAmount.value + shipping.value)

function checkout() {
  checkingOut.value = true
  setTimeout(() => {
    orderRef.value = 'NV-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    cart.clear()
    appliedDiscount.value = false
    checkingOut.value = false
    done.value = true
  }, 1200)
}

useSeoMeta({
  title: 'Cart — Nuvana Electronics',
  robots: 'noindex',
})
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 py-8 md:py-12 font-sans text-slate-900">
    <nav aria-label="Breadcrumb" class="mb-8 text-sm">
      <ol class="flex flex-wrap items-center gap-2 text-slate-500">
        <li>
          <NuxtLink to="/" class="hover:text-orange-600 hover:underline transition-colors">Home</NuxtLink>
        </li>
        <li aria-hidden="true">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </li>
        <li class="font-medium text-slate-900" aria-current="page">Cart</li>
      </ol>
    </nav>

    <div v-if="cart.isEmpty && !done" class="text-center py-24">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6">
        <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      </div>
      <h1 class="text-2xl font-medium mb-2">Your cart is empty</h1>
      <p class="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
      <NuxtLink to="/" class="inline-flex items-center justify-center bg-orange-600 px-8 py-3 text-sm font-bold text-white hover:bg-orange-700 transition-colors">
        Start Shopping
      </NuxtLink>
    </div>

    <div v-else-if="done" class="max-w-md mx-auto text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6">
        <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 class="text-3xl font-medium mb-3">Order Confirmed</h1>
      <p class="text-slate-500 mb-8">Thank you for your purchase. Your order reference is <strong class="text-slate-900">{{ orderRef }}</strong>.</p>
      <p class="text-sm text-slate-400 mb-8">(This is a mocked checkout for the demo)</p>
      <NuxtLink to="/" class="inline-flex items-center justify-center bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors">
        Continue Shopping
      </NuxtLink>
    </div>

    <div v-else>
      <h1 class="text-3xl font-medium mb-8">Shopping Cart</h1>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 md:gap-16 items-start">
        <div class="border-t border-slate-200">
          <ul class="divide-y divide-slate-200">
            <li v-for="line in cart.lines" :key="line.lineId" class="flex gap-6 py-6">
              <NuxtLink :to="`/products/${line.slug}`" class="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-[#f6f6f6] overflow-hidden">
                <NuxtImg :src="line.imageUrl" :alt="line.name" class="h-full w-full object-cover mix-blend-multiply" />
              </NuxtLink>

              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start gap-4">
                    <NuxtLink :to="`/products/${line.slug}`" class="font-medium text-slate-900 hover:text-orange-600 transition-colors line-clamp-2">
                      {{ line.name }}
                    </NuxtLink>
                    <p class="font-bold text-slate-900 whitespace-nowrap">{{ fmt(line.price) }}</p>
                  </div>

                  <div class="mt-1 flex items-center gap-3 text-sm text-slate-500">
                    <span v-if="line.selectedColor" class="flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-full border border-slate-300" :style="{ backgroundColor: line.selectedColor === 'Midnight Black' ? '#111' : line.selectedColor === 'Silver' ? '#d4d4d8' : line.selectedColor === 'Ocean Blue' ? '#6366f1' : '#f4a6b1' }"></span>
                      {{ line.selectedColor }}
                    </span>
                    <span v-if="line.selectedColor" class="text-slate-300">|</span>
                    <span class="text-emerald-600 text-xs font-medium">In Stock</span>
                  </div>
                </div>

                <div class="flex items-end justify-between mt-4">
                  <div class="flex items-center border border-slate-300 h-9 w-28">
                    <button @click="cart.setQty(line.lineId, line.qty - 1)" class="w-9 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors border-r border-slate-200">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                    </button>
                    <span class="flex-1 text-center text-sm font-medium">{{ line.qty }}</span>
                    <button @click="cart.setQty(line.lineId, line.qty + 1)" class="w-9 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors border-l border-slate-200">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  </div>

                  <button @click="cart.remove(line.lineId)" class="text-sm text-slate-500 hover:text-red-600 transition-colors underline decoration-slate-300 underline-offset-4">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="pt-2">
          <h2 class="text-xl font-medium mb-6">Order Summary</h2>

          <div class="space-y-4 text-sm mb-6 border-b border-slate-200 pb-6">
            <div class="flex justify-between text-slate-600">
              <span>Subtotal ({{ cart.count }} items)</span>
              <span class="font-medium text-slate-900">{{ fmt(cart.subtotal) }}</span>
            </div>

            <div class="pt-2">
              <div v-if="!appliedDiscount" class="flex gap-2">
                <input
                  type="text"
                  v-model="discountCode"
                  placeholder="Discount code"
                  class="flex-1 border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 uppercase"
                />
                <button
                  @click="applyDiscount"
                  class="border border-slate-300 px-6 py-2 text-sm font-medium hover:border-slate-900 transition-colors"
                >
                  Apply
                </button>
              </div>
              <p v-if="discountError" class="text-xs text-red-600 mt-1.5">{{ discountError }}</p>

              <div v-if="appliedDiscount" class="flex items-center justify-between border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                <span class="font-medium tracking-wide uppercase">TECH10</span>
                <button @click="removeDiscount" class="text-slate-400 hover:text-red-500 transition-colors underline">Remove</button>
              </div>
            </div>

            <div v-if="appliedDiscount" class="flex justify-between text-emerald-700 font-medium mt-2">
              <span>Discount (10%)</span>
              <span>-{{ fmt(discountAmount) }}</span>
            </div>

            <div class="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span v-if="shipping === 0" class="font-medium text-emerald-600">Free</span>
              <span v-else class="font-medium text-slate-900">{{ fmt(shipping) }}</span>
            </div>

            <div v-if="shipping > 0" class="text-xs text-slate-600 mt-2">
              Add <strong class="text-slate-900">{{ fmt(50000 - cart.subtotal) }}</strong> more to get free shipping.
            </div>
          </div>

          <div class="flex justify-between items-baseline mb-8">
            <span class="text-lg font-medium text-slate-900">Total</span>
            <span class="text-2xl font-bold text-slate-900">{{ fmt(total) }}</span>
          </div>

          <div class="flex flex-col gap-3">
            <NuxtLink to="/checkout" class="w-full flex items-center justify-center bg-orange-600 py-3.5 text-[15px] font-medium text-white hover:bg-orange-700 transition-colors">
              Proceed to Checkout
            </NuxtLink>
            <NuxtLink
              to="/"
              class="w-full flex items-center justify-center border border-slate-300 bg-white py-3.5 text-[15px] font-medium text-slate-900 hover:border-slate-400 transition-colors"
            >
              Continue Shopping
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>