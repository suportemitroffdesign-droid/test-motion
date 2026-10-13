import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {beat,bounce,Cross,Grid,KineticTitle,Rail,ramp,smooth} from '../components/Motion';

export const Opening: React.FC = () => {
  const f=useCurrentFrame();const p=bounce(f);const close=smooth(f,54,72);
  return <AbsoluteFill style={{background:b.background,overflow:'hidden'}}>
    <Grid/><Rail number="01"/>
    <div className="opening-band" style={{transform:`translateX(${(1-p)*-120}%) rotate(-12deg)`,height:380+beat(f)*10}}/>
    <div className="open-ring" style={{transform:`translate(-50%,-50%) rotate(${f*.6}deg) scale(${.8+.2*p+close*.6})`,opacity:1-close}}/>
    {[0,1,2].map(i=><div className="opening-bar" key={i} style={{top:460+i*58,left:90,transform:`scaleX(${smooth(f,2+i*3,14+i*3)})`,width:210+i*75}}/>)}
    <div className="title-center" style={{transform:`translate(-50%,-50%) scale(${1+.04*beat(f)+close*.45})`,filter:`blur(${close*9}px)`,opacity:1-close}}>
      <div className="opening-echo"><KineticTitle text={b.opening} outline color={b.accent}/></div>
      <KineticTitle text={b.opening}/>
    </div>
    <div className="opening-underline" style={{width:ramp(f,10,24,0,790),transform:`translateX(${close*900}px)`}}/>
    <Cross x={92} y={1380}/><Cross x={958} y={538}/>
    <div className="open-outline" style={{transform:`translateY(${(1-p)*150}px) rotate(${-5+f*.08}deg)`,opacity:ramp(f,8,18)}}/>
    <div className="blue-corner" style={{transform:`translateY(${(1-bounce(f,10))*600}px)`}}/>
  </AbsoluteFill>;
};
