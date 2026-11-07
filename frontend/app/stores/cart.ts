import { defineStore } from 'pinia'
import type { Product } from '~/types/product'

export interface CartLine {
  lineId: string
  id: string
  slug: string
  name: string
  price: number
  currency: string
  imageUrl: string
  qty: number
  selectedColor?: string
}

const STORAGE_KEY = 'nuvana-cart-v2'

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: [] as CartLine[],
    loaded: false,
  }),

  getters: {
    count: (s) => s.lines.reduce((n, l) => n + l.qty, 0),
    subtotal: (s) => s.lines.reduce((n, l) => n + l.price * l.qty, 0),
    currency: (s) => s.lines[0]?.currency ?? 'KES',
    isEmpty: (s) => s.lines.length === 0,
  },

  actions: {
    load() {
      if (this.loaded || !import.meta.client) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) this.lines = JSON.parse(raw)
      } catch {
        this.lines = []
      }
      this.loaded = true
    },

    persist() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines))
      }
    },

    add(product: Product, qty = 1, color?: string) {
      const lineId = `${product.id}-${color || 'default'}`
      const existing = this.lines.find((l) => l.lineId === lineId)

      if (existing) {
        existing.qty += qty
      } else {
        this.lines.push({
          lineId,
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          currency: product.currency,
          imageUrl: product.imageUrl,
          qty,
          selectedColor: color,
        })
      }
      this.persist()
    },

    setQty(lineId: string, qty: number) {
      const line = this.lines.find((l) => l.lineId === lineId)
      if (!line) return
      if (qty <= 0) {
        this.remove(lineId)
      } else {
        line.qty = qty
        this.persist()
      }
    },

    remove(lineId: string) {
      this.lines = this.lines.filter((l) => l.lineId !== lineId)
      this.persist()
    },

    clear() {
      this.lines = []
      this.persist()
    },
  },
})