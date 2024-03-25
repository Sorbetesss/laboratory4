import*as e from"../../core/common/common.js";import*as t from"../../core/root/root.js";import*as n from"../../core/sdk/sdk.js";import*as o from"../../ui/legacy/legacy.js";import*as i from"../../core/i18n/i18n.js";const a={showElements:"Show Elements",elements:"Elements",showEventListeners:"Show Event Listeners",eventListeners:"Event Listeners",showProperties:"Show Properties",properties:"Properties",showStackTrace:"Show Stack Trace",stackTrace:"Stack Trace",showLayout:"Show Layout",layout:"Layout",hideElement:"Hide element",editAsHtml:"Edit as HTML",duplicateElement:"Duplicate element",undo:"Undo",redo:"Redo",captureAreaScreenshot:"Capture area screenshot",selectAnElementInThePageTo:"Select an element in the page to inspect it",wordWrap:"Word wrap",enableDomWordWrap:"Enable `DOM` word wrap",disableDomWordWrap:"Disable `DOM` word wrap",showHtmlComments:"Show `HTML` comments",hideHtmlComments:"Hide `HTML` comments",revealDomNodeOnHover:"Reveal `DOM` node on hover",showDetailedInspectTooltip:"Show detailed inspect tooltip",showCSSDocumentationTooltip:"Show CSS documentation tooltip",copyStyles:"Copy styles",showUserAgentShadowDOM:"Show user agent shadow `DOM`",showComputedStyles:"Show Computed Styles",showStyles:"Show Styles",toggleEyeDropper:"Toggle eye dropper"},s=i.i18n.registerUIStrings("panels/elements/elements-meta.ts",a),r=i.i18n.getLazilyComputedLocalizedString.bind(void 0,s);let l,c;async function g(){return l||(l=await import("./elements.js")),l}function d(e){return void 0===l?[]:e(l)}o.ViewManager.registerViewExtension({location:"panel",id:"elements",commandPrompt:r(a.showElements),title:r(a.elements),order:10,persistence:"permanent",hasToolbar:!1,loadView:async()=>(await g()).ElementsPanel.ElementsPanel.instance()}),o.ActionRegistration.registerActionExtension({actionId:"elements.show-styles",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.showStyles),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance()}),o.ActionRegistration.registerActionExtension({actionId:"elements.show-computed",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.showComputedStyles),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance()}),o.ViewManager.registerViewExtension({location:"elements-sidebar",id:"elements.eventListeners",commandPrompt:r(a.showEventListeners),title:r(a.eventListeners),order:5,hasToolbar:!0,persistence:"permanent",loadView:async()=>(await g()).EventListenersWidget.EventListenersWidget.instance()}),o.ViewManager.registerViewExtension({location:"elements-sidebar",id:"elements.domProperties",commandPrompt:r(a.showProperties),title:r(a.properties),order:7,persistence:"permanent",loadView:async()=>(await g()).PropertiesWidget.PropertiesWidget.instance()}),o.ViewManager.registerViewExtension({experiment:t.Runtime.ExperimentName.CAPTURE_NODE_CREATION_STACKS,location:"elements-sidebar",id:"elements.domCreation",commandPrompt:r(a.showStackTrace),title:r(a.stackTrace),order:10,persistence:"permanent",loadView:async()=>(await g()).NodeStackTraceWidget.NodeStackTraceWidget.instance()}),o.ViewManager.registerViewExtension({location:"elements-sidebar",id:"elements.layout",commandPrompt:r(a.showLayout),title:r(a.layout),order:4,persistence:"permanent",loadView:async()=>(await async function(){return c||(c=await import("./components/components.js")),c}()).LayoutPane.LayoutPane.instance().wrapper}),o.ActionRegistration.registerActionExtension({actionId:"elements.hide-element",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.hideElement),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance(),contextTypes:()=>d((e=>[e.ElementsPanel.ElementsPanel])),bindings:[{shortcut:"H"}]}),o.ActionRegistration.registerActionExtension({actionId:"elements.toggle-eye-dropper",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.toggleEyeDropper),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance(),contextTypes:()=>d((e=>[e.ColorSwatchPopoverIcon.ColorSwatchPopoverIcon])),bindings:[{shortcut:"c"}]}),o.ActionRegistration.registerActionExtension({actionId:"elements.edit-as-html",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.editAsHtml),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance(),contextTypes:()=>d((e=>[e.ElementsPanel.ElementsPanel])),bindings:[{shortcut:"F2"}]}),o.ActionRegistration.registerActionExtension({actionId:"elements.duplicate-element",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.duplicateElement),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance(),contextTypes:()=>d((e=>[e.ElementsPanel.ElementsPanel])),bindings:[{shortcut:"Shift+Alt+Down"}]}),o.ActionRegistration.registerActionExtension({actionId:"elements.copy-styles",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.copyStyles),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance(),contextTypes:()=>d((e=>[e.ElementsPanel.ElementsPanel])),bindings:[{shortcut:"Ctrl+Alt+C",platform:"windows,linux"},{shortcut:"Meta+Alt+C",platform:"mac"}]}),o.ActionRegistration.registerActionExtension({actionId:"elements.undo",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.undo),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance(),contextTypes:()=>d((e=>[e.ElementsPanel.ElementsPanel])),bindings:[{shortcut:"Ctrl+Z",platform:"windows,linux"},{shortcut:"Meta+Z",platform:"mac"}]}),o.ActionRegistration.registerActionExtension({actionId:"elements.redo",category:o.ActionRegistration.ActionCategory.ELEMENTS,title:r(a.redo),loadActionDelegate:async()=>(await g()).ElementsPanel.ElementsActionDelegate.instance(),contextTypes:()=>d((e=>[e.ElementsPanel.ElementsPanel])),bindings:[{shortcut:"Ctrl+Y",platform:"windows,linux"},{shortcut:"Meta+Shift+Z",platform:"mac"}]}),o.ActionRegistration.registerActionExtension({actionId:"elements.capture-area-screenshot",loadActionDelegate:async()=>(await g()).InspectElementModeController.ToggleSearchActionDelegate.instance(),condition:t.Runtime.ConditionName.CAN_DOCK,title:r(a.captureAreaScreenshot),category:o.ActionRegistration.ActionCategory.SCREENSHOT}),o.ActionRegistration.registerActionExtension({category:o.ActionRegistration.ActionCategory.ELEMENTS,actionId:"elements.toggle-element-search",toggleable:!0,loadActionDelegate:async()=>(await g()).InspectElementModeController.ToggleSearchActionDelegate.instance(),title:r(a.selectAnElementInThePageTo),iconClass:"select-element",bindings:[{shortcut:"Ctrl+Shift+C",platform:"windows,linux"},{shortcut:"Meta+Shift+C",platform:"mac"}]}),e.Settings.registerSettingExtension({category:e.Settings.SettingCategory.ELEMENTS,storageType:e.Settings.SettingStorageType.Synced,order:1,title:r(a.showUserAgentShadowDOM),settingName:"showUAShadowDOM",settingType:e.Settings.SettingType.BOOLEAN,defaultValue:!1}),e.Settings.registerSettingExtension({category:e.Settings.SettingCategory.ELEMENTS,storageType:e.Settings.SettingStorageType.Synced,order:2,title:r(a.wordWrap),settingName:"domWordWrap",settingType:e.Settings.SettingType.BOOLEAN,options:[{value:!0,title:r(a.enableDomWordWrap)},{value:!1,title:r(a.disableDomWordWrap)}],defaultValue:!0}),e.Settings.registerSettingExtension({category:e.Settings.SettingCategory.ELEMENTS,storageType:e.Settings.SettingStorageType.Synced,order:3,title:r(a.showHtmlComments),settingName:"showHTMLComments",settingType:e.Settings.SettingType.BOOLEAN,defaultValue:!0,options:[{value:!0,title:r(a.showHtmlComments)},{value:!1,title:r(a.hideHtmlComments)}]}),e.Settings.registerSettingExtension({category:e.Settings.SettingCategory.ELEMENTS,storageType:e.Settings.SettingStorageType.Synced,order:4,title:r(a.revealDomNodeOnHover),settingName:"highlightNodeOnHoverInOverlay",settingType:e.Settings.SettingType.BOOLEAN,defaultValue:!0}),e.Settings.registerSettingExtension({category:e.Settings.SettingCategory.ELEMENTS,storageType:e.Settings.SettingStorageType.Synced,order:5,title:r(a.showDetailedInspectTooltip),settingName:"showDetailedInspectTooltip",settingType:e.Settings.SettingType.BOOLEAN,defaultValue:!0}),e.Settings.registerSettingExtension({settingName:"showEventListenersForAncestors",settingType:e.Settings.SettingType.BOOLEAN,defaultValue:!0}),e.Settings.registerSettingExtension({category:e.Settings.SettingCategory.ADORNER,storageType:e.Settings.SettingStorageType.Synced,settingName:"adornerSettings",settingType:e.Settings.SettingType.ARRAY,defaultValue:[]}),e.Settings.registerSettingExtension({category:e.Settings.SettingCategory.ELEMENTS,storageType:e.Settings.SettingStorageType.Synced,title:r(a.showCSSDocumentationTooltip),settingName:"showCSSPropertyDocumentationOnHover",settingType:e.Settings.SettingType.BOOLEAN,defaultValue:!0}),o.ContextMenu.registerProvider({contextTypes:()=>[n.RemoteObject.RemoteObject,n.DOMModel.DOMNode,n.DOMModel.DeferredDOMNode],loadProvider:async()=>(await g()).ElementsPanel.ContextMenuProvider.instance(),experiment:void 0}),o.ViewManager.registerLocationResolver({name:"elements-sidebar",category:o.ViewManager.ViewLocationCategory.ELEMENTS,loadResolver:async()=>(await g()).ElementsPanel.ElementsPanel.instance()}),e.Revealer.registerRevealer({contextTypes:()=>[n.DOMModel.DOMNode,n.DOMModel.DeferredDOMNode,n.RemoteObject.RemoteObject],destination:e.Revealer.RevealerDestination.ELEMENTS_PANEL,loadRevealer:async()=>(await g()).ElementsPanel.DOMNodeRevealer.instance()}),e.Revealer.registerRevealer({contextTypes:()=>[n.CSSProperty.CSSProperty],destination:e.Revealer.RevealerDestination.STYLES_SIDEBAR,loadRevealer:async()=>(await g()).ElementsPanel.CSSPropertyRevealer.instance()}),o.Toolbar.registerToolbarItem({loadItem:async()=>(await g()).LayersWidget.ButtonProvider.instance(),order:1,location:o.Toolbar.ToolbarItemLocation.STYLES_SIDEBARPANE_TOOLBAR,showLabel:void 0,condition:void 0,separator:void 0,actionId:void 0}),o.Toolbar.registerToolbarItem({loadItem:async()=>(await g()).ElementStatePaneWidget.ButtonProvider.instance(),order:2,location:o.Toolbar.ToolbarItemLocation.STYLES_SIDEBARPANE_TOOLBAR,showLabel:void 0,condition:void 0,separator:void 0,actionId:void 0}),o.Toolbar.registerToolbarItem({loadItem:async()=>(await g()).ClassesPaneWidget.ButtonProvider.instance(),order:3,location:o.Toolbar.ToolbarItemLocation.STYLES_SIDEBARPANE_TOOLBAR,showLabel:void 0,condition:void 0,separator:void 0,actionId:void 0}),o.Toolbar.registerToolbarItem({loadItem:async()=>(await g()).StylesSidebarPane.ButtonProvider.instance(),order:100,location:o.Toolbar.ToolbarItemLocation.STYLES_SIDEBARPANE_TOOLBAR,showLabel:void 0,condition:void 0,separator:void 0,actionId:void 0}),o.Toolbar.registerToolbarItem({actionId:"elements.toggle-element-search",location:o.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_LEFT,order:0,showLabel:void 0,condition:void 0,separator:void 0,loadItem:void 0}),o.UIUtils.registerRenderer({contextTypes:()=>[n.DOMModel.DOMNode,n.DOMModel.DeferredDOMNode],loadRenderer:async()=>(await g()).ElementsTreeOutline.Renderer.instance()}),e.Linkifier.registerLinkifier({contextTypes:()=>[n.DOMModel.DOMNode,n.DOMModel.DeferredDOMNode],loadLinkifier:async()=>(await g()).DOMLinkifier.Linkifier.instance()});
