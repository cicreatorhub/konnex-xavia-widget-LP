import {formatTime} from "./utils.js";
export class XaviaUI{
constructor(config){this.config=config;this.elements={}}
build(){if(document.getElementById("xavia-widget"))return;const root=document.createElement("div");root.id="xavia-widget";root.innerHTML=`<button id="xavia-launcher" type="button" aria-label="Open Xavia chat"><span>✦</span></button><section id="xavia-chat" aria-label="Xavia AI chat"><header id="xavia-header"><div id="xavia-avatar">${this.config.avatar}</div><div class="xavia-head-copy"><div id="xavia-business">${this.config.businessName}</div><div id="xavia-status"><span>●</span> Xavia is online</div></div><button id="xavia-close" type="button" aria-label="Close chat">×</button></header><div id="xavia-messages" aria-live="polite"></div><div id="xavia-input-area"><textarea id="xavia-input" rows="1" placeholder="Ask Xavia anything..."></textarea><button id="xavia-send" type="button" aria-label="Send message">➤</button></div><div class="xavia-powered">Powered by <strong>Konnex AI</strong></div></section>`;document.body.appendChild(root);this.elements={root,launcher:root.querySelector("#xavia-launcher"),chat:root.querySelector("#xavia-chat"),close:root.querySelector("#xavia-close"),messages:root.querySelector("#xavia-messages"),input:root.querySelector("#xavia-input"),send:root.querySelector("#xavia-send"),business:root.querySelector("#xavia-business"),avatar:root.querySelector("#xavia-avatar")}}
toggle(){this.elements.chat.classList.toggle("open");if(this.elements.chat.classList.contains("open"))setTimeout(()=>this.elements.input.focus(),120)}
close(){this.elements.chat.classList.remove("open")}
setBusiness(d){this.elements.business.textContent=d.businessName||d.name||"Xavia";this.elements.avatar.textContent=d.avatar||"X"}
hasMessages(){return this.elements.messages.children.length>0}
addMessage(role,text){const w=document.createElement("div");w.className=`xavia-message ${role}`;const b=document.createElement("div");b.className="bubble";b.textContent=text;const t=document.createElement("div");t.className="time";t.textContent=formatTime();w.append(b,t);this.elements.messages.appendChild(w);this.scrollBottom()}
showTyping(){this.hideTyping();const w=document.createElement("div");w.id="xavia-typing";w.className="xavia-message bot";w.innerHTML='<div class="bubble typing"><span></span><span></span><span></span></div>';this.elements.messages.appendChild(w);this.scrollBottom()}
hideTyping(){document.getElementById("xavia-typing")?.remove()}
showError(m){this.addMessage("bot","⚠️ "+m)}
clearInput(){this.elements.input.value="";this.resizeInput()}
setSending(v){this.elements.send.disabled=v;this.elements.input.disabled=v;this.elements.send.classList.toggle("sending",v)}
resizeInput(){const i=this.elements.input;i.style.height="auto";i.style.height=Math.min(i.scrollHeight,120)+"px"}
scrollBottom(){requestAnimationFrame(()=>this.elements.messages.scrollTop=this.elements.messages.scrollHeight)}
}
