
// ─── BOOT SCREEN ───
const bootScreen = document.getElementById('boot-screen');
const bootLines  = document.getElementById('boot-lines');
const bootBar    = document.getElementById('boot-bar');
const bootStatus = document.getElementById('boot-status');
const msgs = [
  {t:'SYSTEM BOOT v2.4.1',d:0,ok:false},
  {t:'Loading kernel modules...',d:200,ok:true},
  {t:'Mounting filesystems...',d:420,ok:true},
  {t:'Initializing network...',d:640,ok:true},
  {t:'Loading portfolio...',d:860,ok:true},
  {t:'Launching interface...',d:1100,ok:false},
];
msgs.forEach((m,i)=>{
  setTimeout(()=>{
    const l=document.createElement('div');
    l.className='line'+(m.ok?' ok':'');
    l.textContent='> '+m.t;
    bootLines.appendChild(l);
    const p=Math.round(((i+1)/msgs.length)*100);
    bootBar.style.width=p+'%';
    bootStatus.textContent=p<100?`LOADING... ${p}%`:'READY';
  },m.d);
});
setTimeout(()=>bootScreen.classList.add('done'),1800);

// ─── SCROLL PROGRESS ───
const scrollBar=document.getElementById('scroll-progress');
window.addEventListener('scroll',()=>{
  const max=document.body.scrollHeight-window.innerHeight;
  scrollBar.style.width=(window.scrollY/max*100)+'%';
});

// ─── CURSOR ───
const cursor=document.getElementById('cursor');
const ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*0.1; ry+=(my-ry)*0.1;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.skill-card,.project-card,input,textarea,.contact-link').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.width='18px';cursor.style.height='18px';ring.style.width='52px';ring.style.height='52px';ring.style.borderColor='rgba(249,115,22,0.9)';});
  el.addEventListener('mouseleave',()=>{cursor.style.width='12px';cursor.style.height='12px';ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='rgba(249,115,22,0.5)';});
});

// ─── PARTICLE CANVAS ───
const isMobile=window.innerWidth<=900;
const canvas=document.getElementById('bg-canvas');
if(canvas){
  const ctx=canvas.getContext('2d');
  let W,H,nodes=[];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize();
  window.addEventListener('resize',()=>{resize();buildNodes();});
  function buildNodes(){
    nodes=[];
    const n=isMobile?40:Math.floor(W*H/12000);
    for(let i=0;i<n;i++) nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*1.5+.5});
  }
  buildNodes();
  function drawCanvas(){
    ctx.clearRect(0,0,W,H);
    for(const n of nodes){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;}
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<140){ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.strokeStyle=`rgba(249,115,22,${(1-d/140)*.25})`;ctx.lineWidth=.6;ctx.stroke();}
    }
    for(const n of nodes){ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle='rgba(249,115,22,0.6)';ctx.fill();}
    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();
}

// ─── HERO ROLE TYPEWRITER ───
const roles=['Full Stack Developer','Problem Solver','AI Enthusiast','Young IT Professional','Backend Engineer'];
let rIdx=0,cIdx=0,del=false;
const roleEl=document.querySelector('.hero-role');
if(roleEl){
  function typeRole(){
    const r=roles[rIdx];
    if(!del){roleEl.textContent=r.slice(0,++cIdx);if(cIdx===r.length){del=true;setTimeout(typeRole,2000);return;}}
    else{roleEl.textContent=r.slice(0,--cIdx);if(cIdx===0){del=false;rIdx=(rIdx+1)%roles.length;}}
    setTimeout(typeRole,del?38:80);
  }
  setTimeout(typeRole,2200);
}

// ─── PERIODIC GLITCH ON NAME ───
const glitchEl=document.getElementById('scramble-name');
function triggerGlitch(){
  if(glitchEl){glitchEl.classList.add('glitching');setTimeout(()=>glitchEl.classList.remove('glitching'),200);}
  setTimeout(triggerGlitch,4000+Math.random()*6000);
}
setTimeout(triggerGlitch,3000);

