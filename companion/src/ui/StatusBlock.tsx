import { Box, Text } from 'ink';
import { useStore } from '../store.js';
import { abbreviatePath, formatNumber, formatRelative } from './format.js';

const LABEL_WIDTH = 10;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Box width={LABEL_WIDTH}>
        <Text dimColor>{label}</Text>
      </Box>
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
}

function statusColor(status: string): { color?: string; dim?: boolean } {
  switch (status) {
    case 'connected': return { color: 'green' };
    case 'connecting': return { color: 'yellow' };
    case 'reconnecting': return { color: 'yellow' };
    case 'closed': return { dim: true };
    case 'idle': return { dim: true };
    default: return {};
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'connected': return 'connected';
    case 'connecting': return 'connecting';
    case 'reconnecting': return 'reconnecting';
    case 'closed': return 'closed';
    case 'idle': return 'idle';
    default: return status;
  }
}

export function StatusBlock({ relayUrl, now }: { relayUrl: string; now: number }) {
  const status = useStore(s => s.relayStatus);
  const detail = useStore(s => s.relayDetail);
  const reconnectAt = useStore(s => s.reconnectAt);
  const room = useStore(s => s.room);
  const joined = useStore(s => s.joined);
  const player = useStore(s => s.player);
  const local = useStore(s => s.local);
  const outputPath = useStore(s => s.outputPath);
  const inputPath = useStore(s => s.inputPath);

  const colorProps = statusColor(status);
  const reconnectIn = reconnectAt ? Math.max(0, Math.round((reconnectAt - now) / 1000)) : undefined;

  return (
    <Box flexDirection="column" marginY={1}>
      <Row label="relay">
        <Box>
          <Text {...colorProps}>{statusLabel(status)}</Text>
          <Text dimColor>  {relayUrl}</Text>
          {status === 'reconnecting' && reconnectIn !== undefined && (
            <Text dimColor>  · retry in {reconnectIn}s</Text>
          )}
          {detail && status !== 'connected' && (
            <Text color="red">  · {detail}</Text>
          )}
        </Box>
      </Row>

      <Row label="room">
        {room ? (
          <Box>
            <Text>{room}</Text>
            <Text dimColor>  {joined ? 'joined' : 'pending'}</Text>
          </Box>
        ) : (
          <Text dimColor>not configured</Text>
        )}
      </Row>

      <Row label="local">
        {player ? (
          <Box>
            <Text>{player}</Text>
            {local ? (
              <Text dimColor>
                {'  '}
                {formatNumber(local.amount)} dmg · last update {formatRelative(local.updatedAt, now)} ago
              </Text>
            ) : (
              <Text dimColor>  waiting for plugin to publish stats</Text>
            )}
          </Box>
        ) : (
          <Text dimColor>character unknown — set CAG_PLAYER or wait for plugin</Text>
        )}
      </Row>

      <Row label="reads">
        <Text dimColor>{inputPath ? abbreviatePath(inputPath, 70) : '–'}</Text>
      </Row>

      <Row label="writes">
        <Text dimColor>{outputPath ? abbreviatePath(outputPath, 70) : '–'}</Text>
      </Row>
    </Box>
  );
}
