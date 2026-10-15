import React from 'react';
import {useCurrentFrame,Img,staticFile} from 'remotion';
import {C,Product,S,E} from './engine';

export const Offer:React.FC<{progress?:number;explosion?:number;frame?:number;mini?:boolean;variant?:number}> = ({progress=1,explosion=0,frame,mini=false,variant=0})=>{
 const actual=useCurrentFrame();const f=frame??actual;const q=progress;
 const pose=(i:number,a:[number,number],b:[number,number],rot=0):React.CSSProperties=>({position:'absolute',left:a[0]+(b[0]-a[0])*q,top:a[1]+(b[1]-a[1])*q,transform:`translateZ(${explosion*(70+i*32)}px) rotateY(${explosion*(i%2?9:-9)}deg) rotateZ(${rot*(1-q)+Math.sin(f/42+i)*explosion*1.6}deg)`,filter:`drop-shadow(0 ${explosion*(12+i*2)}px ${explosion*18}px #00000033)`});
 return <div className={`r-offer ${mini?'mini':''}`} style={{background:variant%2?'#F3F6FA':'#FFFFFF'}}>
  <div className="r-offer-wash" style={{opacity:.2+.8*q}}/>
  <div className="r-offer-label">ANÚNCIO FICTÍCIO · ESTUDO DE REDESIGN</div>
  <div className="r-offer-promo" style={pose(0,[430,470],[472,45],-13)}>OFERTA</div>
  <div className="r-offer-title" style={{...pose(1,[50,405],[44,116],8),fontSize:58+q*9,width:640,color:q>.5?C.black:C.blue}}>SOM SEM FIO.</div>
  <div className="r-offer-product" style={pose(2,[190,135],[135,217],-7)}><Product frame={f}/></div>
  <div className="r-offer-price" style={{...pose(3,[45,205],[44,674],-8),fontSize:79-q*3}}>R$ 249<span>,90</span></div>
  <div className="r-offer-spec" style={pose(4,[38,90],[44,612],6)}>Fone Bluetooth<br/><span>Conforto para acompanhar seu ritmo.</span></div>
  <div className="r-offer-button" style={{...pose(5,[180,715],[44,796],-5),width:350+q*282,transform:`${pose(5,[180,715],[44,796],-5).transform} scale(${1+E(f%60,0,8,.015,0)*q})`}}>QUERO VER <svg width="28" height="28" viewBox="0 0 32 32"><path d="M6 26L26 6M6 6H26V26" fill="none" stroke="currentColor" strokeWidth="3"/></svg></div>
  <div className="r-offer-bottom">Produto e preço ilustrativos. Sem vínculo com cliente real.</div>
 </div>;
};
export const SocialCard:React.FC<{frame:number;clear?:number;variant?:number}> = ({frame,clear=0,variant=0})=><div className="r-social-card"><div className="r-social-nav"><Img src={staticFile('production/icons/instagram.svg')}/><div><strong>anúncio.exemplo</strong><span>Estudo fictício</span></div><i/></div><div className="r-social-content"><Offer frame={frame} progress={clear} variant={variant}/></div><div className="r-social-footer"><svg width="28" height="28" viewBox="0 0 64 64"><path d="M32 53L10 32C-3 15 17 4 32 20C47 4 67 15 54 32Z" fill="none" stroke="currentColor" strokeWidth="4"/></svg><span/><i/></div></div>;
