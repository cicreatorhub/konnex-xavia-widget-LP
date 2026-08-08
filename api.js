import {sleep} from "./utils.js";
export class XaviaAPI{
constructor(config){this.config=config}
async getBusiness(){return this.request(`/business/${encodeURIComponent(this.config.businessId)}`,{method:"GET"})}
async sendMessage(message,sessionId){return this.request("/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({business_id:this.config.businessId,session_id:sessionId,channel:"web",message})})}
async request(endpoint,options={}){let last;for(let attempt=1;attempt<=this.config.retryAttempts+1;attempt++){try{const c=new AbortController();const t=setTimeout(()=>c.abort(),this.config.requestTimeout);let r;try{r=await fetch(this.config.backendUrl+endpoint,{...options,signal:c.signal})}finally{clearTimeout(t)}if(!r.ok)throw new Error(`HTTP ${r.status}`);return await r.json()}catch(e){last=e;console.warn(`Xavia API attempt ${attempt} failed:`,e.message);if(attempt<=this.config.retryAttempts)await sleep(this.config.retryDelay)}}throw last}}
