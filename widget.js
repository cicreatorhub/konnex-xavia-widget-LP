(() => {
const s=document.currentScript;if(!s)return;
const businessId=s.dataset.business||"demo";
const base=s.src.substring(0,s.src.lastIndexOf("/")+1);
const css=document.createElement("link");css.rel="stylesheet";css.href=base+"widget.css";document.head.appendChild(css);
import(base+"widget-core.js").then(m=>m.startWidget({businessId})).catch(e=>console.error("Xavia widget failed:",e));
})();
