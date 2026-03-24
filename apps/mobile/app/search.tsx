import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { searchProducts } from '@/services/products';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { ProductListItem } from '@/types/api';

const CATEGORY_EMOJIS: Record<string, string> = {
  Snacks: '🍟',
  Dairy: '🥛',
  Beverages: '🥤',
  Biscuits: '🍪',
  Spreads: '🫙',
  'Snack Bars': '🍫',
};

export default function SearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(q ?? '');
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (q) runSearch(q);
  }, []);

  async function runSearch(term: string) {
    if (!term.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchProducts(term.trim());
      setResults(data);
    } catch {
      setError('Could not reach the server. Please check your connection.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <View style={[styles.inputWrapper, Shadow.sm]}>
          <Ionicons name="search" size={20} color={Colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Product name or barcode..."
            placeholderTextColor={Colors.textSubtle}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => runSearch(query)}
            returnKeyType="search"
            autoFocus={!q}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <Ionicons name="close-circle" size={20} color={Colors.textSubtle} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={() => runSearch(query)}>
          <Text style={styles.searchBtnText}>GO</Text>
        </TouchableOpacity>
      </View>

      {/* Results count */}
      {searched && !loading && (
        <View style={styles.resultsMeta}>
          <Text style={styles.resultsCount}>
            {results.length > 0 ? `${results.length} products found` : 'No products found'}
          </Text>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorEmoji}>📡</Text>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultCard, Shadow.sm]}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
              activeOpacity={0.85}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.categoryEmoji}>
                  {CATEGORY_EMOJIS[item.category ?? ''] ?? '🛒'}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.metaRow}>
                  {item.brand ? <Text style={styles.metaText}>{item.brand}</Text> : null}
                  {item.brand && item.category ? <Text style={styles.metaDot}>·</Text> : null}
                  {item.category ? <Text style={styles.metaChip}>{item.category}</Text> : null}
                </View>
                {item.barcode ? <Text style={styles.barcode}>{item.barcode}</Text> : null}
              </View>
              <View style={styles.cardRight}>
                <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searched ? (
              <View style={styles.centered}>
                <Text style={styles.errorEmoji}>🔍</Text>
                <Text style={styles.errorTitle}>Nothing found</Text>
                <Text style={styles.errorText}>Try a different product name or barcode.</Text>
              </View>
            ) : (
              <View style={styles.centered}>
                <Text style={styles.errorEmoji}>👆</Text>
                <Text style={styles.errorTitle}>Search for a product</Text>
                <Text style={styles.errorText}>Type a product name or barcode above.</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.primarySurface,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryLight,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: { flex: 1, color: Colors.text, fontSize: FontSize.md, paddingVertical: 11, fontWeight: '600' },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    height: 48,
  },
  searchBtnText: { color: '#fff', fontWeight: '900', fontSize: FontSize.sm, letterSpacing: 1 },
  resultsMeta: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  resultsCount: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted },
  listContent: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xxl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
    marginTop: 60,
  },
  loadingText: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '600' },
  errorEmoji: { fontSize: 48 },
  errorTitle: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  errorText: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center', fontWeight: '500' },
  resultCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardLeft: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: { fontSize: 26 },
  cardInfo: { flex: 1 },
  productName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4, flexWrap: 'wrap' },
  metaText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  metaDot: { fontSize: FontSize.sm, color: Colors.textSubtle },
  metaChip: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barcode: { fontSize: FontSize.xs, color: Colors.textSubtle, marginTop: 3 },
  cardRight: {},
});
