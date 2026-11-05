// @ts-nocheck
// Generated from tasks/ginie_void/ginie_void_animation.html (v5). The source of truth is
// tasks/ginie_void/build_ginie_void.py: rebuild there, then re-run the port, never hand edit.
// Changes from the preview: no autoplay (the section plays it when it scrolls into view), and
// it returns play() so the caller can trigger it.
import gsap from 'gsap'

export function mountGinieVoid(svg: SVGSVGElement): { play(): void } {


const $=s=>svg.querySelector(s),$$=s=>[...svg.querySelectorAll(s)];
const HX=250,HY=668.0;
const GX=400,GY=235,S=1.75,ROT=14;
// flight: rises straight out of the hole, then curves toward the viewer
const P0=[HX,HY-24],P1=[HX,430],P2=[GX-60,250],P3=[GX,GY];
function bez(t){const u=1-t;return[0,1].map(i=>u*u*u*P0[i]+3*u*u*t*P1[i]+3*u*t*t*P2[i]+t*t*t*P3[i]);}
const G={t:0,dy:160,s:.55,rot:0,spin:0,sx:1,sy:1,face:0,faceX:0,brow:0,eyeX:0,eyeY:0,blink:1,happy:0};
const ginie=$('#gv-ginie'),happy=$('#gv-happy'),glint=$('#gv-glint'),face=$('#gv-face'),bl=$('#gv-brow-l'),br=$('#gv-brow-r'),eyes=$('#gv-eyes');
// friends follow Ginie out: each on its own curve, landing smaller around the hero
const FR=[ {to:[112,250],rot:-10,s:.72,P1:[250-10,440],P2:[120,320]},
           {to:[522,488],rot:9,s:.66,P1:[250+30,470],P2:[500,430]},
           {to:[128,462],rot:-5,s:.64,P1:[250-20,540],P2:[150,440]} ];
const MW=$$('.gv-mwrap'),MS=$$('.gv-mascot'),FP=$$('.gv-fpuff'),FL=$$('.gv-flines').map(g=>[...g.children]);
const F=FR.map(()=>({t:0,dy:78,rot:0,sx:1,sy:1,on:0}));
// every avatar SVG is laid out as [body layers, face, accessory], so the parts are found by position
const FA=MS.map(m=>{const p=m.firstElementChild.children;return{face:p[1],eyes:[...p[1].querySelectorAll(':scope > g')],acc:p[2]};});
// after landing: the heart's crown bounces, the clover's ladybug hops, the cupcake's sprinkles pop
const REACT=[
  (at,a)=>tl.to(a.acc,{y:-16,rotation:-12,duration:.16,ease:'sine.out'},at(0))
            .to(a.acc,{y:0,rotation:7,duration:.14,ease:'sine.in'},at(.16))
            .to(a.acc,{rotation:-3,duration:.12,ease:'sine.inOut'},at(.3))
            .to(a.acc,{rotation:0,duration:.14,ease:'sine.inOut'},at(.42)),
  (at,a)=>tl.to(a.acc,{y:-18,scaleY:1.1,duration:.14,ease:'sine.out'},at(0))
            .to(a.acc,{y:0,scaleY:1,duration:.12,ease:'sine.in'},at(.14))
            .to(a.acc,{scaleY:.82,duration:.06,ease:'sine.out',yoyo:true,repeat:1},at(.26))
            .to(a.acc,{y:-8,duration:.1,ease:'sine.out'},at(.38))
            .to(a.acc,{y:0,duration:.1,ease:'sine.in'},at(.48)),
  (at,a)=>tl.to(a.acc.firstElementChild.children,{scale:1.5,duration:.1,ease:'sine.out',yoyo:true,repeat:1,stagger:.035},at(0)),
];
const ACC_ORIGIN=['147 77','158 82',null];   // crown base, ladybug feet
function fbez(i,t){const f=FR[i],P=[[250,668.0-10],f.P1,f.P2,f.to],u=1-t;return[0,1].map(k=>u*u*u*P[0][k]+3*u*u*t*P[1][k]+3*u*t*t*P[2][k]+t*t*t*P[3][k]);}
function flinePath(i,off,t0,t1){const pts=[];for(let k=0;k<=20;k++){const t=t0+(t1-t0)*k/20,[x,y]=fbez(i,t),[x2,y2]=fbez(i,Math.min(t+.01,1));const dx=x2-x,dy=y2-y,n=Math.hypot(dx,dy)||1;pts.push([x-dy/n*off,y+dx/n*off]);}
  return 'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');}
