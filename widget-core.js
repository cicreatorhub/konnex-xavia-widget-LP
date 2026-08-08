import {DEFAULT_CONFIG} from "./config.js";
import {XaviaAPI} from "./api.js";
import {XaviaUI} from "./ui.js";
import {getSessionId} from "./storage.js";
class XaviaWidget{
constructor(options={}){this.config={...DEFAULT_CONFIG,...options};this.api=new XaviaAPI(this.config);this.ui=new XaviaUI(this.config);this.sessionId=getSessionId();this.sending=false}
async start(){this.ui.build();this.registerEvents();await this.loadBusiness()}
async loadBusiness(){try{const b=await this.api.getBusiness();if(b){this.config.businessName=b.name||this.config.businessName;this.config.avatar=b.avatar||this.config.avatar;this.config.greeting=b.greeting||this.config.greeting;this.config.theme=b.theme||this.config.theme}}catch(e){console.warn("Business configuration unavailable; using defaults.",e)}this.ui.setBusiness(this.config);this.applyTheme();if(!this.ui.hasMessages())this.ui.addMessage("bot",this.config.greeting)}
applyTheme(){const t=this.config.theme||{},r=document.documentElement;for(const[k,v]of Object.entries({"--xavia-primary":t.primary,"--xavia-secondary":t.secondary,"--xavia-bg":t.background,"--xavia-text":t.text}))if(v)r.style.setProperty(k,v)}
registerEvents(){this.ui.elements.launcher.onclick=()=>this.ui.toggle();this.ui.elements.close.onclick=()=>this.ui.close();this.ui.elements.send.onclick=()=>this.send();this.ui.elements.input.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();this.send()}};this.ui.elements.input.oninput=()=>this.ui.resizeInput()}
async send(){if(this.sending)return;const message=this.ui.elements.input.value.trim();if(!message)return;this.sending=true;this.ui.setSending(true);this.ui.addMessage("user",message);this.ui.clearInput();this.ui.showTyping();try{const r=await this.api.sendMessage(message,this.sessionId);this.ui.hideTyping();if(!r?.reply)throw new Error("No reply in backend response");this.ui.addMessage("bot",r.reply)}catch(e){console.error("Xavia chat error:",e);this.ui.hideTyping();this.ui.showError("I'm having trouble connecting right now. Please try again.")}finally{this.sending=false;this.ui.setSending(false)}}
}
export function startWidget(options={}){new XaviaWidget(options).start()}
