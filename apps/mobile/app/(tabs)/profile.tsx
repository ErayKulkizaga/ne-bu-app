import { View, Text, Switch, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';

const PREFS = [
  { key: 'avoid_artificial_colours', emoji: '🎨', label: 'No Artificial Colours', desc: 'Flag products with synthetic dyes.' },
  { key: 'avoid_sweeteners', emoji: '🍬', label: 'No Artificial Sweeteners', desc: 'Flag aspartame, sucralose and similar.' },
  { key: 'low_sugar', emoji: '🍭', label: 'Low Sugar Focus', desc: 'Highlight multiple added sugar sources.' },
  { key: 'avoid_preservatives', emoji: '🧪', label: 'Flag Preservatives', desc: 'Show warnings for common preservatives.' },
  { key: 'vegan', emoji: '🌱', label: 'Vegan Mode', desc: 'Flag non-vegan additives like carmine (E120).' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Avatar section */}
      <View style={[styles.profileCard, Shadow.md]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🥗</Text>
        </View>
        <Text style={styles.profileName}>Health Explorer</Text>
        <View style={styles.xpRow}>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>🔥 0 scans</Text>
          </View>
          <View style={[styles.xpBadge, styles.xpGreen]}>
            <Text style={styles.xpText}>⭐ Level 1</Text>
          </View>
        </View>
      </View>

      {/* Coming soon banner */}
      <View style={[styles.comingSoonBanner, Shadow.sm]}>
        <Text style={styles.comingSoonEmoji}>🚀</Text>
        <View style={styles.comingSoonText}>
          <Text style={styles.comingSoonTitle}>Personalisation Coming Soon!</Text>
          <Text style={styles.comingSoonDesc}>
            These settings will adjust your product scores based on your dietary preferences.
          </Text>
        </View>
      </View>

      {/* Preferences */}
      <Text style={styles.sectionTitle}>🎯 My Preferences</Text>
      <View style={[styles.prefsCard, Shadow.sm]}>
        {PREFS.map((pref, i) => (
          <View key={pref.key} style={[styles.prefRow, i < PREFS.length - 1 && styles.prefBorder]}>
            <Text style={styles.prefEmoji}>{pref.emoji}</Text>
            <View style={styles.prefInfo}>
              <Text style={styles.prefLabel}>{pref.label}</Text>
              <Text style={styles.prefDesc}>{pref.desc}</Text>
            </View>
            <Switch
              value={false}
              disabled
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.background}
            />
          </View>
        ))}
      </View>

      {/* About section */}
      <Text style={styles.sectionTitle}>ℹ️ About NeBU</Text>
      <View style={[styles.aboutCard, Shadow.sm]}>
        <Text style={styles.aboutText}>
          NeBU is an informational tool for curious consumers. It analyses ingredient lists and provides
          a risk score based on food additive data. It does <Text style={styles.bold}>not</Text> provide
          medical or nutritional advice.
        </Text>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.aboutRow}>
          <Text style={styles.aboutRowEmoji}>📄</Text>
          <Text style={styles.aboutRowText}>Privacy Policy</Text>
          <Text style={styles.aboutRowChevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.aboutRow}>
          <Text style={styles.aboutRowEmoji}>⭐</Text>
          <Text style={styles.aboutRowText}>Rate the App</Text>
          <Text style={styles.aboutRowChevron}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>NeBU v0.1.0 — MVP</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },

  profileCard: {
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 40 },
  profileName: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  xpRow: { flexDirection: 'row', gap: Spacing.sm },
  xpBadge: {
    backgroundColor: Colors.accentSurface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  xpGreen: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  xpText: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text },

  comingSoonBanner: {
    backgroundColor: Colors.accentSurface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  comingSoonEmoji: { fontSize: 28 },
  comingSoonText: { flex: 1, gap: 2 },
  comingSoonTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text },
  comingSoonDesc: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20, fontWeight: '500' },

  sectionTitle: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  prefsCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  prefRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  prefBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  prefEmoji: { fontSize: 24 },
  prefInfo: { flex: 1 },
  prefLabel: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textMuted },
  prefDesc: { fontSize: FontSize.xs, color: Colors.textSubtle, marginTop: 2, fontWeight: '500' },

  aboutCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  aboutText: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20, fontWeight: '500' },
  bold: { fontWeight: '900', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xs },
  aboutRowEmoji: { fontSize: 20 },
  aboutRowText: { flex: 1, fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  aboutRowChevron: { fontSize: FontSize.xl, color: Colors.primary, fontWeight: '900' },

  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textSubtle, fontWeight: '600' },
});
