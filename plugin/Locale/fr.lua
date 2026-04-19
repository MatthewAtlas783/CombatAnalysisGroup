-- Database for Combat Analysis (FranÃ§ais)
-- Encodage: UTF-8 (sans BOM) afin de conserver les accents
-- Version du 06 mai 2022

L["DevelopedBy"] = "DeveloppÃ© par Evendale, amÃ©liorÃ© par Landal.";
L["TranslatedBy"] = "Traduction : Mayara@Sirannon Ardi@Estel Adra@Sirannon";

L["FailedToLoadTraitsResetConfirmation"] = "Ã‰chec du chargement des traits. RÃ©initialiser et continuer ?".."\n".."Attention : Vous perdrez toutes vos configurations personnelles de buffs et dÃ©buffs.";
L["FailedToLoadTraitsMessage"] = "Il est recommandÃ© que vous dÃ©chargiez le plugin maintenant. Vous pouvez tenter de rechercher les erreurs dans votre fichier de traits :\n\"Documents\\The_Lord_of_the_Rings_Online\\PluginData\\<NomDuCompte>\\<NomDuServeur>\\<NomDuPerso>\\CombatAnalysisTraits.plugindata\"";
L["FailedToLoadSettingsResetConfirmation"] = "Ã‰chec du chargement de vos paramÃ¨tres de configuration. RÃ©initialiser et continuer ?".."\n".."Attention : Vous perdrez tous vos paramÃ¨tres personnels (exceptÃ© les configurations de buffs et dÃ©buffs).";
L["FailedToLoadSettingsMessage"] = "Il est recommandÃ© que vous dÃ©chargiez le plugin maintenant. Vous pouvez tenter de rechercher les erreurs dans votre fichier de configuration :\n\"Documents\\The_Lord_of_the_Rings_Online\\PluginData\\<NomDuCompte>\\<NomDuServeur>\\<NomDuPerso>\\TumbaAnalysis.plugindata\"";

-- Icon Menu

L["Logo"] = "Logo";
L["LockWindows"] = "Verrouiller les fenÃªtres";
L["UnlockWindows"] = "DÃ©verrouiller fenÃªtres";
L["SaveData"] = "Sauveg. donnÃ©es";
L["LoadData"] = "Import. donnÃ©es";
L["OpenTheMenu"] = "Ouvrir menu principal";

-- Menu Headings

L["MenuTitle"] = "Combat Analysis";

L["General"] = "GÃ©nÃ©ral";
L["Stats"] = "Statistiques";
L["Buffs"] = "Buffs";
L["About"] = "Ã€ propos";

-- General Menu

L["GeneralSettingsTitle"] = "RÃ©glages gÃ©nÃ©raux";
L["AutoSelectNewEncounters"] = "SÃ©lection automatique des nouvelles rencontres";
L["ConfirmDialogOnReset"] = "Dialogue de confirmation pour la remise Ã  zÃ©ro";
L["largeFont"] = "Agrandir le texte des stats (redÃ©marrage requis)";

L["ShowLogo"] = "Afficher le logo de Combat Analysis";

L["MaxStandardEncounters"] = "Nombre max de rencontres";
L["MaxLoadedEncounters"] = "Nombre max de rencontres importÃ©es";

L["TimerConfigurationsTitle"] = "RÃ©glages temporels";
L["CombatTimeout"] = "DÃ©lai d'expiration du combat";
L["TargetTimeout"] = "DÃ©lai d'expiration de la cible";
L["LogDelay"] = "DÃ©lai d'enregistrement";
L["EffectDelay"] = "DÃ©lai pour les effets";

L["SaveLoadTitle"] = "Sauvegarde/Importation";
L["AutoSaveData"] = "Enregistrement auto. des donnÃ©es";
L["Off"] = "Pas d'enregistrement";
L["SaveOnExit"] = "Enregistre en quittant";
L["SaveEncounters"] = "Enreg. les rencontres";

-- UI Menu

L["UI"] = "Interface";
L["Tabs"] = "Onglets";
L["Windows"] = "Panneaux";
L["Tab"] = "Onglets";
L["Window"] = "Panneau";

L["TabsAndWindowsConfigurationTitle"] = "Configuration des onglets et des panneaux";
L["TabsAndWindowsDescription"] = "DÃ©placez les onglets pour reconfigurer votre interface.\nDÃ©placez les onglets inutilisÃ©s dans le rangement sur la droite";

L["TabSettingsTitle"] = "ParamÃ©trage de l'onglet";
L["SelectedTab"] = "Onglet sÃ©lectionnÃ©";
L["ColorScheme"] = "Palette de couleurs ";
L["TempMorale"] = "Moral temporaire";
L["AutoSelectPlayer"] = "SÃ©lection automatique des dÃ©tails du joueur";

L["WindowSettingsTitle"] = "ParamÃ©trage de ce panneau";
L["SelectedWindow"] = "panneau sÃ©lectionnÃ©";
L["Background"] = "arriÃ¨re-plan";
L["XPos"] = "x-pos";
L["YPos"] = "y-pos";
L["Width"] = "Largeur";
L["Height"] = "Hauteur";
L["Minimized"] = "RÃ©duite";
L["CenterOnScreen"] = "Centrer Ã  l'Ã©cran";
L["AutoHideTabs"] = "Masquer les onglets en l'absence de la souris";
L["ShowBackground"] = "Afficher l'arriÃ¨re-plan et les bords";
L["ShowMiniTitleBar"] = "Afficher la mini barre fermer/rÃ©duire";
L["ShowTitleAndDuration"] = "Afficher titre et durÃ©e";
L["ShowEncountersList"] = "Afficher la liste des rencontres";
L["ShowTargetsList"] = "Afficher la liste des cibles";
L["ShowExtraButtons"] = "Afficher bouton *envoi dans canal* et *i*";

L["StatsWindowsConfigurationTitle"] = "Configuration des statistiques";
L["StatsWindowsDescription"] = "> DÃ©placez les cases pour reconfigurer votre interface\n> DÃ©placez les Ã©lÃ©ments inutiles dans le rangement Ã  droite";

L["StatsWindowSettingsTitle"] = "ParamÃ¨tres du panneau de statistiques";
L["Visibility"] = "VisibilitÃ©";
L["AlwaysShow"] = "Toujours visible";
L["ShowOnHover"] = "Montrer au survol";
L["ShowOnLock"] = "Sur verrouillage";

L["ReOrder"] = "DÃ©placement";
L["InsertTab"] = "InsÃ©rer l'onglet";
L["NewWindow"] = "Nouveau panneau";
L["CloseWindow"] = "Fermer panneau";

-- Buffs Menu

L["Debuffs"] = "DÃ©buffs";
L["CC"] = "ContrÃ´les";
L["CrowdControl"] = "ContrÃ´les de foules";
L["Bubbles"] = "Bulles";

L["TraitConfigurationsTitle"] = "Configurations des Traits";
L["SelectedConfiguration"] = "Configuration sÃ©lectionnÃ©e";
L["RemoveTraitConfigurationConfirmation"] = "ÃŠtes vous sÃ»r de vouloir supprimer cette configuration ?";

L["AddConfiguration"] = "Ajout de Configuration";
L["ConfigurationName"] = "Nom de cette config. ";
L["CopyDebuffsFrom"] = "Copier les dÃ©buffs de ";
L["None"] = "Aucun";
L["Add"] = "Ajout";
L["Remove"] = "Retrait";

L["ConfigurationNameRequired"] = "Un nom de Configuration est obligatoire";
L["ConfigurationNameAlreadyExists"] = "Ce nom de configuration existe dÃ©jÃ ";
L["ColorSchemeRequired"] = "Une palette de couleurs est obligatoire";

L["AddBuff"] = "Ajout des buffs";
L["AddDebuff"] = "Ajout des dÃ©buffs";
L["RemoveBuff"] = "Suppr. buff";
L["RemoveDebuff"] = "Suppr. dÃ©buff";
L["FilterList"] = "Filtres";
L["Remov"] = "Suppression"; -- lowercase (for filtering by removal only debuffs/CC)
L["Class"] = "Classe ";

-- { Full Name, Full Name with no spaces, Two Letter Abbreviation}
L["BuffBars"] = {"BuffBars", "BuffBars", "BB"}
L["CombatAnalysis"] = {"Combat Analysis", "CombatAnalysis", "CA"}
L["ConfigureInBuffBars"] = "Config. dans BuffBars";
L["BuffBarsNotLoadedMessage"] = "BuffBars n'est pas chargÃ© ou vous utilisez une version non compatible avec Combat Analysis.";

L["RemoverPrefix"] = "PrÃ©fixe de suppresseur";-- pas de trad
L["NameRequiredPrefix"] = "Nom Obligatoire";

L["EffectName"] = "Nom de l'Effet";
L["BuffName"] = "Nom du buff ";
L["DebuffName"] = "Nom du dÃ©buff ";
L["IconFileName"] = "Nom de l'icÃ´ne ";
L["RemovalOnly"] = "Suppresseur ";
L["ToggleSkill"] = "comp. permutable ";
L["Removes"] = "Suppression ";
L["ConflictsWith"] = "PrÃ©munit contre ";
L["EffectModifiers"] = "Modificateurs d'effets ";
L["IsStance"] = "Posture ";
L["StackingBuffs"] = "Buffs empilables ";
L["LogName"] = "Nom du Log";
L["AppliedBy"] = "AppliquÃ© Par ";
L["CritsOnlyAbbreviation"] = "Crit";
L["DelayAbbreviation"] = "Delai";
L["DurationAbbreviation"] = "DurÃ©e";

-- About Menu

L["AboutTitle"] = "A propos";
L["VersionNo"] = "Version NÂ°";
L["RestoreSettings"] = "Restaurer la config.";
L["RestoreSettingsConfirmation"] = "ÃŠtes vous sÃ»r de vouloir restaurer tous les paramÃ¨tres par dÃ©faut, Ã  l'exclusion des traits ?";
L["RestoreTraits"] = "Restaurer les traits";
L["RestoreTraitsConfirmation"] = "ÃŠtes vous sÃ»r de vouloir restaurer les paramÃ¨tres de configuration des traits Ã  leur valeur par dÃ©faut ?";
L["PluginUsageMessage"] = "Pour plus d'informations sur l'utilisation de ce plugin, visitez :";
L["FoundABugMessage"] = "Un Bug ? Signalez le en laissant un commentaire Ã  l'adresse ci-dessus, ou bien sur sa page Github.";

