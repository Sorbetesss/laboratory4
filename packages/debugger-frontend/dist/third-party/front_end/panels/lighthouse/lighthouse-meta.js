import*as i from"../../core/i18n/i18n.js";import*as e from"../../ui/legacy/legacy.js";const t={showLighthouse:"Show `Lighthouse`"},o=i.i18n.registerUIStrings("panels/lighthouse/lighthouse-meta.ts",t),n=i.i18n.getLazilyComputedLocalizedString.bind(void 0,o);let s;e.ViewManager.registerViewExtension({location:"panel",id:"lighthouse",title:i.i18n.lockedLazyString("Lighthouse"),commandPrompt:n(t.showLighthouse),order:90,loadView:async()=>(await async function(){return s||(s=await import("./lighthouse.js")),s}()).LighthousePanel.LighthousePanel.instance(),tags:[i.i18n.lockedLazyString("lighthouse"),i.i18n.lockedLazyString("pwa")]});