// ─── BLACKBOX DECODE ENGINE ───
const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!?';
function rChar(){return CHARS[Math.floor(Math.random()*CHARS.length)];}
function blackboxDecode(el,text,{charCycles=8,stepDelay=35,charDelay=60,onDone}={}){
  el.innerHTML=text.split('').map(c=>c===' '?'<span class="decode-space"> </span>':`<span class="decode-char" data-final="${c}">${rChar()}</span>`).join('');
  const spans=[...el.querySelectorAll('.decode-char')];
  let idx=0;
  function revealNext(){
    if(idx>=spans.length){if(onDone)onDone();return;}
    const s=spans[idx++]; let cy=0;
    const f=setInterval(()=>{s.textContent=rChar();s.style.color='rgba(249,115,22,0.7)';if(++cy>=charCycles){clearInterval(f);s.textContent=s.dataset.final;s.style.color='';}},stepDelay);
    setTimeout(revealNext,charDelay);
  }
  revealNext();
}

// ─── NAME DECODE (runs on load, loops) ───
const scrambleEl=document.getElementById('scramble-name');
const NAME='Leslie Kekane';
function runNameDecode(){blackboxDecode(scrambleEl,NAME,{charCycles:10,stepDelay:28,charDelay:75,onDone:()=>setTimeout(runNameDecode,7000)});}
runNameDecode();

// ─── SECTION TITLE DECODE (scroll trigger, loops every 30s) ───
function runTitleDecode(el){
  blackboxDecode(el,el.dataset.decode,{charCycles:7,stepDelay:26,charDelay:50,onDone:()=>setTimeout(()=>runTitleDecode(el),30000)});
}
const decodeObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting&&!e.target.dataset.decoded){e.target.dataset.decoded='1';runTitleDecode(e.target);}});
},{threshold:0.4});
document.querySelectorAll('[data-decode]').forEach(el=>{
  el.textContent=el.dataset.decode.replace(/[^ ]/g,'-');
  decodeObs.observe(el);
});

// ─── SCROLL REVEAL: SKILLS & PROJECTS ───
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>{
        e.target.classList.add('visible');
        const bar=e.target.querySelector('.skill-bar');
        if(bar)setTimeout(()=>{bar.style.width=bar.dataset.width+'%';},150);
      },i*80);
      revealObs.unobserve(e.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.skill-card,.project-card').forEach(el=>revealObs.observe(el));

// ─── 3D CARD TILT ───
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='perspective(600px) rotateY(0) rotateX(0) translateY(0)';card.style.transition='transform 0.5s ease,border-color 0.3s,box-shadow 0.4s';});
  card.addEventListener('mouseenter',()=>{card.style.transition='border-color 0.3s,box-shadow 0.4s';});
});

// ─── HAMBURGER MENU ───
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('nav-links');
hamburger.addEventListener('click',()=>{hamburger.classList.toggle('open');navLinks.classList.toggle('open');});
navLinks.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{hamburger.classList.remove('open');navLinks.classList.remove('open');}));

// ─── SMOOTH SCROLL NAV ───
function easedScrollTo(targetY,dur=1100){
  const startY=window.scrollY,diff=targetY-startY;let start=null;
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function step(ts){if(!start)start=ts;const p=Math.min((ts-start)/dur,1);window.scrollTo(0,startY+diff*ease(p));if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.getElementById(link.dataset.target);
    if(t)easedScrollTo(t.getBoundingClientRect().top+window.scrollY-document.querySelector('nav').offsetHeight-20,1100);
  });
});
document.getElementById('nav-home').addEventListener('click',e=>{e.preventDefault();easedScrollTo(0,1000);});

// Active nav highlight
const sections=['hero','skills','projects','contact'];
window.addEventListener('scroll',()=>{
  const navH=document.querySelector('nav').offsetHeight;
  let cur='hero';
  sections.forEach(id=>{const el=document.getElementById(id);if(el&&window.scrollY>=el.offsetTop-navH-60)cur=id;});
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('active',l.dataset.target===cur));
});

