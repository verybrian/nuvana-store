<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cart = useCartStore()
const isMounted = ref(false)

onMounted(() => {
  cart.load()
  isMounted.value = true
  
  if (cart.isEmpty) {
    router.push('/cart')
  }
})

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  paymentMethod: 'mpesa',
  mpesaPhone: '',
})

const isProcessing = ref(false)
const orderComplete = ref(false)
const orderRef = ref('')
const errors = ref<Record<string, string>>({})

const shipping = computed(() => (cart.subtotal > 50000 ? 0 : 500))
const tax = computed(() => 0)
const total = computed(() => cart.subtotal + shipping.value + tax.value)

const isFormValid = computed(() => {
  const baseFieldsValid = form.value.firstName && form.value.lastName && form.value.email && form.value.phone && form.value.address
  return baseFieldsValid && form.value.mpesaPhone.length >= 9
})

function validateForm() {
  errors.value = {}
  if (!form.value.firstName) errors.value.firstName = 'First name is required'
  if (!form.value.lastName) errors.value.lastName = 'Last name is required'
  if (!form.value.email) errors.value.email = 'Email is required'
  if (!form.value.phone) errors.value.phone = 'Phone is required'
  if (!form.value.address) errors.value.address = 'Address is required'
  if (!form.value.mpesaPhone) errors.value.mpesaPhone = 'M-Pesa number is required'
  
  return Object.keys(errors.value).length === 0
}

function placeOrder() {
  if (!validateForm()) return

  isProcessing.value = true
  
  setTimeout(() => {
    orderRef.value = 'NV-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    cart.clear()
    isProcessing.value = false
    orderComplete.value = true
  }, 2000)
}

useSeoMeta({
  title: 'Checkout — Nuvana Electronics',
  robots: 'noindex',
})
</script>

