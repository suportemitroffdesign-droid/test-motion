import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {bounce,ramp,smooth} from '../components/Motion';

export const Finale:React.FC=()=>{
 const f=useCurrentFrame();const reveal=smooth(f,24,50);const burst=1-smooth(f,32,68);
 return <AbsoluteFill style={{background:'#FFFFFF',color:b.background,overflow:'hidden'}}>
  <div className="final-blue-sweep" style={{transform:`translateX(${ramp(f,0,24,-5,115)}%) skewX(-9deg)`}}/>
  <div className="final-ring" style={{transform:`translate(-50%,-50%) scale(${.15+smooth(f,18,66)*2})`,opacity:burst}}/>
  <div className="final-outline" style={{transform:`translate(-50%,-50%) scale(${.65+.35*bounce(f,12)})`,opacity:.7}}/>
  {[0,1,2,3].map(i=><div className={`final-corner corner-${i}`} key={i} style={{transform:`translate(${(i%2?1:-1)*(1-smooth(f,26,44))*70}px,${(i<2?-1:1)*(1-smooth(f,26,44))*40}px)`,opacity:smooth(f,26,44)}}/>)}
  <div className="final-logo-stage" style={{transform:`translate(-50%,-50%) scale(${.94+.06*bounce(f,24,25)})`,clipPath:`inset(0 ${(1-reveal)*100}% 0 0)`}}>
   <Img src={staticFile(b.logo)} className="official-logo"/>
  </div>
  <div className="final-line" style={{width:ramp(f,36,62,0,100)}}/>
  <div className="final-services" style={{opacity:smooth(f,54,70),transform:`translateY(${(1-smooth(f,54,70))*20}px)`}}>{b.services}</div>
  <div className="final-edge top-edge" style={{transform:`scaleX(${smooth(f,14,42)})`}}/><div className="final-edge bottom-edge" style={{transform:`scaleX(${smooth(f,18,48)})`}}/>
 </AbsoluteFill>;
};
