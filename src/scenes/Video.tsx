import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {beat,bounce,Grid,KineticTitle,Rail,ramp,smooth} from '../components/Motion';
import {timing} from '../timing';

export const Video:React.FC=()=>{
 const f=useCurrentFrame();const cut=Math.floor(f/timing.beatFrames);const kick=beat(f);const sweep=smooth(f%(timing.beatFrames*2),0,timing.beatFrames*1.5);
 return <AbsoluteFill style={{background:cut%4===3?b.foreground:b.background,overflow:'hidden'}}>
  <div className="video-blue-field" style={{transform:`translateY(${-240+cut%3*60}px) rotate(-10deg)`}}/>
  <Grid/><Rail number="03"/>
  {[0,1,2].map(i=><div className="video-slice" key={i} style={{top:390+i*110,background:i===1?b.foreground:b.accent,transform:`translateX(${(1-bounce(f,i*3))*1100+(i%2?1:-1)*sweep*100}px) rotate(-8deg)`,opacity:i===2?.45:1}}/>)}
  <div className="video-title-frame" style={{transform:`translate(-50%,-50%) rotate(${cut%2?2:-2}deg) scale(${1+kick*.035})`}}>
   <div className="video-echo" style={{transform:`translate(${kick*22}px,${kick*14}px)`}}><KineticTitle text={b.video} size={292} outline color={b.accent}/></div>
   <KineticTitle text={b.video} size={292}/>
  </div>
  <div className="film-stack" style={{transform:`translateX(${-sweep*58}px) rotate(7deg)`}}>
   {[0,1,2,3].map(i=><div className="film-panel" key={i} style={{background:i===cut%4?b.foreground:'#151b32',transform:`translateY(${i===cut%4?-22:0}px)`,borderColor:i===cut%4?b.accent:'#ffffff33'}}><div className="film-art" style={{borderRadius:i%2?'50%':'0',transform:`rotate(${f*1.5+i*30}deg) scale(${.85+kick*.15})`,background:i===cut%4?b.accent:b.foreground}}/></div>)}
  </div>
  <div className="video-timeline">{[0,1,2].map(row=><div className="video-track" key={row}>{[0,1,2,3,4,5].map(i=><i key={i} style={{background:row===1?b.foreground:b.accent,opacity:.45+(i%3)*.23,width:55+(i+row)%3*44,transform:`scaleX(${smooth(f,10+row*3+i,22+row*3+i)})`}}/>)}</div>)}<div className="video-playhead" style={{left:`${ramp(f,0,96,4,95)}%`}}/></div>
  <div className="cut-line" style={{left:`${sweep*130-15}%`,boxShadow:`0 0 ${20+kick*20}px ${b.accent}`}}/>
  <div className="beat-meter">{Array.from({length:12},(_,i)=><i key={i} style={{height:12+Math.abs(Math.sin((f/timing.beatFrames)*Math.PI+i*.8))*40}}/>)}</div>
 </AbsoluteFill>;
};
