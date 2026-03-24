import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { ExplanationCardData } from '@/types/api';

interface Props {
  card: ExplanationCardData;
}

const SEVERITY_CONFIG = {
  info: {
    emoji: 'ℹ️',
    color: Colors.severityInfo,
    bg: '#E8F7FE',
    border: '#B3E5FC',
  },
  caution: {
    emoji: '⚠️',
    color: Colors.severityCaution,
    bg: Colors.accentSurface,
    border: '#FFE082',
  },
  warning: {
    emoji: '🚨',
    color: Colors.severityWarning,
    bg: '#FFEBEB',
    border: '#FFCDD2',
  },
} as const;

export function ExplanationCard({ card }: Props) {
  const config = SEVERITY_CONFIG[card.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.info;

  return (
    <View style={[styles.card, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{config.emoji}</Text>
        <Text style={[styles.title, { color: config.color }]}>{card.title}</Text>
      </View>
      <Text style={styles.body}>{card.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  emoji: { fontSize: 20 },
  title: { fontSize: FontSize.md, fontWeight: '800', flex: 1 },
  body: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20, fontWeight: '500' },
});
