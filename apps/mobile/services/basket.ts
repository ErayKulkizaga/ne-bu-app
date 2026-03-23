import { apiClient } from './api';
import type { BasketCreate, BasketItemCreate, BasketResponse, BasketSummary } from '@/types/api';

export async function createBasket(payload: BasketCreate): Promise<BasketResponse> {
  const { data } = await apiClient.post<BasketResponse>('/basket', payload);
  return data;
}

export async function addItemToBasket(
  basketId: number,
  payload: BasketItemCreate,
): Promise<{ id: number; basket_id: number; product_id: number }> {
  const { data } = await apiClient.post(`/basket/${basketId}/items`, payload);
  return data;
}

export async function getBasketSummary(basketId: number): Promise<BasketSummary> {
  const { data } = await apiClient.get<BasketSummary>(`/basket/${basketId}/summary`);
  return data;
}

export async function getBasket(basketId: number): Promise<BasketResponse> {
  const { data } = await apiClient.get<BasketResponse>(`/basket/${basketId}`);
  return data;
}
