import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { analyzeProduct } from '@/services/analysis';
import { getRecommendations } from '@/services/recommendations';
import { createBasket, addItemToBasket } from '@/services/basket';
import { useBasketStore } from '@/store/basketStore';
import { ScoreMeter } from '@/components/ScoreMeter';
import { ExplanationCard } from '@/components/ExplanationCard';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { AnalysisResult, RecommendationItem } from '@/types/api';

const CATEGORY_EMOJIS: Record<string, string> = {
  Snacks: '🍟', Dairy: '🥛', Beverages: '🥤',
  Biscuits: '🍪', Spreads: '🫙', 'Snack Bars': '🍫',
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { basketId, setBasketId } = useBasketStore();

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToBasket, setAddingToBasket] = useState(false);

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);
    Promise.all([analyzeProduct(productId), getRecommendations(productId)])
      .then(([a, r]) => { setAnalysis(a); setRecommendations(r); })
      .catch(() => setError('Could not load product analysis.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToBasket() {
    if (!id) return;
    setAddingToBasket(true);
    try {
      let bid = basketId;
      if (!bid) {
        const nb = await createBasket({});
        bid = nb.id;
        setBasketId(bid);
      }
      await addItemToBasket(bid, { product_id: Number(id) });
      Alert.alert('Added! 🛒', `${analysis?.product.name} has been added to your basket.`);
    } catch {
      Alert.alert('Oops!', 'Could not add to basket. Please try again.');
    } finally {
      setAddingToBasket(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.loadingText}>Analysing ingredients... 🔬</Text>
      </View>
    );
  }

  if (error || !analysis) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const { product, score, score_band, flagged_ingredients, explanation_cards, contributing_factors } = analysis;
  const categoryEmoji = CATEGORY_EMOJIS[product.category ?? ''] ?? '🛒';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Product header */}
      <View style={styles.productHeader}>
        <View style={[styles.categoryIcon, Shadow.sm]}>
          <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.metaRow}>
            {product.brand ? <Text style={styles.brandText}>{product.brand}</Text> : null}
            {product.category ? (
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{product.category}</Text>
              </View>
            ) : null}
          </View>
          {product.barcode ? <Text style={styles.barcode}>{product.barcode}</Text> : null}
        </View>
      </View>

      {/* Score section */}
      <Text style={styles.sectionTitle}>📊 Safety Score</Text>
      <ScoreMeter score={score} band={score_band} />

      {/* Explanation cards */}
      <Text style={styles.sectionTitle}>💡 What This Means</Text>
      {explanation_cards.map((card, i) => (
        <ExplanationCard key={i} card={card} />
      ))}

      {/* Flagged ingredients */}
      {flagged_ingredients.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🚩 Flagged Ingredients</Text>
          <View style={[styles.card, Shadow.sm]}>
            {flagged_ingredients.map((item, i) => (
              <View key={i} style={[styles.flagRow, i > 0 && styles.flagRowBorder]}>
                <View style={styles.flagLeft}>
                  <Text style={styles.flagName}>{item.name}</Text>
                  {item.e_number ? (
                    <View style={styles.eNumPill}>
                      <Text style={styles.eNumText}>{item.e_number}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={[styles.concernDot, { backgroundColor: concernColor(item.concern_level) }]} />
              </View>
            ))}
          </View>
        </>
      )}

      {/* Contributing factors */}
      {contributing_factors.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🔍 Score Factors</Text>
          <View style={[styles.card, Shadow.sm]}>
            {contributing_factors.map((f, i) => (
              <View key={i} style={[styles.factorRow, i > 0 && styles.factorRowBorder]}>
                <Text style={styles.factorBullet}>›</Text>
                <Text style={styles.factorText}>{f}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Full ingredients */}
      {product.raw_ingredients && (
        <>
          <Text style={styles.sectionTitle}>📋 Full Ingredient List</Text>
          <View style={[styles.card, Shadow.sm]}>
            <Text style={styles.rawIngredients}>{product.raw_ingredients}</Text>
          </View>
        </>
      )}

      {/* Alternatives */}
      {recommendations.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>✨ Cleaner Alternatives</Text>
          {recommendations.map((rec) => (
            <TouchableOpacity
              key={rec.id}
              style={[styles.recCard, Shadow.sm]}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: rec.id } })}
              activeOpacity={0.85}
            >
              <Text style={styles.recEmoji}>{CATEGORY_EMOJIS[rec.category ?? ''] ?? '🛒'}</Text>
              <View style={styles.recInfo}>
                <Text style={styles.recName}>{rec.name}</Text>
                {rec.brand ? <Text style={styles.recBrand}>{rec.brand}</Text> : null}
              </View>
              <ScoreBadge score={rec.score} label={rec.score_label} size="sm" />
              <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Add to basket */}
      <TouchableOpacity
        style={[styles.addBtn, Shadow.md]}
        onPress={handleAddToBasket}
        disabled={addingToBasket}
        activeOpacity={0.85}
      >
        {addingToBasket ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.addBtnEmoji}>🛒</Text>
            <Text style={styles.addBtnText}>Add to Basket</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        For informational purposes only. Not medical or nutritional advice.
      </Text>
    </ScrollView>
  );
}

function concernColor(level: number): string {
  if (level >= 3) return Colors.scoreHigh;
  if (level === 2) return Colors.scoreAttention;
  return Colors.scoreModerate;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md },
  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: Spacing.md, padding: Spacing.xl, backgroundColor: Colors.background,
  },
  loadingText: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '700' },
  errorEmoji: { fontSize: 48 },
  errorTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  errorText: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },

  productHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: { fontSize: 34 },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text, lineHeight: 24 },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center', flexWrap: 'wrap' },
  brandText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '700' },
  categoryPill: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  categoryPillText: { fontSize: FontSize.xs, color: '#fff', fontWeight: '900' },
  barcode: { fontSize: FontSize.xs, color: Colors.textSubtle },

  sectionTitle: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },

  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  flagRowBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  flagLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  flagName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  eNumPill: {
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  eNumText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '900' },
  concernDot: { width: 12, height: 12, borderRadius: 6 },

  factorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  factorRowBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  factorBullet: { fontSize: FontSize.lg, color: Colors.primary, fontWeight: '900', lineHeight: 20 },
  factorText: { flex: 1, fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20, fontWeight: '500' },

  rawIngredients: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 22,
    padding: Spacing.md,
    fontWeight: '500',
  },

  recCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recEmoji: { fontSize: 26 },
  recInfo: { flex: 1 },
  recName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text },
  recBrand: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },

  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  addBtnEmoji: { fontSize: 22 },
  addBtnText: { color: '#fff', fontWeight: '900', fontSize: FontSize.lg },
  disclaimer: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
});
