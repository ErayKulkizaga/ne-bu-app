import { apiClient } from './api';
import type { AnalysisResult } from '@/types/api';

export async function analyzeProduct(
  productId: number,
  sensitivityModifier = 0,
): Promise<AnalysisResult> {
  const { data } = await apiClient.post<AnalysisResult>(
    `/analysis/product/${productId}`,
    null,
    { params: { sensitivity_modifier: sensitivityModifier } },
  );
  return data;
}