// ─── SECTION MOON MEN ───
function makeSectionMM(id){
  const el=document.createElement('div');
  el.id=id; el.style.cssText='position:absolute;pointer-events:none;z-index:50;filter:drop-shadow(0 0 8px rgba(249,115,22,0.4));opacity:0.9;';
  return el;
}
const mmSVGstr=`<svg width="52" height="72" viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="22" r="18" fill="#1a1a2e" stroke="#f97316" stroke-width="2"/><ellipse cx="26" cy="22" rx="13" ry="13" fill="#0f0f1a"/><ellipse cx="20" cy="16" rx="4" ry="2.5" fill="rgba(249,115,22,0.15)" transform="rotate(-20 20 16)"/><circle cx="20" cy="20" r="2.5" fill="#f97316" class="s-eye-l"/><circle cx="32" cy="20" r="2.5" fill="#f97316" class="s-eye-r"/><path class="s-mouth" d="M20 28 Q26 33 32 28" stroke="#f97316" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="26" cy="22" r="18" fill="none" stroke="rgba(249,115,22,0.2)" stroke-width="1" stroke-dasharray="4 3"/><rect x="14" y="38" width="24" height="20" rx="6" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5"/><rect x="20" y="43" width="12" height="7" rx="2" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.35)" stroke-width="1"/><circle cx="26" cy="46.5" r="1.5" fill="#f97316"/><rect class="s-arm-l" x="4" y="39" width="12" height="5" rx="2.5" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" transform-origin="16 41.5"/><rect class="s-arm-r" x="36" y="39" width="12" height="5" rx="2.5" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" transform-origin="36 41.5"/><rect class="s-leg-l" x="16" y="58" width="8" height="14" rx="4" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" transform-origin="20 58"/><rect class="s-leg-r" x="28" y="58" width="8" height="14" rx="4" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" transform-origin="32 58"/><line x1="26" y1="4" x2="26" y2="10" stroke="#f97316" stroke-width="1.5"/><circle cx="26" cy="3" r="2" fill="#f97316"/><circle cx="26" cy="3" r="4" fill="rgba(249,115,22,0.2)" class="s-blink"/></svg>`;

// Gamer
const gamer=makeSectionMM('mm-gamer');
gamer.style.bottom='30px'; gamer.style.right='24px';
gamer.innerHTML=mmSVGstr;
const skillsSec=document.getElementById('skills');
if(skillsSec){skillsSec.style.position='relative';skillsSec.appendChild(gamer);}
const gBub=document.createElement('div');
gBub.className='mm-bubble';gBub.innerHTML="I'm still learning 🎮";
gBub.style.cssText='position:absolute;bottom:108px;right:20px;background:#111;border:1px solid rgba(249,115,22,0.5);color:#e8e8e8;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 12px;border-radius:10px 10px 2px 10px;white-space:nowrap;pointer-events:none;z-index:51;box-shadow:0 0 14px rgba(249,115,22,0.2);animation:bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;';
if(skillsSec)skillsSec.appendChild(gBub);

let gStep=0;
function animGamer(){
  gStep++;
  const aL=gamer.querySelector('.s-arm-l'),aR=gamer.querySelector('.s-arm-r'),lL=gamer.querySelector('.s-leg-l'),lR=gamer.querySelector('.s-leg-r'),bl=gamer.querySelector('.s-blink');
  gamer.querySelector('.s-mouth').setAttribute('d','M20 27 Q26 33 32 27');
  aL.setAttribute('transform','rotate(35,16,41.5)'); aR.setAttribute('transform','rotate(-35,36,41.5)');
  lL.setAttribute('transform','rotate(25,20,58)'); lR.setAttribute('transform','rotate(-25,32,58)');
  bl.setAttribute('fill',`rgba(249,115,22,${0.1+0.25*Math.abs(Math.sin(gStep*0.05))})`);
  gamer.style.transform=`translateY(${Math.sin(gStep*0.06)*1.5}px)`;
  requestAnimationFrame(animGamer);
}
animGamer();

// Builder
const builder=makeSectionMM('mm-builder');
builder.style.bottom='30px'; builder.style.right='28px';
builder.innerHTML=mmSVGstr;
const projSec=document.getElementById('projects');
if(projSec){projSec.style.position='relative';projSec.appendChild(builder);}
const bBub=document.createElement('div');
bBub.className='mm-bubble';bBub.innerHTML='I love building! 🧱';
bBub.style.cssText='position:absolute;bottom:108px;right:20px;background:#111;border:1px solid rgba(249,115,22,0.5);color:#e8e8e8;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 12px;border-radius:10px 10px 2px 10px;white-space:nowrap;pointer-events:none;z-index:51;box-shadow:0 0 14px rgba(249,115,22,0.2);animation:bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;';
if(projSec)projSec.appendChild(bBub);