-- Tooltips

L["AutoSelectTooltip"] = "SÃ©lectionner immÃ©diatement la nouvelle rencontre lorsque le combat dÃ©bute.";
L["ConfirmOnResetTooltip"] = "Afficher une demande de confirmation lors de la rÃ©initialisation de toutes les rencontres.";
L["ShowLogoTooltip"] = "Afficher ou masquer le logo de Combat Analysis. \nCelui-ci permet d'afficher/masquer les fenÃªtres et d'accÃ©der au menu.";
L["LockWindowsTooltip"] = "VÃ©rrouiller toutes les fenÃªtres en l'Ã©tat, de sorte qu'elles ne puissent pas Ãªtre dÃ©placÃ©es, redimensionnÃ©es ou fermÃ©es, exceptÃ© via le menu de l'onglet ou par le menu principal.";
L["LargeFontTooltip"] = "Agrandit la taille du texte sur les fenÃªtres de vue d'esemble et de stats. Une fois ceci cochÃ©, vous devez fermer puis relancer C A pour voir les textes agrandis. Sinon les changements prendront effet au prochain lancement.";
L["MaxEncountersTooltip"] = "DÃ©finir le nombre de rencontres Ã  conserver dans l'historique.";
L["MaxLoadedEncountersTooltip"] = "DÃ©finir le nombre de rencontres importÃ©es Ã  conserver dans l'historique.";
L["CombatTimeoutTooltip"] = "DÃ©finir la pÃ©riode de grace aprÃ¨s la fin du combat durant laquelle les dÃ©gÃ¢ts sont encore pris en compte.";
L["TargetTimeoutTooltip"] = "DÃ©finir la pÃ©riode de grace aprÃ¨s la mort du joueur ou d'un monstre durant laquelle les dÃ©gÃ¢ts vers la cible demeurent pris en compte. Remarque : Cette valeur doit Ãªtre infÃ©rieure Ã  celle dÃ©finissant le delai d'expiration du combat.";
L["LogDelayTooltip"] = "DÃ©finir la pÃ©riode maximum entre la dÃ©tection d'un Ã©vÃ¨nement de combat et la dÃ©tection qu'un effet correspondant a Ã©tÃ© appliquÃ©";
L["EffectDelayTooltip"] = "DÃ©finir la pÃ©riode maximum entre la dÃ©tection qu'un effet a Ã©tÃ© appliquÃ© et la dÃ©tection d'un Ã©vÃ¨nement de combat correspondant.";
L["AutoSaveTooltip"] = "DÃ©finir comment les donnÃ©es sont automatiquement sauvegardÃ©es:\na) Les donnÃ©es ne sont pas sauvergardÃ©es automatiquement\nb) Toutes les donnÃ©es (l'ensemble des rencontres) sont sauvegardÃ©es lorsque vous vous dÃ©connectez (ou lorsque vous dÃ©chargez le plugin)\nc) Chaque rencontre est sauvegardÃ©e aussitÃ´t que le combat prend fin";

L["SelectedTabTooltip"] = "Selectionnez un onglet Ã  configurer.";
L["ColorSchemeTooltip"] = "DÃ©finissez le profil de couleur utilisÃ© par cet onglet.";
L["TempMoraleTooltip"] = "DÃ©finissez le profil de couleur utilisÃ© pour les dÃ©tails se rapportant au moral temporaire.";
L["AutoSelectPlayerTooltip"] = "Pour cet onglet : ImmÃ©diatement sÃ©lectionner les dÃ©tails du joueur lorsque qu'une nouvelle rencontre est sÃ©lectionnÃ©e.";
L["SelectWindowTooltip"] = "Selectionner une fenÃªtre Ã  configurer.";
L["BackgroundTooltip"] = "DÃ©finir la couleur d'arriÃ¨re-plan pour cette fenÃªtre.";
L["WindowTabsTooltip"] = "Une liste des onglets figurant actuellement dans cette fenÃªtre.";
L["CenterWindowOnScreenTooltip"] = "Centrer cette fenÃªtre sur votre Ã©cran. Cela maximisera Ã©galement la fenÃªtre, assurant ainsi que les onglets et arriÃ¨re-plans soient visibles";
L["AutoHideTabsTooltip"] = "Pour cette fenÃªtre : Afficher les onglets seulement lorque la souris survole la fenÃªtre.";
L["ShowBackgroundTooltip"] = "Pour cette fenÃªtre : Afficher ou masquer l'arriÃ¨re-plan et les bordures par dessus la surface d'affichage principal.";
L["ShowMiniTitleBarTooltip"] = "Pour cette fenÃªtre : Afficher ou masquer la mini barre de titre (avec le menu et les icÃ´nes minimiser et fermer).";
L["ShowTitleAndDurationTooltip"] = "Pour cette fenÃªtre : Afficher ou masquer le titre colorÃ© qui montre la cible sÃ©lectionnÃ©e et la durÃ©e.";
L["ShowEncountersListTooltip"] = "Pour cette fenÃªtre : Afficher ou masquer la liste dÃ©roulante des rencontres.";
L["ShowTargetsListTooltip"] = "Pour cette fenÃªtre : Afficher ou masquer la liste dÃ©roulante des cibles.";
L["ShowExtraButtonsTooltip"] = "Afficher ou masquer les boutons *Info* et *Envoi dans chat*.";
L["SelectedWindowTooltip"] = "SÃ©lectionner une fenÃªtre de statistiques Ã  configurer.";
L["StatsBackgroundTooltip"] = "DÃ©finir la couleur d'arriÃ¨re-plan pour cette fenÃªtre de statistiques.";
L["StatsWindowTabsTooltip"] = "Une liste des onglets figurant actuellement dans cette fenÃªtre.";
L["CenterStatsWindowOnScreenTooltip"] = "Centrer cette fenÃªtre de statistiques sur votre Ã©cran. Cela assurera Ã©galement que la fenÃªtre de statistiques est affichÃ©e (Toujours montrer).";
L["VisibilityTooltip"] = "Pour cette fenÃªtre de statistiques, veuillez spÃ©cifiez si:\na) la fenÃªtre sera toujours visible\nb) la fenÃªtre deviendra visible lorsque qu'une barre est survolÃ©e ou bien vÃ©rouillÃ©e dans l'un des onglets\nc) la fenÃªtre ne deviendra visible que lorsque les dÃ©tails d'une barre sont vÃ©rouillÃ©s";

