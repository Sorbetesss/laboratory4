import*as t from"../../core/common/common.js";import*as i from"../../core/i18n/i18n.js";import*as n from"../../ui/legacy/legacy.js";const e={throttling:"Throttling",showThrottling:"Show Throttling",goOffline:"Go offline",device:"device",throttlingTag:"throttling",enableSlowGThrottling:"Enable slow `3G` throttling",enableFastGThrottling:"Enable fast `3G` throttling",goOnline:"Go online"},o=i.i18n.registerUIStrings("panels/mobile_throttling/mobile_throttling-meta.ts",e),a=i.i18n.getLazilyComputedLocalizedString.bind(void 0,o);let g;async function r(){return g||(g=await import("./mobile_throttling.js")),g}n.ViewManager.registerViewExtension({location:"settings-view",id:"throttling-conditions",title:a(e.throttling),commandPrompt:a(e.showThrottling),order:35,loadView:async()=>(await r()).ThrottlingSettingsTab.ThrottlingSettingsTab.instance(),settings:["customNetworkConditions"]}),n.ActionRegistration.registerActionExtension({actionId:"network-conditions.network-offline",category:n.ActionRegistration.ActionCategory.NETWORK,title:a(e.goOffline),loadActionDelegate:async()=>(await r()).ThrottlingManager.ActionDelegate.instance(),tags:[a(e.device),a(e.throttlingTag)]}),n.ActionRegistration.registerActionExtension({actionId:"network-conditions.network-low-end-mobile",category:n.ActionRegistration.ActionCategory.NETWORK,title:a(e.enableSlowGThrottling),loadActionDelegate:async()=>(await r()).ThrottlingManager.ActionDelegate.instance(),tags:[a(e.device),a(e.throttlingTag)]}),n.ActionRegistration.registerActionExtension({actionId:"network-conditions.network-mid-tier-mobile",category:n.ActionRegistration.ActionCategory.NETWORK,title:a(e.enableFastGThrottling),loadActionDelegate:async()=>(await r()).ThrottlingManager.ActionDelegate.instance(),tags:[a(e.device),a(e.throttlingTag)]}),n.ActionRegistration.registerActionExtension({actionId:"network-conditions.network-online",category:n.ActionRegistration.ActionCategory.NETWORK,title:a(e.goOnline),loadActionDelegate:async()=>(await r()).ThrottlingManager.ActionDelegate.instance(),tags:[a(e.device),a(e.throttlingTag)]}),t.Settings.registerSettingExtension({storageType:t.Settings.SettingStorageType.Synced,settingName:"customNetworkConditions",settingType:t.Settings.SettingType.ARRAY,defaultValue:[]});