let bStep=0,bPhase=0,bPhaseT=0;
const bPhaseDur=[60,40,60,80];
function animBuilder(){
  bStep++;bPhaseT++;
  if(bPhaseT>=bPhaseDur[bPhase]){bPhaseT=0;bPhase=(bPhase+1)%4;}
  const t=bPhaseT/bPhaseDur[bPhase],ease=t<.5?2*t*t:-1+(4-2*t)*t;
  const aL=builder.querySelector('.s-arm-l'),aR=builder.querySelector('.s-arm-r'),lL=builder.querySelector('.s-leg-l'),lR=builder.querySelector('.s-leg-r'),bl=builder.querySelector('.s-blink'),mo=builder.querySelector('.s-mouth');
  if(bPhase===0){aR.setAttribute('transform',`rotate(${-30+ease*-40},36,41.5)`);aL.setAttribute('transform','rotate(15,16,41.5)');mo.setAttribute('d','M20 28 Q26 31 32 28');}
  else if(bPhase===1){aR.setAttribute('transform','rotate(-70,36,41.5)');aL.setAttribute('transform','rotate(15,16,41.5)');mo.setAttribute('d','M20 27 Q26 34 32 27');}
  else if(bPhase===2){aR.setAttribute('transform',`rotate(${-70+ease*70},36,41.5)`);mo.setAttribute('d','M20 27 Q26 34 32 27');}
  else{aR.setAttribute('transform','rotate(20,36,41.5)');aL.setAttribute('transform','rotate(-20,16,41.5)');mo.setAttribute('d','M20 27 Q26 34 32 27');}
  const sway=Math.sin(bStep*0.04)*3;
  lL.setAttribute('transform',`rotate(${sway},20,58)`); lR.setAttribute('transform',`rotate(${-sway},32,58)`);
  bl.setAttribute('fill',`rgba(249,115,22,${0.1+0.25*Math.abs(Math.sin(bStep*0.05))})`);
  builder.style.transform=`translateY(${Math.sin(bStep*0.05)*1.5}px)`;
  requestAnimationFrame(animBuilder);
}
animBuilder();

// Waver
const waver=makeSectionMM('mm-waver');
waver.style.bottom='30px'; waver.style.right='28px';
waver.innerHTML=mmSVGstr;
const contactSec=document.getElementById('contact');
if(contactSec){contactSec.style.position='relative';contactSec.appendChild(waver);}
const wBub=document.createElement('div');
wBub.className='mm-bubble';wBub.innerHTML="Let's work — contact me! 👋";
wBub.style.cssText='position:absolute;bottom:108px;right:20px;background:#111;border:1px solid rgba(249,115,22,0.5);color:#e8e8e8;font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 12px;border-radius:10px 10px 2px 10px;white-space:nowrap;pointer-events:none;z-index:51;box-shadow:0 0 14px rgba(249,115,22,0.2);animation:bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.4s both;';
if(contactSec)contactSec.appendChild(wBub);

let wStep=0;
function animWaver(){
  wStep++;
  const aL=waver.querySelector('.s-arm-l'),aR=waver.querySelector('.s-arm-r'),lL=waver.querySelector('.s-leg-l'),lR=waver.querySelector('.s-leg-r'),bl=waver.querySelector('.s-blink'),mo=waver.querySelector('.s-mouth');
  const wAng=-75+Math.sin(wStep*0.12)*22;
  aR.setAttribute('transform',`rotate(${wAng},36,41.5)`); aL.setAttribute('transform','rotate(10,16,41.5)');
  const lean=Math.sin(wStep*0.05)*4;
  lL.setAttribute('transform',`rotate(${lean-3},20,58)`); lR.setAttribute('transform',`rotate(${lean+3},32,58)`);
  mo.setAttribute('d','M19 27 Q26 35 33 27');
  bl.setAttribute('fill',`rgba(249,115,22,${0.1+0.3*Math.abs(Math.sin(wStep*0.04))})`);
  waver.style.transform=`translateY(${Math.sin(wStep*0.12)*2}px)`;
  requestAnimationFrame(animWaver);
}
animWaver();