<template>
  <div class="mx-auto max-w-[1200px] px-4 py-8 md:py-12 font-sans text-slate-900">
    <div v-if="!isMounted" class="py-24 flex justify-center">
      <div class="w-8 h-8 rounded-full border-4 border-slate-200 border-t-orange-600 animate-spin"></div>
    </div>

    <div v-else-if="orderComplete" class="max-w-lg mx-auto text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6">
        <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 class="text-3xl font-medium mb-3">Order Confirmed</h1>
      <p class="text-slate-500 mb-8">
        Thank you, {{ form.firstName }}. Your payment was successful. Your order reference is 
        <strong class="text-slate-900">{{ orderRef }}</strong>.
      </p>
      <p class="text-sm text-slate-500 mb-8">
        A confirmation email has been sent to <strong>{{ form.email }}</strong> and an SMS to <strong>{{ form.mpesaPhone }}</strong>.
      </p>
      <NuxtLink to="/" class="inline-flex items-center justify-center bg-orange-600 px-8 py-3 text-sm font-bold text-white hover:bg-orange-700 transition-colors">
        Continue Shopping
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 md:gap-16 items-start">
      <div>
        <div class="mb-8">
          <nav class="flex items-center text-sm text-slate-500 mb-6">
            <NuxtLink to="/" class="hover:text-orange-600 hover:underline">Home</NuxtLink>
            <svg class="w-3.5 h-3.5 text-slate-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            <NuxtLink to="/cart" class="hover:text-orange-600 hover:underline">Cart</NuxtLink>
            <svg class="w-3.5 h-3.5 text-slate-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            <span class="text-slate-900 font-medium">Checkout</span>
          </nav>
          
          <div class="flex items-center gap-4 border-b border-slate-200 pb-4">
            <div class="flex items-center gap-2 text-sm font-medium text-slate-900">
              <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
              Customer Info
            </div>
            <div class="w-8 border-t border-slate-300"></div>
            <div class="flex items-center gap-2 text-sm text-slate-400">
              <div class="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">2</div>
              Payment
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-medium mb-1">Check Out Your Items</h2>
        <p class="text-sm text-slate-500 mb-6">Verify your shipping details before ordering.</p>

        <div class="space-y-4 mb-10">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">First Name</label>
              <input v-model="form.firstName" type="text" placeholder="Jane" class="w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 transition-colors" :class="{ 'border-red-500': errors.firstName }" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
              <input v-model="form.lastName" type="text" placeholder="Doe" class="w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 transition-colors" :class="{ 'border-red-500': errors.lastName }" />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input v-model="form.email" type="email" placeholder="jane@example.com" class="w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 transition-colors" :class="{ 'border-red-500': errors.email }" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
              <input v-model="form.phone" type="tel" placeholder="0712 345 678" class="w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 transition-colors" :class="{ 'border-red-500': errors.phone }" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Delivery Address</label>
            <textarea v-model="form.address" rows="3" placeholder="Street name, building, apartment..." class="w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 transition-colors resize-none" :class="{ 'border-red-500': errors.address }"></textarea>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">City / Town</label>
            <input v-model="form.city" type="text" placeholder="Nairobi" class="w-full border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 transition-colors" />
          </div>
        </div>

        <h2 class="text-2xl font-medium mb-1">Payment Method</h2>
        <p class="text-sm text-slate-500 mb-6">Select how you want to pay.</p>

        <div class="space-y-3">
          <label class="flex items-center justify-between border border-slate-900 bg-slate-50 p-4 cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
              <NuxtImg src="/images/M-pesa.webp" alt="M-Pesa" class="h-8 object-contain" />
              <span class="font-medium">M-Pesa Payment</span>
            </div>
            <div class="w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <div class="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
            </div>
            <input type="radio" value="mpesa" v-model="form.paymentMethod" class="hidden" />
          </label>
          
          <div class="pl-4 py-2 border-l-2 border-slate-200 ml-4">
            <label class="block text-xs font-medium text-slate-700 mb-1">M-Pesa Number</label>
            <input v-model="form.mpesaPhone" type="tel" placeholder="0712 345 678" class="w-full max-w-sm border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 transition-colors" :class="{ 'border-red-500': errors.mpesaPhone }" />
          </div>
        </div>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-6">
        <h2 class="text-lg font-medium mb-1">Current Order</h2>
        <p class="text-sm text-slate-500 mb-6">The sum of all total payments for goods here.</p>
        
        <div class="space-y-4 mb-6 border-b border-slate-200 pb-6">
          <div v-for="line in cart.lines" :key="line.lineId" class="flex items-start gap-4">
            <div class="w-16 h-16 bg-white border border-slate-200 shrink-0 p-1">
              <NuxtImg :src="line.imageUrl" class="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium line-clamp-1">{{ line.name }}</p>
              <p class="text-xs text-slate-500 mb-2">Qty: {{ line.qty }}</p>
              <p class="text-sm font-bold">{{ fmt(line.price * line.qty) }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-3 text-sm mb-6 border-b border-slate-200 pb-6">
          <div class="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span class="font-medium text-slate-900">{{ fmt(cart.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Items</span>
            <span class="font-medium text-slate-900">{{ cart.count }}x</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Delivery Service</span>
            <span v-if="shipping === 0" class="font-medium text-emerald-600">Free</span>
            <span v-else class="font-medium text-slate-900">{{ fmt(shipping) }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>VAT (0%)</span>
            <span class="font-medium text-slate-900">{{ fmt(tax) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-baseline mb-6">
          <span class="text-lg font-medium text-slate-900">Total</span>
          <span class="text-2xl font-bold text-slate-900">{{ fmt(total) }}</span>
        </div>

        <button 
          @click="placeOrder"
          :disabled="isProcessing || !isFormValid"
          class="w-full flex items-center justify-center bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isProcessing ? 'Processing Payment...' : `Pay ${fmt(total)}` }}
        </button>
      </div>
    </div>
  </div>
</template>