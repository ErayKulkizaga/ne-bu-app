import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

interface Props {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

function scoreColor(score: number): string {
  if (score <= 20) return Colors.scoreClean;
  if (score <= 40) return Colors.scoreLow;
  if (score <= 60) return Colors.scoreModerate;
  if (score <= 80) return Colors.scoreAttention;
  return Colors.scoreHigh;
}

export function ScoreBadge({ score, label, size = 'md' }: Props) {
  const color = scoreColor(score);
  const isLarge = size === 'lg';

  return (
    <View style={[styles.badge, { borderColor: color }, isLarge && styles.badgeLg]}>
      <Text style={[styles.number, { color }, isLarge && styles.numberLg]}>{score}</Text>
      <Text style={[styles.label, { color }, isLarge && styles.labelLg]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 56,
  },
  badgeLg: { minWidth: 70, paddingVertical: Spacing.sm },
  number: { fontSize: FontSize.lg, fontWeight: '800' },
  numberLg: { fontSize: FontSize.xxl },
  label: { fontSize: FontSize.xs, fontWeight: '600', textAlign: 'center' },
  labelLg: { fontSize: FontSize.sm },
});
