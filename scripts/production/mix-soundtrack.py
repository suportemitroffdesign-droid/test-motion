"""Original electronic score, interface sound design and narration-first stereo mix."""
from pathlib import Path
import json,re,subprocess,wave
import numpy as np
from scipy.signal import butter,sosfilt,lfilter
from scipy.ndimage import uniform_filter1d,maximum_filter1d
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'public'/'production'/'audio'
T=json.loads((ROOT/'src'/'production'/'voice-timing.json').read_text());SR=48000;FPS=T['fps'];D=T['duration_frames']/FPS;N=round(D*SR);B=60/132
rng=np.random.default_rng(751940);music=np.zeros((N,2));sfx=np.zeros_like(music)
def time(d):return np.arange(round(d*SR))/SR
def hz(n):return 440*2**((n-69)/12)
def noise(d,cut,kind='lowpass'):return sosfilt(butter(2,cut,btype=kind,fs=SR,output='sos'),rng.standard_normal(round(d*SR)))
def add(bus,x,at,gain=1,pan=0):
 start=round(at*SR)
 if x.ndim==1:x=np.column_stack((x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)))
 if start<0:x=x[-start:];start=0
 count=min(len(x),N-start)
 if count>0:bus[start:start+count]+=x[:count]*gain

def cue(scene,word):
 for w in T['scenes'][scene]['words']:
  if re.sub(r'[^\w]','',w['word']).lower()==word:return w['start']
 return T['scenes'][scene]['start']
def root(at):return [40,36,43,38,40][max(i for i,s in enumerate(T['scenes']) if at>=s['start']/FPS)]
voice_end=T['scenes'][-1]['speech_end']/FPS
for i in range(int(D/B)+1):
 at=i*B
 if at>voice_end+.28:break
 t=time(.34);phase=2*np.pi*(48*t+95*.025*(1-np.exp(-t/.025)))
 add(music,(np.sin(phase)*np.exp(-t*16)+noise(.34,4500)*np.exp(-t*240)*.1),at,.34)
 if i%2:
  t=time(.17);add(music,(noise(.17,[1100,8500],'bandpass')+np.sin(2*np.pi*185*t)*.16)*np.exp(-t*32),at,.15,pan=.05)
 for off in [.25,.5,.75]:
  t=time(.08);add(music,noise(.08,6500,'highpass')*np.exp(-t*70),at+off*B,.035 if off!=.5 else .065,pan=-.3 if off==.25 else .3)
 for off in [0,.5,.75 if i%4==3 else .5]:
  t=time(.21);freq=hz(root(at)+(12 if off==.75 else 0))
  bass=(np.sin(2*np.pi*freq*t)+.25*np.sin(4*np.pi*freq*t)+.08*np.sin(6*np.pi*freq*t))*(1-np.exp(-t*200))*np.exp(-t*8)
  add(music,np.tanh(bass),at+off*B+.012,.2)
 # Short, restrained chord pulses and lead motif; no stock loops.
 if i%2==0:
  for k,interval in enumerate([12,19,22,26]):
   t=time(.32);freq=hz(root(at)+interval);env=(1-np.exp(-t*240))*np.exp(-t*12)
   osc=(np.sin(2*np.pi*freq*t)+.24*np.sin(2*np.pi*freq*2*t)+.10*np.sin(2*np.pi*freq*3*t))*env
   add(music,osc,at+B*.5,.055,pan=(k-1.5)*.3)
 if i%4 in [0,2,3]:
  t=time(.28);freq=hz([76,79,83,86,81,79,74,71][i%8]);env=(1-np.exp(-t*300))*np.exp(-t*16)
  x=np.sin(2*np.pi*freq*t+np.sin(2*np.pi*freq*2*t)*np.exp(-t*20))*env
  add(music,x,at+B*.75,.055,pan=.45);add(music,x,at+B*1.5,.012,pan=-.45)

def hit(frame,gain=.20):
 t=time(.45);x=np.sin(2*np.pi*(53*t+74*.025*(1-np.exp(-t/.025))))*np.exp(-t*17)
 x+=noise(.45,3200)*np.exp(-t*120)*.14;add(sfx,x,frame/FPS,gain)
def whoosh(frame):
 t=time(.42);x=noise(.42,[700,6500],'bandpass')*np.sin(np.pi*np.arange(len(t))/len(t))**2
 add(sfx,x,frame/FPS-.24,.15,-.35);add(sfx,x,frame/FPS-.21,.10,.35)
