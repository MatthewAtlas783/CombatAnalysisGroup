
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
    local amount;
    if (type(val) == "number") then
      amount = val;
    elseif (type(val) == "table" and type(val.amount) == "number") then
      amount = val.amount;
    else
      amount = 0;
    end
    out[name] = setmetatable({
      amount = amount,
      empty = (amount <= 0),
      attacks = (amount > 0 and 1 or 0), -- prevents div-by-zero in StatOverviewBar:177
      absorbs = 0,
      min = amount, max = amount,
    }, groupDataMt)
  end
  return out
end

_G.cag_BuildGroupData = function(raw)
  -- Preserves backward-compat with old desktop builds that only emit `players`.
  -- New shape additionally carries roomInCombat + current + history.
  if (type(raw) ~= "table") then
    _G.cag_groupRoomInCombat = false
    _G.cag_groupCurrent = nil
    _G.cag_groupHistory = {}
    return {}
  end
  _G.cag_groupRoomInCombat = (raw.roomInCombat == true)
  _G.cag_groupCurrent = (type(raw.current) == "table") and raw.current or nil
  _G.cag_groupHistory = (type(raw.history) == "table") and raw.history or {}
  -- Default display: live current encounter when in combat, otherwise most
  -- recent closed encounter. Falls back to the legacy `players` map if the
  -- desktop hasn't yet sent encounter-shaped data.
  local source;
  if (_G.cag_groupCurrent ~= nil and type(_G.cag_groupCurrent.players) == "table") then
    source = _G.cag_groupCurrent.players
  elseif (_G.cag_groupHistory[1] ~= nil and type(_G.cag_groupHistory[1].players) == "table") then
    source = _G.cag_groupHistory[1].players
  else
    source = raw.players
  end
  return cag_buildPlayersMap(source)
end

function _G.groupTab:GetData() return _G.cag_groupData end
function _G.groupTab:GetDataForPlayer(player,includeTotals,category) return _G.cag_groupData end

-- Seed with placeholder rows so the tab is visibly populated before any desktop-app data arrives.
_G.cag_groupData = _G.cag_BuildGroupData({ players = { ["Waiting for desktop app..."] = 1 } })

-- Poller: reads CAGroupData plugindata file (written by external companion app)
-- and refreshes the Group tab. Two cadences:
--   (a) data load every cag_groupLoadIntervalSec — Turbine.PluginData.Load is
--       async and can be slow under load, so we DON'T gate the next load on
--       the previous callback firing (a stuck callback would otherwise freeze
--       all subsequent polls and the tab updates only every ~15s).
--   (b) tab repaint every cag_groupRepaintIntervalSec — drives the duration/
--       DPS labels via combatData state so the timer ticks smoothly even
--       when no fresh data arrived from the desktop app.
-- Stored as a global to avoid GC of the host Control (verified during POC:
-- local hosts get GC'd after first callback).
_G.cagGroupPoller = Turbine.UI.Control();
_G.cagGroupPoller:SetWantsUpdates(true);
_G.cag_groupLastLoadAt = 0;
_G.cag_groupLastRepaintAt = 0;
_G.cag_groupLoadIntervalSec = 0.4;
_G.cag_groupRepaintIntervalSec = 0.2;
_G.cagGroupPoller.Update = function()
  local now = Turbine.Engine.GetGameTime();
  if (now - _G.cag_groupLastLoadAt >= _G.cag_groupLoadIntervalSec) then
    _G.cag_groupLastLoadAt = now;
    pcall(Turbine.PluginData.Load, Turbine.DataScope.Account, "CAGroupData", function(result)
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
_G.cag_localWriteIntervalSec = 0.5;
_G.cag_localLastAmount = -1;
_G.cag_localLastDuration = -1;
_G.cag_localPrevInCombat = false;

local function cag_collectLocalStats()
  if (combatData == nil) then return nil end
  -- currentEncounter is the active fight; it's also the most recent fight
  -- between combats, so we just read it directly.
  local enc = combatData.currentEncounter;
  if (enc == nil) then return nil end
  local mob = enc.orderedMobs and enc.orderedMobs[1];
  if (mob == nil or mob.players == nil) then return nil end
  local pdata = mob.players[player.name];
  local amount = 0;
  if (pdata ~= nil and pdata[1] ~= nil and pdata[1].dmgData ~= nil and type(pdata[1].dmgData.amount) == "number") then
    amount = pdata[1].dmgData.amount;
  end
  local duration = (type(mob.duration) == "number" and mob.duration) or 0;
  if (mob.alive and not mob.terminated and type(mob.gameStartTime) == "number") then
    duration = duration + (Turbine.Engine.GetGameTime() - mob.gameStartTime);
  end
  if (duration < 0) then duration = 0 end
  return amount, duration;
end

_G.cagLocalWriter.Update = function()
  local now = Turbine.Engine.GetGameTime();
  -- Detect combat-start transition: force an immediate write so the new
  -- encounter (and any reset) propagates without waiting for the throttle.
  local inCombat = (combatData ~= nil and combatData.inCombat) and true or false;
  local justEnteredCombat = (inCombat and not _G.cag_localPrevInCombat);
  _G.cag_localPrevInCombat = inCombat;
  if (not justEnteredCombat and now - _G.cag_localLastWriteAt < _G.cag_localWriteIntervalSec) then return end
  _G.cag_localLastWriteAt = now;
  local amount, duration = cag_collectLocalStats();
  if (amount == nil) then return end
  -- skip writes when nothing changed (durations tick continuously, so use rounded compare)
  local roundedDuration = math.floor(duration * 10) / 10;
  if (not justEnteredCombat and amount == _G.cag_localLastAmount and roundedDuration == _G.cag_localLastDuration) then return end
  _G.cag_localLastAmount = amount;
  _G.cag_localLastDuration = roundedDuration;
  pcall(Turbine.PluginData.Save, Turbine.DataScope.Account, "CALocalStats", {
    player = player.name,
    amount = amount,
    duration = roundedDuration,
    inCombat = inCombat,
  });
end
