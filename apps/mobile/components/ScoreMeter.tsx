import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { ScoreBand } from '@/types/api';

interface Props {
  score: number;
  band: ScoreBand;
}

const BAND_STOPS = [
  { max: 20, color: Colors.scoreClean },
  { max: 40, color: Colors.scoreLow },
  { max: 60, color: Colors.scoreModerate },
  { max: 80, color: Colors.scoreAttention },
  { max: 100, color: Colors.scoreHigh },
];

function getColor(score: number): string {
  return BAND_STOPS.find((b) => score <= b.max)?.color ?? Colors.scoreHigh;
}

export function ScoreMeter({ score, band }: Props) {
  const fillPercent = Math.min(Math.max(score, 0), 100);
  const color = getColor(score);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={styles.outOf}>/100</Text>
        <Text style={[styles.label, { color }]}>{band.label}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fillPercent}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.description}>{band.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs },
  score: { fontSize: FontSize.hero, fontWeight: '800' },
  outOf: { fontSize: FontSize.md, color: Colors.textMuted, marginRight: Spacing.sm },
  label: { fontSize: FontSize.md, fontWeight: '700' },
  track: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  description: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
});
