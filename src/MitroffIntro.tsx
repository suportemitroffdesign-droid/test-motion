import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand as b} from './brand';
import {timing} from './timing';
import './style.css';
const ease = (f:number,a:number,z:number,from=0,to=1) => interpolate(f,[a,z],[from,to],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const Pop:React.FC<{delay?:number;children:React.ReactNode;style?:React.CSSProperties}> = ({delay=0,children,style}) => {
 const f=useCurrentFrame(); const {fps}=useVideoConfig(); const p=spring({frame:f-delay,fps,config:{damping:22,stiffness:130}});
 return <div style={{...style,opacity:ease(f,delay,delay+9),transform:`translateY(${(1-p)*90}px)`}}>{children}</div>;
};
const Arrow = ({size=24}:{size?:number}) => <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M9 39L39 9M9 9H39V39" stroke="currentColor" strokeWidth="3"/></svg>;
const Tag:React.FC<{children:React.ReactNode}> = ({children}) => <div className="tag">{children}</div>;
const Header:React.FC<{number:string;label:string}> = ({number,label}) => <div className="header"><span>MITROFF / DESIGN</span><span>{number} — {label}</span></div>;
const Scene:React.FC<{children:React.ReactNode;duration:number}> = ({children,duration}) => {
 const f=useCurrentFrame();return <AbsoluteFill style={{opacity:ease(f,duration-9,duration,1,0)}}>{children}</AbsoluteFill>;
};
const LetterReveal:React.FC<{text:string;delay:number}> = ({text,delay}) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();return <>{Array.from(text).map((c,i)=>{const p=spring({frame:f-delay-i*.65,fps,config:{damping:24,stiffness:180}});return <span key={i} style={{display:'inline-block',whiteSpace:'pre',transform:`translateY(${(1-p)*24}px)`,opacity:ease(f,delay+i*.65,delay+i*.65+6)}}>{c}</span>;})}</>;
};
const Intro:React.FC = () => {
 const f=useCurrentFrame();return <Scene duration={90}><Header number="01" label="UM NOVO COMEÇO"/><div className="intro"><Tag>IDEIAS EM MOVIMENTO</Tag>{b.intro.map((line,i)=><div key={line} className="mask"><Pop delay={timing.introLines[i]}><div className="big" style={{color:i===2?b.accent:b.foreground}}><LetterReveal text={line} delay={timing.introLines[i]}/></div></Pop></div>)}<Pop delay={32}><div className="small-note">A pausa acaba aqui.</div></Pop></div><div className="intro-bar" style={{width:760*ease(f,12,63)}}/><div className="bottom-caption">VISUAL. DIGITAL. EM MOVIMENTO.</div></Scene>;
};
const Bridge:React.FC = () => {
 const f=useCurrentFrame();const morph=ease(f,40,59);return <Scene duration={60}><Header number="02" label="DA IDEIA À FORMA"/><div className="bridge" style={{transform:`translateY(${-morph*80}px)`,opacity:1-morph}}>{b.bridge.map((line,i)=><div className="mask" key={line}><Pop delay={timing.bridgeLines[i]}><div className="bridge-type" style={{color:i===2?b.accent:b.foreground}}>{line}</div></Pop></div>)}</div>{[0,1,2,3].map(i=><div key={i} style={{position:'absolute',left:96+i*222,top:1160-morph*(170+i*38),width:180,height:12+morph*180,background:i%2?b.foreground:b.accent,opacity:morph,transform:`rotate(${morph*(i-1.5)*6}deg)`}}/>)}</Scene>;
};
const Design:React.FC = () => {
 const f=useCurrentFrame();return <Scene duration={100}><Header number="03" label="COMPOSIÇÃO"/><div className="section-title"><Tag>01 / IDENTIDADE VISUAL</Tag><Pop><h1>DESIGN</h1></Pop><Pop delay={7}><p>Forma, intenção e presença.</p></Pop></div><div className="gallery"><Pop delay={5} style={{position:'absolute',left:0,top:0,transformOrigin:'center'}}><div className="poster blue" style={{transform:`rotate(${-6+ease(f,22,65)*4}deg) translateX(${ease(f,40,75)*-28}px)`}}><span className="micro">ESTUDO VISUAL / 001</span><div className="poster-type">IDEIA<br/>VIRA<br/>FORMA<span>.</span></div><div className="poster-circle"/><span className="micro">TIPOGRAFIA + COMPOSIÇÃO</span></div></Pop><Pop delay={14} style={{position:'absolute',right:0,top:185}}><div className="poster white" style={{transform:`rotate(${7-ease(f,25,70)*4}deg)`}}><span className="micro">EXPLORAÇÃO GRÁFICA</span><div className="graphic-grid">{Array.from({length:9},(_,i)=><div key={i} style={{borderRadius:i%3===0?'50%':'0',background:i%2?b.background:b.accent,transform:`scale(${.82+.18*Math.sin(f/18+i)})`}}/>)}</div><div className="poster-label">MENOS RUÍDO.<br/>MAIS SIGNIFICADO.</div></div></Pop></div><div className="bottom-caption">CONCEITO AUTORAL / SEM MARCAS CLIENTES</div></Scene>;
};
const Video:React.FC = () => {
 const f=useCurrentFrame();const cut=Math.floor(f/25)%3;const pulse=Math.exp(-(f%12.5)/4);return <Scene duration={100}><Header number="04" label="RITMO"/><div className="section-title"><Tag>02 / NARRATIVA AUDIOVISUAL</Tag><Pop><h1>EDIÇÃO<br/>DE VÍDEO</h1></Pop></div><Pop delay={5} style={{position:'absolute',left:96,right:96,top:790}}><div className="video-screen"><div className="screen-index">SEQUÊNCIA 0{cut+1} / 03</div><div className="screen-shape" style={{transform:`rotate(${f*1.2}deg) scale(${1+pulse*.08})`,borderRadius:cut===1?'50%':0}}/><div className="kinetic" style={{transform:`translateX(${ease(f%25,0,8,26,0)}px)`}}>{['CORTE.','RITMO.','IMPACTO.'][cut]}</div><div className="screen-footer">MOTION STUDY — MITROFF</div></div><div className="timeline"><div className="ruler">00:00 <span>00:01</span><span>00:02</span><span>00:03</span></div>{[0,1,2].map(row=><div className="track" key={row}>{[0,1,2,3].map(i=><div key={i} style={{flex:i===row?2:1,background:row===1?b.foreground:b.accent,opacity:.5+i*.13,transform:`scaleX(${ease(f,12+row*6+i*3,27+row*6+i*3)})`,transformOrigin:'left'}}/>)}</div>)}<div className="playhead" style={{left:`${7+ease(f,0,99)*86}%`}}/></div></Pop><div className="bottom-caption">CORTES PRECISOS. MOVIMENTOS COORDENADOS.</div></Scene>;
};
const Web:React.FC = () => {
 const f=useCurrentFrame();const mobile=ease(f,timing.mobileStart,timing.mobileEnd);return <Scene duration={100}><Header number="05" label="EXPERIÊNCIA"/><div className="section-title"><Tag>03 / DESIGN DIGITAL</Tag><Pop><h1>LANDING<br/>PAGES</h1></Pop><Pop delay={5}><p>Da primeira impressão à ação.</p></Pop></div><div className="browser" style={{width:888-mobile*390,left:96+mobile*195,top:775-mobile*45,height:640+mobile*195}}><div className="browser-chrome"><i/><i/><i/><span>CONCEITO / INTERFACE RESPONSIVA</span></div><div className="web-nav"><strong>STUDIO / CONCEITO</strong><span>☰</span></div><div className="web-hero" style={{display:'flex',flexDirection:mobile>.5?'column':'row'}}><Pop delay={9}><div className="web-type" style={{fontSize:62-mobile*12}}>Uma ideia.<br/>Novas<br/><span>possibilidades.</span></div><div className="web-copy">Design pensado para conectar.</div><div className="web-button">Explore o conceito <Arrow size={16}/></div></Pop><div className="web-art" style={{height:250-mobile*100,width:240-mobile*25}}><div style={{transform:`rotate(${45+f*.4}deg)`}}/></div></div><div className="web-cards">{['ESTRATÉGIA','DESIGN','EXPERIÊNCIA'].map((x,i)=><Pop key={x} delay={19+i*6}><div><span>0{i+1}</span><strong>{x}</strong><div className="fake-line"/><div className="fake-line short"/></div></Pop>)}</div></div><div className="responsive-label" style={{opacity:ease(f,65,80)}}>DESKTOP → MOBILE</div><div className="bottom-caption">INTERFACE CONCEITUAL / ESTUDO AUTORAL</div></Scene>;
};
const Outro:React.FC = () => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const settle=spring({frame:f-timing.logoReveal,fps,config:{damping:26,stiffness:140}});
 const reveal=ease(f,timing.logoReveal,timing.logoReveal+24);
 return <AbsoluteFill><Header number="06" label="MITROFF DESIGN"/>
  <div className="outro-intro"><Pop><div>{b.name}</div></Pop><Pop delay={8}><div style={{color:b.muted}}>{b.signature}</div></Pop></div>
  <div className="brand-final">
   <div className="logo-stage" style={{opacity:ease(f,18,25),transform:`translateY(${(1-settle)*28}px) scale(${.96+.04*settle})`}}>
    <div className="logo-window" style={{clipPath:`inset(0 ${(1-reveal)*100}% 0 0)`}}>
     <Img src={staticFile(b.logo)} className="official-logo"/>
    </div>
    <div className="logo-reveal-line" style={{left:`${reveal*100}%`,opacity:1-ease(f,47,55)}}/>
   </div>
   <Pop delay={55}><div className="brand-rule"/><div className="services">{b.services}</div></Pop>
  </div>
  <div className="outro-bottom" style={{opacity:ease(f,62,77)}}><span>VAMOS CRIAR ALGO<br/>QUE MEREÇA SER VISTO.</span><div className="arrow"><Arrow size={64}/></div></div>
 </AbsoluteFill>;
};
const Transition:React.FC = () => {
 const f=useCurrentFrame();const progress=ease(f,0,12);return <AbsoluteFill style={{pointerEvents:'none',zIndex:5}}><div style={{position:'absolute',top:0,bottom:0,width:100,left:`${-15+progress*130}%`,background:b.foreground,transform:'skewX(-12deg)',opacity:Math.sin(progress*Math.PI)*.09}}/></AbsoluteFill>;
};
export const MitroffIntro:React.FC = () => {
 const f=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:b.background,color:b.foreground,fontFamily:'Arial, Helvetica, sans-serif', '--accent':b.accent, '--foreground':b.foreground, '--background':b.background, '--muted':b.muted} as React.CSSProperties}><Audio src={staticFile("audio/mitroff-master.wav")} volume={1}/><div className="ambient"/><Sequence from={0} durationInFrames={90}><Intro/></Sequence><Sequence from={90} durationInFrames={60}><Bridge/></Sequence><Sequence from={150} durationInFrames={100}><Design/></Sequence><Sequence from={250} durationInFrames={100}><Video/></Sequence><Sequence from={350} durationInFrames={100}><Web/></Sequence><Sequence from={450} durationInFrames={150}><Outro/></Sequence>{timing.scenes.slice(1).map(frame=><Sequence key={frame} from={frame-6} durationInFrames={13}><Transition/></Sequence>)}<div className="progress" style={{background:b.accent,width:`${f/599*100}%`}}/></AbsoluteFill>;
};
