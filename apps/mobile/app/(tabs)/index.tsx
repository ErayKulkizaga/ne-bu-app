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
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch() {
    if (query.trim()) {
      router.push({ pathname: '/search', params: { q: query.trim() } });
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.brandName}>NeBU</Text>
        <Text style={styles.tagline}>Know what's in your food.</Text>
        <Text style={styles.subtitle}>
          Search any product to see its ingredient breakdown, risk score, and cleaner alternatives.
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or barcode..."
            placeholderTextColor={Colors.textSubtle}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/search')}>
          <Ionicons name="barcode-outline" size={28} color={Colors.accent} />
          <Text style={styles.actionLabel}>Barcode Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, styles.actionDisabled]}>
          <Ionicons name="camera-outline" size={28} color={Colors.textSubtle} />
          <Text style={[styles.actionLabel, styles.actionLabelDisabled]}>Scan Label</Text>
          <Text style={styles.comingSoon}>Coming soon</Text>
        </TouchableOpacity>
      </View>

      {/* Recent scans placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="time-outline" size={32} color={Colors.textSubtle} />
          <Text style={styles.emptyText}>No recent scans yet.</Text>
          <Text style={styles.emptySubText}>Search for a product above to get started.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  hero: { paddingTop: Spacing.xxl, paddingBottom: Spacing.xl, alignItems: 'center' },
  brandName: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  searchRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: { flex: 1, color: Colors.text, fontSize: FontSize.md, paddingVertical: 12 },
  searchBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  searchBtnText: { color: Colors.background, fontWeight: '700', fontSize: FontSize.md },
  actionsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionDisabled: { opacity: 0.5 },
  actionLabel: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  actionLabelDisabled: { color: Colors.textSubtle },
  comingSoon: { fontSize: FontSize.xs, color: Colors.textSubtle },
  section: { gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, fontWeight: '600' },
  emptySubText: { fontSize: FontSize.sm, color: Colors.textSubtle, textAlign: 'center' },
});
