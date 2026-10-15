import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {FontGate} from '../components/Motion';
import T from './voice-timing.json';
import {Hook,Problem,Solution,Transformation,Closing} from './Scenes';
import {C,E} from './engine';
import './production.css';
const Scenes=[Hook,Problem,Solution,Transformation,Closing];
const Captions:React.FC=()=>{
 const f=useCurrentFrame();const scene=T.scenes.find(s=>f>=s.speech_start&&f<=s.speech_end);if(!scene)return null;
 const active=scene.words.reduce((best,w,i)=>w.start<=f?i:best,-1);if(active<0)return null;
 const base=Math.floor(active/3)*3,words=scene.words.slice(base,base+3);const start=words[0].start;return <div className="r-captions" style={{opacity:E(f,start-1,start+2)}}>{words.map((w,i)=><span key={base+i} className={base+i===active?'spoken':''}>{w.word}</span>)}</div>;
};
export const MitroffReelsFinal:React.FC=()=> <AbsoluteFill className="r-production" style={{'--electric':C.blue} as React.CSSProperties}>
 <FontGate/><Audio src={staticFile('production/audio/final-mix.wav')}/>
 {Scenes.map((Scene,i)=><Sequence key={i} from={T.scenes[i].start} durationInFrames={T.scenes[i].duration}><Scene/></Sequence>)}
 <Captions/>
</AbsoluteFill>;
