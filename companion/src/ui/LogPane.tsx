import { Box, Text } from 'ink';
import { useStore } from '../store.js';

const LEVEL_COLOR: Record<string, string | undefined> = {
  info: undefined,
  warn: 'yellow',
  error: 'red',
};

function ts(ms: number): string {
  const d = new Date(ms);
  return d.toTimeString().slice(0, 8);
}

export function LogPane({ rows = 8 }: { rows?: number }) {
  const log = useStore(s => s.log);
  const tail = log.slice(-rows);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text dimColor>recent events</Text>
      {tail.length === 0 ? (
        <Text dimColor>  –</Text>
      ) : (
        tail.map((entry, i) => (
          <Box key={i}>
            <Text dimColor>{ts(entry.ts)}  </Text>
            <Text color={LEVEL_COLOR[entry.level]}>{entry.message}</Text>
          </Box>
        ))
      )}
    </Box>
  );
}
