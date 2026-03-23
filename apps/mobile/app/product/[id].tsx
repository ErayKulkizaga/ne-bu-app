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
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { analyzeProduct } from '@/services/analysis';
import { getRecommendations } from '@/services/recommendations';
import { createBasket, addItemToBasket } from '@/services/basket';
import { useBasketStore } from '@/store/basketStore';
import { ScoreMeter } from '@/components/ScoreMeter';
import { ExplanationCard } from '@/components/ExplanationCard';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { AnalysisResult, RecommendationItem } from '@/types/api';

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
    Promise.all([
      analyzeProduct(productId),
      getRecommendations(productId),
    ])
      .then(([analysisData, recsData]) => {
        setAnalysis(analysisData);
        setRecommendations(recsData);
      })
      .catch(() => setError('Could not load product analysis.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToBasket() {
    if (!id) return;
    setAddingToBasket(true);
    try {
      let currentBasketId = basketId;
      if (!currentBasketId) {
        const newBasket = await createBasket({});
        currentBasketId = newBasket.id;
        setBasketId(currentBasketId);
      }
      await addItemToBasket(currentBasketId, { product_id: Number(id) });
      Alert.alert('Added to Basket', `${analysis?.product.name} has been added to your basket.`);
    } catch {
      Alert.alert('Error', 'Could not add to basket. Please try again.');
    } finally {
      setAddingToBasket(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.accent} size="large" />
        <Text style={styles.loadingText}>Analysing ingredients...</Text>
      </View>
    );
  }

  if (error || !analysis) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={40} color={Colors.scoreHigh} />
        <Text style={styles.errorText}>{error ?? 'Something went wrong.'}</Text>
      </View>
    );
  }

  const { product, score, score_band, flagged_ingredients, explanation_cards, contributing_factors } = analysis;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.metaRow}>
            {product.brand ? <Text style={styles.metaText}>{product.brand}</Text> : null}
            {product.brand && product.category ? <Text style={styles.metaDot}>·</Text> : null}
            {product.category ? <Text style={styles.metaText}>{product.category}</Text> : null}
          </View>
          {product.barcode ? <Text style={styles.barcode}>{product.barcode}</Text> : null}
        </View>
        <ScoreBadge score={score} label={score_band.label} size="lg" />
      </View>

      {/* Score meter */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Risk Score</Text>
        <ScoreMeter score={score} band={score_band} />
      </View>

      {/* Explanation cards */}
      {explanation_cards.map((card, i) => (
        <ExplanationCard key={i} card={card} />
      ))}

      {/* Contributing factors */}
      {contributing_factors.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Score Factors</Text>
          {contributing_factors.map((factor, i) => (
            <View key={i} style={styles.factorRow}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.scoreModerate} />
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Flagged ingredients */}
      {flagged_ingredients.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Flagged Ingredients</Text>
          {flagged_ingredients.map((item, i) => (
            <View key={i} style={styles.flagRow}>
              <View style={styles.flagHeader}>
                <Text style={styles.flagName}>{item.name}</Text>
                {item.e_number ? <Text style={styles.eNumber}>{item.e_number}</Text> : null}
              </View>
              <Text style={styles.flagReason}>{item.reason}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Full ingredient list */}
      {product.raw_ingredients && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Full Ingredient List</Text>
          <Text style={styles.rawIngredients}>{product.raw_ingredients}</Text>
        </View>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cleaner Alternatives</Text>
          <Text style={styles.recSubtitle}>
            Products in the same category with a lower score:
          </Text>
          {recommendations.map((rec) => (
            <TouchableOpacity
              key={rec.id}
              style={styles.recCard}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: rec.id } })}
            >
              <View style={styles.recInfo}>
                <Text style={styles.recName}>{rec.name}</Text>
                {rec.brand ? <Text style={styles.recBrand}>{rec.brand}</Text> : null}
              </View>
              <ScoreBadge score={rec.score} label={rec.score_label} />
              <Ionicons name="chevron-forward" size={16} color={Colors.textSubtle} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Add to basket */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={handleAddToBasket}
        disabled={addingToBasket}
      >
        {addingToBasket ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <>
            <Ionicons name="cart-outline" size={20} color={Colors.background} />
            <Text style={styles.addBtnText}>Add to Basket</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Analysis is for informational purposes only and does not constitute medical or nutritional advice.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl },
  loadingText: { color: Colors.textMuted, fontSize: FontSize.sm },
  errorText: { color: Colors.scoreHigh, fontSize: FontSize.md, textAlign: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerText: { flex: 1 },
  productName: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  metaRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  metaText: { fontSize: FontSize.sm, color: Colors.textMuted },
  metaDot: { fontSize: FontSize.sm, color: Colors.textSubtle },
  barcode: { fontSize: FontSize.xs, color: Colors.textSubtle, marginTop: 3, fontFamily: 'monospace' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  factorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  factorText: { flex: 1, fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  flagRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: 4,
  },
  flagHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  flagName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  eNumber: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  flagReason: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  rawIngredients: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  recSubtitle: { fontSize: FontSize.sm, color: Colors.textMuted },
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  recInfo: { flex: 1 },
  recName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  recBrand: { fontSize: FontSize.xs, color: Colors.textMuted },
  addBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  addBtnText: { color: Colors.background, fontWeight: '700', fontSize: FontSize.md },
  disclaimer: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    textAlign: 'center',
    lineHeight: 18,
  },
});