// ─── FLOATING SPACEMAN ───
const moonMan=document.createElement('div');
moonMan.id='moonman';
moonMan.innerHTML=`<svg width="48" height="68" viewBox="0 0 52 72" fill="none"><circle cx="26" cy="22" r="18" fill="#1a1a2e" stroke="#f97316" stroke-width="2"/><ellipse cx="26" cy="22" rx="13" ry="13" fill="#0f0f1a"/><ellipse cx="20" cy="16" rx="4" ry="2.5" fill="rgba(249,115,22,0.15)" transform="rotate(-20 20 16)"/><circle cx="20" cy="20" r="2.5" fill="#f97316" id="mm-eye-l"/><circle cx="32" cy="20" r="2.5" fill="#f97316" id="mm-eye-r"/><path id="mm-mouth" d="M20 28 Q26 33 32 28" stroke="#f97316" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="26" cy="22" r="18" fill="none" stroke="rgba(249,115,22,0.25)" stroke-width="1" stroke-dasharray="4 3"/><rect x="14" y="38" width="24" height="20" rx="6" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5"/><rect x="20" y="43" width="12" height="7" rx="2" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.35)" stroke-width="1"/><circle cx="26" cy="46.5" r="1.5" fill="#f97316"/><rect id="mm-arm-l" x="4" y="39" width="10" height="5" rx="2.5" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" transform-origin="14 41.5"/><rect id="mm-arm-r" x="38" y="39" width="10" height="5" rx="2.5" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" transform-origin="38 41.5"/><rect id="mm-leg-l" x="16" y="56" width="8" height="14" rx="4" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" transform-origin="20 56"/><rect id="mm-leg-r" x="28" y="56" width="8" height="14" rx="4" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" transform-origin="32 56"/><line x1="26" y1="4" x2="26" y2="10" stroke="#f97316" stroke-width="1.5"/><circle cx="26" cy="3" r="2" fill="#f97316"/><circle cx="26" cy="3" r="4" fill="rgba(249,115,22,0.2)" id="mm-blink"/></svg>`;
moonMan.style.cssText=`position:fixed;z-index:9990;pointer-events:none;width:${isMobile?'36px':'48px'};height:${isMobile?'51px':'68px'};filter:drop-shadow(0 0 8px rgba(249,115,22,0.4));opacity:${isMobile?'0.65':'0.85'};`;
document.body.appendChild(moonMan);
const mmJetpack=document.createElement('div');
mmJetpack.id='mm-jetpack';
mmJetpack.style.cssText='position:fixed;pointer-events:none;z-index:9989;width:18px;font-size:18px;text-align:center;opacity:0;transition:opacity 0.3s;filter:drop-shadow(0 0 6px rgba(249,115,22,0.8));';
mmJetpack.textContent='🔥';
document.body.appendChild(mmJetpack);

