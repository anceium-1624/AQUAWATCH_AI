const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let selectedFile = null;
let currentResult = null;
let previewUrl = null;
let observations = [
  {location:"Marina Beach", region:"Chennai, India", type:"Floating plastic", count:38, score:86, status:"Needs review"},
  {location:"Puri Coast", region:"Odisha, India", type:"Mixed debris", count:24, score:64, status:"Pending"},
  {location:"Versova Beach", region:"Mumbai, India", type:"Plastic bottles", count:17, score:31, status:"Reviewed"}
];
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function showPage(id){$$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.target===id));const names={overview:"Overview",analyze:"Analyze image",hotspots:"Hotspot map",reports:"Reports"};$("#page-title").textContent=names[id]||"Overview";window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav-link").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.target)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));
const input=$("#image-input"),drop=$("#dropzone");
function setFile(file){
  if(!file)return;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)){toast("Please choose a JPG, PNG or WEBP image.");return}
  if(file.size>10*1024*1024){toast("Image must be smaller than 10 MB.");return}
  selectedFile=file;
  if(previewUrl)URL.revokeObjectURL(previewUrl);
  previewUrl=URL.createObjectURL(file);
  $("#preview-image").src=previewUrl;$("#result-image").src=previewUrl;$("#file-name").textContent=file.name;
  drop.classList.add("hidden");$("#preview-wrap").classList.remove("hidden");$("#analyze-btn").disabled=false;$("#results-panel").classList.add("hidden");$("#save-observation").disabled=false;$("#save-observation").textContent="＋ Save observation to dashboard";currentResult=null;
}
input.addEventListener("change",e=>setFile(e.target.files[0]));
["dragenter","dragover"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("dragover")}));
["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("dragover")}));
drop.addEventListener("drop",e=>setFile(e.dataTransfer.files[0]));
$("#remove-image").addEventListener("click",()=>{selectedFile=null;input.value="";if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null;}$("#preview-image").removeAttribute("src");$("#result-image").removeAttribute("src");$("#preview-wrap").classList.add("hidden");drop.classList.remove("hidden");$("#analyze-btn").disabled=true;$("#results-panel").classList.add("hidden")});
$("#analyze-btn").addEventListener("click",()=>{
 if(!selectedFile)return;
 const seed=selectedFile.size+selectedFile.name.length*17;
 const count=12+(seed%37), confidence=84+(seed%13), score=Math.min(96,Math.round(count*1.7+(confidence-80)*1.1));
 const band=score>=70?"High priority":score>=45?"Medium priority":"Low priority";
 const action=score>=70?"Urgent field review":score>=45?"Schedule inspection":"Routine monitoring";
 currentResult={saved:false,location:$("#location-input").value.trim()||"Unspecified location",notes:$("#notes-input").value.trim(),type:"Prototype image observation",count,confidence,score,status:"Awaiting human review",file:selectedFile.name};
 $("#score-number").innerHTML=score+'<span>/100</span>';$("#score-band").textContent=band;$("#score-band").className="priority "+(score>=70?"high-p":score>=45?"med-p":"low-p");
 $("#score-fill").style.width=score+"%";$("#score-fill").style.background=score>=70?"linear-gradient(90deg,#e9b35d,#e36e63)":score>=45?"#efb35e":"#63c6a2";
 $("#debris-count").textContent=count;$("#confidence").textContent=confidence+"%";$("#action-text").textContent=action;
 $("#result-explain").textContent="Simulated demonstration output generated from the uploaded file metadata. It does not represent detections made by a trained computer-vision model. Connect the YOLO inference API for real predictions.";
 $("#results-panel").classList.remove("hidden");$("#results-panel").scrollIntoView({behavior:"smooth",block:"start"});
});
$("#save-observation").addEventListener("click",()=>{
 if(!currentResult||currentResult.saved)return;
 currentResult.saved=true;
 observations.unshift({...currentResult,region:"User submitted",status:"Awaiting review"});
 updateTable();
 $("#metric-observations").textContent=24+observations.length-3;
 $("#metric-items").textContent=186+observations.slice(3).reduce((sum,o)=>sum+o.count,0);
 $("#metric-high").textContent=6+observations.slice(3).filter(o=>o.score>=70).length;
 $("#metric-locations").textContent=8+new Set(observations.slice(3).map(o=>o.location)).size;
 $("#save-observation").disabled=true;$("#save-observation").textContent="✓ Observation saved";
 toast("Observation saved to this browser session.");
});
function updateTable(){
 const rows=observations.slice(0,5).map(o=>{let p=o.score>=70?"high-p":o.score>=45?"med-p":"low-p";let s=o.score>=70?"High":o.score>=45?"Medium":"Low";return `<tr><td><b>${escapeHtml(o.location)}</b><small>${escapeHtml(o.region||"User submitted")}</small></td><td>${escapeHtml(o.type)}</td><td>${o.count}</td><td><span class="priority ${p}">${s} · ${o.score}</span></td><td><span class="status review">${escapeHtml(o.status)}</span></td></tr>`}).join("");
 $("#recent-table").innerHTML=rows;
}
function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$$(".map-point").forEach(point=>point.addEventListener("click",()=>{
 $$(".map-point").forEach(p=>p.style.transform="scale(1)");point.style.transform="scale(1.18)";
 const name=point.dataset.place,score=Number(point.dataset.score);toast(`${name}: illustrative priority score ${score}/100`);
 $$(".hotspot-entry").forEach(e=>e.classList.toggle("selected",e.querySelector("b").textContent===name));
}));
$("#download-report").addEventListener("click",()=>{
 const headers=["Location","Region","Observation type","Estimated debris count","Priority score","Status","Notes"];
 const rows=observations.map(o=>[o.location,o.region||"",o.type,o.count,o.score,o.status,o.notes||""]);
 const csv=[headers,...rows].map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="aquawatch_observation_report.csv";a.click();URL.revokeObjectURL(url);toast("CSV report downloaded.");
});