FL.forEach((ls,i)=>ls.forEach((l,j)=>{l.setAttribute('d',flinePath(i,j?14:-10,.15+j*.05,.7+j*.04));l.dataset.len=l.getTotalLength();}));
// depth: every mascot is extruded back toward the portal as a stack of flat, darker cut-outs, and sits at its own z.
// A camera offset moves near things more than far ones, so the stacks shift and the scene reads as 3D popping out.
const NS='http://www.w3.org/2000/svg',NL=4,cam={x:0,y:0},FLOOR=.35;
const Z={ginie:1,friends:[.6,.8,.45]};
const SHADES={ginie:['#F5C94F','#E5A63A','#CC8530','#A86626'],
  friends:[['#F2807F','#DC6266','#C24A57','#A2384A'],
           ['#55B463','#3F9852','#2F7D43','#226335'],
           ['#EC8DBE','#D96FA8','#C05591','#A04178']]};
// ink copies go under all the coloured ones, so one keyline wraps the whole stack like the stickers' own cut
function extrude(before,src,wrapT,cols,inkExtra){
  const mk=(fill,extra)=>{const g=document.createElementNS(NS,'g'),inner=document.createElementNS(NS,'g'),c=src.cloneNode(true);
    if(wrapT)inner.setAttribute('transform',wrapT);
    c.setAttribute('fill',fill);c.setAttribute('stroke',fill);c.setAttribute('stroke-linejoin','round');
    [c,...c.querySelectorAll('[stroke-width]')].forEach(n=>{const w=n.getAttribute('stroke-width');if(w)n.setAttribute('stroke-width',+w+extra);});
    inner.appendChild(c);g.appendChild(inner);before.parentNode.insertBefore(g,before);return g;};
  const ink=[],col=[];
  for(let k=NL;k>=1;k--)ink[k]=mk('#111114',inkExtra);
  for(let k=NL;k>=1;k--)col[k]=mk(cols[k-1],0);
  return{ink,col};}
function vp(){return[250-cam.x*FLOOR,668.0-cam.y*FLOOR];}
function placeDepth(ex,x,y,baseT,depth,grow,op){const [vx,vy]=vp(),dx=vx-x,dy=vy-y,n=Math.hypot(dx,dy)||1;
  for(let k=1;k<=NL;k++){const o=depth*grow*k/NL,s=1-.016*k*grow;
    const t=`translate(${(x+dx/n*o).toFixed(2)} ${(y+dy/n*o).toFixed(2)}) scale(${s.toFixed(3)}) translate(${(-x).toFixed(2)} ${(-y).toFixed(2)}) ${baseT}`;
    ex.ink[k].setAttribute('transform',t);ex.col[k].setAttribute('transform',t);
    ex.ink[k].setAttribute('opacity',op);ex.col[k].setAttribute('opacity',op);}}