let mmX=window.innerWidth*.8,mmY=window.innerHeight*.6,mmVX=0.22,mmVY=-0.15,mmStep=0,mmFlipX=1;
let mmMode='float',mmTrickTimer=0,mmNextTrick=300+Math.floor(Math.random()*200),mmSpinAngle=0,mmDiveY=0;
const mmMaxSpeed=isMobile?0.3:0.45;
const mmMouth=moonMan.querySelector('#mm-mouth'),mmArmL=moonMan.querySelector('#mm-arm-l'),mmArmR=moonMan.querySelector('#mm-arm-r'),mmLegL=moonMan.querySelector('#mm-leg-l'),mmLegR=moonMan.querySelector('#mm-leg-r'),mmBlink=moonMan.querySelector('#mm-blink');
function endTrick(){mmMode='float';mmSpinAngle=0;mmJetpack.style.opacity='0';mmMouth.setAttribute('d','M20 28 Q26 33 32 28');mmNextTrick=500+Math.floor(Math.random()*400);}
function startTrick(){const t=['backflip','backflip','jetpack','jetpack','dive'];mmMode=t[Math.floor(Math.random()*t.length)];mmTrickTimer=0;mmSpinAngle=0;if(mmMode==='jetpack')mmJetpack.style.opacity='1';if(mmMode==='dive')mmDiveY=mmY;}
function animateMM(){
  mmStep++;mmTrickTimer++;
  if(mmMode==='float'&&mmTrickTimer>=mmNextTrick)startTrick();
  if(mmMode==='backflip'){
    if(mmTrickTimer<=70){mmSpinAngle=(mmTrickTimer/70)*360;mmArmL.setAttribute('transform','rotate(-85,14,41.5)');mmArmR.setAttribute('transform','rotate(85,38,41.5)');mmLegL.setAttribute('transform','rotate(-35,20,56)');mmLegR.setAttribute('transform','rotate(35,32,56)');mmMouth.setAttribute('d','M21 27 Q26 35 31 27');mmY-=0.6;}
    else{mmSpinAngle=0;endTrick();}
  }
  if(mmMode==='dive'){
    const visH=window.innerHeight,div=180;
    if(mmTrickTimer<=div*.4){mmY+=5;mmArmL.setAttribute('transform','rotate(-160,14,41.5)');mmArmR.setAttribute('transform','rotate(160,38,41.5)');mmMouth.setAttribute('d','M21 27 Q26 35 31 27');if(mmY>visH+20)mmY=visH+20;}
    else if(mmTrickTimer<=div*.5){mmSpinAngle+=18;mmJetpack.style.opacity='1';mmJetpack.style.left=(mmX+18)+'px';mmJetpack.style.top=(mmY+52)+'px';}
    else if(mmTrickTimer<=div){mmY-=5.5;mmJetpack.style.left=(mmX+18)+'px';mmJetpack.style.top=(mmY+52)+'px';mmJetpack.style.transform=`scale(${0.8+Math.random()*.5})`;mmMouth.setAttribute('d','M19 27 Q26 34 33 27');if(mmY<70)mmY=70;}
    else{mmSpinAngle=0;mmJetpack.style.opacity='0';endTrick();}
  }
  if(mmMode==='jetpack'){
    const jp=160;
    if(mmTrickTimer<=jp){const p=mmTrickTimer/jp,b=p<.35?-p*5:p<.65?-(0.35-(p-.35))*5:-(1-p)*3;mmY+=b;mmX+=Math.sin(mmTrickTimer*.08)*1.2;mmVY=0;mmArmL.setAttribute('transform','rotate(45,14,41.5)');mmArmR.setAttribute('transform','rotate(-45,38,41.5)');mmLegL.setAttribute('transform','rotate(25,20,56)');mmLegR.setAttribute('transform','rotate(-25,32,56)');mmMouth.setAttribute('d','M19 27 Q26 34 33 27');mmJetpack.style.left=(mmX+18)+'px';mmJetpack.style.top=(mmY+52)+'px';mmJetpack.style.transform=`scale(${0.7+Math.random()*.6})`;}
    else{mmJetpack.style.opacity='0';mmVY=.1;endTrick();}
  }
  if(mmMode==='float'){
    if(mmStep%200===0){mmVX+=(Math.random()-.5)*.18;mmVY+=(Math.random()-.5)*.18;const spd=Math.sqrt(mmVX*mmVX+mmVY*mmVY);if(spd>mmMaxSpeed){mmVX=mmVX/spd*mmMaxSpeed;mmVY=mmVY/spd*mmMaxSpeed;}if(spd<.1){mmVX*=1.5;mmVY*=1.5;}}
    const af=Math.sin(mmStep*.05)*8,ld=Math.sin(mmStep*.04)*6;
    mmArmR.setAttribute('transform',`rotate(${af},38,41.5)`);mmArmL.setAttribute('transform',`rotate(${-af*.5},14,41.5)`);mmLegL.setAttribute('transform',`rotate(${ld},20,56)`);mmLegR.setAttribute('transform',`rotate(${-ld},32,56)`);mmMouth.setAttribute('d','M20 28 Q26 33 32 28');
  }
  const W=window.innerWidth,visH=window.innerHeight;
  if(mmX<10){mmX=10;mmVX=Math.abs(mmVX)*.8;}if(mmX>W-60){mmX=W-60;mmVX=-Math.abs(mmVX)*.8;}
  if(mmY<70){mmY=70;mmVY=Math.abs(mmVY)*.8;}if(mmY>visH-80){mmY=visH-80;mmVY=-Math.abs(mmVY)*.8;}
  mmX+=mmVX;mmY+=mmVY;
  if(mmVX>.02)mmFlipX=1;if(mmVX<-.02)mmFlipX=-1;
  const bob=Math.sin(mmStep*.04)*2.5,tilt=mmMode==='float'?Math.sin(mmStep*.03)*3:0;
  moonMan.style.left=mmX+'px';moonMan.style.top=(mmY+bob)+'px';
  moonMan.style.transform=mmMode==='backflip'?`scaleX(${mmFlipX}) rotate(${mmSpinAngle}deg)`:`scaleX(${mmFlipX}) rotate(${tilt}deg)`;
  mmBlink.setAttribute('fill',`rgba(249,115,22,${0.1+0.3*Math.abs(Math.sin(mmStep*.04))})`);
  requestAnimationFrame(animateMM);
}
animateMM();

