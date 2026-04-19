# CombatAnalysisGroup — project handoff

Paste this into any Claude chat (desktop, mobile, API) to pick up where the VSCode sessions left off. It captures the *why*, the *what's built*, and the *what's pending* — not the code, which lives in the repo.

---

## TL;DR

LOTRO doesn't natively share DPS parses between group members. The **TumbaAnalysis / Combat Analysis (CA)** plugin parses your own combat locally but can't see your group's numbers. This project is a fork that fixes that by adding a **companion desktop app** and a **WebSocket relay** so everyone in a fellowship sees the same real-time group parse.

Three components:

| Component | Language / Runtime | Role |
|---|---|---|
| `plugin/` | Lua (LOTRO in-game) | Reads combat events, writes per-player stats to a plugindata file, displays a new "Group" tab |
| `desktop/` | TypeScript (Electron + React) | Watches the plugindata file, forwards stats to the relay, shows a live group-parse window, receives other players' stats and writes them back for the plugin to render |
| `relay/` | TypeScript (Node + `ws`) | Multi-room WebSocket server; aggregates per-encounter baselines, opens/closes room encounters, ships history |

Deployed relay: Railway (one free hobby instance). Plugin distribution: LotroInterface manual install. Desktop distribution: GitHub Releases via electron-updater auto-update.

---

## Architecture at a glance

```
LOTRO client
  └─ plugin/StatOverview/__init__.lua
       writes CALocalStats.plugindata  (per-tick, local player totals + inCombat)
       writes CAEncounterDetail.plugindata  (on COMBAT_END, per-mob/per-skill)
       reads  CAGroupData.plugindata    (room-level state, for the in-game Group tab)

desktop/ (Electron main process)
  ├─ chokidar watches CALocalStats.plugindata  → push stats to relay
  ├─ chokidar watches CAEncounterDetail.plugindata → push detail snapshot to relay
  ├─ WebSocket client to relay
  │    - sends: { type: 'stats', amount, duration, attacks, inCombat }
  │    - sends: { type: 'encounterDetail', player, seq, mobs[] }
  │    - receives: { type: 'snapshot', players, current, history, roomInCombat }
  └─ writes CAGroupData.plugindata (whole room state so plugin can render)

relay/ (Node)
  ├─ Room state machine:
  │   - open encounter when anyone enters combat (baselines snapshot at open)
  │   - close encounter 5s after EVERYONE leaves combat
  │   - per-player delta = reported - baseline, clamped >= 0
  │   - plugin-local resets detected by "reported < last-reported" → re-anchor baseline to 0
  ├─ 3-minute offline grace window (flapping clients keep their row)
  └─ Broadcasts snapshots to all room members on state change
```

Both desktop and plugin keep each other backward-compatible: the plugin still renders a "Waiting for desktop app" placeholder if no file exists, and the desktop mirrors last-known stats for 2min if the relay drops a peer.

---

## What's been built (session-by-session)

### Phase 0 — proof of concept
- Verified LOTRO's `Turbine.PluginData.Save` / `Load` round-trips JSON between a background companion and the in-game plugin within ~200ms.
- Validated `Turbine.UI.Control:SetWantsUpdates` as a polling tick (plugins have no real timers) — must store the host control as a `_G` to avoid GC.

### Phase 1 — live group parse
- Added per-player local stats writer (`cagLocalWriter.Update`) that publishes `{ amount, duration, attacks, inCombat }` per player every ~250ms while in combat.
- Built the relay's room+encounter state machine: opens on combat-start, holds "current" encounter while anyone is fighting, baselines per-player so stats are per-fight not cumulative.
- Desktop renderer shows: roster bars sorted by damage, group DPS, encounter duration, and a connection/combat status strip.
- Added plugin "Group" tab by bumping combobox instance counts — reuses all the existing bar rendering so it looks native.

### Phase 2 — historical parses + per-mob / per-skill drilldown
- Plugin builds an encounter-detail snapshot on COMBAT_END (`cag_buildEncounterDetail`) from `currentEncounter.orderedMobs[2..N]`, capturing per-mob duration/total and per-skill dmg/attacks/max/crits/devs. Written to `CAEncounterDetail.plugindata`.
- Relay message `encounterDetail` + `SkillBreakdown` / `MobBreakdown` types. `recordEncounterDetail` matches the snapshot to room.current if the player is in it, else the most-recent history entry containing that player. Idempotent via monotonic `seq`.
- Desktop renderer: history pills for past encounters, click-to-expand rows with a tabbed mob breakdown + skill table.

