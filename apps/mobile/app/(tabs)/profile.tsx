import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

type Preference = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

const PLACEHOLDER_PREFERENCES: Preference[] = [
  { key: 'avoid_artificial_colours', label: 'Avoid Artificial Colours', description: 'Flag products containing synthetic dyes.', enabled: false },
  { key: 'avoid_artificial_sweeteners', label: 'Avoid Artificial Sweeteners', description: 'Increase score for products with aspartame, sucralose, etc.', enabled: false },
  { key: 'low_sugar', label: 'Low Sugar Focus', description: 'Highlight multiple added sugar sources.', enabled: false },
  { key: 'avoid_preservatives', label: 'Flag Preservatives', description: 'Show warning when common preservatives are found.', enabled: false },
  { key: 'vegan', label: 'Vegan Mode', description: 'Flag non-vegan ingredients such as carmine (E120).', enabled: false },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
        <Text style={styles.sectionSubtitle}>
          These preferences will influence how scores are calculated and which ingredients are flagged.
          Sensitivity settings do not constitute medical advice.
        </Text>
        <Text style={styles.comingSoonBadge}>Coming in a future update</Text>
      </View>

      <View style={styles.prefsCard}>
        {PLACEHOLDER_PREFERENCES.map((pref, index) => (
          <View
            key={pref.key}
            style={[styles.prefRow, index < PLACEHOLDER_PREFERENCES.length - 1 && styles.prefRowBorder]}
          >
            <View style={styles.prefInfo}>
              <Text style={styles.prefLabel}>{pref.label}</Text>
              <Text style={styles.prefDesc}>{pref.description}</Text>
            </View>
            <Switch
              value={pref.enabled}
              disabled
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.text}
            />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          NeBU is an informational tool only. Nothing in this app constitutes medical, nutritional, or
          dietary advice. Always consult a qualified health professional for personal guidance.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  section: { gap: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  sectionSubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  prefsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  prefRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  prefInfo: { flex: 1 },
  prefLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textMuted },
  prefDesc: { fontSize: FontSize.xs, color: Colors.textSubtle, marginTop: 2 },
  footer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  footerText: { fontSize: FontSize.xs, color: Colors.textSubtle, lineHeight: 18, textAlign: 'center' },
});
