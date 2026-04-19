import { Box, Text, useApp, useInput } from 'ink';
import { useEffect, useState } from 'react';
import { StatusBlock } from './StatusBlock.js';
import { Roster } from './Roster.js';
import { LogPane } from './LogPane.js';

export function App({ relayUrl, onReconnect }: { relayUrl: string; onReconnect: () => void }) {
  const { exit } = useApp();
  const [now, setNow] = useState(Date.now());
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useInput((input, key) => {
    if (key.ctrl && input === 'c') exit();
    if (input === 'q') exit();
    if (input === 'r') onReconnect();
    if (input === 'l') setShowLog(s => !s);
  });

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box>
        <Text bold>combat-analysis-group</Text>
        <Text dimColor>  ·  companion</Text>
      </Box>

      <StatusBlock relayUrl={relayUrl} now={now} />

      <Roster now={now} />

      {showLog && <LogPane />}

      <Box marginTop={1}>
        <Text dimColor>q quit  ·  r reconnect  ·  l {showLog ? 'hide log' : 'show log'}</Text>
      </Box>
    </Box>
  );
}
