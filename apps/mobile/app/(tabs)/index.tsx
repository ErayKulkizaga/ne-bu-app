import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';

const QUICK_SEARCHES = ['Chips', 'Yoghurt', 'Energy Drink', 'Biscuits', 'Granola'];

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch() {
    if (query.trim()) {
      router.push({ pathname: '/search', params: { q: query.trim() } });
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day! 👋</Text>
          <Text style={styles.brandName}>NeBU</Text>
          <Text style={styles.tagline}>Know what's in your food.</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>NEW</Text>
        </View>
      </View>

      {/* Hero card */}
      <View style={[styles.heroCard, Shadow.md]}>
        <Text style={styles.heroEmoji}>🔍</Text>
        <Text style={styles.heroTitle}>Scan any product</Text>
        <Text style={styles.heroSubtitle}>
          Search by name or barcode to instantly analyse ingredients and get a safety score.
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchInputWrapper, Shadow.sm]}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.textSubtle}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSubtle} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>GO</Text>
        </TouchableOpacity>
      </View>

      {/* Quick search chips */}
      <View style={styles.chipsRow}>
        {QUICK_SEARCHES.map((term) => (
          <TouchableOpacity
            key={term}
            style={styles.chip}
            onPress={() => router.push({ pathname: '/search', params: { q: term } })}
          >
            <Text style={styles.chipText}>{term}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action cards */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardGreen, Shadow.sm]}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.actionEmoji}>📷</Text>
          <Text style={styles.actionLabel}>Barcode</Text>
          <Text style={styles.actionSub}>Enter manually</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, styles.actionCardYellow, Shadow.sm]}>
          <Text style={styles.actionEmoji}>📸</Text>
          <Text style={styles.actionLabel}>Scan Label</Text>
          <View style={styles.soonPill}>
            <Text style={styles.soonText}>Soon</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent scans */}
      <Text style={styles.sectionTitle}>Recent Scans</Text>
      <View style={[styles.emptyCard, Shadow.sm]}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>No scans yet</Text>
        <Text style={styles.emptyText}>Search for a product to get started!</Text>
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.emptyBtnText}>Start Scanning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.primarySurface,
  },
  greeting: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  brandName: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -1,
    lineHeight: 44,
  },
  tagline: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600', marginTop: 2 },
  streakBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    ...Shadow.sm,
  },
  streakEmoji: { fontSize: 22 },
  streakText: { fontSize: FontSize.xs, fontWeight: '900', color: Colors.text },

  heroCard: {
    margin: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  heroEmoji: { fontSize: 40, marginBottom: Spacing.sm },
  heroTitle: { fontSize: FontSize.xl, fontWeight: '900', color: '#fff', textAlign: 'center' },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
  },

  searchSection: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.text, paddingVertical: 12 },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 56,
    height: 48,
  },
  searchBtnText: { color: '#fff', fontWeight: '900', fontSize: FontSize.sm, letterSpacing: 1 },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted },

  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionCardGreen: { backgroundColor: Colors.primarySurface, borderWidth: 2, borderColor: Colors.primaryLight },
  actionCardYellow: { backgroundColor: Colors.accentSurface, borderWidth: 2, borderColor: Colors.accent },
  actionEmoji: { fontSize: 32 },
  actionLabel: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  actionSub: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  soonPill: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  soonText: { fontSize: FontSize.xs, fontWeight: '900', color: Colors.text },

  emptyCard: {
    margin: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  emptyBtn: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  emptyBtnText: { color: '#fff', fontWeight: '900', fontSize: FontSize.md },
});
