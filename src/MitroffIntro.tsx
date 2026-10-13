import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import {brand} from './brand';
import {timing} from './timing';
import {FontGate} from './components/Motion';
import {Portal} from './components/InterfaceMotion';
import {Opening} from './scenes/Opening';
import {Design} from './scenes/Design';
import {Video} from './scenes/Video';
import {Landing} from './scenes/Landing';
import {Positioning} from './scenes/Positioning';
import {Finale} from './scenes/Finale';
import './style.css';

// Same composition and project, refreshed visual direction. Every motion is frame based.
const scenes=[Opening,Design,Video,Landing,Positioning,Finale];
export const MitroffIntro:React.FC=()=> <AbsoluteFill className="mitroff" style={{background:brand.background,'--accent':brand.accent,'--ink':brand.background,'--paper':brand.foreground} as React.CSSProperties}>
 <FontGate/><Audio src={staticFile('audio/mitroff-master.wav')}/>
 {scenes.map((Scene,i)=><Sequence key={i} from={timing.scenes[i]} durationInFrames={(timing.scenes[i+1]??600)-timing.scenes[i]}><Scene/></Sequence>)}
 {timing.transitions.map((frame,i)=><Sequence key={frame} from={frame-8} durationInFrames={17}><Portal kind={i}/></Sequence>)}
</AbsoluteFill>;
