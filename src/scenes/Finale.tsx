import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {bounce,ramp,smooth} from '../components/Motion';
import {OriginalLogo,SoftBackdrop,Trace} from '../components/InterfaceMotion';

export const Finale:React.FC=()=>{
 const f=useCurrentFrame();const p=bounce(f,0,28);const reveal=smooth(f,0,15);
 return <AbsoluteFill style={{background:'#FFFFFF',overflow:'hidden'}}>
  <SoftBackdrop/>
  <div className="final-logo-shadow" style={{opacity:ramp(f,0,20),transform:`translate(-50%,-50%) scale(${.5+smooth(f,0,38)*.6})`}}/>
  <div className="new-final-logo" style={{transform:`translate(-50%,-50%) translateY(${(1-p)*24}px) scale(${.96+p*.04})`}}><OriginalLogo reveal={reveal}/></div>
  <Trace f={f} start={4} end={26} path="M125 820V780H205M955 820V780H875M125 1100V1140H205M955 1100V1140H875"/>
  <div className="final-v3-services" style={{opacity:smooth(f,13,29),transform:`translateY(${(1-smooth(f,13,29))*14}px)`}}>{b.services}</div>
 </AbsoluteFill>;
};
