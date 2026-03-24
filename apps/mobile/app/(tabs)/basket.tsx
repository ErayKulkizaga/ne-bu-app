import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { useBasketStore } from '@/store/basketStore';
import { getBasketSummary } from '@/services/basket';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { BasketSummary } from '@/types/api';

function scoreEmoji(score: number): string {
  if (score <= 20) return '🥦';
  if (score <= 40) return '👍';
  if (score <= 60) return '🤔';
  if (score <= 80) return '⚠️';
  return '🚨';
}

export default function BasketScreen() {
  const router = useRouter();
  const { basketId } = useBasketStore();
  const [summary, setSummary] = useState<BasketSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!basketId) return;
    setLoading(true);
    getBasketSummary(basketId)
      .then(setSummary)
      .catch(() => setError('Could not load basket.'))
      .finally(() => setLoading(false));
  }, [basketId]);

  if (!basketId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.bigEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your basket is empty</Text>
        <Text style={styles.emptyText}>Search for a product and add it to your basket to see your overall score.</Text>
        <TouchableOpacity style={[styles.ctaBtn, Shadow.md]} onPress={() => router.push('/')}>
          <Text style={styles.ctaBtnText}>Start Browsing 🔍</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.loadingText}>Loading basket...</Text>
      </View>
    );
  }

  if (error || !summary) {
    return (
      <View style={styles.centered}>
        <Text style={styles.bigEmoji}>😕</Text>
        <Text style={styles.errorText}>{error ?? 'Something went wrong.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={summary.items}
        keyExtractor={(item) => String(item.product_id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Summary card */}
            <View style={[styles.summaryCard, Shadow.md]}>
              <Text style={styles.summaryEmoji}>{scoreEmoji(summary.average_score)}</Text>
              <Text style={styles.summaryTitle}>Basket Score</Text>
              <Text style={styles.summaryScore}>{summary.average_score.toFixed(0)}</Text>
              <View style={[styles.overallPill, { backgroundColor: overallColor(summary.average_score) }]}>
                <Text style={styles.overallPillText}>{summary.overall_label}</Text>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{summary.item_count}</Text>
                  <Text style={styles.statLabel}>Products</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{summary.average_score.toFixed(0)}</Text>
                  <Text style={styles.statLabel}>Avg Score</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {summary.items.filter(i => i.score <= 20).length}
                  </Text>
                  <Text style={styles.statLabel}>Clean</Text>
                </View>
              </View>
            </View>

            {/* Summary text */}
            <View style={[styles.summaryTextCard, Shadow.sm]}>
              <Text style={styles.summaryTextEmoji}>💬</Text>
              <Text style={styles.summaryText}>{summary.summary_text}</Text>
            </View>

            <Text style={styles.sectionTitle}>🛒 Your Products</Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.itemCard, Shadow.sm]}
            onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.product_id } })}
            activeOpacity={0.85}
          >
            <Text style={styles.itemEmoji}>{scoreEmoji(item.score)}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.product_name}</Text>
              {item.brand ? <Text style={styles.itemBrand}>{item.brand}</Text> : null}
            </View>
            <ScoreBadge score={item.score} label={item.score_label} size="sm" />
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function overallColor(score: number): string {
  if (score <= 20) return '#58CC02';
  if (score <= 40) return '#89E219';
  if (score <= 60) return '#FFC800';
  if (score <= 80) return '#FF9600';
  return '#FF4B4B';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },
  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: Spacing.xl, gap: Spacing.md, backgroundColor: Colors.background,
  },
  bigEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
  loadingText: { color: Colors.textMuted, fontWeight: '700' },
  errorText: { fontSize: FontSize.md, color: Colors.scoreHigh, textAlign: 'center' },
  ctaBtn: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  ctaBtnText: { color: '#fff', fontWeight: '900', fontSize: FontSize.md },

  summaryCard: {
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    marginBottom: Spacing.sm,
  },
  summaryEmoji: { fontSize: 48 },
  summaryTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textMuted },
  summaryScore: { fontSize: 72, fontWeight: '900', color: Colors.primary, lineHeight: 80 },
  overallPill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  overallPillText: { color: '#fff', fontWeight: '900', fontSize: FontSize.md },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: '100%',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '700' },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  summaryTextCard: {
    backgroundColor: Colors.accentSurface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: '#FFE082',
    marginBottom: Spacing.sm,
  },
  summaryTextEmoji: { fontSize: 20 },
  summaryText: { flex: 1, fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20, fontWeight: '500' },

  sectionTitle: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  itemCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  itemEmoji: { fontSize: 26 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  itemBrand: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  chevron: { fontSize: FontSize.xl, color: Colors.primary, fontWeight: '900' },
});