events=[0,cue(0,'perder'),cue(1,'feio'),cue(1,'ninguém'),cue(2,'entender'),cue(2,'desejar'),cue(2,'agir'),cue(3,'hierarquia'),cue(3,'oferta'),cue(3,'transforma'),cue(4,'comunicando'),cue(4,'ocupando')]
for f in events:hit(f,.29 if f in [0,cue(0,'perder')] else .17)
for scene in T['scenes'][1:]:whoosh(scene['start'])
for f in [cue(0,'perder')-3,cue(3,'hierarquia'),cue(3,'transforma')]:whoosh(f)
for scene in T['scenes']:
 for j,w in enumerate(scene['words']):
  if j%4:continue
  t=time(.075);x=np.sin(2*np.pi*hz(80+j%4*2)*t)*np.exp(-t*65)
  add(sfx,x,w['start']/FPS,.035,pan=(j%3-1)*.3)
# Interface click when the final action and redesign CTA become clear.
for frame in [cue(2,'agir')+4,cue(3,'oferta'),cue(4,'ocupando')-12]:
 t=time(.05);x=noise(.05,[1700,9000],'bandpass')*np.exp(-t*140);add(sfx,x,frame/FPS,.10)
# A small, controlled digital stutter for the confused interface.
for frame in [cue(1,'ninguém')-2,cue(1,'ninguém')+2]:
 t=time(.06);x=noise(.06,4300)*np.exp(-t*60)*np.sin(2*np.pi*140*t);add(sfx,x,frame/FPS,.07)
logo=T['scenes'][-1]['speech_end']+9;hit(logo,.2)
for frame in [logo,T['duration_frames']-32]:
 for k,n in enumerate([52,59,62,66]):
  t=time(1.6);x=np.sin(2*np.pi*hz(n)*t)*(1-np.exp(-t*50))*np.exp(-t*3.4);add(music,x,frame/FPS,.06,pan=(k-1.5)*.3)

# Normalize and gently compress voice with no speed/pitch change.
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(OUT/'narration.wav'),'-af','highpass=f=75,lowpass=f=11000,acompressor=threshold=0.16:ratio=2:attack=12:release=130:makeup=1.2,loudnorm=I=-16:TP=-2:LRA=7','-ar','48000','-ac','2','-c:a','pcm_s16le',str(OUT/'voice-mixed.wav')],check=True)
from scipy.io import wavfile
sr,voice=wavfile.read(OUT/'voice-mixed.wav');voice=voice.astype(float)/32768
assert sr==SR and voice.shape==(N,2)
env=np.sqrt(uniform_filter1d((voice**2).mean(axis=1),size=2400))
activity=maximum_filter1d((env>.013).astype(float),size=7201)
# Anticipatory ducking; raise the bed in pauses, keep speech dominant.
duck=.43-.27*activity
alpha=np.exp(-1/(SR*.045));duck=lfilter([1-alpha],[1,-alpha],duck)
music*=.18/max(1e-9,np.sqrt(np.mean(music**2)));music*=duck[:,None]
sfx*=.7
fade=np.minimum((D-np.arange(N)/SR)/.42,1).clip(0)
music*=fade[:,None];sfx*=fade[:,None]
active=env>.02
voice_rms=float(np.sqrt(np.mean(voice[active]**2)));music_rms=float(np.sqrt(np.mean(music[active]**2)))
if music_rms>voice_rms/5.2:music*=voice_rms/5.2/music_rms
ratio=20*np.log10(np.sqrt(np.mean(voice[active]**2))/np.sqrt(np.mean(music[active]**2)))
assert ratio>=14

def write(path,x):
 with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(np.rint(np.clip(x,-.999,.999)*32767).astype('<i2').tobytes())
write(OUT/'music-bed.wav',music);write(OUT/'sound-design.wav',sfx)
combined=voice+music+sfx;combined*=min(1,.9/np.max(np.abs(combined)));write(OUT/'premaster.wav',combined)
first=subprocess.run(['ffmpeg','-hide_banner','-i',str(OUT/'premaster.wav'),'-af','loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
measured=json.loads(re.findall(r'\{\s*"input_i".*?\}',first.stderr,re.S)[-1]);filt=f"loudnorm=I=-14:TP=-1.5:LRA=7:measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:offset={measured['target_offset']}:linear=true"
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(OUT/'premaster.wav'),'-af',filt,'-ar','48000','-c:a','pcm_s16le',str(OUT/'final-mix.wav')],check=True)
(OUT/'premaster.wav').unlink()
report={'fps':FPS,'duration_frames':T['duration_frames'],'duration_seconds':D,'bpm':132,'voice_model':'Kokoro-82M v1.0, pm_alex, pt-br, native speed 1.0','voice_over_music_db_during_speech':float(ratio),'target_lufs':-14,'target_true_peak':-1.5,'events':events,'logo_hit':logo,'master_measurement':measured,'third_party_music_samples':False}
(OUT/'mix-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
