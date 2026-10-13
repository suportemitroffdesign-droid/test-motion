"""MITROFF V3 / 120 BPM electronic score + frame-accurate sound design.
Original procedural oscillators, filtered noise and FM. No third-party audio.
Optional regeneration: Python + numpy + scipy + FFmpeg. WAVs are bundled.
"""
from pathlib import Path
import json, subprocess, re, wave
import numpy as np
from scipy.signal import butter, sosfilt
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'audio';OUT.mkdir(exist_ok=True,parents=True)
C=json.loads((ROOT/'scripts'/'audio-cues.json').read_text())
SR=48000;D=C['duration_frames']/C['fps'];N=int(SR*D);B=60/C['bpm']
rng=np.random.default_rng(431906)
music=np.zeros((N,2));sfx=np.zeros_like(music)
def freq(m):return 440*2**((m-69)/12)
def time(d):return np.arange(round(SR*d))/SR
def add(bus,x,start,gain=1,pan=0):
 a=round(start*SR)
 if x.ndim==1:x=np.column_stack((x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)))
 if a<0:x=x[-a:];a=0
 length=min(len(x),N-a)
 if length>0:bus[a:a+length]+=x[:length]*gain
def noise(d,cut,kind='lowpass'):
 return sosfilt(butter(2,cut,btype=kind,fs=SR,output='sos'),rng.standard_normal(round(d*SR)))
def envelope(t,attack=.004,release=.035):
 return np.minimum(t/attack,1)*np.minimum((t[-1]-t)/release,1).clip(0)
def saw(t,hz,harmonics=7):
 return sum(np.sin(2*np.pi*hz*k*t)/k for k in range(1,harmonics+1))/1.8

# Syncopated D-minor groove. The chord sequence follows the six cuts.
sections=[(0,3,[45,52,55,59]),(3,4,[41,48,52,55]),
 (7,4,[48,55,59,62]),(11,4,[43,50,55,57]),
 (15,3,[41,48,52,55]),(18,2,[45,52,55,59])]
def chord_at(t):return next(notes for start,length,notes in reversed(sections) if t>=start)
# Tight chord stabs: a rhythmic, slightly detuned supersaw, never a calm pad bed.
for i in range(38):
 start=i*B
 if start>=19:break
 offsets=[0,.75] if i%2==0 else [.5]
 for off in offsets:
  at=start+off*B
  if at>=19:continue
  t=time(.32);gate=(1-np.exp(-t*240))*np.exp(-t*12)*envelope(t)
  for k,m in enumerate(chord_at(at)):
   hz=freq(m+12)
   x=.6*saw(t,hz,5)+.4*saw(t,hz*1.003,5)
   add(music,x*gate,at,.052 if at<7 else .067,pan=(k-1.5)*.35)
   add(music,x*gate,at+B*.75,.011,pan=-(k-1.5)*.35)

# Driving offbeat bass with pitch attack and audible midrange body.
for i in range(76):
 start=i*B/2
 if start>=19:break
 m=chord_at(start)[0]-12+(12 if i%8==7 else 0)
 t=time(.195);hz=freq(m)
 phase=2*np.pi*hz*(t+.0018*(1-np.exp(-t*80)))
 x=np.sin(phase)+.3*np.sin(phase*2)+.11*np.sin(phase*3)
 env=envelope(t,.005,.035)*np.exp(-t*3)
 # Duck the downbeat and let the offbeat push forward.
 gain=.14 if i%2==0 else .245
 add(music,np.tanh(x*1.15)*env,start+.014,gain)

# Kick, dry snare/clap and offbeat hats. Beat is already present at the opening.
for i in range(38):
 at=i*B
 if at>=19:break
 t=time(.32);phase=2*np.pi*(49*t+100*.025*(1-np.exp(-t/.025)))
 kick=np.sin(phase)*np.exp(-t*15)+noise(.32,4600)*np.exp(-t*250)*.18
 add(music,kick,at,.43 if at<18 else .34)
 if i%2==1:
  t=time(.18)
  clap=noise(.18,[1100,9000],'bandpass')*np.exp(-t*34)
  body=np.sin(2*np.pi*180*t)*np.exp(-t*29)*.22
  add(music,clap+body,at,.19 if at>=3 else .12,pan=.05)
 for off in [0,.5]:
  t=time(.115 if off else .05)
  hh=noise(t[-1]+1/SR,7000,'highpass')*np.exp(-t*(42 if off else 95))
  add(music,hh,at+off*B,.068 if off else .042,pan=.3 if off else -.2)
 # Sparse sixteenth fills at scene boundaries, not busy all the time.
 if i in [5,13,21,29,35]:
  for off in [.5,.75]:
   t=time(.075);x=noise(.075,2500,'highpass')*np.exp(-t*48)
   add(music,x,at+off*B,.095,pan=off-.6)