// ─── ORBIT BUBBLE ───
const orbitWrap = document.getElementById('orbitBubble');
if (orbitWrap) {
  const langs = [
    'JavaScript','Python','Java','C#','PHP',
    'Kotlin','TypeScript','HTML','CSS','C++',
    '.NET','React','JSON','SQL'
  ];

  const WW = orbitWrap.offsetWidth  || 400;
  const WH = orbitWrap.offsetHeight || 400;
  const cx = WW / 2;
  const cy = WH / 2;

  // Two orbit radii for inner/outer ring
  const radii = [130, 200];
  const speeds = [0.00025, -0.00018]; // rad/ms — opposite directions
  const offsets = langs.map((_, i) => (i / langs.length) * Math.PI * 2);

  // Create canvas for connecting lines
  const lineCanvas = document.createElement('canvas');
  lineCanvas.id = 'orbit-lines';
  lineCanvas.width = WW; lineCanvas.height = WH;
  orbitWrap.appendChild(lineCanvas);
  const lctx = lineCanvas.getContext('2d');

  // Create tag elements
  const tagEls = langs.map((lang, i) => {
    const el = document.createElement('div');
    el.className = 'orbit-tag';
    el.textContent = lang;
    orbitWrap.appendChild(el);
    return el;
  });

  let start = null;
  function animOrbit(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;

    lctx.clearRect(0, 0, WW, WH);

    const positions = langs.map((lang, i) => {
      const ring   = i % 2;
      const radius = radii[ring];
      const speed  = speeds[ring];
      const angle  = offsets[i] + elapsed * speed;
      // Add gentle vertical bob
      const bob = Math.sin(elapsed * 0.0008 + i * 0.8) * 6;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle) + bob;

      const el = tagEls[i];
      el.style.left = x + 'px';
      el.style.top  = y + 'px';

      // Pulse opacity
      el.style.opacity = (0.6 + 0.4 * Math.abs(Math.sin(elapsed * 0.0005 + i))).toFixed(2);

      return { x, y };
    });

    // Draw faint lines from center to some tags
    positions.forEach((pos, i) => {
      if (i % 3 === 0) {
        const fade = 0.08 + 0.06 * Math.abs(Math.sin(elapsed * 0.0006 + i));
        lctx.beginPath();
        lctx.moveTo(cx, cy);
        lctx.lineTo(pos.x, pos.y);
        lctx.strokeStyle = `rgba(249,115,22,${fade})`;
        lctx.lineWidth = 0.8;
        lctx.stroke();
      }
    });

    // Draw faint lines between nearby tags
    for (let a = 0; a < positions.length; a++) {
      for (let b = a + 1; b < positions.length; b++) {
        const dx = positions[a].x - positions[b].x;
        const dy = positions[a].y - positions[b].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 90) {
          lctx.beginPath();
          lctx.moveTo(positions[a].x, positions[a].y);
          lctx.lineTo(positions[b].x, positions[b].y);
          lctx.strokeStyle = `rgba(249,115,22,${(1 - dist/90) * 0.12})`;
          lctx.lineWidth = 0.5;
          lctx.stroke();
        }
      }
    }

    requestAnimationFrame(animOrbit);
  }

  // Start orbit when section scrolls into view
  const orbitObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      requestAnimationFrame(animOrbit);
      orbitObserver.disconnect();
    }
  }, { threshold: 0.2 });
  orbitObserver.observe(orbitWrap);
}

