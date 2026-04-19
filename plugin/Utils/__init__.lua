
-- automatically extract plugin version number

local function GetVersionNo()
	for _,plugin in ipairs(Turbine.PluginManager.GetAvailablePlugins()) do
		if (plugin.Name == "TumbaAnalysis") then
			return plugin.Version;
		end
	end
	return "";
end
local err,versionNo = pcall(GetVersionNo);
_G.versionNo = (err and versionNo or "");


-- imports

import "TumbaAnalysis.Utils.Class"
import "TumbaAnalysis.Utils.Type"

import "TumbaAnalysis.Utils.HashSet"
import "TumbaAnalysis.Utils.OrderedList"
import "TumbaAnalysis.Utils.OrderedFileList"

import "TumbaAnalysis.Utils.Settings"
import "TumbaAnalysis.Utils.DataStorage"
import "TumbaAnalysis.Utils.Misc"
import "TumbaAnalysis.Utils.Enums"

import "TumbaAnalysis.Utils.Commands"
import "TumbaAnalysis.Utils.KeyManager"
