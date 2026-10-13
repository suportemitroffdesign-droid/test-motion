import React from 'react';
import {Img,staticFile,useCurrentFrame} from 'remotion';
import {brand as b} from '../brand';
import {bounce,ramp,smooth} from './Motion';

export const drift=(f:number,seed=0,amount=1)=>({x:Math.sin(f/25+seed)*9*amount,y:Math.sin(f/21+seed*1.7)*12*amount,rx:Math.sin(f/34+seed)*2.5*amount,ry:Math.cos(f/39+seed)*4*amount});

export const Float:React.FC<{children:React.ReactNode;x:number;y:number;width?:number;delay?:number;seed?:number;z?:number;rotate?:number;exit?:number}> = ({children,x,y,width,delay=0,seed=0,z=0,rotate=0,exit=0})=>{
 const f=useCurrentFrame();const d=drift(f,seed);const p=bounce(f,delay,25);
 return <div className="float-layer" style={{left:x+d.x,top:y+d.y,width,zIndex:z,opacity:ramp(f,delay,delay+8)*(1-exit),transform:`perspective(1800px) translateY(${(1-p)*100-exit*180}px) translateZ(${z*8}px) rotateX(${d.rx+(1-p)*12}deg) rotateY(${d.ry+(1-p)*-12}deg) rotateZ(${rotate+Math.sin(f/43+seed)*1.5}deg) scale(${.93+p*.07+exit*.25})`,filter:`blur(${(1-p)*4+exit*7}px)`}}>{children}</div>;
};
export const StageTitle:React.FC<{text:string;light?:boolean;size?:number;delay?:number}> = ({text,light=false,size=146,delay=0})=>{
 const f=useCurrentFrame();const p=bounce(f,delay,26);
 return <div className="stage-title" style={{color:light?b.foreground:b.background,fontSize:size,transform:`translate(-50%,-50%) translateY(${(1-p)*70}px) scale(${.97+p*.03})`,opacity:ramp(f,delay,delay+10),filter:`blur(${(1-p)*7}px)`}}>{text}</div>;
};
export const Cursor:React.FC<{x:number;y:number;click?:number;light?:boolean;opacity?:number}> = ({x,y,click=0,light=false,opacity=1})=><div className="cursor" style={{left:x,top:y,opacity,transform:`scale(${1-click*.18})`}}><svg width="48" height="58" viewBox="0 0 48 58"><path d="M7 5L38 36L24 37L32 51L24 56L17 41L7 51Z" fill={light?'#FFFFFF':b.background} stroke={light?b.background:'#FFFFFF'} strokeWidth="3"/></svg><div style={{opacity:click,borderColor:b.accent,transform:`translate(-50%,-50%) scale(${1+click*.7})`}}/></div>;
export const Trace:React.FC<{f:number;start?:number;end?:number;path:string;viewBox?:string;className?:string}> = ({f,start=0,end=30,path,viewBox='0 0 1080 1920',className})=><svg className={className??'traced-line'} viewBox={viewBox} preserveAspectRatio="none"><path d={path} fill="none" stroke={b.accent} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-smooth(f,start,end)} strokeLinecap="round"/></svg>;
export const OriginalLogo:React.FC<{reveal?:number;white?:boolean;className?:string}> = ({reveal=1,white=false,className=''})=><div className={`brand-image ${className}`} style={{clipPath:`inset(0 ${(1-reveal)*100}% 0 0)`,background:white?'#FFFFFF':undefined}}><Img className="original-png" src={staticFile(b.logo)}/></div>;
export const Art:React.FC<{f:number;variant?:number}> = ({f,variant=0})=><div className={`original-art art-${variant}`}><div className="art-disc" style={{transform:`translate(-50%,-50%) rotate(${f*.38+variant*38}deg)`}}/><div className="art-arc" style={{transform:`rotate(${f*.44+variant*24}deg)`}}/><div className="art-caption">{['FORMA','IDEIA','AÇÃO'][variant%3]}</div></div>;
export const SoftBackdrop:React.FC<{dark?:boolean}> = ({dark=false})=>{
 const f=useCurrentFrame();return <div className={`soft-backdrop ${dark?'dark':''}`}><div style={{transform:`translate(${Math.sin(f/45)*45}px,${Math.cos(f/37)*30}px)`}}/></div>;
};

export const Portal:React.FC<{kind:number}> = ({kind})=>{
 const f=useCurrentFrame();const inout=Math.sin(Math.PI*smooth(f,0,16));const p=smooth(f,0,16);
 return <div className="continuity-portal" style={{opacity:inout*.96,transform:`translate(-50%,-50%) perspective(1800px) rotateY(${(1-p)*-9}deg) scale(${.9+inout*1.15})`,filter:`blur(${inout*2}px)`,borderRadius:28+inout*55}}>{kind===1||kind===2?<Art f={f} variant={kind===1?0:1}/>:<div className="portal-interface"><i/><span/><span/></div>}</div>;
};