const FX=MS.map((m,i)=>{const rg=m.firstElementChild;return extrude(m,rg.children[0].children[0],rg.getAttribute('transform'),SHADES.friends[i],8);});
function renderFriends(){F.forEach((m,i)=>{const f=FR[i],[x0,y0]=fbez(i,m.t),z=Z.friends[i],x=x0+cam.x*z,y=y0+m.dy+cam.y*z,sc=f.s*(.55+.45*m.t);
  MW[i].setAttribute('clip-path',m.t<0.15?'url(#gv-rise)':'none');
  const T=`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(f.rot*m.t+m.rot).toFixed(2)}) scale(${(sc*m.sx).toFixed(3)} ${(sc*m.sy).toFixed(3)}) translate(-120 -125)`;
  MS[i].setAttribute('transform',T);
  MS[i].setAttribute('opacity',m.on);
  placeDepth(FX[i],x,y,T,52*z,m.t,m.on);});}
function render(){
  renderFriends();
  const [x,y]=bez(G.t);
  wrap.setAttribute('clip-path',G.t<0.12?'url(#gv-rise)':'none');
  const gx=x+cam.x*Z.ginie,gy=y+G.dy+cam.y*Z.ginie;
  const GT=`translate(${gx.toFixed(2)} ${gy.toFixed(2)}) rotate(${(G.rot+G.spin).toFixed(2)}) scale(${(S*G.s*G.sx).toFixed(3)} ${(S*G.s*G.sy).toFixed(3)}) translate(-100 -112)`;
  ginie.setAttribute('transform',GT);
  placeDepth(GXT,gx,gy,GT,52*Z.ginie,G.t,1);
  // the floor (portal, puffs) moves against the camera; rays, confetti and sparkles ride with Ginie
  const fl=`translate(${(-cam.x*FLOOR).toFixed(2)} ${(-cam.y*FLOOR).toFixed(2)})`,nr=`translate(${cam.x.toFixed(2)} ${cam.y.toFixed(2)})`;
  FLOORS.forEach(e=>e.setAttribute('transform',fl));NEARS.forEach(e=>e.setAttribute('transform',nr));
  face.setAttribute('transform',`translate(${G.faceX.toFixed(2)} ${G.face.toFixed(2)})`);   // sliding the whole face fakes a head turn
  happy.setAttribute('transform',`translate(0 104) scale(1 ${G.happy.toFixed(3)}) translate(0 -104)`);
  bl.setAttribute('transform',`translate(0 ${(-11*G.brow).toFixed(2)}) rotate(${(16*G.brow).toFixed(2)} 80 86)`);
  br.setAttribute('transform',`translate(0 ${(-11*G.brow).toFixed(2)}) rotate(${(-16*G.brow).toFixed(2)} 120 86)`);
  eyes.setAttribute('transform',`translate(${G.eyeX.toFixed(2)} ${G.eyeY.toFixed(2)}) translate(0 104) scale(1 ${G.blink.toFixed(3)}) translate(0 -104)`);
}
// speed lines follow the path behind Ginie, then retract: nothing is left behind
const lines=$$('.gv-line');
const OFF=[0,-26,24];
function linePath(off,t0,t1){const pts=[];for(let i=0;i<=24;i++){const t=t0+(t1-t0)*i/24,[x,y]=bez(t),[x2,y2]=bez(Math.min(t+.01,1));const dx=x2-x,dy=y2-y,n=Math.hypot(dx,dy)||1;pts.push([x-dy/n*off,y+dx/n*off]);}
  return 'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');}
