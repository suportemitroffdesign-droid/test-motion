import React, {useEffect, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand as b} from '../brand';
import {timing} from '../timing';

export const ramp = (f: number, start: number, end: number, a = 0, z = 1) =>
  interpolate(f, [start, end], [a, z], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const smooth = (f: number, start: number, end: number) => {
  const p = ramp(f, start, end); return p * p * (3 - 2 * p);
};
export const bounce = (f: number, delay = 0, damping = 21) => spring({frame: f - delay, fps: 30, config: {damping, stiffness: 170, mass: .8}});
export const beat = (f: number) => Math.exp(-(f % timing.beatFrames) / 2.8);

export const FontGate: React.FC = () => {
  const [handle] = useState(() => delayRender('Loading bundled brand typography'));
  useEffect(() => {
    let active = true;
    Promise.all([
      new FontFace('Anton', `url("${staticFile('fonts/Anton-Regular.ttf')}")`).load(),
      new FontFace('Space', `url("${staticFile('fonts/SpaceGrotesk.ttf')}")`, {weight: '300 700'}).load(),
    ]).then(fonts => {
      fonts.forEach(font => (document.fonts as FontFaceSet & {add: (face: FontFace) => void}).add(font));
      if (active) continueRender(handle);
    }).catch(cancelRender);
    return () => {active = false;};
  }, [handle]);
  return null;
};

export const Grid: React.FC<{light?: boolean; spacing?: number}> = ({light = false, spacing = 108}) => (
  <AbsoluteFill style={{backgroundImage: `linear-gradient(${light ? '#0000000C' : '#FFFFFF0C'} 1px, transparent 1px), linear-gradient(90deg, ${light ? '#0000000C' : '#FFFFFF0C'} 1px, transparent 1px)`, backgroundSize: `${spacing}px ${spacing}px`}}/>
);
export const Rail: React.FC<{number: string; light?: boolean}> = ({number, light}) => (
  <div className="rail" style={{color: light ? b.background : b.foreground}}><div className="rail-mark"/><span>{number} / 06</span></div>
);
export const Cross: React.FC<{x:number;y:number;size?:number;color?:string}> = ({x,y,size=24,color=b.accent}) => <svg style={{position:'absolute',left:x,top:y}} width={size} height={size} viewBox="0 0 24 24"><path d="M0 12H24M12 0V24" stroke={color} strokeWidth="2"/></svg>;
export const Arrow: React.FC<{size?:number}> = ({size=48}) => <svg width={size} height={size} viewBox="0 0 48 48" fill="none"><path d="M8 40L40 8M8 8H40V40" stroke="currentColor" strokeWidth="3"/></svg>;

// Masked letters, physical spring, fast optical blur on the entrance.
export const KineticTitle: React.FC<{text:string;size?:number;delay?:number;color?:string;outline?:boolean;stagger?:number}> = ({text,size=238,delay=0,color=b.foreground,outline=false,stagger=1.2}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return <div className="kinetic-title" style={{fontSize:size,color,WebkitTextStroke:outline?`2px ${color}`:undefined,WebkitTextFillColor:outline?'transparent':undefined}}>
    {Array.from(text).map((letter,i) => {
      const start=delay+i*stagger;const p=spring({frame:f-start,fps,config:{damping:20,stiffness:195,mass:.65}});
      return <span className="letter-mask" key={i}><span style={{display:'inline-block',transform:`translateY(${(1-p)*size*1.1}px) rotate(${(1-p)*(i%2?8:-8)}deg)`,filter:`blur(${Math.max(0,1-p)*7}px)`}}>{letter===' '?'\u00a0':letter}</span></span>;
    })}
  </div>;
};

// Shared fast wipe between scenes. No fade to an empty black slide.
export const Wipe: React.FC<{reverse?:boolean}> = ({reverse=false}) => {
  const f=useCurrentFrame();const p=smooth(f,0,10);
  return <AbsoluteFill style={{pointerEvents:'none',zIndex:20}}>
    <div style={{position:'absolute',inset:0,background:b.accent,transform:`translateX(${(p*220-110)*(reverse?-1:1)}%) skewX(-12deg)`}}/>
    <div style={{position:'absolute',top:0,bottom:0,width:24,left:`${p*125-15}%`,background:b.foreground,transform:'skewX(-12deg)'}}/>
  </AbsoluteFill>;
};
