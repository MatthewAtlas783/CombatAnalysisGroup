--[[
  CombatAnalysisGroup POC v0.0.5 — external read test

  v0.0.4 confirmed: plugin self-roundtrip works (Save -> Load returns own data).
  Discovered writer was using wrong path: AllServers/AllCharacters/ instead of
  AllServers/. Writer fixed to use AllServers/<key>.plugindata and to format
  integer numbers as %f to match Turbine's exact output.

  This version: no self-save. Just polls. If we see counter=N in chat, the full
  external-write -> plugin-read path is validated.
]]--

import "Turbine";
import "Turbine.Gameplay";
import "Turbine.UI";

Turbine.Shell.WriteLine("CAGroup POC v0.0.5 loaded (external read test).");

_G.cagPoller = Turbine.UI.Control();
_G.cagPoller:SetWantsUpdates(true);

_G.cag_lastPollAt = 0;
_G.cag_lastHeartbeat = 0;
_G.cag_pollIntervalSec = 3;
_G.cag_heartbeatSec = 5;
_G.cag_timeoutSec = 20;
_G.cag_pollNum = 0;
_G.cag_heartbeatNum = 0;
_G.cag_pendingPoll = nil;
_G.cag_pendingIssuedAt = 0;

_G.cagPoller.Update = function()
  local now = Turbine.Engine.GetGameTime();

  if (now - _G.cag_lastHeartbeat >= _G.cag_heartbeatSec) then
    _G.cag_lastHeartbeat = now;
    _G.cag_heartbeatNum = _G.cag_heartbeatNum + 1;
    Turbine.Shell.WriteLine("CAGroup POC: [hb " .. _G.cag_heartbeatNum .. " pending=" .. tostring(_G.cag_pendingPoll) .. "]");
  end

  if (_G.cag_pendingPoll ~= nil and (now - _G.cag_pendingIssuedAt) > _G.cag_timeoutSec) then
    Turbine.Shell.WriteLine("CAGroup POC: poll " .. _G.cag_pendingPoll .. " TIMEOUT");
    _G.cag_pendingPoll = nil;
  end

  if (now - _G.cag_lastPollAt < _G.cag_pollIntervalSec) then return end
  _G.cag_lastPollAt = now;

  if (_G.cag_pendingPoll ~= nil) then return end

  _G.cag_pollNum = _G.cag_pollNum + 1;
  local myPollNum = _G.cag_pollNum;
  _G.cag_pendingPoll = myPollNum;
  _G.cag_pendingIssuedAt = now;

  Turbine.Shell.WriteLine("CAGroup POC: poll " .. myPollNum .. " issued");

  local ok, err = pcall(Turbine.PluginData.Load, Turbine.DataScope.Account, "CAGroupPOC", function(result)
    local elapsed = Turbine.Engine.GetGameTime() - _G.cag_pendingIssuedAt;
    if (type(result) == "table") then
      Turbine.Shell.WriteLine("CAGroup POC: poll " .. myPollNum .. " got counter=" .. tostring(result.counter) .. " msg=" .. tostring(result.message) .. " (" .. string.format("%.1f", elapsed) .. "s)");
    else
      Turbine.Shell.WriteLine("CAGroup POC: poll " .. myPollNum .. " got " .. type(result) .. "=" .. tostring(result) .. " (" .. string.format("%.1f", elapsed) .. "s)");
    end
    if (_G.cag_pendingPoll == myPollNum) then _G.cag_pendingPoll = nil end
  end);

  if (not ok) then
    Turbine.Shell.WriteLine("CAGroup POC: poll " .. myPollNum .. " pcall error: " .. tostring(err));
    _G.cag_pendingPoll = nil;
  end
end
