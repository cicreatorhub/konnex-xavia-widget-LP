const SESSION_KEY="xavia_session_id";
export function getSessionId(){let s=localStorage.getItem(SESSION_KEY);if(!s){s="web-"+(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now());localStorage.setItem(SESSION_KEY,s)}return s}
export function clearSession(){localStorage.removeItem(SESSION_KEY)}
