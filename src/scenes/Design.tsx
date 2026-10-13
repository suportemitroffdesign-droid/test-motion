import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {beat,bounce,Cross,Grid,KineticTitle,Rail,smooth} from '../components/Motion';

export const Design:React.FC=()=>{
 const f=useCurrentFrame();const rearrange=smooth(f,36,64);const exit=smooth(f,80,96);
 return <AbsoluteFill style={{background:b.foreground,overflow:'hidden',color:b.background}}>
  <Grid light/><Rail light number="02"/>
  <div className="design-canvas" style={{transform:`translateY(${exit*-300}px) scale(${1+exit*.25})`}}>
   <div className="design-poster" style={{left:116-rearrange*45,top:335+rearrange*35,transform:`translateY(${(1-bounce(f,6))*-480}px) rotate(${-13+rearrange*7}deg)`}}>
    <div className="poster-monogram">Aa</div><div className="poster-baseline"/>
    <div className="poster-lines">{[1,2,3,4,5].map(i=><i key={i} style={{width:55+i*22}}/>)}</div>
   </div>
   <div className="design-shape-card" style={{right:90,top:440-rearrange*130,transform:`translateX(${(1-bounce(f,12))*600}px) rotate(${10-rearrange*7}deg)`}}>
    {[0,1,2,3].map(i=><div key={i} style={{borderRadius:i===0||i===3?'50%':'0',background:i%2?b.background:b.accent,transform:`rotate(${i===2?f*.9:0}deg) scale(${.92+beat(f-i*3)*.08})`}}/>)}
   </div>
   <div className="design-grid-card" style={{left:145+rearrange*100,top:1170-rearrange*15,transform:`translateY(${(1-bounce(f,18))*520}px) rotate(${-8+rearrange*13}deg)`}}>
    <div className="grid-block large"/><div className="grid-block"/><div className="grid-block"/><div className="grid-block wide"/>
   </div>
   <div className="design-type-card" style={{right:68,top:1190+rearrange*30,transform:`translateY(${(1-bounce(f,24))*540}px) rotate(${12-rearrange*8}deg)`}}><span>Mg</span><i/></div>
  </div>
  <div className="design-title-strip" style={{transform:`translateY(${(1-bounce(f))*140}px) rotate(${exit*-5}deg)`,boxShadow:`0 12px ${30+beat(f)*20}px #386bff22`}}><KineticTitle text={b.design} size={265} color={b.background}/></div>
  <div className="design-selection" style={{width:790+rearrange*50,transform:`translate(-50%,-50%) rotate(${exit*-5}deg)`}}>{[0,1,2,3].map(i=><span key={i}/>)}</div>
  <Cross x={908} y={1430}/>
 </AbsoluteFill>;
};
