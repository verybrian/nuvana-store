export function useApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  async function get<T>(path: string): Promise<T> {
    return await $fetch<T>(`${base}${path}`)
  }

  return {
    getProducts: () => get<Product[]>('/products'),
    getProduct: (slug: string) => get<Product>(`/products/${slug}`),
  }
}