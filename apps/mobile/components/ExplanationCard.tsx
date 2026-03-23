import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { ExplanationCardData } from '@/types/api';

interface Props {
  card: ExplanationCardData;
}

const SEVERITY_CONFIG = {
  info: { icon: 'information-circle-outline', color: Colors.severityInfo, bg: '#0c2a3a' },
  caution: { icon: 'warning-outline', color: Colors.severityCaution, bg: '#2a2200' },
  warning: { icon: 'alert-circle-outline', color: Colors.severityWarning, bg: '#2a0a0a' },
} as const;

export function ExplanationCard({ card }: Props) {
  const config = SEVERITY_CONFIG[card.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.info;

  return (
    <View style={[styles.card, { backgroundColor: config.bg, borderColor: config.color }]}>
      <View style={styles.header}>
        <Ionicons
          name={config.icon as React.ComponentProps<typeof Ionicons>['name']}
          size={18}
          color={config.color}
        />
        <Text style={[styles.title, { color: config.color }]}>{card.title}</Text>
      </View>
      <Text style={styles.body}>{card.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: { fontSize: FontSize.sm, fontWeight: '700', flex: 1 },
  body: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
});
