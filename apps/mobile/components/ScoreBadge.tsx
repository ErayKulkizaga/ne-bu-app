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

function scoreBg(score: number): string {
  if (score <= 20) return '#F0FBE3';
  if (score <= 40) return '#F4FCE3';
  if (score <= 60) return '#FFF8E1';
  if (score <= 80) return '#FFF3E0';
  return '#FFEBEB';
}

function scoreEmoji(score: number): string {
  if (score <= 20) return '🟢';
  if (score <= 40) return '🟡';
  if (score <= 60) return '🟠';
  if (score <= 80) return '🔴';
  return '☠️';
}

export function ScoreBadge({ score, label, size = 'md' }: Props) {
  const color = scoreColor(score);
  const bg = scoreBg(score);
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: color }, isLg && styles.badgeLg, isSm && styles.badgeSm]}>
      {!isSm && <Text style={isLg ? styles.emojiLg : styles.emoji}>{scoreEmoji(score)}</Text>}
      <Text style={[styles.number, { color }, isLg && styles.numberLg, isSm && styles.numberSm]}>{score}</Text>
      {!isSm && <Text style={[styles.label, { color }, isLg && styles.labelLg]}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    minWidth: 64,
    gap: 2,
  },
  badgeLg: { minWidth: 90, paddingVertical: Spacing.md, borderRadius: Radius.xl, gap: 4 },
  badgeSm: { minWidth: 40, paddingHorizontal: Spacing.xs, paddingVertical: Spacing.xs, borderRadius: Radius.md },
  emoji: { fontSize: 18 },
  emojiLg: { fontSize: 28 },
  number: { fontSize: FontSize.lg, fontWeight: '900' },
  numberLg: { fontSize: FontSize.xxl },
  numberSm: { fontSize: FontSize.sm, fontWeight: '900' },
  label: { fontSize: FontSize.xs, fontWeight: '800', textAlign: 'center' },
  labelLg: { fontSize: FontSize.sm },
});