L["SelectedConfigurationTooltip"] = "SÃ©lectionner quelle configuration de traits utiliser et Ã©diter ci-dessous. Ceci n'affecte que les informations relatives aux debuff et aux contrÃ´les de foules.";
L["AddConfigurationTooltip"] = "Ajouter une nouvelle configuration de traits.";
L["RemoveConfigurationTooltip"] = "Supprimer la configuration de traits sÃ©lectionnÃ©e.";
L["ConfigurationNameTooltip"] = "Attribuer un nom Ã  la configuration de traits. Celui-ci ne pourra pas Ãªtre modifiÃ© par la suite.";
L["CopyDebuffsFromTooltip"] = "SÃ©lectionner une configuration de traits depuis laquelle copier le set initial de debuffs.";
L["ConfigurationColorSchemeTooltip"] = "SÃ©lectionner un modÃ¨le de couleurs pour la nouvelle configuration.";
L["AddNewBuffTooltip"] = "Ajouter un nouveau buff.";
L["AddNewDebuffTooltip"] = "Ajouter un nouveau dÃ©buff.";
L["RemoveBuffTooltip"] = "Retirer ce buff/dÃ©buff.";
L["BuffsActiveInCombatAnalysisTooltip"] = "Observer/pister les buffs dans Combat Analysis.";
L["DebuffsActiveInCombatAnalysisTooltip"] = "Observer/pister les dÃ©buffs dans Combat Analysis.";
L["DebuffsActiveInBuffBarsTooltip"] = "Observer/pister les dÃ©buff dans BuffBars.";
L["MakeDebuffActiveInCombatAnalysisTooltip"] = "Cocher pour observer/pister ce debuff dans Combat Analysis.";
L["MakeDebuffActiveInBuffBarsTooltip"] = "Cocher pour observer/pister ce debuff dans BuffBars.";
L["ConfigureInBuffBarsLinkTooltip"] = "Cliquer pour aller dans le menu de BuffBars oÃ¹ se configurent les fenÃªtre d'effets qui montrent les debuffs et les contrÃ´les de foules qui sont dÃ©clenchÃ©s en fonction des paramÃ¨tres ci-dessous. Notez que ceux-ci correspndent aux types de dÃ©clencheurs \"Mob Debuffs\" & \"Mob CC\" dans BuffBars.";
L["ClassTooltip"] = "SpÃ©cifier Ã  quelle classe ce buff/dÃ©buff appartient.";
L["TempMoraleEffectNameTooltip"] = "SpÃ©cifier le nom de l'effet correspondant Ã  cette compÃ©tence de moral temporaire. Ce nom doit Ãªtre parfaitement similaire au nom de l'effet.";
L["SkillNameTooltip"] = "SpÃ©cifier un nom unique pour ce buff/debuff. Celui-ci apparaitra sur l'onglet Buffs/DÃ©buffs, ainsi que dans la fenÃªtre de'effets de Buffbars si applicable.";
L["IconFileNameTooltip"] = "SpÃ©cifier le mon de fichier (y compris son extension) de l'icÃ´ne Ã  associer Ã  ce debuff. L'icÃ´ne doit Ãªtre placÃ©e dans le dossier 'TumbaAnalysis/Resources/DebuffIcons' et doit mesurer 16x16 pixels.";
L["RemovalOnlyTooltip"] = "Un debuff 'Suppresseur' n'est pas observÃ©/pistÃ©, Ã  la place il est utilisÃ© pour retirer d'autres dÃ©buffs.";
L["ToggleSkillTooltip"] = "Une 'compÃ©tence permutable' est une compÃ©tence dÃ©sactivable/activable qui dure indÃ©finiment. Ces debuffs predurent jusqu'Ã  la mort de la cible, la fin du combat, ou leur dÃ©sactivation manuelle.";
L["RemovesTooltip"] = "Une liste de debuffs ou de contrÃ´les de foules qui seront supprimÃ©s quand ce debuff est appliquÃ©.";
L["AddRemoveTooltip"] = "Ajouter un nouveau dÃ©buff qui sera supprimÃ© quand ce dÃ©buff est appliquÃ©.";
L["RemoveRemoveTooltip"] = "Retirer le dÃ©buff sÃ©lectionnÃ© de liste des debuffs Ã  supprimer quand ce dÃ©buff est appliquÃ©.";
L["ConflictsWithTooltip"] = "Une liste de compÃ©tences de dÃ©buff et de contrÃ´le de foules qui prÃ©munissent contre ce dÃ©buff si elles sont actives.";
L["AddConflictTooltip"] = "Ajouter un nouveau dÃ©buff qui prÃ©munit contre ce dÃ©buff.";
L["RemoveConflictTooltip"] = "Supprimer le dÃ©buff sÃ©lectionnÃ© de la liste des dÃ©buffs qui prÃ©munissent contre cet effet.";
L["EffectModifiersTooltip"] = "Une liste d'effets, qui, s'ils sont actifs sur le joueur lorsque le dÃ©buff est lui est lancÃ©, allongent ou raccourcicent la durÃ©e de l'effet.";
L["AddEffectModifierTooltip"] = "Ajouter un nouvel effet qui modifie la durÃ©e de ce dÃ©buff.";
L["RemoveEffectModifierTooltip"] = "Supprimer l'effet sÃ©lectionnÃ© de la liste des modificateurs d'effets..";
L["EffectModifierDurationTooltip"] = "DÃ©finissez, en posifif ou nÃ©gatif, le rallongement ou le raccourcissement de la durÃ©e du dÃ©buff si cet effet est actif quand le debuff est activÃ©.";
L["IsStanceTooltip"] = "For skills that are stances, the number of applications are not tracked."; -- need trad
L["StackingBuffsTooltip"] = "Une liste de noms qui seront affichÃ©s pour le buff lors des applications succÃ©ssives lorsque celui-ci est encore actif au moment de sa rÃ©activation.";
L["AddStackingBuffTooltip"] = "Ajouter un nouvau nom d'effet empilable.";
L["RemoveStackingBuffTooltip"] = "Supprimer le nom sÃ©lectionnÃ© de la liste des noms d'effets empilables.";
L["LogNameTooltip"] = "Specify the name of the combat log entry corresponding to this temporary morale skill that will be used to match a bubble effect with the initiating player. The name must exactly match the name of the skill as it appears in the combat log."; -- need trad
L["BuffAppliedByTooltip"] = "Une liste de noms d'effets qui dÃ©clenchent l'application de ce buff. Les noms doivent Ãªtre parfaitement similaires aux noms des effets.";
L["DebuffAppliedByTooltip"] = "Une liste de noms de compÃ©tence du log combat qui dÃ©clenchent l'application de ce dÃ©buff, et les dÃ©tails associÃ©s. Les noms doivent Ãªtre parfaitement similaires aux noms des compÃ©tences telles qu'elles apparaissent dans le log combat.";
L["AddAppliedByTooltip"] = "Add a new application."; -- need trad
L["RemoveAppliedByTooltip"] = "Remove the selected application from the list of applications."; -- need trad
L["CritsOnlyTooltip"] = "When checked, the debuff will only be applied if the skill achieves a Critical or Devastating hit.";
L["DelayTooltip"] = "Set the delay after the application occurs until the skill activates. Note this can be a small negative value to offset a delay before the combat log entry occurs.";
L["DurationTooltip"] = "DÃ©finir la durÃ©e du dÃ©buff.";

-- Tutorials

L["DoNotShowHintInFuture"] = " Ne plus afficher cette\n  astuce Ã  l'avenir"; -- be sure to include line break and spaces
L["LogoTitle"] = "Utiliser le Logo Combat Analysis";
L["LogoMessage"] = "Clic Gauche sur le logo pour Afficher/Masquer l'ensemble des fenÃªtres de Combat Analysis.\n\Clic droit quand le logo est activÃ© (orange) pour faire apparaitre l'option de sauvegarde/importation ou le menu principal.\n\nDÃ©placez le Logo en appuyant simultanÃ©ment sur 'Control' et '*'. Vous pouvez Ã©galement le dÃ©sactiver Ã  partir du menu principal.";

-- Colors by { FullName, Single Letter Abbreviation }
L["Yellow"] = {"Jaune", "J"};
L["Red"] = {"Rouge", "R"};
L["Green"] = {"Vert", "V"};
L["Blue"] = {"Bleu", "B"};
L["Alpha"] = {"Alpha", "A"};

-- Commands

L["Options"] = "options";
L["Settings"] = "paramÃ¨tres";
L["Setup"] = "configuration";
L["ShowCommand"] = "afficher";
L["HideCommand"] = "cacher";
L["ToggleCommand"] = "basculer";
L["SaveCommand"] = "sauver";
L["LoadCommand"] = "charger";
L["LockCommand"] = "verrouiller";
L["UnlockCommand"] = "dÃ©verrouiller";
L["ResetCommand"] = "rÃ©initialiser";
L["LockToggleCommand"] = "verrou";
L["CleanUpCommand"] = "nettoyer";

L["CommandUsage"] = "usage: /ca "..L.Options.." | "..L.SaveCommand.." | "..L.LoadCommand.." | "..L.ToggleCommand.." | "..L.ShowCommand.." | "..L.HideCommand.." | "..L.LockToggleCommand.." | "..L.LockCommand.." | "..L.UnlockCommand.." | "..L.ResetCommand.." | "..L.ResetTotalsCommand.." | "..L.CleanUpCommand;
-- Value/Date Formatting

L["Thousand"] = "K";
L["Million"] = "M";
L["Billion"] = "G";
L["Trillion"] = "T";

L["Jan"] = {"Jan","Janvier"};
L["Feb"] = {"FÃ©v","FÃ©vrier"};
L["Mar"] = {"Mar","Mars"};
L["Apr"] = {"Avr","Avril"};
L["May"] = {"Mai","Mai"};
L["Jun"] = {"Jun","Juin"};
L["Jul"] = {"Jul","Juillet"};
L["Aug"] = {"Aou","Aout"};
L["Sep"] = {"Sep","Septembre"};
L["Oct"] = {"Oct","Octobre"};
L["Nov"] = {"Nov","Novembre"};
L["Dec"] = {"DÃ©c","DÃ©cembre"};

-- Options

L["ResetTotalsMessage"] = "ÃŠtes vous sÃ»r de vouloir rÃ©initialiser le cumulatif ?";
L["Yes"] = "Oui";
L["No"] = "Non";
L["OK"] = "Compris";

-- Classes

L["Burglar"] = {"Cambrioleur","CAM"};
L["Captain"] = {"Capitaine","CAP"};
L["Champion"] = {"Champion","CHP"};
L["Guardian"] = {"Gardien","GRD"};
L["Hunter"] = {"Chasseur","CHS"};
L["LoreMaster"] = {"Maitre du Savoir","MDS"};
L["Minstrel"] = {"MÃ©nestrel","MEN"};
L["RuneKeeper"] = {"Gardien des Runes","GDR"};
L["Warden"] = {"Sentinelle","SEN"};
L["Beorning"] = {"BÃ©ornide","BEO"};
L["Brawler"] = {"Bagarreur", "BAG"};

L["BlackArrow"] = {"FlÃ¨che noire","FN"};
L["Defiler"] = {"Profanateur","PRO"};
L["Reaver"] = {"Faucheur","FAU"};
L["Stalker"] = {"Ouargue","WAR"};
L["WarLeader"] = {"Chef de guerre","CDG"};
L["Weaver"] = {"AraignÃ©e","GNE"};

L["Racial"] = {"Race","RAC"};
L["Item"] = {"Objet","OBJ"};
L["OtherClass"] = {"Autre","INC"};

-- Select File Dialog

L["Select"] = "SÃ©lectionner";
L["Save"] = "Sauvegarder";
L["Saves"] = "Sauvegardes";
L["Load"] = "Charger";
L["Loads"] = "ChargÃ©s"; -- A vÃ©rifier
L["Cancel"] = "Annuler";

L["FileName"] = "Nom du ficher ";

L["SelectAll"] = "Tout sÃ©lec.";
L["ClearAll"] = "Tout dÃ©-sÃ©lec. ";

L["Delete"] = "Effacer";

L["AreYouSureYouWantToDeleteMessage"] = "ÃŠtes-vous sÃ»r de vouloir supprimer\nle(s) fichier(s) sÃ©lectionnÃ©(s)?";

L["Encounters"] = "Rencontres";
L["Items"] = "Objets";
L["CombineWith"] = "Combiner Avec";
L["CombineInto"] = "Combiner Dans";

L["SelectCurrentDataToCombineWith"] = "Combiner les donnÃ©es chargÃ©es avec les donnÃ©es actuelles ";
L["LoadDataAsTotalsEncounter"] = "Remplacer le cumulatif avec les donnÃ©es chargÃ©es";

L["SelectSaveFile"] = "Choisir une sauvegarde";
L["SelectFileToLoad"] = "Choisir le fichier Ã  charger";
L["SelectDataToSave"] = "Choisir le fichier Ã  sauvegarder";
L["SelectDataToCombineWith"] = "Combiner avec";

L["TooLong"] = "Vous ne pouvez entrer qu'un maximum de 64 caractÃ¨res.";
L["IllegalCharacters"] = "Vous ne pouvez entrer que des lettres, des chiffres, des espaces et des soulignÃ©s.";

