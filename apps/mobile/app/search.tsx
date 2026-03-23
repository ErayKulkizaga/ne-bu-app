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
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { searchProducts } from '@/services/products';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { ProductListItem } from '@/types/api';

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
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.icon} />
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
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSubtle} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={() => runSearch(query)}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.accent} size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={40} color={Colors.textSubtle} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() =>
                router.push({ pathname: '/product/[id]', params: { id: item.id } })
              }
            >
              <View style={styles.resultInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={styles.metaRow}>
                  {item.brand ? (
                    <Text style={styles.metaText}>{item.brand}</Text>
                  ) : null}
                  {item.brand && item.category ? (
                    <Text style={styles.metaDot}>·</Text>
                  ) : null}
                  {item.category ? (
                    <Text style={styles.metaText}>{item.category}</Text>
                  ) : null}
                </View>
                {item.barcode ? (
                  <Text style={styles.barcode}>{item.barcode}</Text>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSubtle} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searched ? (
              <View style={styles.centered}>
                <Ionicons name="search-outline" size={40} color={Colors.textSubtle} />
                <Text style={styles.emptyText}>No products found for "{query}"</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  icon: { marginRight: Spacing.sm },
  input: { flex: 1, color: Colors.text, fontSize: FontSize.md, paddingVertical: 11 },
  searchBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  searchBtnText: { color: Colors.background, fontWeight: '700', fontSize: FontSize.sm },
  listContent: { padding: Spacing.md, gap: Spacing.sm },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  errorText: { color: Colors.scoreHigh, fontSize: FontSize.sm, textAlign: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultInfo: { flex: 1 },
  productName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 4 },
  metaText: { fontSize: FontSize.sm, color: Colors.textMuted },
  metaDot: { fontSize: FontSize.sm, color: Colors.textSubtle },
  barcode: { fontSize: FontSize.xs, color: Colors.textSubtle, marginTop: 3, fontFamily: 'monospace' },
});
