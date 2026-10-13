import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {timing} from '../timing';
import {beat,bounce,Cross,KineticTitle,Rail,ramp,smooth} from '../components/Motion';

export const Positioning:React.FC=()=>{
 const f=useCurrentFrame();const starts=timing.position_words.map(frame=>frame-timing.scenes[4]);
 const index=f<starts[1]?0:f<starts[2]?1:2;const local=f-starts[index];
 const size=[151,174,190][index];const exit=smooth(f,84,96);
 return <AbsoluteFill style={{background:index===1?b.background:b.accent,overflow:'hidden'}}>
  <Rail number="05"/>
  <div className="position-circle" style={{borderColor:index===1?b.accent:b.foreground,transform:`translate(-50%,-50%) scale(${.62+bounce(local)*.42+exit*.5}) rotate(${f*.8}deg)`}}/>
  <div className="position-lines" style={{transform:`translateY(${(1-bounce(local))*200}px) rotate(${index===1?12:-12}deg)`}}>{[0,1,2,3,4].map(i=><i key={i} style={{transform:`scaleX(${smooth(local,i,9+i)})`,opacity:.16+i*.11}}/>)}</div>
  <div className="position-word" key={index} style={{transform:`translate(-50%,-50%) scale(${1+.02*beat(local)+exit*.1})`}}>
   <KineticTitle text={b.positioning[index]} size={size} delay={f-local} stagger={.3} color={b.foreground}/>
  </div>
  <div className="position-underline" style={{transform:`translateX(${ramp(local,0,14,-100,0)}%)`}}/>
  <div className="position-block" style={{transform:`translateX(${(1-bounce(local,4))*500}px) rotate(${45+index*90}deg)`}}/>
  <Cross x={114} y={508} color={b.foreground}/><Cross x={935} y={1440} color={b.foreground}/>
 </AbsoluteFill>;
};
