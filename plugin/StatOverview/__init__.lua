
--[[

Constructs the UI elements necessary to display the stat
overview information.

Note many of the elements declared here are updated directly
by the combat data class when new info is parsed.

]]--


-- declare global variables (a window set and tab set)
_G.statOverviewEnabled = true;

_G.statOverviewWindows = {}
_G.statOverviewTabs = {}
_G.statOverviewStatsWindows = {}
_G.autoSelectNewEncounters = true;
_G.confirmOnReset = true;

menuPane:SetWindowSet(statOverviewWindows);
menuPane:SetStatsWindowSet(statOverviewStatsWindows);


-- import relevant classes
import "TumbaAnalysis.StatOverview.StatOverviewWindow";

import "TumbaAnalysis.StatOverview.StatOverviewTabMenu";
import "TumbaAnalysis.StatOverview.StatOverviewStatsMenu";
import "TumbaAnalysis.StatOverview.StatOverviewChatMenu";
import "TumbaAnalysis.StatOverview.StatOverviewTraitConfigMenu";

import "TumbaAnalysis.StatOverview.StatOverviewTab";
import "TumbaAnalysis.StatOverview.StatOverviewPanel";

import "TumbaAnalysis.StatOverview.StatOverviewBarsPanel";
import "TumbaAnalysis.StatOverview.StatOverviewBar";

import "TumbaAnalysis.StatOverview.StatOverviewStatsWindow";

import "TumbaAnalysis.StatOverview.StatOverviewStatsPanel";
import "TumbaAnalysis.StatOverview.StatOverviewTreeNode";


-- construct the encounters combo box and the two target combo boxes (mobs and restores)
-- TumbaAnalysis: bumped instance counts by 1 to back the Group tab
_G.encountersComboBox = CombatAnalysisComboBox(7,backgroundColor,controlColor,combatData,combatData.maxEncounters,combatData.maxLoadedEncounters);
_G.mobsComboBox = CombatAnalysisComboBox(4,backgroundColor,Turbine.UI.Color(0.9,0.45,0.3),combatData);
_G.restoresComboBox = CombatAnalysisComboBox(3,backgroundColor,Turbine.UI.Color(0.2,0.85,0.65),combatData);

Misc.AddListener(combatData,"maxEncounters",function(sender)
  encountersComboBox:SetMaxElements(combatData.maxEncounters);
end, encountersComboBox, encountersComboBox);

Misc.AddListener(combatData,"maxLoadedEncounters",function(sender)
  encountersComboBox:SetMaxTopElements(combatData.maxLoadedEncounters);
end, encountersComboBox, encountersComboBox);

-- construct a shared stat menu and chat send menu
local tabMenu = StatOverviewTabMenu();
_G.statsMenu = StatOverviewStatsMenu();
_G.chatMenu = StatOverviewChatMenu();

