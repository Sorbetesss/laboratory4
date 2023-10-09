import*as o from"../../lit-html/lit-html.js";import*as t from"../helpers/helpers.js";import*as r from"../icon_button/icon_button.js";const e=new CSSStyleSheet;e.replaceSync("*{margin:0;padding:0;box-sizing:border-box}*:focus,\n*:focus-visible,\n:host(:focus),\n:host(:focus-visible){outline:none}:host{display:inline-flex;flex-direction:row}button{--button-has-right-border-radius:calc(1 - var(--override-button-no-right-border-radius, 0));--button-border-size:1px;--button-height:24px;--button-width:100%;align-items:center;border-radius:4px calc(var(--button-has-right-border-radius) * 4px) calc(var(--button-has-right-border-radius) * 4px) 4px;display:inline-flex;font-family:inherit;font-size:12px;font-weight:500;height:var(--button-height);line-height:14px;padding:5px 12px;justify-content:center;width:var(--button-width);white-space:nowrap}button.small{--button-height:20px;border-radius:2px calc(var(--button-has-right-border-radius) * 2px) calc(var(--button-has-right-border-radius) * 2px) 2px}button:focus-visible{box-shadow:0 0 0 2px var(--color-button-outline-focus)}button.toolbar,\nbutton.round{--button-height:24px;--button-width:24px;background:transparent;border-radius:2px calc(var(--button-has-right-border-radius) * 2px) calc(var(--button-has-right-border-radius) * 2px) 2px;border:none;overflow:hidden;padding:0;white-space:nowrap}button.round{border-radius:100%}button.round.small,\nbutton.toolbar.small{--button-height:20px;--button-width:20px}button.round.tiny{--button-height:18px;--button-width:18px}button.primary{border:var(--button-border-size) solid var(--color-primary);background:var(--color-primary);color:var(--color-background)}button.primary:hover{background:var(--color-button-primary-background-hovering);border:var(--button-border-size) solid var(--color-button-primary-background-hovering)}button.primary.active,\nbutton.primary:active{background:var(--color-button-primary-background-pressed);border:var(--button-border-size) solid var(--color-button-primary-background-pressed)}button.primary:disabled,\nbutton.primary:disabled:hover{border:var(--button-border-size) solid transparent;background:var(--color-background-elevation-1);color:var(--color-text-disabled);cursor:not-allowed}button.secondary{border:var(--button-border-size) solid var(--color-details-hairline);background:var(--color-background);color:var(--color-primary)}button.secondary:hover{background:var(--color-button-secondary-background-hovering)}button.secondary.active,\nbutton.secondary:active{background:var(--color-button-secondary-background-pressed);border:var(--button-border-size) solid var(--color-button-secondary-background-pressed)}button.secondary:focus-visible{border:var(--button-border-size) solid var(--color-background)}button.secondary:disabled,\nbutton.secondary:disabled:hover{border:var(--button-border-size) solid var(--color-background-elevation-1);background:var(--color-background);color:var(--color-text-disabled);cursor:not-allowed}button.secondary.active:focus-visible,\nbutton.secondary:active:focus-visible{border:var(--button-border-size) solid var(--color-button-secondary-background-pressed)}button.toolbar:hover,\nbutton.round:hover{background-color:var(--color-iconbutton-hover)}button.toolbar.active,\nbutton.toolbar:active,\nbutton.round.active,\nbutton.round:active{background-color:var(--color-iconbutton-pressed)}button.toolbar:focus-visible,\nbutton.round:focus-visible{background-color:var(--color-background-elevation-2)}button.toolbar:disabled,\nbutton.toolbar:disabled:hover,\nbutton.round:disabled,\nbutton.round:disabled:hover{background:var(--color-background);color:var(--color-text-disabled);cursor:not-allowed}button.text-with-icon{padding:0 calc(12px - var(--button-border-size)) 0 calc(8px - var(--button-border-size))}button.small.text-with-icon{padding:0 calc(9px - var(--button-border-size)) 0 calc(3px - var(--button-border-size))}button.only-icon{padding:0}button devtools-icon{width:calc(var(--button-width) - 4px);height:calc(var(--button-height) - 4px)}button.text-with-icon devtools-icon{width:20px;height:20px;margin-right:4px}button.toolbar devtools-icon,\nbutton.round devtools-icon{--icon-color:var(--icon-default)}button.primary-toolbar devtools-icon{--icon-color:var(--icon-primary)}button.primary devtools-icon{--icon-color:var(--color-background)}button.secondary devtools-icon{--icon-color:var(--icon-primary)}button.explicit-size devtools-icon{width:unset;height:unset}button.small.text-with-icon devtools-icon{width:16px;height:16px;margin-right:4px}button.toolbar.explicit-size devtools-icon,\nbutton.round.explicit-size devtools-icon{width:unset;height:unset}button.toolbar.active devtools-icon,\nbutton.toolbar:active devtools-icon{--icon-color:var(--icon-toggled)}button.primary-toolbar:active devtools-icon{--icon-color:var(--icon-primary)}button.toolbar:hover devtools-icon{--icon-color:var(--icon-default-hover)}button.primary-toolbar:hover devtools-icon{--icon-color:var(--icon-primary)}button.toolbar:disabled devtools-icon,\nbutton.round:disabled devtools-icon{--icon-color:var(--icon-disabled)}button.primary:disabled devtools-icon{--icon-color:var(--icon-disabled)}button.secondary:disabled devtools-icon{--icon-color:var(--icon-disabled)}.spinner-component.secondary{border:2px solid var(--color-primary);border-right-color:transparent}.spinner-component.disabled{border:2px solid var(--color-text-disabled);border-right-color:transparent}.spinner-component{display:block;width:12px;height:12px;border-radius:6px;border:2px solid var(--color-background);animation:spinner-animation 1s linear infinite;border-right-color:transparent;margin-right:4px}@keyframes spinner-animation{from{transform:rotate(0)}to{transform:rotate(360deg)}}\n/*# sourceURL=button.css */\n");class i extends HTMLElement{static formAssociated=!0;static litTagName=o.literal`devtools-button`;#o=this.attachShadow({mode:"open",delegatesFocus:!0});#t=this.#r.bind(this);#e=this.#i.bind(this);#n={size:"MEDIUM",disabled:!1,active:!1,spinner:!1,type:"button"};#s=!0;#a=this.attachInternals();constructor(){super(),this.setAttribute("role","presentation"),this.addEventListener("click",this.#e,!0)}set data(o){this.#n.variant=o.variant,this.#n.iconUrl=o.iconUrl,this.#n.iconName=o.iconName,this.#n.size="MEDIUM","size"in o&&o.size&&(this.#n.size=o.size),"iconWidth"in o&&o.iconWidth&&(this.#n.iconWidth=o.iconWidth),"iconHeight"in o&&o.iconHeight&&(this.#n.iconHeight=o.iconHeight),this.#n.active=Boolean(o.active),this.#n.spinner=Boolean("spinner"in o&&o.spinner),this.#n.type="button","type"in o&&o.type&&(this.#n.type=o.type),this.#d(o.disabled||!1),this.#n.title=o.title,t.ScheduledRender.scheduleRender(this,this.#t)}set iconUrl(o){this.#n.iconUrl=o,t.ScheduledRender.scheduleRender(this,this.#t)}set iconName(o){this.#n.iconName=o,t.ScheduledRender.scheduleRender(this,this.#t)}set variant(o){this.#n.variant=o,t.ScheduledRender.scheduleRender(this,this.#t)}set size(o){this.#n.size=o,t.ScheduledRender.scheduleRender(this,this.#t)}set iconWidth(o){this.#n.iconWidth=o,t.ScheduledRender.scheduleRender(this,this.#t)}set iconHeight(o){this.#n.iconHeight=o,t.ScheduledRender.scheduleRender(this,this.#t)}set type(o){this.#n.type=o,t.ScheduledRender.scheduleRender(this,this.#t)}set title(o){this.#n.title=o,t.ScheduledRender.scheduleRender(this,this.#t)}set disabled(o){this.#d(o),t.ScheduledRender.scheduleRender(this,this.#t)}set active(o){this.#n.active=o,t.ScheduledRender.scheduleRender(this,this.#t)}set spinner(o){this.#n.spinner=o,t.ScheduledRender.scheduleRender(this,this.#t)}#d(o){this.#n.disabled=o,this.toggleAttribute("disabled",o)}focus(){this.#o.querySelector("button")?.focus()}connectedCallback(){this.#o.adoptedStyleSheets=[e],t.ScheduledRender.scheduleRender(this,this.#t)}#i(o){if(this.#n.disabled)return o.stopPropagation(),void o.preventDefault();this.form&&"submit"===this.#n.type&&(o.preventDefault(),this.form.dispatchEvent(new SubmitEvent("submit",{submitter:this}))),this.form&&"reset"===this.#n.type&&(o.preventDefault(),this.form.reset())}#c(o){const r=o.target?.assignedNodes();this.#s=!r||!Boolean(r.length),t.ScheduledRender.scheduleRender(this,this.#t)}#l(){return"toolbar"===this.#n.variant||"primary_toolbar"===this.#n.variant}#r(){if(!this.#n.variant)throw new Error("Button requires a variant to be defined");if(this.#l()){if(!this.#n.iconUrl&&!this.#n.iconName)throw new Error("Toolbar button requires an icon");if(!this.#s)throw new Error("Toolbar button does not accept children")}if("round"===this.#n.variant){if(!this.#n.iconUrl&&!this.#n.iconName)throw new Error("Round button requires an icon");if(!this.#s)throw new Error("Round button does not accept children")}if(this.#n.iconName&&this.#n.iconUrl)throw new Error("Both iconName and iconUrl are provided.");const t=Boolean(this.#n.iconUrl)||Boolean(this.#n.iconName),e={primary:"primary"===this.#n.variant,secondary:"secondary"===this.#n.variant,toolbar:this.#l(),"primary-toolbar":"primary_toolbar"===this.#n.variant,round:"round"===this.#n.variant,"text-with-icon":t&&!this.#s,"only-icon":t&&this.#s,small:Boolean("SMALL"===this.#n.size||"TINY"===this.#n.size),tiny:Boolean("TINY"===this.#n.size),active:this.#n.active,"explicit-size":Boolean(this.#n.iconHeight||this.#n.iconWidth)},i={primary:"primary"===this.#n.variant,secondary:"secondary"===this.#n.variant,disabled:Boolean(this.#n.disabled),"spinner-component":!0};o.render(o.html` <button title="${o.Directives.ifDefined(this.#n.title)}" .disabled="${this.#n.disabled}" class="${o.Directives.classMap(e)}"> ${t?o.html`<${r.Icon.Icon.litTagName} .data="${{iconPath:this.#n.iconUrl,iconName:this.#n.iconName,color:"var(--color-background)",width:this.#n.iconWidth||void 0,height:this.#n.iconHeight||void 0}}"> </${r.Icon.Icon.litTagName}>`:""} ${this.#n.spinner?o.html`<span class="${o.Directives.classMap(i)}"></span>`:""} <slot @slotchange="${this.#c}"></slot> </button> `,this.#o,{host:this})}get value(){return this.#n.value||""}set value(o){this.#n.value=o}get form(){return this.#a.form}get name(){return this.getAttribute("name")}get type(){return this.#n.type}get validity(){return this.#a.validity}get validationMessage(){return this.#a.validationMessage}get willValidate(){return this.#a.willValidate}checkValidity(){return this.#a.checkValidity()}reportValidity(){return this.#a.reportValidity()}}t.CustomElements.defineComponent("devtools-button",i);var n=Object.freeze({__proto__:null,Button:i});export{n as Button};
