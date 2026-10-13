import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {Arrow,bounce,Cross,Grid,KineticTitle,Rail,ramp,smooth} from '../components/Motion';

export const Landing:React.FC=()=>{
 const f=useCurrentFrame();const phone=smooth(f,42,80);const width=888-phone*400;const hero=smooth(f,9,28);
 return <AbsoluteFill style={{background:b.foreground,overflow:'hidden',color:b.background}}>
  <Grid light spacing={72}/><Rail light number="04"/>
  <div className="landing-blue-line" style={{height:ramp(f,0,24,0,1220)}}/>
  <div className="landing-title" style={{transform:`translateX(-50%) scale(${1-phone*.08})`}}>{b.landing.map((line,i)=><KineticTitle key={line} text={line} size={190} delay={i*3} color={b.background}/>)}</div>
  <div className="device-shadow" style={{width:width-30,transform:`translateX(-50%) rotate(${-4+phone*4}deg)`,top:870,height:650+phone*80}}/>
  <div className="new-browser" style={{width,left:540-width/2,top:845-phone*10,height:665+phone*90,transform:`translateY(${(1-bounce(f,4))*180}px) rotate(${-4+phone*4}deg)`}}>
   <div className="new-chrome"><div><i/><i/><i/></div><span/><div className="chrome-menu">—</div></div>
   <div className="ui-nav"><div className="ui-logo"/><div className="ui-links"><i/><i/><i/></div><div className="ui-nav-button"/></div>
   <div className="ui-hero-copy" style={{width:380-phone*80,left:34,top:112,transform:`translateX(${(1-hero)*-400}px)`}}>
    <div className="ui-copy-heading"><span>IDEIAS.</span><span>EM AÇÃO.</span></div><div className="ui-copy-text"><i/><i/></div><div className="ui-cta"><Arrow size={22}/></div>
   </div>
   <div className="ui-hero-art" style={{left:500-phone*466,top:118+phone*286,width:340-phone*140,height:275-phone*90,transform:`scale(${bounce(f,14)})`}}>
    <div className="ui-orbit" style={{transform:`rotate(${f*1.1}deg)`}}/><div className="ui-art-block" style={{transform:`rotate(${-30+f*.8}deg)`}}/>
   </div>
   <div className="ui-section-rule" style={{top:430+phone*195,width:width-68,transform:`scaleX(${smooth(f,18,32)})`}}/>
   {[0,1,2].map(i=><div className="ui-detail-card" key={i} style={{width:250-phone*127,left:34+i*(285-phone*151),top:464+phone*188,opacity:ramp(f,22+i*4,31+i*4),transform:`translateY(${(1-bounce(f,22+i*4))*90}px)`}}><div style={{background:i===0?b.accent:i===1?b.background:'#E7EAF2'}}/><i/><i/></div>)}
   <div className="device-outline"/>
  </div>
  <div className="phone-notch" style={{opacity:smooth(f,60,78)}}/>
  <Cross x={920} y={590}/><Cross x={126} y={1530}/>
  <div className="responsive-brackets" style={{width:width+42,height:670+phone*90,top:840-phone*10,transform:`translateX(-50%) rotate(${-4+phone*4}deg)`}}><i/><i/><i/><i/></div>
 </AbsoluteFill>;
};