L["NoDataMessage"] = "Il n'y a actuellement aucune donnÃ©e Ã  enregistrer.";
L["NoFileMessage"] = "Pas de fichier spÃ©cifiÃ©.";
L["NoDataSelectedMessage"] = "Aucune donnÃ©e n'a Ã©tÃ© sÃ©lectionnÃ©e.";
L["OverwriteFileMessage"] = "Le fichier existe dÃ©jÃ . Voulez-vous combiner les donnÃ©es enregistrÃ©es avec ce fichier ou les remplacer ?";
L["CombineOrSeparateMessage"] = "Vous avez sÃ©lectionnÃ© plusieurs fichiers. Voulez-vous combiner les donnÃ©es ou les charger sÃ©parÃ©ment ?";
L["TooManyCharactersMessage"] = "Le nom de fichier spÃ©cifiÃ© est trop long (longueur maximale = 64 caractÃ¨res)";
L["InvalidCharactersMessage"] = "Le nom de fichier spÃ©cifiÃ© contient des caractÃ¨res non valides..";
L["FileNotFoundMessage"] = "L'un des fichiers spÃ©cifiÃ©s n'a pu Ãªtre trouvÃ©.";
L["SaveFailedMessage"] = "Ã‰chec de la sauvegarde: ";
L["LoadFailedMessage"] = "Ã‰chec du chargement: ";
L["CombineMessage"] = "ÃŠtes-vous sÃ»r de vouloir combiner les fichiers sÃ©lectionnÃ©s ?";
L["LoadBeforeSaveMessage"] = "L'un des fichiers sÃ©lectionnÃ© est actuellement utilisÃ© et ne peut donc pas Ãªtre encore chargÃ©. Essayez Ã  nouveau dans environ 10-15 secondes."

L["Combine"] = "Combiner";
L["Combines"] = "Combines";
L["Overwrite"] = "Remplacer";
L["Combined"] = "CombinÃ©";
L["Separate"] = "SÃ©parer";

-- Encounter Default Names

L["Totals"] = "Cumulatif";
L["Encounter"] = "Rencontre";
L["CurrentEncounter"] = "Rencontre actuelle";
L["CompletedEncounter"] = "Rencontre terminÃ©e";

-- Right Click Menu

L["RestoreTab"] = "Restaurer l'onglet";
L["CloseTab"] = "Fermer l'onglet";

L["ResetTotals"] = "RÃ©initialiser le cumulatif";
L["CleanUp"] = "Vider la poubelle";

-- Chat Menu (indexed by {command, channel name})

L["Say"] = {"parler","Parler"};
L["Fellowship"] = {"f","CommunautÃ©"};
L["Raid"] = {"ra","Raid"};
L["Kinship"] = {"k","ConfrÃ©rie"};
L["Tribe"] = {"k","Tribu"};
L["Gap"] = "------------------";

-- Other

L["AllPlayers"] = "Tous les joueurs";
L["AllSkills"] = "CompÃ©tences (tous)";
L["Duration"] = "DurÃ©e";
L["SendToChat"] = "Envoi dans canal";
L["CombatAnalysisSummary"] = "RÃ©sumÃ© de Combat Analysis";

L["DirectDamage"] = "DÃ©gÃ¢t direct";

L["MinutesAbbr"] = "m";
L["SecondsAbbr"] = "s";

L["Daze"] = "HÃ©bÃ©tÃ©";
L["Root"] = "EnracinÃ©";
L["Fear"] = "Peur";
L["Stun"] = "AssommÃ©";
L["Knockdown"] = "RenversÃ©";

-- Statistics Headings

L["AllData"] = "Toutes les infos";
L["NonCrits"] = "Non-critiques";
L["CritsAndDevs"] = "Crit & DÃ©vast";
L["Partials"] = "Ã‰vitements partiels";

L["Total"] = "Total";
L["Average"] = "Montant moy.";
L["Maximum"] = "Montant max.";
L["Minimum"] = "Montant min.";

--- Added in v4.4.7 to support Normal Hits
L["NormalHits"] = "Coups non-critiques";
L["NormalHitChance"] = "FrÃ©quence";
L["NormalHitAvg"] = "Montant moy.";
L["NormalHitMax"] = "Montant max."
L["NormalHitMin"] = "Montant min."

--- Added in v4.4.7 to support Critical Hits
L["CriticalHits"] = "Coups critiques";
L["CriticalHitChance"] = "FrÃ©quence";
L["CriticalHitAvg"] = "Montant moy.";
L["CriticalHitMax"] = "Montant max."
L["CriticalHitMin"] = "Montant min."

--- Added in v4.4.7 to support Devastate Hits
L["DevastateHits"] = "Coups crit. dÃ©vastateurs";    
L["DevastateHitChance"] = "FrÃ©quence";
L["DevastateHitAvg"] = "Montant moy.";
L["DevastateHitMax"] = "Montant max."       
L["DevastateHitMin"] = "Montant min."

L["Avoidance"] = "Ã‰vitements";
L["Attacks"] = "Actions";
L["AttacksPS"] = "Actions/s";
L["Hits"] = "Coups rÃ©ussis";
L["Absorbs"] = "Coups absorbÃ©s";
L["Misses"] = "Coups ratÃ©s";
L["Deflects"] = "Coups reflÃ©tÃ©s";  -- ou bien "dÃ©viÃ©s" ?
L["Immune"] = "ImmunisÃ©s";
L["Resists"] = "RÃ©sistÃ©s";
L["PhysicalAvoids"] = "Ã‰vitements physiques";
L["FullAvoids"] = "Ã‰vitements complets";
L["PartialAvoids"] = "Ã‰vitements partiels";
L["Avoids"] = "Ã‰vitements complets";
L["Blocks"] = "BloquÃ©s";
L["Parrys"] = "ParrÃ©s";
L["Evades"] = "EsquivÃ©s";
L["PartialBlocks"] = "Blocages Partiels";
L["PartialParrys"] = "Parades Partielles";
L["PartialEvades"] = "Esquives Partielles";

L["Other"] = "Autre";
L["Interrupts"] = "Interruptions";
L["CorruptionsRemoved"] = "Corruptions";

L["DmgTypes"] = "Types de dÃ©gÃ¢ts";

L["TempMorale"] = "Moral temporaire";
L["RegularHeals"] = "Soins normaux";
L["TempHeals"] = "Soins temporaires";
L["WastedTempHeals"] = "Soins perdus";

-- Note the following elements are indexed by: {Short Name, Full Name, Per Second Abbreviation, Tab Title, Tab Tooltip}

L["Dmg"] = {"InfligÃ© ","DÃ©gÃ¢ts infligÃ©s ","InfligÃ©/s ","DÃ©gÃ¢ts InfligÃ©s","Onglet dÃ©gÃ¢ts infligÃ©s"}
L["Taken"] = {"Subi ","DÃ©gÃ¢ts subis","Subi/s ","DÃ©gÃ¢ts subis","Onglet dÃ©gÃ¢ts subis"}
L["Heal"] = {"SoignÃ© ","Soins reÃ§us et prodiguÃ©s","Soin/s ","Soins","Onglet soins reÃ§us et prodiguÃ©s"}
L["Power"] = {"Puiss ","Puissance reÃ§ue et envoyÃ©e","Puiss/s ","Puissance","Onglet puissance reÃ§ue et absorbÃ©e"}

L["Debuff"] = {"Debuff","Debuff","Debuff","Onglet des Debuffs","Onglet sur la durÃ©e des Debuffs"}
L["Buff"] = {"Buff","Buff","Buff","Onglet des Buffs","Onglet sur la durÃ©e des Buffs"}

L["Death"] = {"Mort","Mort"}
L["Corruption"] = {"Corruption","Corruption RetirÃ©e"}
L["Interrupt"] = {"Interruption","Interruption"}
L["CombatEntered"] = {"DÃ©but combat","DÃ©but du combat"}
L["CombatExited"] = {"Fin combat","Fin du combat"}


L["AvoidanceEnum"] = {{"Aucun","Aucun"},{"RatÃ©","RatÃ©"},{"ImmunisÃ©","ImmunisÃ©"},{"RÃ©sistÃ©","RÃ©sistÃ©"},
                      {"BloquÃ©","BloquÃ©"},{"ParÃ©","ParÃ©"},{"EsquivÃ©","EsquivÃ©"},
                      {"BloquÃ©-P","BloquÃ© partiellement"},{"ParÃ©-P","ParÃ© partiellement"},{"EsquivÃ©-P","EsquivÃ© partiellement"},
                      {"ReflÃ©tÃ©", "ReflÃ©tÃ©"}}

L["CriticalEnum"] = {{"Aucun","Aucun"},{"Critique","Coups Critique"},{"DÃ©vastateur","Coups DÃ©vastateur"}}

L["DmgTypeEnum"] = {{"Commun","Commun"},{"Feu","Feu"},{"Foudre","Foudre"},{"Froid","Froid"},{"Acide","Acide"},{"Ombre","Ombre"},{"LumiÃ¨re","LumiÃ¨re"},
					{"Bele","Beleriand"},{"Ouist","Ouistrenesse"},{"Nain","Nain d'antan"},{"Orque","Orque"},{"Mal","MalÃ©fique"},{"Aucun", "Aucun"}}

					
L["MoralePower"] = {{"Moral","Moral"},{"Puissance","Puissance"},{"Aucun","Aucun"}}




--[[

The complete parsing function. Since the order of text in the combat log is likely to differ in
different languages, this entire function is included  in the localization class.

The function is given an input line from the combat log, and parses that line to determine its meaning.
The final step in each section is to return the extracted values. These lines need not be updated, but
the correct info must be extracted into the relevant fields.

Note the use of numeric values for avoids, critical hits, dmg types, and morale/power. These numbers
correspond to the orderings in the four lists directly above this comment block.

You will need to know something about lua pattern matching and/or regex's to attempt to translate this
section. See http://www.lua.org/pil/20.2.html for more details.

]]--

-- Renvoie un nom sans les articles
local function TrimArticles(name)
	if (name == nil) then
		return nil;
	end

	-- Articles possibles: Mayara, LeMayara, Le Mayara, LaMayara, La Mayara, L' Mayara, La Mayara, et peut Ãªtre d'autres ?
	return string.gsub(name, "^[Ll].-(%u)", "%1");
end


