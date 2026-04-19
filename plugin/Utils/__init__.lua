
-- automatically extract plugin version number

local function GetVersionNo()
	for _,plugin in ipairs(Turbine.PluginManager.GetAvailablePlugins()) do
		if (plugin.Name == "CombatAnalysisGroup") then
			return plugin.Version;
		end
	end
	return "";
end
local err,versionNo = pcall(GetVersionNo);
_G.versionNo = (err and versionNo or "");


-- imports

import "CombatAnalysisGroup.Utils.Class"
import "CombatAnalysisGroup.Utils.Type"

import "CombatAnalysisGroup.Utils.HashSet"
import "CombatAnalysisGroup.Utils.OrderedList"
import "CombatAnalysisGroup.Utils.OrderedFileList"

import "CombatAnalysisGroup.Utils.Settings"
import "CombatAnalysisGroup.Utils.DataStorage"
import "CombatAnalysisGroup.Utils.Misc"
import "CombatAnalysisGroup.Utils.Enums"

import "CombatAnalysisGroup.Utils.Commands"
import "CombatAnalysisGroup.Utils.KeyManager"
