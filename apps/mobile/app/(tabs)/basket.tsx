import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { useBasketStore } from '@/store/basketStore';
import { getBasketSummary } from '@/services/basket';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { BasketSummary } from '@/types/api';

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
        <Ionicons name="cart-outline" size={48} color={Colors.textSubtle} />
        <Text style={styles.emptyTitle}>Your basket is empty</Text>
        <Text style={styles.emptyText}>Search for a product and add it to your basket.</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/')}>
          <Text style={styles.ctaBtnText}>Start Browsing</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  if (error || !summary) {
    return (
      <View style={styles.centered}>
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
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Basket Summary</Text>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.statLabel}>Products</Text>
                <Text style={styles.statValue}>{summary.item_count}</Text>
              </View>
              <View style={styles.divider} />
              <View>
                <Text style={styles.statLabel}>Avg. Score</Text>
                <Text style={styles.statValue}>{summary.average_score.toFixed(0)}/100</Text>
              </View>
              <View style={styles.divider} />
              <View>
                <Text style={styles.statLabel}>Overall</Text>
                <Text style={[styles.statValue, styles.statAccent]}>{summary.overall_label}</Text>
              </View>
            </View>
            <Text style={styles.summaryText}>{summary.summary_text}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.product_id } })}
          >
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.product_name}</Text>
              {item.brand ? <Text style={styles.itemBrand}>{item.brand}</Text> : null}
            </View>
            <ScoreBadge score={item.score} label={item.score_label} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No items in basket.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xxl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  errorText: { fontSize: FontSize.md, color: Colors.scoreHigh, textAlign: 'center' },
  ctaBtn: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  ctaBtnText: { color: Colors.background, fontWeight: '700' },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  summaryTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  divider: { width: 1, height: 32, backgroundColor: Colors.border },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 2 },
  statValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  statAccent: { color: Colors.accent },
  summaryText: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: { flex: 1, marginRight: Spacing.md },
  itemName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  itemBrand: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
});
