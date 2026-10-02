const tiers=[
 {name:"Mythic",rate:.001,color:"var(--danger)",one:"100,000"},
 {name:"Legendary",rate:.009,color:"var(--gold)",one:"11,111"},
 {name:"Epic",rate:.09,color:"var(--purple)",one:"1,111"},
 {name:"Rare",rate:.9,color:"var(--cyan)",one:"111"},
 {name:"Uncommon",rate:9,color:"var(--accent)",one:"11.1"},
 {name:"Common",rate:30,color:"#8792a2",one:"3.3"},
 {name:"Basic",rate:40,color:"#626d7e",one:"2.5"},
 {name:"Junk",rate:20,color:"#46505f",one:"5"}
];
// Cumulative weighted picker. Luck affects tiers above Common without inventing probability.
let state={seed:document.getElementById("seed").value,rolls:0,counts:Object.fromEntries(tiers.map(x=>[x.name,0])),pity:0,best:0,streak:0,history:[],rng:0};
const $=id=>document.getElementById(id);
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function nextRand(){state.rng=(Math.imul(state.rng,1664525)+1013904223)>>>0;return state.rng/4294967296}
function rollOnce(forceRare=false){
 const luck=+$("luck").value/100;
 if(forceRare){const r=nextRand();return r<.001?"Mythic":r<.01?"Legendary":r<.10?"Epic":"Rare"}
 let weights=tiers.map((t,i)=>t.rate*(i<4?Math.max(.15,luck):i===4?Math.max(.5,luck*.95):1));
 const sum=weights.reduce((a,b)=>a+b,0), r=nextRand()*sum;let acc=0;
 for(let i=0;i<tiers.length;i++){acc+=weights[i];if(r<acc)return tiers[i].name}
 return "Junk"
}
function roll(n=1){
 state.seed=$("seed").value||"RNG-DEFAULT";state.rng=hash(state.seed+"|"+state.rolls);
 let last="";for(let i=0;i<n;i++){
   state.rolls++; state.pity++;
   const force=$("pityToggle").checked && state.pity>=+$("pity").value;
   last=rollOnce(force);state.counts[last]++;state.history.unshift({n:state.rolls,name:last,t:Date.now()});
   if(["Rare","Epic","Legendary","Mythic"].includes(last)){state.pity=0;state.best=Math.max(state.best,state.streak);state.streak=0}else state.streak++;
 }
 state.best=Math.max(state.best,state.streak);render(last,n)
}
function render(last="?",n=1){
 const tier=tiers.find(x=>x.name===last);$("result").innerHTML=`<div class="result-rarity">${n>1?"BATCH RESULT":"ROLLED"}</div><strong style="color:${tier?.color||"inherit"}">${last}</strong><p>${n>1?`Processed ${n.toLocaleString()} rolls`:"A new outcome entered the ledger."}</p>`;
 $("seedLabel").textContent="SEED "+state.seed.slice(0,18).toUpperCase();$("total").textContent=state.rolls.toLocaleString();$("rare").textContent=tiers.slice(0,4).reduce((a,t)=>a+state.counts[t.name],0).toLocaleString();$("best").textContent=state.best;$("pityCount").textContent=state.pity;
 $("pityState").textContent=`${Math.max(0,+$("pity").value-state.pity)} rolls to threshold`;
 $("rareRate").textContent=state.rolls?((+$("rare").textContent.replace(/,/g,"")/state.rolls)*100).toFixed(2)+"% observed":"0.00% observed";
 $("heroRolls").textContent=state.rolls.toLocaleString();renderBars();renderFeed()
}
function renderBars(){
 const max=Math.max(1,...Object.values(state.counts));$("bars").innerHTML=tiers.slice().reverse().map(t=>`<div class="bar" style="height:${Math.max(3,state.counts[t.name]/max*180)}px;background:${t.color}"><span>${state.counts[t.name]}</span><small>${t.name.slice(0,5)}</small></div>`).join("")
}
function renderFeed(){
 $("feed").innerHTML=state.history.slice(0,12).map(x=>`<div class="feed-row"><span>#${x.n}</span><strong>${x.name}</strong><b>${new Date(x.t).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"})}</b></div>`).join("")||'<div class="empty">No rolls yet.</div>'
}
function initOdds(){$("oddsBody").innerHTML=tiers.map(t=>`<tr><td class="tier" style="color:${t.color}">${t.name}</td><td><span class="dot" style="background:${t.color}"></span>loaded</td><td>${t.rate}%</td><td>${t.one}</td><td>${(t.rate*100).toFixed(3)}</td></tr>`).join("")}
$("rollBtn").onclick=()=>roll();
document.querySelectorAll("[data-rolls]").forEach(b=>b.onclick=()=>roll(+b.dataset.rolls));
$("seed").onchange=()=>{state.rng=hash($("seed").value);$("seedLabel").textContent="SEED "+$("seed").value.slice(0,18).toUpperCase()};
$("luck").oninput=()=>{$("luckOut").value=$("luck").value+"%";$("luckOut").textContent=$("luck").value+"%"};
$("resetBtn").onclick=()=>{state={...state,rolls:0,counts:Object.fromEntries(tiers.map(x=>[x.name,0])),pity:0,best:0,streak:0,history:[]};render()};
$("clearFeed").onclick=()=>{state.history=[];renderFeed()};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),...state},null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="rng-lab-session.json";a.click();URL.revokeObjectURL(a.href)};
$("themeBtn").onclick=()=>document.body.classList.toggle("light");
document.addEventListener("keydown",e=>{if(e.code==="Space"&&e.target.tagName!=="INPUT"){e.preventDefault();roll()}});
setInterval(()=>{$("clock").textContent=new Date().toLocaleString([], {dateStyle:"medium",timeStyle:"medium"})},1000);
initOdds();render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