L["Parse"] = function(line)

	-- 1) ligne de dÃ©gÃ¢ts, incluant les attaque partiellement Ã©vitÃ©es ---
	-- La Cible DPS factice a infligÃ© un coup partiellement esquivÃ© avec Attaque Ã  distance sur Adragor pour 6,538 points de type Commun Ã  l'entitÃ© Moral.
	-- Adragor a infligÃ© un coup critique avec RhÃ©torique glaciale sur la Cible DPS factice pour 51,642 points de type Froid Ã  l'entitÃ© Moral.
	
	local initiatorName,avoidAndCrit,skillName,targetName,amount,dmgType,moralePower = string.match(line,"^(.*) a infligÃ© un coup (.*)avec (.*) sur (.*) pour ([%d,]*) points de type (.*) Ã  l'entitÃ© ?(.*)%.$"); -- (updated in v4.1.0)
		
	if (initiatorName ~= nil) then
	
		local avoidType =
			string.match(avoidAndCrit,"partiellement bloquÃ©") and 8 or
			string.match(avoidAndCrit,"partiellement parÃ©") and 9 or
			string.match(avoidAndCrit,"partiellement esquivÃ© ") and 10 or 1;			
		local critType =
			string.match(avoidAndCrit,"critique") and 2 or
			string.match(avoidAndCrit,"dÃ©vastateur") and 3 or 1;
			
--		skillName = string.match(skillName,"^ avec (.*)$") or L.DirectDamage; -- (as of v4.1.0)

-- 		variables dÃ©ja incluses plus haut 
--		local targetName,amount,dmgType,moralePower = string.match(targetNameAmountAndType,"^(.*) pour ([%d,]*) (.*)points de type \"(.*)\" Ã  (.*)$");

-- Pas sÃ»r que les 3 lignes en dessous soit utiles
--   if (printDebug) then
--      Turbine.Shell.WriteLine( "damage by "..initiatorName.." skill "..skillName );
--  end	
	
		-- damage was absorbed
		if targetName == nil then
			amount = 0;
			dmgType = 13;
			moralePower = 3;
		-- some damage was dealt
		else
			amount = string.gsub(amount,",","")+0;
      
			dmgType = string.match(dmgType, "^%(.*%) (.*)$") or dmgType; -- 4.2.3 adjust for mounted combat
			-- note there may be no damage type
			dmgType = 
				dmgType == "Commun" and 1 or
				dmgType == "Feu" and 2 or
				dmgType == "Foudre" and 3 or
				dmgType == "Froid" and 4 or
				dmgType == "Acide" and 5 or
				dmgType == "Ombre" and 6 or
				dmgType == "LÃ©gÃ¨re" and 7 or
				dmgType == "Beleriand" and 8 or
				dmgType == "Ouistrenesse" and 9 or
				dmgType == "de nain d'antan" and 10 or 
				dmgType == "Orque" and 11 or
				dmgType == "MalÃ©fique" and 12 or 13;
			moralePower = (moralePower == "Moral" and 1 or moralePower == "Puissance" and 2 or 3);
		end
		
		-- Currently ignores damage to power
		if (moralePower == 2) then return nil end
		
		-- Update
		return event_type.DMG_DEALT,TrimArticles(initiatorName),TrimArticles(targetName),skillName,amount,avoidType,critType,dmgType;
	end

	-- 2) Ligne de soins --
	--     (note the distinction with which self heals are now handled)
	--     (note we consider the case of heals of zero magnitude, even though they presumably never occur)

	--	[slfHeal] Arc du Juste a appliquÃ© un soin critique Ã  Ardichas, redonnant 52 points Ã  l'entitÃ© Puissance.
	--  [slfHeal] Esprit de soliloque a appliquÃ© un soin critique Ã  Yogimen, redonnant 228 points Ã  l'entitÃ© Moral.
	--  [Heal]    Eleria a appliquÃ© un soin avec Paroles de guÃ©rison Ardicapde, redonnant 227 points Ã  Moral.
	
	local initiatorName, match = string.match(line, '^(.*) a appliquÃ© un soin (.*)%.$');

	if (initiatorName ~= nil) then
		local critType =
				string.match(match, 'critique') and 2 or
				string.match(match, 'dÃ©vastateur') and 3 or 1;
				
			match = string.gsub(match, '^critique ', '');
			match = string.gsub(match, '^dÃ©vastateur ', '');

		local self_heal = (string.match(match, '^Ã  ') and true or false);

		-- Soins personnels (Self heal)
		-- GuÃ©rison d'Attaque fortifiante a appliquÃ© un soin Ã  Adra, redonnant 314,802 points Ã  l'entitÃ© Moral.
		if (self_heal) then
			skillName = initiatorName;
			targetName, dmg_amount, moralePower = string.match(match, '^Ã  (.*), redonnant ([%d,]*) points? Ã  l\'entitÃ© ?(.*)$');
			initiatorName = targetName;

		-- Soins sur une cible (Heal applied)
		else
			skillName, targetName, dmg_amount, moralePower = string.match(match, '^avec (.*) ([^%s]+), redonnant ([%d,]*) points? Ã  ?(.*)$');
		end

		moralePower = (moralePower == 'Moral' and 1 or (moralePower == 'Puissance' and 2 or 3));
		dmg_amount = (moralePower == 3 and 0 or string.gsub(dmg_amount, ',', '') + 0);

		return (moralePower == 2 and event_type.POWER_RESTORE or event_type.HEAL), TrimArticles(initiatorName), TrimArticles(targetName), skillName, dmg_amount, critType;
	end
	
	-- 3) Ligne de buff --
	-- MarieChantal a appliquÃ© un bÃ©nÃ©fice avec Paroles de guÃ©rison Eleria.
	-- Osred a appliquÃ© un bÃ©nÃ©fice critique avec Cri de ralliement Osred.

	local initiatorName,skillName,targetName = string.match(line,"^(.*) a appliquÃ© un bÃ©nÃ©fice (.*)avec (.*) (.*)%.$");
	
	if (initiatorName ~= nil) then

		-- Update
		return event_type.BENEFIT,TrimArticles(initiatorName),TrimArticles(targetName),skillName;
	end
	
	-- 4) Ligne d'Ã©vitements --
	-- L' Profanateur ghÃ¢shfra vigoureux a essayÃ© d'utiliser une attaque de lancer faible sur MarieChantal mais a esquivÃ© la tentative.
	-- L' Cible DPS factice a essayÃ© d'utiliser Attaque Ã  distance sur Adragor mais il a esquivÃ© la tentative.
	-- L' Berserker hante-jours a essayÃ© d'utiliser une double attaque au corps Ã  corps sur Eleria mais elle a parÃ© la tentative.

	-- Ã‰vitements standards (complets)
	-- L' Eau sinistre redoutable a essayÃ© d'utiliser Maladie sur Osred mais il a rÃ©sistÃ© la tentative.
	-- L' Eau sinistre redoutable a essayÃ© d'utiliser une attaque au corps Ã  corps modÃ©rÃ©e sur Osred mais il a esquivÃ© la tentative.
	
	local initiatorName, skillName, targetName, avoidType = string.match(line, "^(.*) a essayÃ© d'utiliser (.*) sur (.*) mais (.*) la tentative%.$");

	if (initiatorName ~= nil) then
		avoid_Type =
			string.match(avoidType,"bloquÃ©") and 5 or
			string.match(avoidType,"parÃ©") and 6 or
			string.match(avoidType,"esquivÃ©") and 7 or
			string.match(avoidType,"rÃ©sistÃ©") and 4 or
			string.match(avoidType,"immunisÃ© contre") and 3 or 1;

		if (avoid_type == 1) then
			return nil;
		end
		return event_type.DMG_DEALT, TrimArticles(initiatorName), TrimArticles(targetName), skillName, 0, avoid_Type, 1, 10;
	end
			
	-- 4b miss or deflect (deflect added in v4.2.2)

	-- La Eau sinistre misÃ©rable n'a pas rÃ©ussi Ã  utiliser une double attaque au corps Ã  corps sur le Osred.
	local initiatorName, skillName, targetName = string.match(line, "^(.*) n'a pas rÃ©ussi Ã  utiliser (.*) sur (.*)%.$");

	-- il manque le deflect
	
	if (initiatorName ~= nil) then
		local avoidType = 2;
	
		-- Sanity check: must have avoided in some manner
		if (avoidType == 1) then return nil end
		
		-- Update
		return event_type.DMG_DEALT,initiatorName,targetName,skillName,0,avoidType,1,13;
	end
	
	-- 5) Reflect line 

	-- reflet de dÃ©gÃ¢ts
	-- Le Beorgal a renvoyÃ© 1,106 Commun de dÃ©gÃ¢ts au Moral de le Gobelin porteur de bombes.
	
	-- reflet soins
	-- Le Sangsue gardienne a renvoyÃ© 339 points redonnÃ©s au Moral de Eleria.

	local initiatorName,amount,reflectType,targetName = string.match(line,"^(.*) a renvoyÃ© ([%d,]*) (.*) au Moral de (.*)%.$");
	
	if (initiatorName ~= nil) then
		local skillName = "Reflect";
		amount = string.gsub(amount,",","")+0;
		
		local dmgType = string.match(reflectType,"^(.*)de dÃ©gÃ¢ts$");
		-- a damage reflect
		if (dmgType ~= nil) then
			dmgType = 
				dmgType == "Commun" and 1 or
				dmgType == "Feu" and 2 or
				dmgType == "Foudre" and 3 or
				dmgType == "Froid" and 4 or
				dmgType == "Acide" and 5 or
				dmgType == "Ombre" and 6 or
				dmgType == "LÃ©gÃ¨re" and 7 or
				dmgType == "Beleriand" and 8 or
				dmgType == "Ouistrenesse" and 9 or
				dmgType == "de nain d'antan" and 10 or
				dmgType == "Orc" and 11 or
				dmgType == "MalÃ©fique" and 12 or 13;						
			-- Update
			return event_type.DMG_DEALT,TrimArticles(initiatorName),TrimArticles(targetName),skillName,amount,1,1,dmgType;
		-- a heal reflect
		else
			-- Update
			return event_type.HEAL,TrimArticles(initiatorName),TrimArticles(targetName),skillName,amount,1;
		end
	end
	
	-- 6) Temporary Morale bubble line (as of 4.1.0)
	-- Vous avez perdu 11 points de Moral temporaire !
  local amount = string.match(line,"^Vous avez perdu ([%d,]*) points de Moral temporaire !$");
	if (amount ~= nil) then
		amount = string.gsub(amount,",","")+0;
		
		-- the only information we can extract directly is the target and amount
		return event_type.TEMP_MORALE_LOST,nil,TrimArticles(player.name),nil,amount;
	end
	
	-- 7) Combat State Break notice (as of 4.1.0)
	
	-- 7a) Root broken
	-- Racine invoquÃ©e vous a dÃ©livrÃ© de l'immobilisationÂ !
	initiatorName, targetName = string.match(line, "^(.*) dÃ©livrÃ© (.*) de l'immobilisationÂ !$");  -- Ã  vÃ©rifier

	if (initiatorName ~= nil) then
		-- the only information we can extract directly is the target name
		initiatorName =
			string.match(initiatorName, "^Vous avez") and player.name or
			string.match(initiatorName, " vous a$") and string.gsub(initiatorName, " vous a$", "") or
			string.gsub(initiatorName, " a$", "");
		targetName = (targetName == "" and player.name or targetName);

		if (printDebug) then
  			Turbine.Shell.WriteLine("root_broken", line, "ini_name: " .. initiatorName .. " tgt_name: " .. targetName);
		end

		return event_type.CC_BROKEN, nil, TrimArticles(targetName), nil;
	end
	
	-- 7b) Daze broken
	-- 	Vous avez dÃ©livrÃ© Gobelin manipulÃ© de l'hÃ©bÃ©tementÂ !	
	initiatorName, targetName = string.match(line, "^(.*) dÃ©livrÃ© (.*) de l'hÃ©bÃ©tementÂ !$"); -- Ã  vÃ©rifier

	if (initiatorName ~= nil) then
		initiatorName =
			string.match(initiatorName, "^Vous avez") and player.name or
			string.match(initiatorName, " vous a$") and string.gsub(initiatorName, " vous a$", "") or
			string.gsub(initiatorName, " a$", "");
		targetName = (targetName == "" and player.name or targetName);

		if (printDebug) then
		  Turbine.Shell.WriteLine("daze_broken", line, "ini_name: " .. initiatorName .. " tgt_name: " .. targetName);
		end  
		  
	end

	-- 7c) Fear broken
	-- Votre attaque a dissipÃ© la peur qui Ã©treignait Gobelin porteur de bombesÂ !
	local targetName = string.match(line,"^.* a dissipÃ© la peur qui Ã©treignait (.*)Â !$");   -- Ã  vÃ©rifier
	if (targetName ~= nil) then
		
		-- the only information we can extract directly is the target name
		return event_type.CC_BROKEN,nil,targetName,nil;
	end


	-- 8) Interrupt line --
	
	local targetName, initiatorName = string.match(line, "^(.*) a Ã©tÃ© interrompu par (.*) !$");

	if (targetName ~= nil) then
		return event_type.INTERRUPT, TrimArticles(initiatorName), TrimArticles(targetName);
	end
	
	-- 9) Dispell line (corruption removal) --
	
	local corruption, targetName = string.match(line, "Vous avez dissipÃ© l'effet (.*) affectant (.*)%.$");

	if (corruption ~= nil) then
		initiatorName = player.name;
		-- NB: Currently ignore corruption name
		
		-- Update
		return event_type.CORRUPTION, TrimArticles(initiatorName), TrimArticles(targetName);
	end
	
	-- 10) Defeat lines ---
	
	-- 10a) Defeat line 1 (mob or played was killed)
	-- Hellokitting a vaincu la Racine invoquÃ©e.
	initiatorName = string.match(line, "^.* a vaincu (.*)%.$");

	if (initiatorName ~= nil) then

	-- Update
		return event_type.DEATH, TrimArticles(initiatorName);
	end

	-- 10b) Defeat line 2 (mob died)
	initiatorName = string.match(line, "^(.*) meurt%.$");

	if (initiatorName ~= nil) then
		
		-- Update
		return event_type.DEATH, TrimArticles(initiatorName);
	end

	-- 10c) Defeat line 3 (a player was killed or died)
	initiatorName = string.match(line, "^(.*) a pÃ©ri%.$");

	if (initiatorName ~= nil) then
		
		-- Update
		return event_type.DEATH, TrimArticles(initiatorName);
	end

	-- 10d) Defeat line 4 (you were killed)
	match = string.match(line, "^.* a rÃ©ussi Ã  vous mettre hors de combat%.$");

	if (match ~= nil) then
		initiatorName = player.name;
		
		-- Update
		return event_type.DEATH, TrimArticles(player.name);
	end

	-- 10e) Defeat line 5 (you died)
	match = string.match(line, "^Un incident vous a rÃ©duit Ã  l'impuissance%.$");

	if (match ~= nil) then
