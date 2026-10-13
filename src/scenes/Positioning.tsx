import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {bounce,ramp,smooth} from '../components/Motion';
import {Art,SoftBackdrop,Trace} from '../components/InterfaceMotion';

export const Positioning:React.FC=()=>{
 const f=useCurrentFrame();const converge=smooth(f,9,66);const compress=smooth(f,66,90);const q=bounce(f,9,25);
 return <AbsoluteFill style={{background:b.background,overflow:'hidden'}}>
  <SoftBackdrop dark/>
  {[0,1,2,3].map(i=>{
   const starts=[{x:88,y:475},{x:723,y:475},{x:85,y:1200},{x:730,y:1180}];const start=starts[i];const targets=[{x:170,y:530},{x:660,y:535},{x:165,y:1170},{x:655,y:1160}];const target=targets[i];const shrink=.76-compress*.65;
   return <div className="converging-card" key={i} style={{left:start.x+(target.x-start.x)*converge+(434-target.x)*compress+Math.sin(f/25+i)*10,top:start.y+(target.y-start.y)*converge+(866-target.y)*compress+Math.cos(f/23+i)*10,transform:`perspective(1500px) rotateX(${Math.sin(f/24+i)*6}deg) rotateY(${(i%2?1:-1)*(1-converge)*15}deg) rotateZ(${(i%2?1:-1)*(12-converge*8)}deg) scale(${shrink})`,opacity:1-smooth(f,50,73)}}><Art f={f} variant={i%3}/></div>;
  })}
  <div className="presence-message" style={{transform:`translate(-50%,-50%) scale(${.96+q*.04+compress*.045})`}}>
   <div className="presence-mask"><span style={{transform:`translateY(${(1-bounce(f,2,25))*180}px)`}}>MAIS</span></div>
   <div className="presence-mask"><span style={{transform:`translateY(${(1-bounce(f,15,25))*180}px)`,color:b.foreground}}>PRESENÇA<span style={{color:b.accent}}>.</span></span></div>
  </div>
  <Trace f={f} start={19} end={55} path="M90 1130C250 1190 829 1190 990 1130"/>
  <div className="presence-blue-core" style={{transform:`translate(-50%,-50%) scale(${.2+compress*.8})`,opacity:smooth(f,61,82)}}/>
 </AbsoluteFill>;
};
