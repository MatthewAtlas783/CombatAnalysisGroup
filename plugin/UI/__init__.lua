
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

import "TumbaAnalysis.UI.Cursor"

import "TumbaAnalysis.UI.TooltipManager"
import "TumbaAnalysis.UI.Tooltip"

import "TumbaAnalysis.UI.DragBar"

import "TumbaAnalysis.UI.WindowManager"
import "TumbaAnalysis.UI.Window"
import "TumbaAnalysis.UI.ResizableWindow"

import "TumbaAnalysis.UI.DialogManager"
import "TumbaAnalysis.UI.Dialog"

import "TumbaAnalysis.UI.SuggestionsPopup"
import "TumbaAnalysis.UI.SuggestionsTextBox"

import "TumbaAnalysis.UI.NotificationIcon"

import "TumbaAnalysis.UI.Tab"
import "TumbaAnalysis.UI.TabbedPane"

import "TumbaAnalysis.UI.MenuLabel"
import "TumbaAnalysis.UI.MenuCheckBox"
import "TumbaAnalysis.UI.PanelDivider"
import "TumbaAnalysis.UI.LabelledComboBox"
import "TumbaAnalysis.UI.ColoredLabelledComboBox"
import "TumbaAnalysis.UI.Slider"
import "TumbaAnalysis.UI.ColorPicker"

import "TumbaAnalysis.UI.FileSelectDialog"

import "TumbaAnalysis.UI.CombatAnalysisSpecific"