--	initiatorName = player.name;	-- Ã  activer ?
		-- Update
		return event_type.DEATH, TrimArticles(player.name);
	end	
	-- 10f) Defeat line 6 (you killed a mob)
	-- Votre coup puissant a vaincu la Racine invoquÃ©e.
	local initiatorName = string.match(line,"^Votre coup puissant a vaincu (.*)%.$");
	
	if (initiatorName ~= nil) then
		
		-- Update
		return event_type.DEATH,TrimArticles(initiatorName);
	end
	
	-- 11) Revive lines --
	
	-- 11a) Revive line 1 (player revived)
	local initiatorName = string.match(line,"^(.*) revient Ã  la vie%.$");
	
	if (initiatorName ~= nil) then
	  
		-- Update
	  return event_type.REVIVE,TrimArticles(initiatorName);
	end
	
	-- 11b) Revive line 2 (player succumbed)
	local initiatorName = string.match(line,"^(.*) a succombÃ© Ã  ses blessures%.$");
	
	if (initiatorName ~= nil) then
	  
		-- Update
	  return event_type.REVIVE,TrimArticles(initiatorName);
	end
	
	-- 11c) Revive line 3 (you were revived)
	local match = string.match(line,"^Vous revenez Ã  la vie%.$");
	
	if (match ~= nil) then
	  initiatorName = player.name;
	  
		-- Update
	  return event_type.REVIVE,initiatorName;
	end
	
	-- 11d) Revive line 4 (you succumbed)
	local match = string.match(line,"^Vous avez succombÃ© Ã  vos blessures%.$");
	
	if (match ~= nil) then
	  initiatorName = player.name;
	  
		-- Update
	  return event_type.REVIVE,initiatorName;
	end
	
	-- if we reach here, we were unable to parse the line
	--  (note there is very little that isn't parsed)
end



--[[
	
	Skill Names (for Temporary Morale & Buff/Debuff tracking)
	
	> Temporary Morale Skill Names need specify both how the skill name appears in the combat log, as
	    well as how it appears on the effect tooltip.
	
	> Buff Names must match exactly how the name of a skill appears in the effect tooltip.
	> Benefit/Debuff/Crowd-Control Names must match exactly how the name of a skill appears in the combat log.
	
--]]

L["Default"] = "Par dÃ©faut";

-- 0) Temporary Morale Skills {combat log name, effect name}
   -- Champion
L["TrueHeroicsEffect"] = "Grands actes d'hÃ©roÃ¯sme";
L["TrueHeroicsLog"] = "Grands actes d'hÃ©roÃ¯sme";  
L["SuddenDefenceEffect"] = "DÃ©fense soudaine";
L["SuddenDefenceLog"] = "DÃ©fense soudaine";
  -- Minstrel
L["StoryOfTheHammerhandEffect"] = "Histoire du Poing de Marteau";
L["StoryOfTheHammerhandLog"] = "Histoire of the Hammerhand";
L["SongOfTheHammerhandEffect"] = "Chant du Poing de Marteau";
L["SongOfTheHammerhandLog"] = "Chant du Poing de Marteau";
L["GiftOfTheHammerhandEffect"] = "Don du Poing de Marteau";
L["GiftOfTheHammerhandLog"] = "Don du Poing de Marteau";
  -- Rune-Keeper
L["WordOfExaltationEffect"] = "Mot d'exaltation";
L["WordOfExaltationLog"] = "Mot d'exaltation";
L["EssayOfExaltationEffect"] = "Mot d'exaltation";  -- ou "Essai d'exaltation"
L["EssayOfExaltationLog"] = "Essai d'exaltation";  -- ou "Mot d'exaltation"
  -- Other
L["MartyrsFortitudeEffect"] = "Force d'Ã¢me du martyr";  -- A vÃ©rifier - Effet dÃ©clenchable par un set de bijoux niveau 75
L["MartyrsFortitudeLog"] = "Force d'Ã¢me du martyr"; -- A vÃ©rifier
L["FrostRingEffect"] = "Anneau du froid"; -- A vÃ©rifier -- L'effet de l'anneau de froid lors du combat contre Saroumane ?
L["FrostRingLog"] = "Shield of the Blizzard";

-- 1) Burglar Skills
  -- Trait Lines : Il s'agit Ã  priori du nom des chacun des 3 arbres de traits, tel qu'ils s'affichent dans le chat suite Ã  leur chargement.
L["TheMischiefMaker"] = "L'espiÃ¨gle";
L["TheQuietKnife"] = "Le poignard silencieux";
L["TheGambler"] = "Le parieur";
  -- Buffs (effect name)
L["TouchAndGo"] = "Touch and Go";
L["KnivesOut"] = "Knives Out";
L["Mischievous"] = "Mischievous";
L["QuietKnife"] = "Quiet Knife";
L["Gambler"] = "Gambler";
  -- Skills
L["Feint"] = "Feint";
L["ImprovedFeint"] = "Improved Feint";
L["ArmourOfTheUnseen"] = "Armour of the Unseen";
  -- Debuffs (log name)
L["RevealWeakness"] = "Reveal Weakness";
L["Addle"] = "Addle";
L["TrickDisable"] = "Trick: Disable";
L["TrickCounterDefence"] = "Trick: Counter Defence";
L["TrickImprovedCounterDefence"] = "Trick: Improved Counter Defence";
L["TrickDustInTheEyes"] = "Trick: Dust in the Eyes";
L["Slowed"] = "Slowed";
L["TrickEnrage"] = "Trick: Enrage";
L["ASmallSnag"] = "A Small Snag";
L["QuiteASnag"] = "Quite a Snag";
  -- Removals (log name)