-- construct all the main stats tabs that always exist (and their corresponding panels/stat panels)
_G.dmgTab = StatOverviewTab("dmgTab",L.Dmg,tabMenu,chatMenu,encountersComboBox:GetInstance(1),mobsComboBox:GetInstance(1),nil,false,Turbine.UI.Color(0.4,1,0,0));                                              -- red
_G.takenTab = StatOverviewTab("takenTab",L.Taken,tabMenu,chatMenu,encountersComboBox:GetInstance(2),mobsComboBox:GetInstance(2),nil,false,Turbine.UI.Color(0.4,1,0.446154,0));                                 -- orange
_G.healTab = StatOverviewTab("healTab",L.Heal,tabMenu,chatMenu,encountersComboBox:GetInstance(3),restoresComboBox:GetInstance(1),Turbine.UI.Color(0.4,0.625,0,1),false,Turbine.UI.Color(0.4,0,1,0));           -- green
_G.powerTab = StatOverviewTab("powerTab",L.Power,tabMenu,chatMenu,encountersComboBox:GetInstance(4),restoresComboBox:GetInstance(2),nil,false,Turbine.UI.Color(0.4,0,0,1));                                    -- blue
_G.buffTab = StatOverviewTab("buffTab",L.Buff,tabMenu,chatMenu,encountersComboBox:GetInstance(6),restoresComboBox:GetInstance(3),nil,true,Turbine.UI.Color(0.75,1,1,1),Turbine.UI.Color(0.75,0.78,0.78,0.78)); -- white (as of v4.2.0)
_G.debuffTab = StatOverviewTab("debuffTab",L.Debuff,tabMenu,chatMenu,encountersComboBox:GetInstance(5),mobsComboBox:GetInstance(3),nil,true,Turbine.UI.Color(0.75,0,0,0),Turbine.UI.Color(0.7,0.5,0.5,0.5));   -- black (as of v4.2.0)
_G.groupTab = StatOverviewTab("groupTab",L.Group,tabMenu,chatMenu,encountersComboBox:GetInstance(7),mobsComboBox:GetInstance(4),nil,false,Turbine.UI.Color(0.4,0.6,0.3,0.9));                                     -- purple

-- add the tabs to the menu
menuPane:AddStatOverviewTab(dmgTab);
menuPane:AddStatOverviewTab(takenTab);
menuPane:AddStatOverviewTab(healTab);
menuPane:AddStatOverviewTab(powerTab);
menuPane:AddStatOverviewTab(buffTab);
menuPane:AddStatOverviewTab(debuffTab);
menuPane:AddStatOverviewTab(groupTab);

-- additionally, override each tab's GetData methods to ensure they correct the relevant summary data

function _G.dmgTab:GetData(category) return combatData.selectedMob:GetAllPlayerData("dmg"..(category or "")) end
function _G.takenTab:GetData(category) return combatData.selectedMob:GetAllPlayerData("taken"..(category or "")) end
function _G.healTab:GetData(category) return combatData.selectedRestore:GetAllPlayerData("heal"..(category or "")) end
function _G.powerTab:GetData(category) return combatData.selectedRestore:GetAllPlayerData("power"..(category or "")) end
function _G.debuffTab:GetData() return combatData.selectedMob:GetPlayerData(player.name,"debuff",false) end
function _G.buffTab:GetData() return combatData.selectedRestore:GetPlayerData(player.name,"buff",false) end

function _G.dmgTab:GetDataForPlayer(player,includeTotals,category) return combatData.selectedMob:GetPlayerData(player,"dmg"..(category or ""),includeTotals) end
function _G.takenTab:GetDataForPlayer(player,includeTotals,category) return combatData.selectedMob:GetPlayerData(player,"taken"..(category or ""),includeTotals) end
function _G.healTab:GetDataForPlayer(player,includeTotals,category) return combatData.selectedRestore:GetPlayerData(player,"heal"..(category or ""),includeTotals) end
function _G.powerTab:GetDataForPlayer(player,includeTotals,category) return combatData.selectedRestore:GetPlayerData(player,"power"..(category or ""),includeTotals) end

-- Group tab: data sourced from external plugindata file written by the desktop app.
-- The desktop app tracks room-level encounters (starts when anyone enters combat,
-- closes ~5s after everyone leaves). The plugin reflects that state so Group tab
-- numbers stay aligned with actual fight windows instead of showing stale cumulative.
-- Shape matches what StatOverviewBar:UpdateData/StatOverviewBarsPanel:FullUpdate read:
--   .empty, .amount, .attacks, .absorbs, :TotalAmount()
local groupDataMt = { __index = { TotalAmount = function(self) return self.amount end } }
_G.cag_groupData = {}
_G.cag_groupRoomInCombat = false
_G.cag_groupCurrent = nil      -- current room encounter (or nil when idle)
_G.cag_groupHistory = {}       -- list of past encounters, newest-first

