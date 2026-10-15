import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import T from './voice-timing.json';
import {C,E,S,P,drift,Float,Headline,Product,Phone,Bubble,Icon,Pointer,Logo,wordCue,Sprite} from './engine';
import {Offer,SocialCard} from './Offer';

export const Hook:React.FC=()=>{
 const f=useCurrentFrame(),hit=wordCue(0,'perder'),evaporate=S(f,hit-22,hit-2);
 return <AbsoluteFill className="r-dark">
  <div className="r-stage-glow" style={{transform:`translate(${Math.sin(f/25)*35}px,${Math.cos(f/31)*20}px)`}}/>
  {[0,1,2].map(i=>{const d=drift(f,i);return <div key={i} className="r-flying-ad" style={{left:[-45,350,730][i]+d.x+(i-1)*evaporate*1050,top:[520,370,590][i]+d.y-evaporate*400,transform:`perspective(1500px) translateZ(${f*3}px) rotateY(${[-18,3,20][i]-evaporate*25}deg) rotateX(${5-evaporate*14}deg) rotateZ(${[-9,4,12][i]}deg) scale(${(.53+f*.003)*(1+evaporate*.7)})`,opacity:1-evaporate,filter:`blur(${evaporate*10}px)`}}><SocialCard frame={f+i*31} variant={i}/></div>;})}
  <div className="r-hook-title" style={{transform:`scale(${1+Math.exp(-Math.max(0,f-hit)/5)*.12})`}}>
   <div style={{opacity:E(f,hit-10,hit-4),transform:`translateY(${(1-P(f,hit-10))*50}px)`}}>VOCÊ ESTÁ</div>
   <Headline text="PERDENDO" size={151} delay={hit} color={C.blue}/>
   <Headline text="CLIENTES." size={122} delay={wordCue(0,'clientes')}/>
  </div>
  <svg className="r-trace" viewBox="0 0 1080 1920"><path d="M110 1230L957 1230" stroke={C.blue} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-S(f,hit,hit+15)} fill="none"/></svg>
 </AbsoluteFill>;
};

export const Problem:React.FC=()=>{
 const f=useCurrentFrame(),out=S(f,128,162);const click=Math.max(0,1-Math.abs(f-110)/6);const seek=S(f,48,85);
 return <AbsoluteFill className="r-paper">
  <div className="r-light-glow"/>
  <div className="r-problem-title"><Headline text="BONITO" size={116} delay={10} color={C.black}/><div className="r-not-equal" style={{opacity:E(f,wordCue(1,'feio'),wordCue(1,'feio')+7)}}>≠</div><Headline text="EFICIENTE" size={102} delay={wordCue(1,'ninguém')-7} color={C.blue}/></div>
  <Float x={263} y={630} width={570} seed={4} style={{transform:`perspective(1300px) rotateY(${Math.sin(f/35)*9}deg) rotateZ(${Math.sin(f/47)*3}deg) scale(${1-out*.55}) translateY(${-out*500}px)`,opacity:1-out}}><div style={{height:860}}><Phone frame={f} style={{transform:"scale(1.4)"}}/></div></Float>
  <Float x={30-out*500} y={805+out*80} width={720} seed={1} rotate={-8} style={{transform:`perspective(1500px) rotateY(-12deg) rotateZ(${-8-out*23}deg) scale(.43)`,transformOrigin:'top left',opacity:1-out}}><SocialCard frame={f+70}/></Float>
  <Float x={735+out*400} y={720-out*120} width={720} seed={5} rotate={9} style={{transform:`perspective(1500px) rotateY(12deg) rotateZ(${9+out*22}deg) scale(.40)`,transformOrigin:'top left',opacity:1-out}}><SocialCard frame={f+100} variant={1}/></Float>
  <div className="r-app-dock" style={{opacity:S(f,14,25)*(1-out)}}><Img src={staticFile('production/icons/instagram.svg')}/><span/><Img src={staticFile('production/icons/whatsapp.svg')}/></div>
  <div className="r-question-chip" style={{opacity:E(f,wordCue(1,'entende'),wordCue(1,'entende')+7)*(1-out),transform:`translate(-50%,${Math.sin(f/22)*8}px)`}}>Qual é a oferta?</div>
  {Array.from({length:8},(_,i)=><div key={i} className="r-message-fragment" style={{left:500+Math.cos(i*Math.PI/4)*out*510,top:1060+Math.sin(i*Math.PI/4)*out*420,width:55+i*9,opacity:Math.sin(out*Math.PI)*.7,background:i%2?C.blue:C.white,transform:`perspective(1200px) rotateZ(${out*80+i*25}deg) rotateY(${out*45}deg)`}}/>)}
  <Pointer x={E(f,0,44,1000,660)+(Math.sin(f/13)*130)*seek} y={1100+Math.cos(f/18)*155} click={click} opacity={E(f,15,25)*(1-out)}/>
 </AbsoluteFill>;
};

