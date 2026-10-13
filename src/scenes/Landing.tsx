import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {bounce,ramp,smooth} from '../components/Motion';
import {Art,Cursor,drift,SoftBackdrop,StageTitle,Trace} from '../components/InterfaceMotion';

export const Landing:React.FC=()=>{
 const f=useCurrentFrame();const phone=smooth(f,50,102);const stack=smooth(f,45,70);const d=drift(f,4,.5);const width=900-phone*405;const click=Math.max(0,1-Math.abs(f-43)/7);const exit=smooth(f,109,120);
 return <AbsoluteFill style={{background:'#F1F3F8',overflow:'hidden'}}>
  <SoftBackdrop/>
  <div className="landing-heading"><StageTitle text="LANDING" size={126}/><StageTitle text="PAGES" size={126} delay={3}/></div>
  <div className="responsive-camera" style={{transform:`perspective(1800px) translateY(${-exit*40}px) rotateX(${3+d.rx-phone*3}deg) rotateY(${-8+d.ry+phone*8}deg) scale(${.94+.06*bounce(f,0,28)})`,opacity:1-exit*.3}}>
   <div className="responsive-browser" style={{width,left:540-width/2+d.x,top:730+d.y,height:735+stack*210,borderRadius:24+phone*18}}>
    <div className="site-toolbar"><div className="window-dots"><i/><i/><i/></div><div className="site-address"/><div className="site-menu-icon"><i/><i/></div></div>
    <div className="site-nav"><div className="site-brand-shape"/><div className="site-nav-links"><i/><i/><i/></div><div className="site-small-button"/></div>
    <div className="site-heading" style={{width:390-phone*70,top:146,left:38,opacity:ramp(f,9,19),transform:`translateY(${(1-bounce(f,8,28))*50}px)`}}><strong>Ideias.<br/><span>Em ação.</span></strong><div className="site-copy"><i/><i/></div><div className="site-button" style={{transform:`scale(${1-click*.08})`,boxShadow:click?`0 0 ${10+click*24}px ${b.accent}44`:undefined}}><span>Explorar</span><svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 20L20 4M4 4H20V20" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div></div>
    <div className="site-art" style={{left:500-phone*462,top:158+stack*300,width:345-phone*75,height:296-phone*71,transform:`translateY(${(1-bounce(f,17,27))*70}px)`,opacity:ramp(f,17,26)}}><Art f={f} variant={1}/></div>
    <div className="site-divider" style={{top:484+stack*265,width:width-76,transform:`scaleX(${smooth(f,23,42)})`}}/>
    {[0,1,2].map(i=><div className="site-grid-card" key={i} style={{left:38+i*(280-phone*143),top:515+stack*265,width:250-phone*126,opacity:ramp(f,28+i*6,40+i*6),transform:`translateY(${(1-bounce(f,28+i*6,27))*64}px)`}}><div className={`site-card-visual card-visual-${i}`}><i style={{transform:`rotate(${f*.35+i*50}deg)`}}/></div><div className="site-copy"><i/><i/></div></div>)}
    <div className="mobile-home" style={{opacity:phone}}/>
   </div>
  </div>
  <Trace f={f} start={44} end={76} path="M160 1730V1750H920V1730"/>
  <Cursor x={ramp(f,27,43,972,230)+Math.sin(f/28)*7} y={ramp(f,27,43,1550,1140)+Math.cos(f/35)*8} click={click} opacity={1-smooth(f,65,85)}/>
 </AbsoluteFill>;
};
