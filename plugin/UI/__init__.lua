
_G.allWindows = {}
_G.idCounter = 1;

_G.windowsLocked = false;
_G.windowsHidden = false;

_G.lageFonts = false;

-- 14 standard 18 large
_G.statFont = Turbine.UI.Lotro.Font.TrajanPro14;

-- set some UI default colors

_G.borderColor = Turbine.UI.Color(28/255,28/255,28/255);             -- dark, slightly silver
_G.backgroundColor = Turbine.UI.Color(179/255,38/255,38/255,38/255); -- dark, slightly transparent
_G.darkBackgroundColor = Turbine.UI.Color(0.3,0.05,0.05,0.05);       -- very dark, very transparent

_G.blueBorderColor = Turbine.UI.Color(0.15,0.2,0.3);                 -- blue inner border

_G.controlColor = Turbine.UI.Color(0.69,0.59,0.2);         -- gold, slightly yellow
_G.control2Color = Turbine.UI.Color(0.88,0.77,0.1);        -- gold, almost yellow
_G.controlSelectedColor = Turbine.UI.Color(0.9,0.85,0.65); -- light gold
_G.controlLightColor = Turbine.UI.Color(0.95,0.9,0.75);    -- light gold, almost white
_G.control2LightColor = Turbine.UI.Color(0.95,0.85,0.55);  -- light gold, somewhat white
_G.controlYellowColor = Turbine.UI.Color(0.8,0.95,0.2);    -- yellow, slightly gold
_G.control2YellowColor = Turbine.UI.Color(0.8,0.85,0.2);   -- yellow, somewhat gold
_G.controlDisabledColor = Turbine.UI.Color(0.42,0.42,0.4); -- dark grey

-- imports

import "CombatAnalysisGroup.UI.Cursor"

import "CombatAnalysisGroup.UI.TooltipManager"
import "CombatAnalysisGroup.UI.Tooltip"

import "CombatAnalysisGroup.UI.DragBar"

import "CombatAnalysisGroup.UI.WindowManager"
import "CombatAnalysisGroup.UI.Window"
import "CombatAnalysisGroup.UI.ResizableWindow"

import "CombatAnalysisGroup.UI.DialogManager"
import "CombatAnalysisGroup.UI.Dialog"

import "CombatAnalysisGroup.UI.SuggestionsPopup"
import "CombatAnalysisGroup.UI.SuggestionsTextBox"

import "CombatAnalysisGroup.UI.NotificationIcon"

import "CombatAnalysisGroup.UI.Tab"
import "CombatAnalysisGroup.UI.TabbedPane"

import "CombatAnalysisGroup.UI.MenuLabel"
import "CombatAnalysisGroup.UI.MenuCheckBox"
import "CombatAnalysisGroup.UI.PanelDivider"
import "CombatAnalysisGroup.UI.LabelledComboBox"
import "CombatAnalysisGroup.UI.ColoredLabelledComboBox"
import "CombatAnalysisGroup.UI.Slider"
import "CombatAnalysisGroup.UI.ColorPicker"

import "CombatAnalysisGroup.UI.FileSelectDialog"

import "CombatAnalysisGroup.UI.CombatAnalysisSpecific"
