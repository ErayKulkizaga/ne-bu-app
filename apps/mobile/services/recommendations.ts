import { apiClient } from './api';
import type { RecommendationItem } from '@/types/api';

export async function getRecommendations(
  productId: number,
  limit = 3,
): Promise<RecommendationItem[]> {
  const { data } = await apiClient.get<RecommendationItem[]>(
    `/recommendations/product/${productId}`,
    { params: { limit } },
  );
  return data;
}
