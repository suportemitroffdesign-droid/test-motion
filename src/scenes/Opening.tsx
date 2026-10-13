import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {bounce,ramp,smooth} from '../components/Motion';
import {Cursor,OriginalLogo,SoftBackdrop,Trace} from '../components/InterfaceMotion';

export const Opening:React.FC=()=>{
 const f=useCurrentFrame();const morph=smooth(f,47,76);const exit=smooth(f,77,90);const p=bounce(f,4,24);
 const width=890-morph*230;const height=300-morph*144;
 return <AbsoluteFill style={{background:b.background,overflow:'hidden'}}>
  <SoftBackdrop dark/>
  <div className="intro-frame" style={{width:width+40,height:height+40,transform:`translate(-50%,-50%) scale(${1+exit*2})`,opacity:1-exit}}/>
  <div className="intro-identity" style={{width,height,transform:`translate(-50%,-50%) perspective(1800px) rotateX(${(1-p)*18+Math.sin(f/33)*1.3}deg) rotateY(${Math.cos(f/28)*2}deg) scale(${.9+p*.1+exit*2})`,opacity:1-exit,filter:`blur(${exit*12}px)`}}>
   <div style={{position:'absolute',inset:0,opacity:1-morph}}><OriginalLogo reveal={smooth(f,4,26)}/></div>
   <div className="identity-ui" style={{opacity:morph}}><span className="identity-dot"/><strong>MITROFF</strong><div className="identity-button" style={{transform:`scale(${1-(1-Math.abs(Math.sin((f-60)/10)))*.02})`}}><svg width="28" height="28" viewBox="0 0 32 32"><path d="M6 26L26 6M6 6H26V26" stroke="currentColor" strokeWidth="2" fill="none"/></svg></div></div>
  </div>
  <Trace f={f} start={5} end={36} path="M95 965V748Q95 710 132 710H942Q978 710 978 748V1110Q978 1148 942 1148H132Q95 1148 95 1110V965"/>
  <div className="intro-guide" style={{opacity:ramp(f,26,44)*(1-exit),transform:`translateY(${Math.sin(f/28)*7}px)`}}><i/><i/><i/></div>
  <Cursor x={ramp(f,49,68,980,800)} y={ramp(f,49,68,1330,952)} click={Math.max(0,1-Math.abs(f-70)/6)} light opacity={ramp(f,44,51)*(1-exit)}/>
 </AbsoluteFill>;
};
