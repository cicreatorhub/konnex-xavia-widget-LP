export function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
export function formatTime(date=new Date()){return date.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
