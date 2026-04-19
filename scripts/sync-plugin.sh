#!/usr/bin/env bash
# Mirror the repo's plugin/ directory into the live LOTRO Plugins/TumbaAnalysis/
# folder so in-game reloads pick up your latest edits without a manual copy.
# Safe to re-run; it overwrites but does not delete unrelated files.
#
# Usage: bash scripts/sync-plugin.sh
# Override target path with: LOTRO_PLUGINS_DIR=/path/to/Plugins bash scripts/sync-plugin.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC="$REPO_DIR/plugin"

DEFAULT_TARGET="/c/Users/matto/OneDrive/Documents/The Lord of the Rings Online/Plugins/TumbaAnalysis"
TARGET="${LOTRO_PLUGINS_DIR:-$DEFAULT_TARGET}"

if [ ! -d "$SRC" ]; then
  echo "ERROR: source plugin dir missing: $SRC" >&2
  exit 1
fi
if [ ! -d "$TARGET" ]; then
  echo "ERROR: target plugin dir missing: $TARGET" >&2
  echo "  set LOTRO_PLUGINS_DIR if your LOTRO install is elsewhere" >&2
  exit 1
fi

echo "syncing $SRC/  ->  $TARGET/"
# -R recursive, -f force (overwrite read-only). We don't pass --delete because
# LOTRO may keep runtime-generated state files in there (e.g. saved settings).
cp -Rf "$SRC"/. "$TARGET/"

VERSION="$(grep -oE '<Version>[^<]+</Version>' "$SRC/TumbaAnalysis.plugin" | head -n1 | sed -E 's|</?Version>||g')"
echo "synced plugin v${VERSION:-unknown}"
echo "/plugins unload TumbaAnalysis && /plugins load TumbaAnalysis  — in-game to reload"
