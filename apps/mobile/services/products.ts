import { apiClient } from './api';
import type { ProductListItem, ProductResponse } from '@/types/api';

export async function searchProducts(query: string, limit = 20): Promise<ProductListItem[]> {
  const { data } = await apiClient.get<ProductListItem[]>('/products', {
    params: { query, limit },
  });
  return data;
}

export async function getProduct(productId: number): Promise<ProductResponse> {
  const { data } = await apiClient.get<ProductResponse>(`/products/${productId}`);
  return data;
}
