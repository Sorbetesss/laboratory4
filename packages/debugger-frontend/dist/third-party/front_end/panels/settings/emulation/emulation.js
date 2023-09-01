import*as e from"../../../core/i18n/i18n.js";import*as t from"../../../models/emulation/emulation.js";import*as i from"../../../ui/legacy/legacy.js";import*as s from"./components/components.js";const d=new CSSStyleSheet;let a;d.replaceSync(".devices-settings-tab .settings-tab.settings-content{display:flex;flex-direction:column;align-items:flex-start;height:100%;margin:0}.devices-settings-tab .devices-button-row{flex:none;display:flex}.devices-settings-tab .devices-button-row button{margin-right:10px;min-width:120px;flex:none}.devices-settings-tab .devices-list{width:min(350px,100%);margin-top:10px}.devices-list-item{padding:3px 5px;height:30px;display:flex;align-items:center;flex:auto 1 1;overflow:hidden;color:var(--color-text-primary);user-select:none;white-space:nowrap;text-overflow:ellipsis}.devices-list-checkbox{height:12px;width:12px;margin:2px 5px 2px 2px;flex:none;pointer-events:none}.devices-list-checkbox:focus{outline:auto 5px -webkit-focus-ring-color}.device-name{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.devices-edit-fields{flex:auto;display:flex;flex-direction:column;align-items:stretch;padding-left:4px;margin-bottom:5px}.devices-edit-fields b{margin-top:8px;margin-bottom:0}.devices-edit-client-hints-heading{display:flex;flex-direction:row;align-items:center;margin-bottom:5px}li .devices-edit-client-hints-heading{margin-bottom:0}.devices-edit-client-hints-heading b{margin-inline-end:2px}.devices-edit-client-hints-heading .help-icon{margin-left:2px;margin-right:2px;vertical-align:middle}.devices-edit-client-hints-heading a:focus{box-shadow:var(--legacy-focus-ring-active-shadow)}.devices-edit-fields input{flex:auto;margin:8px 5px 0}li.devices-edit-client-hints-field{left:-12px}.devices-edit-client-hints-field input{flex:auto;margin:8px 5px 0}.devices-edit-fields .device-edit-fixed{flex:0 0 140px}.devices-edit-fields select{margin:8px 5px 0}\n/*# sourceURL=devicesSettingsTab.css */\n");const c={emulatedDevices:"Emulated Devices",addCustomDevice:"Add custom device...",device:"Device",deviceName:"Device Name",width:"Width",height:"Height",devicePixelRatio:"Device pixel ratio",userAgentString:"User agent string",userAgentType:"User agent type",deviceNameMustBeLessThanS:"Device name must be less than {PH1} characters.",deviceNameCannotBeEmpty:"Device name cannot be empty.",deviceAddedOrUpdated:"Device {PH1} successfully added/updated."},n=e.i18n.registerUIStrings("panels/settings/emulation/DevicesSettingsTab.ts",c),o=e.i18n.getLocalizedString.bind(void 0,n);class l extends i.Widget.VBox{containerElement;addCustomButton;ariaSuccessMessageElement;list;muteUpdate;emulatedDevicesList;editor;constructor(){super(),this.element.classList.add("settings-tab-container"),this.element.classList.add("devices-settings-tab");const e=this.element.createChild("header");i.UIUtils.createTextChild(e.createChild("h1"),o(c.emulatedDevices)),this.containerElement=this.element.createChild("div","settings-container-wrapper").createChild("div","settings-tab settings-content settings-container");const s=this.containerElement.createChild("div","devices-button-row");this.addCustomButton=i.UIUtils.createTextButton(o(c.addCustomDevice),this.addCustomDevice.bind(this)),this.addCustomButton.id="custom-device-add-button",s.appendChild(this.addCustomButton),this.ariaSuccessMessageElement=this.containerElement.createChild("div","device-success-message"),i.ARIAUtils.markAsPoliteLiveRegion(this.ariaSuccessMessageElement,!1),this.list=new i.ListWidget.ListWidget(this,!1),this.list.element.classList.add("devices-list"),this.list.show(this.containerElement),this.muteUpdate=!1,this.emulatedDevicesList=t.EmulatedDevices.EmulatedDevicesList.instance(),this.emulatedDevicesList.addEventListener("CustomDevicesUpdated",this.devicesUpdated,this),this.emulatedDevicesList.addEventListener("StandardDevicesUpdated",this.devicesUpdated,this),this.setDefaultFocusedElement(this.addCustomButton)}static instance(){return a||(a=new l),a}wasShown(){super.wasShown(),this.devicesUpdated(),this.registerCSSFiles([d]),this.list.registerCSSFiles([d])}devicesUpdated(){if(this.muteUpdate)return;this.list.clear();let e=this.emulatedDevicesList.custom().slice();for(let t=0;t<e.length;++t)this.list.appendItem(e[t],!0);this.list.appendSeparator(),e=this.emulatedDevicesList.standard().slice(),e.sort(t.EmulatedDevices.EmulatedDevice.deviceComparator);for(let t=0;t<e.length;++t)this.list.appendItem(e[t],!1)}muteAndSaveDeviceList(e){this.muteUpdate=!0,e?this.emulatedDevicesList.saveCustomDevices():this.emulatedDevicesList.saveStandardDevices(),this.muteUpdate=!1}addCustomDevice(){const e=new t.EmulatedDevices.EmulatedDevice;e.deviceScaleFactor=0,e.horizontal.width=700,e.horizontal.height=400,e.vertical.width=400,e.vertical.height=700,this.list.addNewItem(this.emulatedDevicesList.custom().length,e)}toNumericInputValue(e){return e?String(e):""}renderItem(e,t){const i=document.createElement("label");i.classList.add("devices-list-item");const s=i.createChild("input","devices-list-checkbox");s.type="checkbox",s.checked=e.show(),s.addEventListener("click",function(i){const d=s.checked;e.setShow(d),this.muteAndSaveDeviceList(t),i.consume()}.bind(this),!1);const d=document.createElement("span");return d.classList.add("device-name"),d.appendChild(document.createTextNode(e.title)),i.appendChild(d),i}removeItemRequested(e){this.emulatedDevicesList.removeCustomDevice(e)}commitEdit(e,i,s){e.title=i.control("title").value.trim(),e.vertical.width=i.control("width").value?parseInt(i.control("width").value,10):0,e.vertical.height=i.control("height").value?parseInt(i.control("height").value,10):0,e.horizontal.width=e.vertical.height,e.horizontal.height=e.vertical.width,e.deviceScaleFactor=i.control("scale").value?parseFloat(i.control("scale").value):0,e.userAgent=i.control("user-agent").value,e.modes=[],e.modes.push({title:"",orientation:t.EmulatedDevices.Vertical,insets:new t.DeviceModeModel.Insets(0,0,0,0),image:null}),e.modes.push({title:"",orientation:t.EmulatedDevices.Horizontal,insets:new t.DeviceModeModel.Insets(0,0,0,0),image:null}),e.capabilities=[];const d=i.control("ua-type").value;d!==t.DeviceModeModel.UA.Mobile&&d!==t.DeviceModeModel.UA.MobileNoTouch||e.capabilities.push(t.EmulatedDevices.Capability.Mobile),d!==t.DeviceModeModel.UA.Mobile&&d!==t.DeviceModeModel.UA.DesktopTouch||e.capabilities.push(t.EmulatedDevices.Capability.Touch);const a=i.control("ua-metadata").value.metaData;a&&(e.userAgentMetadata={...a,mobile:d===t.DeviceModeModel.UA.Mobile||d===t.DeviceModeModel.UA.MobileNoTouch}),s?this.emulatedDevicesList.addCustomDevice(e):this.emulatedDevicesList.saveCustomDevices(),this.addCustomButton.scrollIntoViewIfNeeded(),this.addCustomButton.focus(),this.ariaSuccessMessageElement.setAttribute("aria-label",o(c.deviceAddedOrUpdated,{PH1:e.title}))}beginEdit(e){const i=this.createEditor();let s;return i.control("title").value=e.title,i.control("width").value=this.toNumericInputValue(e.vertical.width),i.control("height").value=this.toNumericInputValue(e.vertical.height),i.control("scale").value=this.toNumericInputValue(e.deviceScaleFactor),i.control("user-agent").value=e.userAgent,s=e.mobile()?e.touch()?t.DeviceModeModel.UA.Mobile:t.DeviceModeModel.UA.MobileNoTouch:e.touch()?t.DeviceModeModel.UA.DesktopTouch:t.DeviceModeModel.UA.Desktop,i.control("ua-type").value=s,i.control("ua-metadata").value={metaData:e.userAgentMetadata||void 0},i}createEditor(){if(this.editor)return this.editor;const e=new i.ListWidget.Editor;this.editor=e;const d=e.contentElement(),a=d.createChild("div","devices-edit-fields");i.UIUtils.createTextChild(a.createChild("b"),o(c.device));const n=e.createInput("title","text",o(c.deviceName),(function(e,i,s){let d,a=!1;const n=s.value.trim();n.length>=t.DeviceModeModel.MaxDeviceNameLength?d=o(c.deviceNameMustBeLessThanS,{PH1:t.DeviceModeModel.MaxDeviceNameLength}):0===n.length?d=o(c.deviceNameCannotBeEmpty):a=!0;return{valid:a,errorMessage:d}}));a.createChild("div","hbox").appendChild(n),n.id="custom-device-name-field";const l=a.createChild("div","hbox");l.appendChild(e.createInput("width","text",o(c.width),(function(e,i,s){return t.DeviceModeModel.DeviceModeModel.widthValidator(s.value)}))),l.appendChild(e.createInput("height","text",o(c.height),(function(e,i,s){return t.DeviceModeModel.DeviceModeModel.heightValidator(s.value)})));const r=e.createInput("scale","text",o(c.devicePixelRatio),(function(e,i,s){return t.DeviceModeModel.DeviceModeModel.scaleValidator(s.value)}));r.classList.add("device-edit-fixed"),l.appendChild(r);const h=d.createChild("div","devices-edit-fields");i.UIUtils.createTextChild(h.createChild("b"),o(c.userAgentString));const u=h.createChild("div","hbox");u.appendChild(e.createInput("user-agent","text",o(c.userAgentString),(()=>({valid:!0,errorMessage:void 0}))));const v=[t.DeviceModeModel.UA.Mobile,t.DeviceModeModel.UA.MobileNoTouch,t.DeviceModeModel.UA.Desktop,t.DeviceModeModel.UA.DesktopTouch],m=e.createSelect("ua-type",v,(()=>({valid:!0,errorMessage:void 0})),o(c.userAgentType));m.classList.add("device-edit-fixed"),u.appendChild(m);const p=e.createCustomControl("ua-metadata",s.UserAgentClientHintsForm.UserAgentClientHintsForm,(function(){return p.validate()}));return p.value={},p.addEventListener("clienthintschange",(()=>e.requestValidation()),!1),d.appendChild(p),e}}var r=Object.freeze({__proto__:null,DevicesSettingsTab:l});export{r as DevicesSettingsTab};
