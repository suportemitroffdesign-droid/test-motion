import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {ramp,smooth} from '../components/Motion';
import {Art,Cursor,Float,SoftBackdrop,StageTitle} from '../components/InterfaceMotion';
import {timing} from '../timing';

export const Video:React.FC=()=>{
 const f=useCurrentFrame();const exit=smooth(f,99,120);const segment=Math.min(3,Math.floor(f/30));const localCuts=timing.video_cuts.map(v=>v-210);const cut=Math.max(...localCuts.filter(v=>v<=f),0);const cutPulse=Math.exp(-(f-cut)/4);
 return <AbsoluteFill style={{background:'#EEF0F6',overflow:'hidden'}}>
  <SoftBackdrop/>
  <div className="camera-layer" style={{transform:`scale(${1.05-smooth(f,0,35)*.05+exit*.8}) translateY(${-exit*150}px)`,opacity:1-smooth(f,113,120)}}>
   <div className="editing-heading"><StageTitle text="EDIÇÃO" size={155}/></div>
   <Float x={89} y={615} width={900} seed={2} delay={0} z={2}>
    <div className="editor-shell">
     <div className="editor-toolbar"><div className="window-dots"><i/><i/><i/></div><div className="editor-tools"><span/><span/><span/></div><div className="play-control" style={{transform:`scale(${1-cutPulse*.09})`}}><svg width="23" height="23" viewBox="0 0 24 24"><path d="M7 4L20 12L7 20Z" fill="currentColor"/></svg></div></div>
     <div className="editor-canvas"><div className="editor-preview" style={{transform:`scale(${1+cutPulse*.035})`}}><Art f={f+segment*50} variant={segment%3}/><div className="frame-guides"><i/><i/><i/><i/></div></div><div className="editor-inspector"><i/><i/><span/><i/><i/><span/><i/></div></div>
     <div className="timeline-ruler">{Array.from({length:13},(_,i)=><i key={i}/>)}</div>
     <div className="editor-timeline">{[0,1,2,3].map(row=><div className="editor-track" key={row}>{Array.from({length:7},(_,i)=><div className="editor-clip" key={i} style={{width:62+(i+row)%3*28,background:row===1?'#E6E9F3':row===3?`${b.accent}22`:b.accent,opacity:.65+i%3*.13,transform:`scaleX(${smooth(f,6+row*3+i,18+row*3+i)})`}}>{row===0?<span style={{background:i===segment?'#fff':'#ffffff66'}}/>:row===3?<svg viewBox="0 0 100 24"><path d="M0 12L5 8L10 15L15 4L20 19L25 10L30 16L35 6L40 20L45 11L50 5L55 18L60 13L65 8L70 19L75 7L80 16L85 10L90 13L100 12" stroke={b.accent} fill="none"/></svg>:null}</div>)}</div>)}<div className="editor-playhead" style={{left:`${ramp(f,0,119,4,93)}%`}}/></div>
    </div>
   </Float>
   <Float x={125} y={1440} width={340} delay={27} seed={6} rotate={-3} z={4}><div className="floating-tool"><span className="tool-icon"><svg width="35" height="35" viewBox="0 0 40 40"><circle cx="9" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M13 13L34 34M13 27L34 6" stroke="currentColor" strokeWidth="2"/></svg></span><div><strong>Corte preciso</strong><div className="tool-meter"><i style={{width:`${55+Math.sin(f/15)*18}%`}}/></div></div></div></Float>
   <Cursor x={ramp(f,7,44,999,685)+Math.sin(f/26)*9} y={ramp(f,7,44,1640,1270)+Math.cos(f/31)*8} click={Math.max(0,1-Math.abs(f-60)/7)}/>
  </div>
 </AbsoluteFill>;
};
