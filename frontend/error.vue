<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="text-center">
      <p class="text-6xl font-semibold text-emerald-600">{{ error.statusCode }}</p>
      <h1 class="mt-4 text-2xl font-semibold">{{ error.statusMessage ?? 'Something went wrong' }}</h1>
      <NuxtLink to="/" class="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700">
        Back to shop
      </NuxtLink>
    </div>
  </div>
</template>