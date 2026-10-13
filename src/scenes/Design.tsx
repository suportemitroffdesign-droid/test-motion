import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {bounce,ramp,smooth} from '../components/Motion';
import {Art,Cursor,Float,SoftBackdrop,StageTitle,Trace} from '../components/InterfaceMotion';

export const Design:React.FC=()=>{
 const f=useCurrentFrame();const organize=smooth(f,34,76);const zoom=smooth(f,98,120);
 const cursorX=ramp(f,18,47,1000,500);const cursorY=ramp(f,18,47,1550,1340);const click=Math.max(0,1-Math.abs(f-48)/6);
 return <AbsoluteFill style={{background:'#F0F2F7',overflow:'hidden'}}>
  <SoftBackdrop/>
  <div className="camera-layer" style={{transform:`scale(${.94+smooth(f,0,42)*.06+zoom*.9}) translateY(${-zoom*150}px)`,filter:`blur(${zoom*5}px)`,opacity:1-smooth(f,114,120)}}>
   <Float x={92+organize*30} y={340+organize*24} width={400} seed={1} delay={7} rotate={-7+organize*6} z={2}><div className="visual-card"><Art f={f} variant={0}/><div className="visual-card-footer"><i/><span/><span/></div></div></Float>
   <Float x={576-organize*42} y={410-organize*45} width={356} seed={3} delay={15} rotate={8-organize*6} z={1}><div className="palette-card"><div className="palette-type">Aa</div><div className="palette-swatches"><i/><i/><i/></div><div className="card-skeleton"><i/><i/></div></div></Float>
   <Float x={143-organize*10} y={1150+organize*16} width={390} seed={5} delay={23} rotate={-6+organize*5} z={2}><div className="layout-card"><div className="layout-hero"/><div className="layout-columns"><i/><i/><i/></div><div className="card-skeleton"><i/><i/></div></div></Float>
   <Float x={600-organize*37} y={1200-organize*65} width={315} seed={7} delay={31} rotate={7-organize*5} z={3}><div className="visual-card"><Art f={f} variant={2}/></div></Float>
   <div className="design-guide-box" style={{transform:`translate(-50%,-50%) scale(${.9+organize*.1})`,opacity:ramp(f,30,47)}}/>
   <StageTitle text="DESIGN" size={170}/>
   <Trace f={f} start={38} end={64} path="M90 1120H990M537 1080V1530"/>
   <Cursor x={cursorX+Math.sin(f/35)*9} y={cursorY+Math.sin(f/29)*12} click={click}/>
   <div className="selection-chip" style={{left:500+Math.sin(f/35)*9,top:1375+Math.sin(f/29)*12,opacity:ramp(f,48,55)}}><span/>Layout</div>
  </div>
 </AbsoluteFill>;
};
