import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing, Shadow } from '@/constants/theme';
import type { ScoreBand } from '@/types/api';

interface Props {
  score: number;
  band: ScoreBand;
}

function getColor(score: number): string {
  if (score <= 20) return Colors.scoreClean;
  if (score <= 40) return Colors.scoreLow;
  if (score <= 60) return Colors.scoreModerate;
  if (score <= 80) return Colors.scoreAttention;
  return Colors.scoreHigh;
}

function getBg(score: number): string {
  if (score <= 20) return '#F0FBE3';
  if (score <= 40) return '#F4FCE3';
  if (score <= 60) return '#FFF8E1';
  if (score <= 80) return '#FFF3E0';
  return '#FFEBEB';
}

function getEmoji(score: number): string {
  if (score <= 20) return '🥦';
  if (score <= 40) return '👍';
  if (score <= 60) return '🤔';
  if (score <= 80) return '⚠️';
  return '🚨';
}

export function ScoreMeter({ score, band }: Props) {
  const fillPercent = Math.min(Math.max(score, 0), 100);
  const color = getColor(score);
  const bg = getBg(score);

  return (
    <View style={[styles.container, { backgroundColor: bg }, Shadow.sm]}>
      <View style={styles.topRow}>
        <Text style={styles.emoji}>{getEmoji(score)}</Text>
        <View style={styles.scoreBlock}>
          <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <View style={[styles.bandPill, { backgroundColor: color }]}>
          <Text style={styles.bandLabel}>{band.label}</Text>
        </View>
      </View>

      {/* Progress track */}
      <View style={styles.track}>
        {/* Gradient-like segmented background */}
        <View style={styles.trackSegments}>
          {[Colors.scoreClean, Colors.scoreLow, Colors.scoreModerate, Colors.scoreAttention, Colors.scoreHigh].map((c, i) => (
            <View key={i} style={[styles.segment, { backgroundColor: c, opacity: 0.25 }]} />
          ))}
        </View>
        <View style={[styles.fill, { width: `${fillPercent}%`, backgroundColor: color }]} />
        {/* Thumb */}
        <View style={[styles.thumb, { left: `${fillPercent}%`, backgroundColor: color, borderColor: '#fff' }]} />
      </View>

      <Text style={styles.description}>{band.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  emoji: { fontSize: 36 },
  scoreBlock: { flexDirection: 'row', alignItems: 'baseline', gap: 2, flex: 1 },
  scoreNumber: { fontSize: FontSize.hero, fontWeight: '900', lineHeight: 44 },
  scoreMax: { fontSize: FontSize.md, color: Colors.textMuted, fontWeight: '700' },
  bandPill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  bandLabel: { color: '#fff', fontSize: FontSize.xs, fontWeight: '900' },
  track: {
    height: 14,
    borderRadius: Radius.full,
    overflow: 'visible',
    backgroundColor: Colors.border,
    position: 'relative',
  },
  trackSegments: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  segment: { flex: 1 },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: Radius.full,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: -3,
    marginLeft: -10,
    borderWidth: 3,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
    fontWeight: '500',
  },
});
