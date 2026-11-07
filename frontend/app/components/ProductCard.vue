<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '~/types/product'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()

const isInCart = computed(() => cart.lines.some(line => line.id === props.product.id))

const price = computed(() =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0
  }).format(props.product.price)
)

const specSummary = computed(() => {
  const keys = Object.keys(props.product.specs || {})
  if (keys.length === 0) return 'Premium electronics'

  return keys
    .slice(0, 2)
    .map(key => `${key}: ${props.product.specs[key]}`)
    .join(' • ')
})

const added = ref(false)

function handleAdd() {
  cart.add(props.product)
  added.value = true
  setTimeout(() => (added.value = false), 1500)
}
</script>

<template>
  <div class="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow duration-200">
    <NuxtLink :to="`/products/${product.slug}`" class="relative block aspect-square w-full bg-[#f6f6f6] overflow-hidden">
      <NuxtImg
        :src="product.imageUrl"
        :alt="product.name"
        width="600"
        height="600"
        format="webp"
        loading="lazy"
        class="h-full w-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
      />

      <div class="absolute top-3 right-3 h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
    </NuxtLink>

    <div class="px-4 py-4 flex flex-col flex-1 justify-between">
      <NuxtLink :to="`/products/${product.slug}`" class="block mb-3">
        <h3 class="text-[15px] font-normal text-slate-800 leading-snug line-clamp-2 mb-1 group-hover:underline">
          {{ product.name }}
        </h3>
        <p class="text-[13px] text-slate-500 truncate">
          {{ specSummary }}
        </p>
      </NuxtLink>

      <div>
        <span class="text-[17px] font-bold text-slate-900 block mb-3">{{ price }}</span>

        <NuxtLink
          v-if="isInCart"
          to="/cart"
          class="flex items-center justify-center w-full rounded-full bg-orange-600 border-2 border-orange-600 py-2 text-sm font-bold text-white hover:bg-orange-700 hover:border-orange-700 transition-colors"
        >
          View Cart
        </NuxtLink>

        <button
          v-else
          @click="handleAdd"
          class="w-full rounded-full border-2 border-orange-600 bg-white py-2 text-sm font-bold text-orange-600 transition-colors hover:bg-orange-600 hover:text-white"
          :class="{ 'bg-orange-600 text-white': added }"
        >
          {{ added ? '✓ Added!' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </div>
</template>