const DimensionalIcon:React.FC<{type:string;frame:number}> = ({type,frame})=>{
 return <Sprite folder={type} position={4.5+Math.sin(frame/30)*4.4} count={10}/>;
};
export const Solution:React.FC=()=>{
 const f=useCurrentFrame();const labels=['ENTENDER','DESEJAR','AGIR'];const icons=['eye','heart','cursor'];const cues=['entender','desejar','agir'].map(w=>wordCue(2,w));const out=S(f,195,213);
 return <AbsoluteFill className="r-paper">
  <div className="r-light-glow"/>
  <div className="r-solution-source" style={{transform:`perspective(1600px) rotateY(${-S(f,20,65)*35}deg) scale(${.53*(1-S(f,30,85))}) translateY(${-S(f,20,80)*500}px)`,opacity:1-S(f,35,72)}}><SocialCard frame={f+40}/></div>
  <div className="r-solution-top" style={{opacity:S(f,70,92)*(1-out)}}><Headline text="DESIGN TEM FUNÇÃO." size={71} delay={75} color={C.black}/></div>
  <svg className="r-trace" viewBox="0 0 1080 1920"><path d="M250 908H840" stroke={C.blue} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-S(f,cues[0],cues[2])} fill="none"/></svg>
  {labels.map((label,i)=>{const d=drift(f,i),active=S(f,cues[i],cues[i]+7),pulse=Math.exp(-Math.max(0,f-cues[i])/8);return <div className="r-process-card" key={label} style={{left:104+i*300+d.x,top:730+d.y+(1-P(f,42+i*14))*340,transform:`perspective(1500px) rotateX(${d.rx}deg) rotateY(${d.ry}deg) scale(${1+active*pulse*.045})`,opacity:S(f,38+i*14,48+i*14),borderColor:active>.5?C.blue:'#ffffff',boxShadow:`0 32px 50px -24px #182b4a44,0 0 ${active*24}px #008cff22`}}><div className="r-process-icon"><DimensionalIcon type={icons[i]} frame={f+i*24}/></div><div className="r-process-word" style={{opacity:active,transform:`translateY(${(1-P(f,cues[i]))*30}px)`}}>{label}</div><div className="r-process-light" style={{width:`${active*100}%`}}/></div>;})}
  <div className="r-solution-action" style={{opacity:S(f,105,124)}}><span className="r-mini-dot"/><span>Clareza conduz à ação.</span><div style={{color:C.blue}}><Icon type="arrow" size={28}/></div></div>
  <Pointer x={E(f,145,183,1000,925)} y={E(f,145,183,1410,1100)} click={Math.max(0,1-Math.abs(f-cues[2]-4)/6)} opacity={S(f,139,150)}/>
 </AbsoluteFill>;
};

export const Transformation:React.FC=()=>{
 const f=useCurrentFrame(),rebuild=S(f,wordCue(3,'destacar'),wordCue(3,'transforma'));const explosion=S(f,wordCue(3,'hierarquia')-8,wordCue(3,'destacar'))*(1-S(f,142,wordCue(3,'transforma')));const d=drift(f,4);
 return <AbsoluteFill className="r-paper">
  <div className="r-light-glow"/>
  <div className="r-redesign-title"><Headline text="MESMA OFERTA." size={79} color={C.black} delay={2}/><div style={{opacity:S(f,wordCue(3,'transforma'),wordCue(3,'transforma')+12),transform:`translateY(${(1-P(f,wordCue(3,'transforma')))*20}px)`}}>OUTRA PERCEPÇÃO.</div></div>
  <div className="r-redesign-stage" style={{transform:`perspective(1800px) translateX(${d.x}px) translateY(${d.y}px) rotateX(${7-explosion*8+d.rx*.3}deg) rotateY(${-10+rebuild*10+d.ry*.4}deg) scale(${.96+rebuild*.04})`}}><Offer progress={rebuild} explosion={explosion} frame={f+80}/></div>
  <div className="r-redesign-status"><span style={{color:rebuild>.8?C.blue:'#8C94A2'}}>{rebuild>.8?'OFERTA CLARA':'REORGANIZANDO A MENSAGEM'}</span><div><i style={{width:`${rebuild*100}%`}}/></div></div>
  <Pointer x={E(f,30,80,950,740)+Math.sin(f/40)*12} y={E(f,30,80,1470,1205)+Math.cos(f/29)*9} click={Math.max(0,1-Math.abs(f-wordCue(3,'oferta'))/7)} opacity={S(f,20,35)*(1-S(f,175,200))}/>
 </AbsoluteFill>;
};

export const Closing:React.FC=()=>{
 const f=useCurrentFrame();const leave=S(f,4,108),question=wordCue(4,'será'),cta=wordCue(4,'ocupando')-12;const logoStart=T.scenes[4].speech_end-T.scenes[4].start+9;const brand=S(f,logoStart,logoStart+12);
 return <AbsoluteFill className="r-dark">
  <div className="r-stage-glow"/>
  {[0,1,2].map(i=><div className="r-closing-ad" key={i} style={{left:[-20,365,740][i]+(i-1)*leave*250,top:520+Math.sin(f/30+i)*20-leave*360,transform:`perspective(1700px) rotateY(${(i-1)*-18+leave*30}deg) rotateZ(${(i-1)*8}deg) scale(${.44*(1-leave*.7)})`,opacity:1-leave}}><SocialCard frame={f+40+i*20} clear={1}/></div>)}
  <div className="r-closing-question" style={{opacity:S(f,question,question+9)*(1-brand),transform:`translateY(${-S(f,cta,cta+20)*80}px)`}}><Headline text="SEU CONTEÚDO" size={84} delay={question}/><Headline text="COMUNICA?" size={112} delay={question+5}/></div>
  <div className="r-comment-model" style={{opacity:S(f,cta-8,cta+6)*(1-brand),transform:`translateY(${(1-P(f,cta-8))*60}px) rotateZ(${Math.sin(f/25)*4}deg)`}}><Bubble frame={f}/></div>
  <div className="r-brand-reveal" style={{opacity:brand,clipPath:`circle(${brand*120}% at 50% 55%)`}}><div className="r-final-halo"/><div className="r-final-logo"><Logo progress={S(f,logoStart,logoStart+15)}/></div></div>
  <div className="r-comment-cta" style={{opacity:S(f,cta,cta+10),top:1300-brand*45,transform:`translateX(-50%) scale(${.94+.06*P(f,cta)})`}}><Icon type="comment" size={39}/><span>COMENTA <strong>PERFIL</strong></span></div>
 </AbsoluteFill>;
};