# Bright rhythmic lead: short FM accents with ping-pong delay, builds from scene 2.
melody=[81,76,79,84,83,79,76,72]
for i in range(76):
 at=i*B/2
 if at>=19:break
 if at<3 and i%4:continue
 if i%8 in [2,6]:continue
 m=melody[i%8]+(-5 if 2.4<=at<7 or 12<=at<18 else 0)
 hz=freq(m);t=time(.45)
 env=(1-np.exp(-t*400))*np.exp(-t*14)
 x=np.sin(2*np.pi*hz*t+2.1*np.exp(-t*25)*np.sin(2*np.pi*hz*2*t))*env
 level=.065 if at<7 else .09
 p=.45 if i%2 else -.45
 add(music,x,at,level,p);add(music,x,at+B*.75,level*.24,-p)

# Frame accurate impacts, stereo whooshes, tiny digital ticks.
def hit(frame,level=.25):
 t=time(.4);phase=2*np.pi*(55*t+75*.025*(1-np.exp(-t/.025)))
 x=np.sin(phase)*np.exp(-t*19)+noise(.4,3800)*np.exp(-t*130)*.2
 add(sfx,x,frame/30,level)
for f in C['title_impacts']:hit(f,.3 if f in [0,C['logo_reveal']] else .24)
for frame in C['transitions']:
 t=time(.4);env=np.sin(np.pi*np.arange(len(t))/len(t))**2
 x=noise(.4,[850,8500],'bandpass')*env
 add(sfx,x,frame/30-.2,.19,-.4);add(sfx,x,frame/30-.18,.12,.4)
for family in ['word_entries','design_details','video_cuts','web_details']:
 for i,f in enumerate(C[family]):
  t=time(.095);hz=freq(79+[0,3,7][i%3])
  x=np.sin(2*np.pi*hz*t+np.sin(2*np.pi*hz*3*t))*np.exp(-t*50)
  add(sfx,x,f/30,.037 if family=='word_entries' else .06,pan=(i%3-1)*.4)
# Risers carry the ear through major sections without excessive impact noise.
for end in [7,15,18]:
 t=time(.65);env=(t/.65)**2*(1-t/.65)**.25
 x=noise(.65,[1000,7000],'bandpass')*env
 add(sfx,x,end-.65,.14)
# Strong final logo bloom, then an intentional resolved chord with a clean tail.
for frame,amp in [(C['logo_reveal'],.045),(C['resolution'],.075)]:
 t=time(2.0);env=(1-np.exp(-t*60))*np.exp(-t*3.5)
 for k,m in enumerate([62,69,72,76]):
  x=(np.sin(2*np.pi*freq(m)*t)+.15*np.sin(2*np.pi*freq(m)*2*t))*env
  add(sfx,x,frame/30,amp,pan=(k-1.5)*.3)

# Short room on FX; modest stereo delays. No long washed-out reverb.
for bus in [music,sfx]:
 dry=bus.copy()
 for delay,gain in [(.073,.035),(.15,.025),(.24,.014)]:
  shift=round(delay*SR);bus[shift:]+=dry[:-shift,::-1]*gain
 t=np.arange(N)/SR
 bus*=np.minimum(t/.004,1)[:,None]*np.minimum((D-t)/.55,1).clip(0)[:,None]
 bus[:]=np.tanh(bus*1.15)/1.15

def write(path,x):
 with wave.open(str(path),'wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
  w.writeframes(np.rint(np.clip(x,-.999,.999)*32767).astype('<i2').tobytes())
write(OUT/'music.wav',music);write(OUT/'sfx.wav',sfx)
mix=music+sfx;mix*=min(1,.85/np.max(np.abs(mix)));write(OUT/'mix-premaster.wav',mix)
result=subprocess.run(['ffmpeg','-hide_banner','-i',str(OUT/'mix-premaster.wav'),'-af','loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
measured=json.loads(re.findall(r'\{\s*"input_i".*?\}',result.stderr,re.S)[-1])
filt=(f"loudnorm=I=-14:TP=-1.5:LRA=7:measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:offset={measured['target_offset']}:linear=true")
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(OUT/'mix-premaster.wav'),'-af',filt,'-ar','48000','-c:a','pcm_s16le',str(OUT/'mitroff-master.wav')],check=True)
(OUT/'mix-premaster.wav').unlink()
(OUT/'audio-analysis.json').write_text(json.dumps({'version':3,'bpm':C['bpm'],'sample_rate':SR,'duration':D,'target_lufs':-14,'true_peak_ceiling_dbtp':-1.5,'premaster':measured,'method':'Original procedural synthesis; no external samples'},indent=2))
print('V3 original score + SFX generated: 120 BPM, 48 kHz stereo.')