L["MischievousDelight"] = "Mischievous Delight";
L["MischievousGlee"] = "Mischievous Glee";
  -- Crowd Control (log name)
L["Riddle"] = "Riddle";
L["ImprovedRiddle"] = "Improved Riddle";
L["Confound"] = "Confound";
L["StartlingTwist"] = "Startling Twist";
L["ImprovedStartlingTwist"] = "Improved Startling Twist";
L["AdvancedStartlingTwist"] = "Advanced Startling Twist";
L["StunDustTier1"] = "Stun Dust Tier 1";
L["StunDustTier2"] = "Stun Dust Tier 2";
L["StunDustTier3"] = "Stun Dust Tier 3";
L["ExploitOpening"] = "Exploit Opening";
L["Trip"] = "Trip";
L["MarblesTier1"] = "Marbles Tier 1";
L["MarblesTier2"] = "Marbles Tier 2";
L["MarblesTier3"] = "Marbles Tier 3";

-- 2) Captain Skills
  -- Trait Lines
L["LeadTheCharge"] = "A la charge";
L["LeaderOfMen"] = "Meneur d'hommes";
L["HandsOfHealing"] = "Mains guÃ©risseuses";
  -- Buffs (effect name)
L["MusterCourage"] = "Rassemblement de courage";
L["InHarmsWay"] = "Au cÅ“ur du danger";
L["WarCry"] = "Cri de guerre"; -- Obsolete
L["BladeOfElendil"] = "Lame d'Elendil";
L["Motivated"] = "Discours motivant amÃ©liorÃ©"; -- or "motivation" ?
L["OnGuard"] = "En garde";
L["RelentlessAttack"] = "Attaque acharnÃ©e";
L["Focus"] = "Concentration";
L["ShieldBrother"] = "FrÃ¨re de bouclier";
L["WatchfulShieldBrother"] = "FrÃ¨re de bouclier vigilant";
L["SongBrother"] = "FrÃ¨re de chants";
L["BladeBrother"] = "FrÃ¨re d'armes";
L["ShieldOfTheDunedain"] = "Bouclier des DÃºnedain";
L["ToArmsShieldBrother"] = "Aux-armes";
L["ToArmsFellowshipShieldBrother"] = "Aux armes! (FrÃ¨re de bouclier communautÃ©)"; -- obsolete ?
L["ToArmsSongBrother"] = "Aux armesÂ ! (FrÃ¨re de chants)";
L["ToArmsFellowshipSongBrother"] = "Aux armes! (FrÃ¨re de chants communautÃ©)"; -- obsolete ?
L["ToArmsBladeBrother"] = "Aux armes ! (FrÃ¨re d'armes)";
L["ToArmsFellowshipBladeBrother"] = "Aux armes! (FrÃ¨re d'armes communautÃ©)"; -- obsolete ?
L["StrengthOfWillShieldBrother"] = "Inspiration (FrÃ¨re de bouclier)"; -- obsolete ?
L["StrengthOfWillFellowshipShieldBrother"] = "Inspiration (FrÃ¨re de bouclier communautÃ©)"; -- obsolete ?
L["StrengthOfWillSongBrother"] = "Inspiration (FrÃ¨re de chants)"; -- obsolete ?
L["StrengthOfWillFellowshipSongBrother"] = "Inspiration (FrÃ¨re de chants communautÃ©)"; -- obsolete ?
L["StrengthOfWillBladeBrother"] = "Inspiration (FrÃ¨re d'armes)"; -- obsolete ?
L["StrengthOfWillFellowshipBladeBrother"] = "Inspiration (FrÃ¨re d'armes communautÃ©)"; -- obsolete ?
L["RallyingCry"] = "Cri de ralliement";
L["InDefenceOfMiddleEarth"] = "A la dÃ©fense de la Terre du Milieu"; -- Obsolete ?
L["DefensiveStrike"] = "Attaque retenue"; -- Obsolete
L["ImprovedDefensiveStrike"] = "Frappe certaine amÃ©liorÃ©e";
L["LastStand"] = "Dernier combat";
  -- Debuffs (log name)
L["NobleMark"] = "Marque de noblesse";
L["TellingMark"] = "Marque efficace";
L["RevealingMark"] = "Marque rÃ©vÃ©latrice";

-- 3) Champion Skills
  -- Trait Lines
L["TheBerserker"] = "Berserker";
L["TheDeadlyStorm"] = "TempÃªte mortelle";
L["TheMartialChampion"] = "Champion du combat";
  -- Buffs (effect name)
L["Fervour"] = "Ferveur"; -- obsolete
L["Glory"] = "Gloire"; -- obsolete
L["Ardour"] = "Ardeur"; -- obsolete
L["ControlledBurn"] = "BrÃ»lure contrÃ´lÃ©e";
L["Flurry"] = "DÃ©luge de coups";
L["SuddenDefence"] = "DÃ©fense soudaine";
L["SeekingBlades"] = "Lame chercheuse"; -- obsolete
L["Adamant"] = "Adamantite";
L["Invincible"] = "InvincibilitÃ©"; -- or "Invincible"
  -- Hamstring (log name)
L["Hamstring"] = "Coup aux jarrets";
  -- Crowd Control (log name)
L["HornOfGondor"] = "Cor du Gondor";
L["Horn"] = "Cor";
  -- Benefits (log name)
L["EbbingIre"] = "ColÃ¨re attÃ©nuÃ©e";
L["RisingIre"] = "ColÃ¨re grandissante"; -- obsolete

-- 4) Guardian Skills
  -- Trait lines
L["TheKeenBlade"] = "Lame acÃ©rÃ©e";
L["TheFighterOfShadow"] = "Adversaire de l'Ombre";
L["TheDefenderOfTheFree"] = "DÃ©fenseur des Peuples Libres";
  -- Buffs (effect name)
L["Protection"] = "Protection";
L["ProtectionByTheSword"] = "Protection par l'Ã©pÃ©e";
L["ShieldWall"] = "Mur de boucliers";
L["GuardiansBlockStance"] = "Guardian's Block Stance";  -- obsolete
L["GuardiansParryStance"] = "Guardian's Parry Stance";  -- obsolete
L["Overpower"] = "Surpuissance";  -- obsolete
L["GuardiansThreatStance"] = "Guardian's Threat Stance"; -- obsolete
L["GuardiansPledge"] = "Serment de gardien";
L["GuardiansWard"] = "Guardian's Ward";
L["ImprovedGuardiansWard"] = "Improved Guardian's Ward";
L["GuardiansWardTactics"] = "Tactiques de Protection de gardien";
L["ImprovedGuardiansWardTactics"] = "Improved Guardian's Ward Tactics";
L["WarriorsBlock"] = "Warrior's Block";
L["WarriorsParry"] = "Warrior's Parry";
L["WarriorsPower"] = "Warrior's Power";
L["WarriorsThreat"] = "Warrior's Threat";
  -- Debuffs (log name)
L["Bash"] = "Bash";
L["ShieldSmash"] = "Ã‰crasement au bouclier";
L["ToTheKing"] = "Au roi";
L["Challenge"] = "DÃ©fi";
L["ImprovedChallenge"] = "Improved Challenge";
L["ChallengeTheDarkness"] = "Challenge the Darkness";   -- obsolete
L["ImprovedOverwhelm"] = "Improved Overwhelm";
L["ImprovedSting"] = "Improved Sting";
L["ImminentCleansing"] = "Imminent Cleansing";

-- 5) Hunter Skills
  -- Trait lines
L["TheBowmaster"] = "MaÃ®tre archer";
L["TheTrapperOfFoes"] = "PiÃ©geur d'ennemis";
L["TheHuntsman"] = "FlÃ¨che sylvaine";
  -- Buffs (effect name)
L["StanceStrength"] = "PostureÂ : force";
L["StancePrecision"] = "PostureÂ : prÃ©cision";
L["StanceEndurance"] = "PostureÂ : endurance";
L["BurnHot"] = "Vive flamme";
L["CoolBurn"] = "Cool Burn";  -- obsolete
L["Fleetness"] = "CÃ©lÃ©ritÃ©";
L["ImprovedFleetness"] = "CÃ©lÃ©ritÃ© amÃ©liorÃ©e";
L["SwiftStroke"] = "DÃ©cochage rapide";
L["NeedfulHaste"] = "HÃ¢te nÃ©cessaire";
L["HuntersArt"] = "Art du chasseur"; -- Obsolete
  -- Debuffs (log name)
L["QuickShot"] = "Tir rapide";
L["LowCut"] = "Coups au jambes";
L["CripplingShot"] = "Crippling Shot";
L["SlowingCut"] = "Coupure ralentissante";
  -- Crowd Control (log name)
L["DazingBlow"] = "Coups d'hÃ©bÃ©tement";
L["ImprovedDazingBlow"] = "Coups d'hÃ©bÃ¨tement amÃ©liorÃ©";
L["DistractingShot"] = "Tir de distraction";
L["RainOfThorns"] = "Pluie d'Ã©pines";
L["CryOfThePredator"] = "Cri du prÃ©dateur";
L["BardsArrow"] = "FlÃ¨che de Bard";
L["TrapDamage"] = "DÃ©gÃ¢ts de piÃ¨ge";

-- 6) Lore-Master 
  -- Trait lines
L["MasterOfNaturesFury"] = "MaÃ®tre de la fureur naturelle";
L["TheAncientMaster"] = "MaÃ®tre ancien";
L["TheKeeperOfAnimals"] = "Gardien des animaux";
  -- Buffs (effect name)
L["AirLore"] = "Connaissance de l'air";
L["ContinualAirLore"] = "Continual Air-lore"; -- exist ??
L["SignOfPowerRighteousness"] = "Signe du pouvoirÂ : IntÃ©gritÃ©";
L["SignOfPowerVigilance"] = "Signe du pouvoirÂ : Vigilance";
L["SignOfTheWildRage"] = "Signe du pouvoirÂ : Rage"; --exist ??
L["ImprovedSignOfTheWildRage"] = "Improved Sign of the Wild: Rage"; --exist ??
L["SignOfTheWildProtection"] = "Sign of the Wild: Protection"; --exist ??
  -- Debuffs (log name)
  -- L["KnowledgeOfTheLoreMaster"] = "Knowledge of the Lore-master";
