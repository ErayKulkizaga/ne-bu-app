// ── Product ────────────────────────────────────────────────────────────────

export interface ProductListItem {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  barcode: string | null;
  image_url: string | null;
}

export interface ProductResponse {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  barcode: string | null;
  raw_ingredients: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// ── Ingredient ─────────────────────────────────────────────────────────────

export interface IngredientDetail {
  id: number;
  name: string;
  normalized_name: string;
  e_number: string | null;
  is_additive: boolean;
  additive_type: string | null;
  concern_level: number;
  description: string | null;
}

export interface ProductIngredientEntry {
  position: number;
  raw_text: string | null;
  ingredient: IngredientDetail;
}

// ── Analysis ───────────────────────────────────────────────────────────────

export interface ScoreBand {
  label: string;
  color: string;
  description: string;
}

export interface IngredientFlag {
  name: string;
  e_number: string | null;
  concern_level: number;
  reason: string;
}

export interface ExplanationCardData {
  title: string;
  body: string;
  severity: 'info' | 'caution' | 'warning';
}

export interface AnalysisResult {
  product: ProductResponse;
  ingredients: ProductIngredientEntry[];
  score: number;
  score_band: ScoreBand;
  flagged_ingredients: IngredientFlag[];
  explanation_cards: ExplanationCardData[];
  contributing_factors: string[];
}

// ── Recommendations ────────────────────────────────────────────────────────

export interface RecommendationItem {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  score: number;
  score_label: string;
}

// ── Basket ─────────────────────────────────────────────────────────────────

export interface BasketResponse {
  id: number;
  user_id: number | null;
  created_at: string;
}

export interface BasketCreate {
  user_id?: number;
}

export interface BasketItemCreate {
  product_id: number;
}

export interface BasketSummaryItem {
  product_id: number;
  product_name: string;
  brand: string | null;
  score: number;
  score_label: string;
}

export interface BasketSummary {
  basket_id: number;
  item_count: number;
  average_score: number;
  overall_label: string;
  items: BasketSummaryItem[];
  summary_text: string;
}

// ── Health ─────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  version: string;
}