### Phase 3 — robustness + UX fixes (most recent session)
- **Relay idle-close bug** (critical): `refreshIdleTimer` was clearing+resetting the 5s timer on every OOC heartbeat (desktop heartbeats every 2s) → timer never fired → encounters accumulated for 30+ minutes. Fixed to arm once.
- **Relay `isRoomInCombat`**: was pinning room open if a disconnected player had stale `inCombat=true`. Now requires `p.online && p.inCombat`.
- **`markOffline`**: now calls `refreshIdleTimer` so a disconnect can trigger encounter close instead of waiting the full 3min TTL.
- **Group tab dropdown mismatch**: totals came from room state, duration came from `combatData[selectedMob]` (tied to dropdown). Switching the dropdown moved DPS but not totals. Fixed by caching `cag_groupActiveEncounter` alongside `cag_groupData` and overriding `_G.groupTab:Duration()` to read from it.
- **Live view shows zeros when idle** (user requested): desktop's Live tab and plugin's Group tab now both zero out when the room is not in combat. Historical encounters reachable via numbered pills.
- **Plugin writer robustness**: `cag_localWriter.Update` now always emits the `inCombat=false` transition even when `cag_collectLocalStats` returns nil. Previously a corner case could skip the transition and pin the relay at "in combat".
- **Tab labels renamed**: Dmg → DPS, Taken → TPS, Heal → HPS (first element of each `L[...]` tuple in `Locale/en.lua`).
- **Auto-updater**: wired `electron-updater` → GitHub Releases for `MatthewAtlas783/CombatAnalysisGroup`. Manual "Check for updates" in menu. Background polling gated on `autoUpdateEnabled` setting (off by default so end users don't silently upgrade).

---

## Current state

- **Plugin** version: **1.0.3** (in `plugin/TumbaAnalysis.plugin` and `.plugincompendium`). Install by copying `plugin/` into `Documents/The Lord of the Rings Online/Plugins/TumbaAnalysis/`.
- **Desktop** version: **1.0.3** (in `desktop/package.json`). Auto-update configured.
- **Relay**: deployed to Railway. Session 3 critical fixes to `relay/src/rooms.ts` are in source but **may or may not be deployed yet** — user needed to push to redeploy. Verify `refreshIdleTimer` change is live by checking if encounters actually close 5s after OOC.
- **GitHub repo** `MatthewAtlas783/CombatAnalysisGroup` is public (flipped this session to unblock auto-update).
- **GH_TOKEN** stored in `desktop/.env` (gitignored). Used by `npm run release`.
- **v1.0.3 published to GitHub Releases**: (this session kicked off `npm run release`; confirm by checking https://github.com/MatthewAtlas783/CombatAnalysisGroup/releases)

---

## Open questions / known issues

1. **Relay redeploy confirmation**: whether the Railway instance has been restarted since the `rooms.ts` fixes. If encounters still don't close 5s after OOC in-game, that's the symptom of an un-redeployed relay.
2. **Perks 6.1M-vs-4.13M discrepancy** in a recent screenshot: root cause was the stuck encounter (stale baselines from a never-closed fight). Should resolve once the relay redeploy confirms encounter closure. If it recurs after redeploy, there's a deeper baseline-seeding bug in `startEncounter` (currently seeds from `room.players` snapshot before the current player's message is stored — fine in principle but worth double-checking).
3. **Plugin's `combatData.inCombat` flip timing**: LOTRO's CA sets `inCombat = false` inside `EncounterFinished`, which fires after `orderedMobs[1].terminated == true`. There may be a several-second lag between the last damage event and that flip. This is expected LOTRO behavior, not a bug — but it's why the desktop sometimes shows a few seconds of "IN COMBAT" after visible combat ends in game.
4. **Encounter-detail coverage when relay didn't see a baseline**: `recordEncounterDetail` matches by player-entry in current/history. If a player joined after an encounter started and never got a `room.current.players` entry (e.g. their stats never arrived), the detail snapshot has nowhere to attach. Low priority — would show up as "click for breakdown" not working on that row.
5. **Group tab dropdowns are orphaned**: the in-game Group tab has encounter/mob comboboxes inherited from the base tab template, but our override ignores them for both data AND duration. They're essentially cosmetic. Could either disable them or wire them to `cag_groupHistory` (more work, not blocking).

---

## How to resume work

- Working dir: `c:\Users\matto\OneDrive\Desktop\Personal projects\CombatAnalysisGroup`
- Memory files from auto-memory: `C:\Users\matto\.claude\projects\c--Users-matto-OneDrive-Desktop-Personal-projects\memory\`
- Key files:
  - `plugin/StatOverview/__init__.lua` — most plugin logic lives here
  - `relay/src/rooms.ts` — room state machine
  - `relay/src/server.ts` — WebSocket entrypoint
  - `desktop/src/main/service.ts` — ties file watcher + relay + state together
  - `desktop/src/renderer/src/Roster.tsx` — the main UI
- Build commands:
  - Plugin: none (Lua, loaded by LOTRO directly)
  - Plugin sync (one-shot): `bash scripts/sync-plugin.sh` — copies `plugin/` → live LOTRO install
  - Plugin sync (auto): `node scripts/watch-plugin.mjs` — debounced re-sync on file change; leave running during a dev session, then `/plugins reload TumbaAnalysis` in-game
  - Relay: `cd relay && npm run typecheck` (deploys via Railway auto-deploy on `git push`)
  - Desktop dev: `cd desktop && npm run dev`
  - Desktop release: `cd desktop && export $(grep -v '^#' .env | xargs) && npm run release`

When something is broken in-game:
1. Watch `%APPDATA%/Turbine/The Lord of the Rings Online/PluginData/<account>/AllServers/CALocalStats.plugindata` to confirm the plugin is writing
2. Check the desktop app's status strip: relay status, room, inCombat, local damage
3. Check Railway logs for the relay
4. Symptom table:
   - Desktop stuck "IN COMBAT" after combat ends → plugin isn't writing `inCombat=false` OR relay isn't closing encounters
   - "Live encounter" duration > 5min with no history → relay `refreshIdleTimer` bug (should be fixed; verify deployment)
   - Group tab totals don't match in-game CA → dropdown source mismatch (should be fixed via `cag_groupActiveEncounter`)
   - Auto-update 404s → GH repo private or no releases published
