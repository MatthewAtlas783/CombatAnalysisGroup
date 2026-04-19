import { Box, Text } from 'ink';
import { useStore } from '../store.js';
import { formatNumber, formatRate, formatRelative, pad } from './format.js';

const COLS = {
  player: 22,
  damage: 12,
  dps: 10,
  age: 6,
};

const TOTAL_WIDTH = COLS.player + COLS.damage + COLS.dps + COLS.age;

export function Roster({ now }: { now: number }) {
  const players = useStore(s => s.players);
  const localPlayer = useStore(s => s.player);

  const rows = Object.entries(players)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <Box flexDirection="column">
      <Box>
        <Text dimColor>{pad('player', COLS.player)}</Text>
        <Text dimColor>{pad('damage', COLS.damage, 'right')}</Text>
        <Text dimColor>{pad('dps', COLS.dps, 'right')}</Text>
        <Text dimColor>{pad('age', COLS.age, 'right')}</Text>
      </Box>
      <Text dimColor>{'─'.repeat(TOTAL_WIDTH)}</Text>

      {rows.length === 0 ? (
        <Box marginTop={1}>
          <Text dimColor>no parses received yet.</Text>
        </Box>
      ) : (
        rows.map(row => {
          const isMe = row.name === localPlayer;
          return (
            <Box key={row.name}>
              <Text bold={isMe}>{pad(row.name, COLS.player)}</Text>
              <Text>{pad(formatNumber(row.amount), COLS.damage, 'right')}</Text>
              <Text>{pad(formatRate(row.amount, row.duration), COLS.dps, 'right')}</Text>
              <Text dimColor>{pad(formatRelative(row.updatedAt, now), COLS.age, 'right')}</Text>
            </Box>
          );
        })
      )}
    </Box>
  );
}
