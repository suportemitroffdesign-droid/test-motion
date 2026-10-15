import React from 'react';
import {Img,staticFile,useCurrentFrame,spring,interpolate} from 'remotion';
import timing from './voice-timing.json';
import palette from './palette.json';
export const C=palette;
export const E=(f:number,a:number,b:number,x=0,y=1)=>interpolate(f,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const S=(f:number,a:number,b:number)=>{const t=E(f,a,b);return t*t*(3-2*t);};
export const P=(f:number,delay=0)=>spring({frame:f-delay,fps:30,config:{damping:24,stiffness:175,mass:.8}});
export const drift=(f:number,i=0)=>({x:Math.sin(f/35+i)*9,y:Math.sin(f/29+i*1.4)*12,ry:Math.cos(f/44+i)*4,rx:Math.sin(f/37+i)*3});
export const wordCue=(index:number,word:string)=>{const scene=timing.scenes[index];const found=scene.words.find(w=>w.word.toLocaleLowerCase().replace(/[^a-záéíóúãõâêôç]/g,'')===word.toLowerCase());return found?found.start-scene.start:0;};
export const Sprite:React.FC<{folder:string;position:number;count:number;style?:React.CSSProperties}> = ({folder,position,count,style})=>{
 const clamped=Math.max(0,Math.min(count-1,position)),low=Math.floor(clamped),high=Math.min(count-1,low+1),fraction=clamped-low;
 return <div style={{position:'relative',width:'100%',height:'100%',isolation:'isolate',...style}}>{[low,high].map((i,j)=><Img key={j} src={staticFile(`production/${folder}/${String(i).padStart(2,'0')}.png`)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',opacity:j===0?1-fraction:fraction,mixBlendMode:'plus-lighter'}}/>)}</div>;
};
export const Product:React.FC<{frame:number;style?:React.CSSProperties}> = ({frame,style})=><Sprite folder="product" position={11.5+Math.sin(frame/43)*11.4} count={24} style={style}/>;
export const Phone:React.FC<{frame:number;style?:React.CSSProperties}> = ({frame,style})=><Sprite folder="phone" position={8.5+Math.sin(frame/51)*8.4} count={18} style={style}/>;
export const Bubble:React.FC<{frame:number}> = ({frame})=><Sprite folder="comment" position={4.5+Math.sin(frame/25)*4.4} count={10}/>;
export const Float:React.FC<{children:React.ReactNode;x:number;y:number;width?:number;delay?:number;seed?:number;rotate?:number;style?:React.CSSProperties}> = ({children,x,y,width,delay=0,seed=0,rotate=0,style})=>{
 const f=useCurrentFrame(),d=drift(f,seed),p=P(f,delay);
 return <div style={{position:'absolute',left:x+d.x,top:y+d.y,width,opacity:E(f,delay,delay+7),transform:`perspective(1600px) translateY(${(1-p)*120}px) rotateX(${d.rx+(1-p)*12}deg) rotateY(${d.ry+(1-p)*-10}deg) rotateZ(${rotate+Math.sin(f/48+seed)*1.2}deg)`,...style}}>{children}</div>;
};
export const Headline:React.FC<{text:string;size?:number;delay?:number;color?:string}> = ({text,size=126,delay=0,color=C.white})=>{
 const f=useCurrentFrame();return <div className="r-headline" style={{fontSize:size,color}}>{text.split(' ').map((w,i)=>{const p=P(f,delay+i*3);return <span className="r-word-mask" key={i}><span style={{transform:`translateY(${(1-p)*120}%) rotate(${(1-p)*(i%2?4:-4)}deg)`,filter:`blur(${Math.max(0,1-p)*7}px)`}}>{w}</span></span>;})}</div>;
};
export const Icon:React.FC<{type:'eye'|'heart'|'cursor'|'comment'|'arrow';size?:number}> = ({type,size=70})=><svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">{type==='eye'?<><path d="M5 32S15 15 32 15S59 32 59 32S49 49 32 49S5 32 5 32Z" stroke="currentColor" strokeWidth="4"/><circle cx="32" cy="32" r="9" stroke="currentColor" strokeWidth="4"/></>:type==='heart'?<path d="M32 53L10 32C-3 15 17 4 32 20C47 4 67 15 54 32Z" fill="currentColor"/>:type==='cursor'?<path d="M12 6L53 40L34 42L43 57L34 62L25 46L12 59Z" fill="currentColor"/>:type==='comment'?<path d="M12 9H52Q59 9 59 17V43Q59 51 51 51H28L12 60V51Q5 51 5 43V17Q5 9 12 9Z" stroke="currentColor" strokeWidth="4"/>:<path d="M12 52L52 12M12 12H52V52" stroke="currentColor" strokeWidth="4"/>}</svg>;
export const Pointer:React.FC<{x:number;y:number;click?:number;opacity?:number}> = ({x,y,click=0,opacity=1})=><div className="r-pointer" style={{left:x,top:y,opacity,transform:`scale(${1-click*.15})`}}><svg width="52" height="62" viewBox="0 0 52 62"><path d="M6 4L43 40L27 42L37 57L27 61L18 45L6 58Z" fill="white" stroke="#080808" strokeWidth="3"/></svg><i style={{opacity:click,transform:`scale(${1+click})`}}/></div>;
export const Logo:React.FC<{progress?:number}> = ({progress=1})=><div className="r-logo" style={{clipPath:`inset(0 ${(1-progress)*100}% 0 0)`}}><Img src={staticFile('logo mitroff3.png')}/></div>;
