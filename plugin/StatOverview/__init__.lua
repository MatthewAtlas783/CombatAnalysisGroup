
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

-- Group tab: data sourced from external plugindata file written by the companion app.
-- _G.cag_groupData is a {playerName -> summaryData} table maintained by the poller in main.lua.
-- Shape matches what StatOverviewBar:UpdateData/StatOverviewBarsPanel:FullUpdate read:
--   .empty, .amount, .attacks, .absorbs, :TotalAmount()
local groupDataMt = { __index = { TotalAmount = function(self) return self.amount end } }
_G.cag_groupData = {}
_G.cag_BuildGroupData = function(raw)
  local out = {}
  if (type(raw) ~= "table" or type(raw.players) ~= "table") then return out end
  for name,amount in pairs(raw.players) do
    if (type(amount) == "number") then
      out[name] = setmetatable({
        amount = amount,
        empty = (amount <= 0),
        attacks = (amount > 0 and 1 or 0), -- prevents div-by-zero in StatOverviewBar:177
        absorbs = 0,
        min = amount, max = amount,
      }, groupDataMt)
    end
  end
  return out
end
function _G.groupTab:GetData() return _G.cag_groupData end
function _G.groupTab:GetDataForPlayer(player,includeTotals,category) return _G.cag_groupData end

-- Seed with placeholder rows so the tab is visibly populated before any companion-app data arrives.
_G.cag_groupData = _G.cag_BuildGroupData({ players = { ["Waiting for companion..."] = 1 } })

-- Poller: reads CAGroupData plugindata file (written by external companion app) every few
-- seconds and updates _G.cag_groupData. Stored as a global to avoid GC of the host Control
-- (verified during POC: local hosts get GC'd after first callback).
_G.cagGroupPoller = Turbine.UI.Control();
_G.cagGroupPoller:SetWantsUpdates(true);
_G.cag_groupLastPollAt = 0;
_G.cag_groupPendingPoll = false;
_G.cag_groupPollIntervalSec = 3;
_G.cagGroupPoller.Update = function()
  local now = Turbine.Engine.GetGameTime();
  if (now - _G.cag_groupLastPollAt < _G.cag_groupPollIntervalSec) then return end
  if (_G.cag_groupPendingPoll) then return end
  _G.cag_groupLastPollAt = now;
  _G.cag_groupPendingPoll = true;
  local ok = pcall(Turbine.PluginData.Load, Turbine.DataScope.Account, "CAGroupData", function(result)
    _G.cag_groupPendingPoll = false;
    if (type(result) == "table") then
      _G.cag_groupData = _G.cag_BuildGroupData(result);
    end
  end);
  if (not ok) then _G.cag_groupPendingPoll = false end
end

-- Local-stats writer: publishes the local player's totals-encounter damage so
-- the companion app can forward it to the relay. Read by companion via
-- <PluginData>/<account>/AllServers/CALocalStats.plugindata.
_G.cagLocalWriter = Turbine.UI.Control();
_G.cagLocalWriter:SetWantsUpdates(true);
_G.cag_localLastWriteAt = 0;
_G.cag_localWriteIntervalSec = 1;
_G.cag_localLastAmount = -1;
_G.cag_localLastDuration = -1;

local function cag_collectLocalStats()
  if (combatData == nil or combatData.totalsEncounter == nil) then return nil end
  local mob = combatData.totalsEncounter.orderedMobs and combatData.totalsEncounter.orderedMobs[1];
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
  if (now - _G.cag_localLastWriteAt < _G.cag_localWriteIntervalSec) then return end
  _G.cag_localLastWriteAt = now;
  local amount, duration = cag_collectLocalStats();
  if (amount == nil) then return end
  -- skip writes when nothing changed (durations tick continuously, so use rounded compare)
  local roundedDuration = math.floor(duration * 10) / 10;
  if (amount == _G.cag_localLastAmount and roundedDuration == _G.cag_localLastDuration) then return end
  _G.cag_localLastAmount = amount;
  _G.cag_localLastDuration = roundedDuration;
  pcall(Turbine.PluginData.Save, Turbine.DataScope.Account, "CALocalStats", {
    player = player.name,
    amount = amount,
    duration = roundedDuration,
  });
end