local function cag_buildPlayersMap(playersTbl)
  local out = {}
  if (type(playersTbl) ~= "table") then return out end
  for name,val in pairs(playersTbl) do
    local amount, attacks;
    if (type(val) == "number") then
      amount = val;
      attacks = 1;
    elseif (type(val) == "table") then
      amount = (type(val.amount) == "number" and val.amount) or 0;
      attacks = (type(val.attacks) == "number" and val.attacks) or 1;
    else
      amount = 0;
      attacks = 1;
    end
    -- StatOverviewBar:177 divides by attacks for the avg column — must be >=1
    -- even on empty rows to avoid div-by-zero.
    if (attacks < 1) then attacks = 1 end
    out[name] = setmetatable({
      amount = amount,
      empty = (amount <= 0),
      attacks = attacks,
      absorbs = 0,
      min = amount, max = amount,
    }, groupDataMt)
  end
  return out
end

-- The encounter currently driving both the data AND the duration of the Group
-- tab. Kept as a single source so totals and duration can never disagree (prior
-- bug: totals came from room state, duration came from combatData's selectedMob
-- which tracks the dropdown — switching the dropdown made DPS move while the
-- totals stayed pinned).
_G.cag_groupActiveEncounter = nil

_G.cag_BuildGroupData = function(raw)
  -- Preserves backward-compat with old desktop builds that only emit `players`.
  -- New shape additionally carries roomInCombat + current + history.
  if (type(raw) ~= "table") then
    _G.cag_groupRoomInCombat = false
    _G.cag_groupCurrent = nil
    _G.cag_groupHistory = {}
    _G.cag_groupActiveEncounter = nil
    return {}
  end
  _G.cag_groupRoomInCombat = (raw.roomInCombat == true)
  _G.cag_groupCurrent = (type(raw.current) == "table") and raw.current or nil
  _G.cag_groupHistory = (type(raw.history) == "table") and raw.history or {}
  -- Show the current encounter while one is live; when the room is idle, show
  -- nothing (zeros) rather than leaving the last fight's numbers on-screen —
  -- users read a populated tab as "actively tracking". Only fall back to the
  -- legacy `players` map on cold-start so the placeholder row still renders
  -- before the desktop ever writes an encounter-shaped payload.
  local active = nil
  local source = nil
  if (_G.cag_groupCurrent ~= nil and type(_G.cag_groupCurrent.players) == "table") then
    active = _G.cag_groupCurrent
    source = active.players
  elseif (#_G.cag_groupHistory == 0 and _G.cag_groupCurrent == nil) then
    -- No encounter has ever been recorded — keep legacy players as a seed so
    -- the "Waiting for desktop app" placeholder keeps rendering.
    source = raw.players
  end
  _G.cag_groupActiveEncounter = active
  return cag_buildPlayersMap(source or {})
end

function _G.groupTab:GetData() return _G.cag_groupData end
-- Drill-down into a single player's skill breakdown is not supported on the
-- Group tab (we'd need encounter-detail data from the relay). Returning nil
-- tells the bars panel to stay at the overview level instead of showing the
-- full group map a second time.
function _G.groupTab:GetDataForPlayer(player,includeTotals,category) return nil end

-- Duration must come from the same encounter as the totals, not from
-- combatData[selectedMob], which is local to this client and changes when the
-- user picks a different mob/encounter in the dropdowns. When idle (no active
-- encounter) we return 0 so the DPS/duration displays zero out with the data.
function _G.groupTab:Duration()
  local active = _G.cag_groupActiveEncounter
  if (active ~= nil and type(active.duration) == "number") then
    return active.duration
  end
  return 0
end

-- Seed with placeholder rows so the tab is visibly populated before any desktop-app data arrives.
-- Version is baked into the placeholder label so the user can confirm which plugin build is
-- loaded without opening chat — disappears as soon as real group data arrives.
_G.cag_groupData = _G.cag_BuildGroupData({
  players = { ["Waiting for desktop app \xc2\xb7 CAG v"..(versionNo or "?")] = 1 },
})

-- Poller: reads CAGroupData plugindata file (written by external companion app)
-- and refreshes the Group tab. Two cadences:
--   (a) data load at an adaptive interval — faster during combat (250ms),
--       slower when idle (1s). Gated on callback completion to prevent
--       overlapping async disk reads from piling up.
--   (b) tab repaint every cag_groupRepaintIntervalSec — drives the duration/
--       DPS labels via combatData state so the timer ticks smoothly even
--       when no fresh data arrived from the desktop app.
-- Stored as a global to avoid GC of the host Control (verified during POC:
-- local hosts get GC'd after first callback).
_G.cagGroupPoller = Turbine.UI.Control();
_G.cagGroupPoller:SetWantsUpdates(true);
_G.cag_groupLastLoadAt = 0;
_G.cag_groupLastRepaintAt = 0;
_G.cag_groupLoadPending = false;  -- gate: prevent overlapping async loads
_G.cag_groupLoadIntervalCombat = 0.25;   -- 4 loads/sec during combat
_G.cag_groupLoadIntervalIdle = 1.0;      -- 1 load/sec when idle
_G.cag_groupRepaintIntervalSec = 0.1;
_G.cagGroupPoller.Update = function()
  local now = Turbine.Engine.GetGameTime();
  local interval = _G.cag_groupRoomInCombat and _G.cag_groupLoadIntervalCombat or _G.cag_groupLoadIntervalIdle;
  if (not _G.cag_groupLoadPending and now - _G.cag_groupLastLoadAt >= interval) then
    _G.cag_groupLastLoadAt = now;
    _G.cag_groupLoadPending = true;
    pcall(Turbine.PluginData.Load, Turbine.DataScope.Account, "CAGroupData", function(result)
      _G.cag_groupLoadPending = false;
      if (type(result) == "table") then
        _G.cag_groupData = _G.cag_BuildGroupData(result);
      end
    end);
  end
  if (now - _G.cag_groupLastRepaintAt >= _G.cag_groupRepaintIntervalSec) then
    _G.cag_groupLastRepaintAt = now;
    if (_G.groupTab ~= nil and _G.groupTab.panel ~= nil) then
      pcall(_G.groupTab.FullUpdate, _G.groupTab, true);
    end
  end
end

-- Local-stats writer: publishes the local player's CURRENT-encounter damage so
-- the companion forwards per-fight numbers (resets when a new encounter starts,
-- holds the last fight's totals between fights). Read by companion via
-- <PluginData>/<account>/AllServers/CALocalStats.plugindata.
_G.cagLocalWriter = Turbine.UI.Control();
_G.cagLocalWriter:SetWantsUpdates(true);
_G.cag_localLastWriteAt = 0;
_G.cag_localWriteIntervalSec = 0.25;
_G.cag_localLastAmount = -1;
_G.cag_localLastDuration = -1;
_G.cag_localLastAttacks = -1;
_G.cag_localPrevInCombat = false;

-- C1 fix: on plugin load, write a reset sentinel so the desktop app detects a
-- fresh session and doesn't keep pushing stale cumulative amounts from a previous
-- login. The desktop checks for the `reset` flag and re-anchors baselines.
if (player ~= nil and player.name ~= nil) then
  pcall(Turbine.PluginData.Save, Turbine.DataScope.Account, "CALocalStats", {
    player = player.name,
    amount = 0,
    duration = 0,
    attacks = 0,
    inCombat = false,
    reset = true,
  });
end

local function cag_collectLocalStats()
  if (combatData == nil) then return nil end
  -- currentEncounter is the active fight; it's also the most recent fight
  -- between combats, so we just read it directly.
  local enc = combatData.currentEncounter;
  if (enc == nil) then return nil end
  local mob = enc.orderedMobs and enc.orderedMobs[1];
  if (mob == nil or mob.players == nil) then return nil end
  local pdata = mob.players[player.name];
  local amount, attacks = 0, 0;
  if (pdata ~= nil and pdata[1] ~= nil and pdata[1].dmgData ~= nil) then
    if (type(pdata[1].dmgData.amount) == "number") then
      amount = pdata[1].dmgData.amount;
    end
    if (type(pdata[1].dmgData.attacks) == "number") then
      attacks = pdata[1].dmgData.attacks;
    end
  end
  local duration = (type(mob.duration) == "number" and mob.duration) or 0;
  if (mob.alive and not mob.terminated and type(mob.gameStartTime) == "number") then
    duration = duration + (Turbine.Engine.GetGameTime() - mob.gameStartTime);
  end
  if (duration < 0) then duration = 0 end
  return amount, duration, attacks;
end

-- Encounter-detail snapshot (Phase 2): on COMBAT_END, build a per-mob / per-skill
-- breakdown of the fight that just ended and persist to CAEncounterDetail.plugindata.
-- The companion watches this file and forwards snapshots to the relay so remote
-- viewers can drill from encounter -> mob -> player -> skill. We only serialize
-- rows with damage > 0 so empty placeholder mobs never hit the wire.
-- Use a timestamp-based seq so plugin reloads don't reset below the relay's
-- last-seen value (an incrementing counter restarting at 1 would be rejected
-- by the relay's idempotency check until it exceeded the old session's max).
_G.cag_encounterDetailSeq = math.floor(Turbine.Engine.GetGameTime() * 1000);

local function cag_buildEncounterDetail()
  if (combatData == nil or player == nil or player.name == nil) then return nil end
  local enc = combatData.currentEncounter;
  if (enc == nil or enc.orderedMobs == nil) then return nil end
  local me = player.name;

  local mobs = {}
  -- orderedMobs[1] is the "Totals" aggregate (per-encounter totals across all real
  -- mobs); real mobs start at index 2 and hold the per-target breakdown we want.
  for i = 2, #enc.orderedMobs do
    local mob = enc.orderedMobs[i];
    if (mob ~= nil and mob.players ~= nil and mob.players[me] ~= nil) then
      local pdata = mob.players[me];
      local totals = pdata[1];
      if (totals ~= nil and totals.dmgData ~= nil and (totals.dmgData.amount or 0) > 0) then
        local skills = {}
        for skillName, skillEntry in pairs(pdata) do
          if (type(skillName) == "string" and skillEntry ~= nil and skillEntry.dmgData ~= nil and (skillEntry.dmgData.amount or 0) > 0) then
            local d = skillEntry.dmgData;
            skills[skillName] = {
              amount = d.amount or 0,
              attacks = d.attacks or 0,
              max = d.max or 0,
              min = d.min or 0,
              crits = d.crits or 0,
              devs = d.devs or 0,
            }
          end
        end
        local duration = mob.duration or 0;
        if (mob.alive and not mob.terminated and type(mob.gameStartTime) == "number") then
          duration = duration + (Turbine.Engine.GetGameTime() - mob.gameStartTime);
        end
        if (duration < 0) then duration = 0 end
        table.insert(mobs, {
          name = mob.mobName or "",
          duration = math.floor(duration * 10) / 10,
          total = totals.dmgData.amount or 0,
          attacks = totals.dmgData.attacks or 0,
          skills = skills,
        })
      end
    end
  end

  if (#mobs == 0) then return nil end

  -- Encounter-level totals pulled from the Totals aggregate (orderedMobs[1]) so the
  -- relay can reconcile the detail snapshot against its own per-encounter summary.
  local encTotals = enc.orderedMobs[1];
  local encAmount, encAttacks, encDuration = 0, 0, 0;
  if (encTotals ~= nil) then
    encDuration = encTotals.duration or 0;
    if (encTotals.players ~= nil and encTotals.players[me] ~= nil and encTotals.players[me][1] ~= nil and encTotals.players[me][1].dmgData ~= nil) then
      encAmount = encTotals.players[me][1].dmgData.amount or 0;
      encAttacks = encTotals.players[me][1].dmgData.attacks or 0;
    end
  end

  _G.cag_encounterDetailSeq = _G.cag_encounterDetailSeq + 1;

  return {
    player = me,
    seq = _G.cag_encounterDetailSeq,
    duration = math.floor(encDuration * 10) / 10,
    total = encAmount,
    attacks = encAttacks,
    mobs = mobs,
  }
end

_G.cag_localLastInCombat = nil;

_G.cagLocalWriter.Update = function()
  local now = Turbine.Engine.GetGameTime();
  -- Detect combat-start transition: force an immediate write so the new
  -- encounter (and any reset) propagates without waiting for the throttle.
  local inCombat = (combatData ~= nil and combatData.inCombat) and true or false;
  local justEnteredCombat = (inCombat and not _G.cag_localPrevInCombat);
  local justExitedCombat = (not inCombat and _G.cag_localPrevInCombat);
  _G.cag_localPrevInCombat = inCombat;
  local forceWrite = justEnteredCombat or justExitedCombat;
  if (not forceWrite and now - _G.cag_localLastWriteAt < _G.cag_localWriteIntervalSec) then return end
  _G.cag_localLastWriteAt = now;
  local amount, duration, attacks = cag_collectLocalStats();
  -- If stats aren't available yet (e.g. no encounter tracked) but we're at a
  -- combat-transition boundary, still emit an inCombat-only update so the
  -- companion learns we've left combat. Otherwise the relay can't close the
  -- room encounter and the desktop pins at "IN COMBAT" indefinitely.
  if (amount == nil) then
    if (forceWrite and _G.cag_localLastInCombat ~= inCombat and player ~= nil and player.name ~= nil) then
      _G.cag_localLastInCombat = inCombat;
      pcall(Turbine.PluginData.Save, Turbine.DataScope.Account, "CALocalStats", {
        player = player.name,
        amount = _G.cag_localLastAmount >= 0 and _G.cag_localLastAmount or 0,
        duration = _G.cag_localLastDuration >= 0 and _G.cag_localLastDuration or 0,
        attacks = _G.cag_localLastAttacks >= 0 and _G.cag_localLastAttacks or 0,
        inCombat = inCombat,
      });
    end
    return
  end
  -- skip writes when nothing changed (durations tick continuously, so use rounded compare)
  local roundedDuration = math.floor(duration * 10) / 10;
  local inCombatChanged = (_G.cag_localLastInCombat ~= inCombat);
  if (not forceWrite
      and not inCombatChanged
      and amount == _G.cag_localLastAmount
      and roundedDuration == _G.cag_localLastDuration
      and attacks == _G.cag_localLastAttacks) then return end
  _G.cag_localLastAmount = amount;
  _G.cag_localLastDuration = roundedDuration;
  _G.cag_localLastAttacks = attacks;
  _G.cag_localLastInCombat = inCombat;
  pcall(Turbine.PluginData.Save, Turbine.DataScope.Account, "CALocalStats", {
    player = player.name,
    amount = amount,
    duration = roundedDuration,
    attacks = attacks,
    inCombat = inCombat,
  });

  -- On the COMBAT_END transition, write a per-mob/per-skill snapshot. currentEncounter
  -- still holds the just-completed fight at this point — a new COMBAT_START won't
  -- replace it until the next combat begins.
  if (justExitedCombat) then
    local detail = cag_buildEncounterDetail();
    if (detail ~= nil) then
      pcall(Turbine.PluginData.Save, Turbine.DataScope.Account, "CAEncounterDetail", detail);
    end
  end
end