lines.forEach((l,i)=>{l.setAttribute('d',linePath(OFF[i],.12+i*.04,.72+i*.03));const L=l.getTotalLength();l.dataset.len=L;});
let wrap;
const rings=$$('.gv-ring'),swirls=$$('.gv-swirl'),hole=$('#gv-hole'),puffs=$$('.gv-puffc'),sparks=$$('.gv-spark > path');wrap=$('#gv-rise-wrap');
const GXT=extrude(ginie,ginie.firstElementChild,null,SHADES.ginie,5);
const FLOORS=['#gv-portal','#gv-puff'].map(q=>$(q)),NEARS=['#gv-rays','#gv-confetti','#gv-sparks'].map(q=>$(q));
const drops=$$('.gv-drop'),rays=$$('.gv-ray'),conf=$$('.gv-conf'),eyeR=$('#gv-eye-r');
rays.forEach(r=>r.dataset.len=r.getTotalLength());
// gap longer than the path, dash parked 5 past the end: nothing shows, not even a round cap
const dashHidden=el=>({'stroke-dasharray':el.dataset.len+' '+(+el.dataset.len+10),'stroke-dashoffset':+el.dataset.len+5});
let tl;
function play(){
  if(tl) tl.kill();
  Object.assign(G,{t:0,dy:160,s:.55,rot:0,spin:0,sx:1,sy:1,face:0,faceX:0,brow:0,eyeX:0,eyeY:-6,blink:1,happy:0});
  Object.assign(cam,{x:0,y:0});
  F.forEach(m=>Object.assign(m,{t:0,dy:78,rot:0,sx:1,sy:1,on:0}));
  gsap.set(rings,{scale:0,transformOrigin:'50% 50%'});
  gsap.set(hole,{scale:0,transformOrigin:'50% 50%'});
  gsap.set(swirls,{rotation:0,opacity:0,svgOrigin:'0 0'});
  gsap.set(puffs,{scale:0,transformOrigin:'50% 50%'});
  gsap.set(sparks,{scale:0,rotation:-45,transformOrigin:'50% 50%'});
  gsap.set(drops,{scale:0,transformOrigin:'50% 100%'});
  gsap.set(conf,{x:0,y:0,scale:0,rotation:0,transformOrigin:'50% 50%'});
  gsap.set(eyeR,{scaleY:1,transformOrigin:'50% 50%'});
  gsap.set(glint,{x:0});
  rays.forEach(r=>gsap.set(r,{attr:dashHidden(r)}));
  lines.forEach(l=>gsap.set(l,{attr:dashHidden(l)}));
  tl=gsap.timeline({onUpdate:render});
  // 1 · the portal opens, ring by ring
  tl.to(rings,{scale:1,duration:.5,ease:'back.out(1.4)',stagger:.07},0)
    .to(hole,{scale:1,duration:.45,ease:'back.out(1.6)'},.25)
  // 2 · it starts to swirl, then the hole breathes: something is coming
    .to(swirls,{opacity:1,duration:.3,ease:'sine.out'},.35);
  swirls.forEach(s=>tl.to(s,{rotation:-360*(4.2/+s.dataset.dur)*.6,duration:9.25,ease:'power1.out'},.35));
  tl.to(hole,{scaleX:1.07,scaleY:1.1,duration:.16,ease:'sine.inOut',yoyo:true,repeat:1},.8)
    .to(hole,{scaleX:1.07,scaleY:1.1,duration:.16,ease:'sine.inOut',yoyo:true,repeat:1},1.1)
    .to(hole,{scaleX:1.12,scaleY:1.18,duration:.12,ease:'sine.out',yoyo:true,repeat:1},1.4)
  // 3 · Ginie appears: the tip pokes out, wobbles, then the head rises into view
    .to(rings,{scaleY:.95,duration:.25,ease:'sine.inOut',yoyo:true,repeat:1,stagger:.04},1.5)
    .to(G,{dy:105,duration:.5,ease:'sine.out'},1.55)
    .to(G,{rot:-7,duration:.25,ease:'sine.inOut'},1.6)
    .to(G,{rot:6,duration:.3,ease:'sine.inOut'},1.85)
    .to(G,{rot:0,duration:.3,ease:'sine.inOut'},2.15)
    .to(G,{dy:0,duration:.7,ease:'power2.inOut'},2.0)
    .to(G,{sx:.94,sy:1.07,duration:.35,ease:'sine.inOut'},2.0)
    .to(G,{sx:1.05,sy:.95,duration:.2,ease:'sine.inOut'},2.55)
    .to(G,{sx:1,sy:1,duration:.3,ease:'sine.inOut'},2.75)
    .to(G,{face:-3,duration:.35,ease:'sine.out'},2.0)
    .to(G,{face:0,duration:.4,ease:'sine.inOut'},2.55)
  // looks around, then up, then gets determined
    .to(G,{eyeX:-6,eyeY:0,faceX:-10,duration:.22,ease:'sine.inOut'},2.8)
    .to(G,{rot:-4,duration:.22,ease:'sine.inOut'},2.8)
    .to(G,{eyeX:6,faceX:10,duration:.3,ease:'sine.inOut'},3.15)
    .to(G,{rot:4,duration:.3,ease:'sine.inOut'},3.15)
    .to(G,{eyeX:0,eyeY:-8,faceX:0,duration:.25,ease:'sine.inOut'},3.55)
    .to(G,{rot:0,duration:.25,ease:'sine.inOut'},3.55)
    .to(G,{brow:1,duration:.25,ease:'sine.inOut'},3.65)
  // 4 · anticipation: a slow crouch into the hole
    .to(G,{dy:20,sx:1.24,sy:.78,face:5,duration:.45,ease:'sine.inOut'},3.85)
    .to(G,{blink:.45,duration:.2,ease:'sine.inOut'},3.9)
    .to(drops,{scale:1,duration:.18,ease:'back.out(2)',stagger:.08},3.95)
    .to(G,{rot:-3,duration:.45,ease:'sine.inOut'},3.85)
  // 5 · the pop: push off, stretch, one long ease-in-out flight toward the viewer
    .addLabel('go',4.35)
    .to(G,{dy:0,duration:0.15,ease:'sine.out'},'go')
    .to(G,{t:1,duration:0.75,ease:'power2.inOut'},'go')
    .to(G,{s:1,duration:0.75,ease:'sine.inOut'},'go')
    .to(G,{rot:-9,duration:0.3,ease:'sine.inOut'},'go')
    .to(G,{rot:ROT,duration:0.45,ease:'sine.inOut'},'go+=0.3')
    .to(G,{sx:.74,sy:1.32,face:10,duration:0.24,ease:'sine.inOut'},'go')
    .to(G,{sx:.9,sy:1.12,face:5,duration:0.21,ease:'sine.inOut'},'go+=0.24')
    .to(G,{blink:.12,duration:.1,ease:'sine.in'},'go')
    .to(drops,{scale:0,duration:.12,ease:'sine.in'},'go')
    .to(G,{sx:1,sy:1,face:2,duration:0.24,ease:'sine.inOut'},'go+=0.45')
    .to(rings,{scaleY:.86,duration:0.108,ease:'sine.out',yoyo:true,repeat:1,stagger:0.024},'go')
    .to(puffs,{scale:1,duration:0.18,ease:'back.out(1.8)',stagger:0.024},'go+=0.03')
    .to(puffs,{scale:0,y:-18,duration:0.3,ease:'sine.in',stagger:0.024},'go+=0.24')
    .to(lines,{attr:{'stroke-dashoffset':0},duration:0.27,ease:'sine.out',stagger:0.03},'go+=0.12')
    .to(lines,{attr:{'stroke-dashoffset':(i,el)=>-el.dataset.len-5},duration:0.3,ease:'sine.in',stagger:0.03},'go+=0.45')
  // 6 · landing: a soft squash, the face catches up, sparkles pop
    .to(G,{sx:1.2,sy:.84,face:-4,duration:0.12,ease:'sine.out'},'go+=0.72')
    .to(G,{sx:.96,sy:1.05,face:1,duration:0.14,ease:'sine.inOut'},'go+=0.84')
    .to(G,{sx:1,sy:1,face:0,duration:0.2,ease:'sine.inOut'},'go+=0.98')
    .to(G,{blink:1,duration:.14,ease:'back.out(2)'},'go+=0.7')
    .to(cam,{y:10,duration:.08,ease:'sine.out'},'go+=0.72')                                                   // impact: the camera bounces, depth shows
    .to(cam,{y:-4,duration:.14,ease:'sine.inOut'},'go+=0.8')
    .to(cam,{y:0,duration:.24,ease:'sine.inOut'},'go+=0.94')
    .to(rays,{attr:{'stroke-dashoffset':0},duration:.16,ease:'power2.out',stagger:.015},'go+=0.7')
    .to(rays,{attr:{'stroke-dashoffset':(i,el)=>-el.dataset.len-5},duration:.22,ease:'sine.in',stagger:.015},'go+=0.9')
    .to(G,{brow:.55,eyeY:0,duration:0.24,ease:'sine.inOut'},'go+=0.75')
    .to(sparks,{scale:1,rotation:0,duration:0.27,ease:'back.out(2)',stagger:0.048},'go+=0.72')
    .to(G,{blink:.1,duration:.08,yoyo:true,repeat:1,ease:'sine.inOut'},'go+=1.2');
  // 7 · friends pop out after Ginie, one by one, each with the full beat
  gsap.set(FP.flatMap(g=>[...g.children]),{scale:0,y:0,transformOrigin:'50% 50%'});
  FL.flat().forEach(l=>gsap.set(l,{attr:dashHidden(l)}));
  FA.forEach((a,i)=>{
    gsap.set(a.face,{x:0,y:0});
    gsap.set(a.eyes,{scaleY:1,transformOrigin:'50% 50%'});
    if(ACC_ORIGIN[i]) gsap.set(a.acc,{x:0,y:0,rotation:0,scaleY:1,svgOrigin:ACC_ORIGIN[i]});
    else gsap.set(a.acc.firstElementChild.children,{scale:1,transformOrigin:'50% 50%'});
  });
  F.forEach((m,i)=>{
    const L=`f${i}`,lean=i===1?7:-7;
    tl.addLabel(L,`go+=${(0.5+i*0.42).toFixed(2)}`)
      .set(m,{on:1},L)
      .to(rings,{scaleY:.94,duration:.12,ease:'sine.inOut',yoyo:true,repeat:1,stagger:.02},L)                  // the lip ripples
      .to(m,{dy:8,duration:.26,ease:'sine.out'},`${L}+=.06`)                                                // top pokes out
      .to(m,{rot:-6,duration:.11,ease:'sine.inOut'},`${L}+=.08`)
      .to(m,{rot:5,duration:.12,ease:'sine.inOut'},`${L}+=.19`)
      .to(m,{rot:0,duration:.1,ease:'sine.inOut'},`${L}+=.31`)
      .to(m,{dy:26,sx:1.22,sy:.78,duration:.16,ease:'sine.inOut'},`${L}+=.32`)                                 // crouch
      .to(FA[i].eyes,{scaleY:.4,duration:.12,ease:'sine.inOut'},`${L}+=.32`)
      .addLabel(`${L}go`,`${L}+=.48`)
      .to(m,{dy:0,duration:.12,ease:'sine.out'},`${L}go`)                                                     // push off
      .to(m,{t:1,duration:.62,ease:'power2.inOut'},`${L}go`)                                                  // the pop
      .to(m,{rot:lean,duration:.28,ease:'sine.inOut'},`${L}go`)
      .to(m,{rot:0,duration:.34,ease:'sine.inOut'},`${L}go+=.28`)
      .to(m,{sx:.78,sy:1.26,duration:.18,ease:'sine.inOut'},`${L}go`)                                        // stretch, in stages
      .to(m,{sx:.9,sy:1.12,duration:.16,ease:'sine.inOut'},`${L}go+=.18`)
      .to(FA[i].eyes,{scaleY:.15,duration:.08,ease:'sine.in'},`${L}go`)
      .to(FA[i].eyes,{scaleY:1,duration:.14,ease:'back.out(2)'},`${L}go+=.6`)
      .to(m,{sx:1,sy:1,duration:.2,ease:'sine.inOut'},`${L}go+=.34`)
      .to(FP[i].children,{scale:1,duration:.18,ease:'back.out(1.8)',stagger:.03},`${L}go`)                      // own puff
      .to(FP[i].children,{scale:0,y:-12,duration:.3,ease:'sine.in',stagger:.03},`${L}go+=.22`)
      .to(FL[i],{attr:{'stroke-dashoffset':0},duration:.24,ease:'sine.out',stagger:.04},`${L}go+=.1`)          // own speed lines
      .to(FL[i],{attr:{'stroke-dashoffset':(k,el)=>-el.dataset.len-5},duration:.26,ease:'sine.in',stagger:.04},`${L}go+=.38`)
      .to(m,{sx:1.18,sy:.84,duration:.1,ease:'sine.out'},`${L}go+=.6`)                                        // land: squash
      .to(m,{sx:.96,sy:1.04,duration:.12,ease:'sine.inOut'},`${L}go+=.7`)                                     // rebound
      .to(m,{sx:1,sy:1,duration:.18,ease:'sine.inOut'},`${L}go+=.82`)
      .to(m,{rot:-lean*.5,duration:.12,ease:'sine.inOut'},`${L}go+=.62`)                                      // settling wobble
      .to(m,{rot:lean*.25,duration:.14,ease:'sine.inOut'},`${L}go+=.74`)
      .to(m,{rot:0,duration:.16,ease:'sine.inOut'},`${L}go+=.88`)
      .to(FA[i].face,{y:5,duration:.1,ease:'sine.out'},`${L}go+=.6`)                                          // face catches up
      .to(FA[i].face,{y:0,duration:.22,ease:'sine.inOut'},`${L}go+=.7`)
      .to(FA[i].eyes,{scaleY:.1,duration:.07,ease:'sine.inOut',yoyo:true,repeat:1},`${L}go+=${(1.05+i*.12).toFixed(2)}`);
    if(ACC_ORIGIN[i]) tl.to(FA[i].acc,{rotation:-lean*1.6,duration:.2,ease:'sine.out'},`${L}go`)              // accessory drags behind
                        .to(FA[i].acc,{rotation:0,duration:.3,ease:'sine.inOut'},`${L}go+=.28`);
    REACT[i](d=>`${L}go+=${(.66+d).toFixed(2)}`,FA[i]);
    tl.to(FA[i].face,{x:i===1?-8:8,duration:.26,ease:'sine.inOut'},`${L}go+=1.25`);                        // looks at Ginie
  });
  // 8 · finale: everyone cheers in their own way with happy eyes, confetti bursts, Ginie winks and the glasses glint
  tl.addLabel('fin','go+=3.3');
  // a slow camera sway through the finale: near things slide past far ones, then everything settles back
  tl.to(cam,{x:-22,y:-8,duration:.6,ease:'sine.inOut'},'fin-=.2')
    .to(cam,{x:16,y:4,duration:.75,ease:'sine.inOut'},'fin+=.4')
    .to(cam,{x:0,y:0,duration:.7,ease:'sine.inOut'},'fin+=1.15');
  function hop(m,at,up,d){
    tl.to(m,{sx:1.16,sy:.84,duration:.12*d,ease:'sine.inOut'},at(0))
      .to(m,{dy:up,sx:.88,sy:1.14,duration:.2*d,ease:'power2.out'},at(.12*d))
      .to(m,{sx:1,sy:1,duration:.12*d,ease:'sine.inOut'},at(.3*d))
      .to(m,{dy:0,duration:.18*d,ease:'power2.in'},at(.34*d))
      .to(m,{sx:1.14,sy:.87,duration:.08*d,ease:'sine.out'},at(.52*d))
      .to(m,{sx:.97,sy:1.03,duration:.1*d,ease:'sine.inOut'},at(.6*d))
      .to(m,{sx:1,sy:1,duration:.16*d,ease:'sine.inOut'},at(.7*d));}
  const fat=k=>d=>`fin+=${(k*.06+d).toFixed(2)}`;
  tl.to(FA.map(a=>a.face),{x:0,duration:.16,ease:'sine.inOut',stagger:.04},'fin-=.1');
  // Ginie: a big hop with a full shooting-star spin, eyes closed happy
  hop(G,fat(0),-58,1.15);
  tl.to(G,{spin:360,duration:.5,ease:'power2.inOut'},fat(0)(.12))
    .to(G,{blink:.1,happy:1,duration:.1,ease:'sine.out'},fat(0)(.12))
    .to(G,{blink:1,happy:0,duration:.14,ease:'back.out(2)'},fat(0)(.66));
  // heart: hops while the crown flips off, spins once and drops back on
  hop(F[0],fat(1),-30,1);
  tl.to(FA[0].acc,{y:-34,duration:.22,ease:'power2.out'},fat(1)(.14))
    .to(FA[0].acc,{rotation:-360,duration:.44,ease:'sine.inOut'},fat(1)(.14))
    .to(FA[0].acc,{y:0,duration:.2,ease:'power2.in'},fat(1)(.36))
    .to(FA[0].acc,{rotation:-372,duration:.1,ease:'sine.out'},fat(1)(.58))
    .to(FA[0].acc,{rotation:-360,duration:.16,ease:'sine.inOut'},fat(1)(.68));
  // clover: two quick hops, the ladybug riding along
  hop(F[1],fat(2),-22,.7);
  hop(F[1],d=>fat(2)(.56+d),-26,.7);
  // cupcake: a wiggle hop
  hop(F[2],fat(3),-28,1);
  tl.to(F[2],{rot:10,duration:.08,ease:'sine.inOut'},fat(3)(.12))
    .to(F[2],{rot:-10,duration:.1,ease:'sine.inOut'},fat(3)(.2))
    .to(F[2],{rot:7,duration:.1,ease:'sine.inOut'},fat(3)(.3))
    .to(F[2],{rot:0,duration:.14,ease:'sine.inOut'},fat(3)(.4));
  F.forEach((m,i)=>tl.to(FA[i].eyes,{scaleY:.15,duration:.1,ease:'sine.inOut'},fat(i+1)(.12))
                     .to(FA[i].eyes,{scaleY:1,duration:.14,ease:'back.out(2)'},fat(i+1)(i===1?1.0:.52)));
  tl.to(conf,{x:(k,el)=>+el.dataset.dx,y:(k,el)=>+el.dataset.dy,scale:1,rotation:(k,el)=>el.dataset.rot*.5,duration:.45,ease:'power2.out',stagger:.01},'fin+=.3')
    .to(conf,{y:(k,el)=>+el.dataset.dy+70,rotation:(k,el)=>+el.dataset.rot,scale:0,duration:.55,ease:'sine.in',stagger:.01},'fin+=.75')
    .to(sparks,{scale:1.35,duration:.12,ease:'sine.inOut',yoyo:true,repeat:1,stagger:.04},'fin+=.35')
    .to(eyeR,{scaleY:.1,duration:.08,ease:'sine.inOut'},'fin+=1.2')
    .to(G,{brow:.9,duration:.1,ease:'sine.inOut'},'fin+=1.2')
    .to(eyeR,{scaleY:1,duration:.1,ease:'sine.inOut'},'fin+=1.5')
    .to(G,{brow:.55,duration:.16,ease:'sine.inOut'},'fin+=1.5')
    .to(glint,{x:130,duration:.32,ease:'power1.inOut'},'fin+=1.68');
}
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduce){gsap.set([...drops,...conf],{scale:0,transformOrigin:'50% 50%'});gsap.set(rays,{opacity:0});Object.assign(G,{t:1,dy:0,s:1,rot:ROT,brow:.55});F.forEach(m=>Object.assign(m,{t:1,dy:0,on:1}));render();return { play() {} };}
svg.addEventListener('click',play);
return { play };

}