L["GustOfWind"] = "Bourrasque";
L["FireLore"] = "Connaissance du feu";
L["WindLore"] = "Connaissance du vent";
L["FrostLore"] = "Connaissance du froid";
L["AncientCraft"] = "Artisanat ancien";
L["SignOfPowerCommand"] = "Signe du pouvoirÂ : Commandement";
L["ImprovedSignOfPowerCommand"] = "Signe du pouvoirÂ : commandement amÃ©liorÃ©";
L["SignOfPowerSeeAllEnds"] = "Signe du pouvoirÂ : voir la fin des choses";
  -- Crowd Control (log name)
L["BlindingFlash"] = "LumiÃ¨re aveuglante";
L["ImprovedBlindingFlash"] = "LumiÃ¨re aveuglante amÃ©liorÃ©e";
L["BaneFlare"] = "Eclat fatal";
L["HerbLore"] = "Connaissance des plantes";
L["CrackedEarth"] = "Terre craquelÃ©e";
L["StormLore"] = "Connaissance de l'orage";
L["LightOfTheRisingDawn"] = "LumiÃ¨re de l'aube naissante";
L["TestOfWill"] = "Test de volontÃ©";
L["EntsGoToWar"] = "Marche guerriÃ¨re des Ents";
L["ImprovedStaffStrike"] = "Coup de bÃ¢ton amÃ©liore";

-- 7) Minstrel
  -- Trait lines
L["TheWarriorSkald"] = "Skalde guerrier";
L["TheProtectorOfSong"] = "Protecteur des chants";
L["TheWatcherOfResolve"] = "Veilleur dÃ©terminÃ©";
  -- Buffs (effect name)
L["AnthemOfWar"] = "Hymne de guerre";
L["AnthemOfTheFreePeoples"] = "Hymne des Peuples Libres";
L["AnthemOfProwess"] = "Anthem of Prowess";
L["AnthemOfComposure"] = "Hymne de contenance";
L["TheMelodyOfBattle"] = "MÃ©lodie de bataille";
L["InspireFellows"] = "Inspire Fellows";
L["SoliloquyOfSpirit"] = "Esprit de soliloque";
L["ImprovedChordOfSalvation"] = "Improved Chord of Salvation";
L["TaleOfHeroism"] = "EpopÃ©e hÃ©roÃ¯que";
L["TaleOfBattle"] = "EpopÃ©e de combat";
L["TaleOfWarding"] = "EpopÃ©e de rÃ©pit"; -- Tale of Warding ???
L["TaleOfWardingAndHope"] = "Tale of Warding and Hope";
L["TaleOfFrostAndFlame"] = "Tale of Frost and Flame";
L["TaleOfFrostAndFlamesBattle"] = "Tale of Frost and Flame's Battle";
L["TaleOfWardingAndHeroism"] = "Tale of Warding and Heroism";
L["SymphonyOfTheHopefulHeart"] = "Symphony of the Hopeful Heart";
L["Harmony"] = "Harmonie";
L["WarSpeech"] = "Discours de guerre";
L["AnthemOfCompassion"] = "Hymne de sympathie";
L["AnthemOfTheThirdAge"] = "Hymne du TroisiÃ¨me Age";
L["AnthemOfTheThirdAgeWarSpeech"] = "Hymne dissonant du TroisiÃ¨me Age";
L["AnthemOfTheThirdAgeHarmony"] = "Hymne rÃ©sonant du TroisiÃ¨me Age";
L["MinorBallad"] = "Ballade mineure";
L["MajorBallad"] = "Ballade majeure";
L["PerfectBallad"] = "Ballade parfaite";
L["StillAsDeath"] = "ImmobilitÃ© de cadavre";
-- Debuffs (log name)
L["CallOfOrome"] = "Appel d'Orom\195\171";
L["CryOfTheWizards"] = "Cri des Magiciens";
L["EchoesOfBattle"] = "Echo de bataille";
L["TimelessEchoesOfBattle"] = "Echo de bataille intemporel";
-- Crowd Control (log name)
L["SongOfTheDead"] = "Song of the Dead";
L["InvocationOfElbereth"] = "Invocation d'Elbereth";

-- 8) Rune-Keeper Skills
  -- Trait lines
L["CleansingFires"] = "Flammes purificatrices"; -- Au pluriel dans le log mais au singulier sur l'arbre de traits
L["SolitaryThunder"] = "Tonnerre solitaire";
L["BenedictionsOfPeace"] = "BÃ©nÃ©dictions de la paix"; -- Au pluriel dans le log mais au singulier sur l'arbre de traits
  -- Buffs (effect name)
L["DoNotFallToStorm"] = "Do Not Fall to Storm"; -- obsolete
L["DoNotFallToFlame"] = "Do Not Fall to Flame"; -- obsolete
L["DoNotFallToWinter"] = "Do Not Fall to Winter"; -- obsolete
L["DoNotFallThisDay"] = "Tu ne succomberas pas aujourd'hui";
L["ShallNotFallThisDay"] = "Shall Not Fall This Day"; -- obsolete
L["PreludeToHope"] = "PrÃ©lude Ã  l'espoir"; -- il manque "Prelude Ã  la Puissance" (sans accent)
L["RuneOfRestoration"] = "Rune de restauration";
L["WritOfHealthTier1"] = "AllÃ©gorie de la santÃ©Â - niveau 1"; -- il manque "AllÃ©gorie de la santÃ©" sans suffixe en tant que "bÃ©nÃ©fice".
L["WritOfHealthTier2"] = "AllÃ©gorie de la santÃ©Â - niveau 2";
L["WritOfHealthTier3"] = "AllÃ©gorie de la santÃ©Â - niveau 3";
L["OurFatesEntwined"] = "Nos destins entrelacÃ©s";
L["AllFatesEntwined"] = "Nos destins entrelacÃ©s"; -- obsolete
L["GloriousForeshadowing"] = "PrÃ©sage glorieux";
L["WondrousForeshadowing"] = "PrÃ©sage merveilleux"; -- obsolete

-- 9) Warden Skills
  -- Trait lines
L["WayOfTheSpear"] = "La voie de la lance";  -- obsolete
L["WayOfTheFist"] = "La voie du poing";  -- obsolete
L["WayOfTheShield"] = "La voie du bouclier";  -- obsolete
  -- Buffs (effect name)
L["Conviction"] = "Conviction";
L["DeterminationStance"] = "DÃ©termination"; -- A vÃ©rifier
L["Conservation"] = "Conservation";
L["Recklessness"] = "Imprudence";  -- A vÃ©rifier
L["WayOfTheWarden"] = "Way of the Warden";
L["ShieldBashBlock"] = "Shield-bash - Block";
L["WallOfSteelParry"] = "Wall of Steel - Parry";
L["AdroitManoeuvre"] = "Adroit Manoeuvre";
L["WardensTriumph"] = "Warden's Triumph";
L["DefensiveStrikeBlock"] = "Defensive Strike - Block";
L["Persevere"] = "Persevere";
L["ShieldMastery"] = "Shield Mastery";
L["ShieldDefence"] = "Shield-defence";
L["ShieldTactics"] = "Shield-tactics";
L["DanceOfBattleEvade"] = "Dance of Battle - Evade";
L["TacticallySound"] = "Tactically Sound";
L["T1HealOverTime"] = "GuÃ©rison au fil du temps de niveau 1";
L["T2HealOverTime"] = "GuÃ©rison au fil du temps de niveau 2";
L["T3HealOverTime"] = "GuÃ©rison au fil du temps de niveau 3";
L["T4HealOverTime"] = "GuÃ©rison au fil du temps de niveau 4";

-- 10) Racial Skills
L["DutyBound"] = "Appel du devoir";
L["DwarfEndurance"] = "Endurance de nain";

-- 11) Beorning
  -- Traits
L["WayofTheHide"] = "La Peau"
L["WayofTheClaw"] = "La Griffe"
L["WayofTheRoar"] = "Le Cri"
  -- Buffs
L["EncouragingRoar"] = "Rugissement d'encouragement";
L["RejuvenatingBellow"] = "Hurlement du renouveau";
L["BracingRoar"] = "Rugissement fortifiant";
L["Sacrifice"] = "Sacrifice";
L["BearUp"] = "Tenez bon";
L["VigilantRoar"] = "Rugissement vigilant";
L["AssertiveRoar"] = "Rugissement assurÃ©";
L["SluggishStings"] = "Abeilles lÃ©nifiantes"; -- to be checked
L["EnragingSacrifice"] = "Sacrifice rageant";
L["DebilitatingBees"] = "Abeilles affaiblissantes";
L["EncouragingStrike"] = "Frappe encourageante"; 
L["ShakeFree"] = "Arrachement";
L["Takedown"] = "Tacle";
L["CripplingStings"] = "Dards invalidants";
L["CripplingRoar"] = "Rugissement invalidant"; -- ou "Rugissement perÃ§ant" le nom de l'effet de ralentissement
L["ThickenedHide"] = "Cuir renforcÃ©";
L["Counter"] = "Contre";
L["CallToWild"] = "Appel sauvage";
  -- Crowd control
L["GrislyCry"] = "Cri atroce";

-- 12 Brawler : bagarreur
  -- Traits
L["TheFulcrum"] = "Le Fulcrum";
L["TheMaelstrom"] = "Le MaelstrÃ¶m";
L["TheFundament"] = "La Fondation";

L["GetSerious"] = "Choses sÃ©rieuses";
L["WeatherBlows"] = "Weather Blows";
L["SkipFree"] = "Skip Free";
L["IgnorePain"] = "Ignore Pain";
L["FollowMe"] = "Follow Me!";
L["QuickFeint"] = "Quick Feint";
L["OneforAll"] = "One for All";
L["SkipFree"] = "Skip Free";

-- Other
L["VagabondsCraft"] = "Vagabond's Craft";
L["StunImmunity"] = "ImmunitÃ© contre les Ã©tats temporaires";
