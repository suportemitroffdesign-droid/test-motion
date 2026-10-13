"""MITROFF / original score and sound design, 48 kHz stereo.
No recordings, loops, external music or samples. Deterministic additive/FM synthesis.
Optional regeneration: Python 3.10+, numpy, scipy and FFmpeg.
"""
from pathlib import Path
import json, subprocess, re, wave
import numpy as np
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'audio'
OUT.mkdir(parents=True, exist_ok=True)
CUES = json.loads((ROOT / 'scripts' / 'audio-cues.json').read_text())
SR, DURATION = 48000, CUES['duration_frames'] / CUES['fps']
N = int(SR * DURATION)
BEAT = 60 / CUES['bpm']
rng = np.random.default_rng(20261013)
music = np.zeros((N, 2), dtype=np.float64)
sfx = np.zeros_like(music)

def note(n): return 440 * 2 ** ((n - 69) / 12)
def clock(d): return np.arange(int(SR * d)) / SR

def pan(signal, p=0):
    return np.column_stack((signal * np.sqrt((1-p)/2), signal * np.sqrt((1+p)/2)))

def add(bus, signal, start, gain=1, p=0):
    a=int(round(start*SR)); signal=pan(signal,p) if signal.ndim==1 else signal
    if a<0: signal=signal[-a:]; a=0
    count=min(len(signal), N-a)
    if count>0: bus[a:a+count]+=signal[:count]*gain

def fade_env(t, attack=.008, release=.08):
    return np.minimum(t/attack,1)*np.minimum((t[-1]-t)/release,1).clip(0)

def filtered_noise(d, freq, kind='lowpass'):
    return sosfilt(butter(2, freq, btype=kind, fs=SR, output='sos'),rng.standard_normal(int(d*SR)))

# Warm, wide chords: Dm9 / Bbmaj7 / Cadd9 / Fmaj7 / Dm9.
chords = [(0,5,[50,57,60,64,65]),(5,10/3,[46,53,57,60,62]),
          (25/3,10/3,[48,55,60,62,64]),(35/3,10/3,[41,53,57,60,64]),
          (15,2.5,[50,57,60,64,65])]
for start, length, notes in chords:
    t=clock(length+1.4)
    gate=np.minimum(t/.42,1)*np.exp(-np.maximum(t-length,0)*3.7)
    for k,n in enumerate(notes):
        freq=note(n)
        # Detuned sine/triangle-like harmonics, low in the mix.
        osc=(np.sin(2*np.pi*freq*t)+.19*np.sin(2*np.pi*freq*2*t)+.08*np.sin(2*np.pi*freq*3*t))/1.27
        other=np.sin(2*np.pi*(freq*1.0018)*t+.6)
        signal=.62*osc+.38*other
        add(music,signal*gate,start,.045,p=(k-2)*.3)

# Original FM pluck, not a sampled melody. Sparse opening -> eight-note drive.
for i in range(84):
    start=i*BEAT/2
    if start>=17.5: break
    if start<3 and i%4: continue
    if 3<=start<5 and i%2: continue
    notes=[74,77,81,84,76,81,77,72]
    shift=0 if start<5 or start>=15 else (-5 if start<25/3 else (-2 if start<35/3 else 3))
    freq=note(notes[i%len(notes)]+shift)
    t=clock(.7)
    env=(1-np.exp(-t*450))*np.exp(-t*8.5)
    fm=1.8*np.exp(-t*12)*np.sin(2*np.pi*freq*2*t)
    tone=np.sin(2*np.pi*freq*t+fm)*env
    amp=.047 if start<5 else (.065 if start<15 else .035)
    p=np.sin(i*1.7)*.5
    add(music,tone,start,amp,p)
    add(music,tone,start+.156,amp*.24,-p)
    add(music,tone,start+.312,amp*.1,p)

# Kick, sidechained sub, restrained snare/clap, and textured hats.
for i in range(42):
    start=i*BEAT
    if start>=17.5: break
    active=start>=5 or (i%2==0 and start<15)
    if active:
        t=clock(.34)
        phase=2*np.pi*(48*t+85*.028*(1-np.exp(-t/.028)))
        kick=np.sin(phase)*np.exp(-t*15)+(filtered_noise(.34,3600)*np.exp(-t*180)*.12)
        add(music,kick,start,.27 if start>=5 else .16)
    root=50 if start<5 or start>=15 else (46 if start<25/3 else (48 if start<35/3 else 41))
    if start>=3 and (start<15 or i%2==0):
        t=clock(.39);freq=note(root-12)
        bass=(np.sin(2*np.pi*freq*t)+.18*np.sin(2*np.pi*freq*2*t))
        bass*=np.minimum(t/.025,1)*np.minimum((.39-t)/.08,1)
        bass*=.25+.75*(1-np.exp(-t*12))
        add(music,bass,start+.015,.17)
    if start>=5 and start<15 and i%2==1:
        t=clock(.22)
        noise=filtered_noise(.22,1400,'highpass')
        clap=noise*np.exp(-t*32)*(.4+.6*np.sin(t*800)**2)
        snare=np.sin(2*np.pi*178*t)*np.exp(-t*32)*.15
        add(music,clap+snare,start,.08,p=.08)
    if 3<=start<17.5:
        for off in [0,.5]:
            t=clock(.09)
            hat=filtered_noise(.09,6500,'highpass')*np.exp(-t*65)
            add(music,hat,start+off*BEAT,.045 if start>=5 else .022,p=-.25 if off else .3)

# Frame-exact sound design.
def impact(frame,gain=.24):
    t=clock(.6)
    tone=np.sin(2*np.pi*(62*t+50*.032*(1-np.exp(-t/.032))))*np.exp(-t*13)
    click=filtered_noise(.6,2200)*np.exp(-t*110)*.18
    add(sfx,tone+click,frame/30,gain)

for frame in CUES['transitions']:
    t=clock(.52)
    # Smooth, band-limited stereo air sweep; peak sits precisely at the cut.
    x=filtered_noise(.52,[600,7000],'bandpass')
    env=np.sin(np.pi*np.arange(len(t))/len(t))**2
    mod=.5+.5*np.sin(2*np.pi*(120*t+1700*t*t))
    swoosh=x*env*mod
    add(sfx,swoosh,frame/30-.26,.13,p=-.45)
    add(sfx,swoosh,frame/30-.23,.095,p=.45)
for f in CUES['title_impacts']: impact(f)
impact(CUES['logo_reveal'],.3)
for j,f in enumerate(CUES['word_entries']):
    t=clock(.12)
    sound=np.sin(2*np.pi*note(69+j%3*3)*t+np.sin(2*np.pi*1800*t)*np.exp(-t*65))*np.exp(-t*45)
    add(sfx,sound,f/30,.08,p=(j%3-1)*.2)
for family in ['design_details','video_cuts','web_details']:
    for i,f in enumerate(CUES[family]):
        t=clock(.18);freq=note(79+[0,3,7,10][i%4])
        sound=(np.sin(2*np.pi*freq*t+1.3*np.sin(2*np.pi*freq*2*t)*np.exp(-t*30))*.7+filtered_noise(.18,5000)*.15)
        sound*=np.minimum(t/.004,1)*np.exp(-t*30)
        add(sfx,sound,f/30,.055,p=(i%3-1)*.4)
# Logo bloom and a resolved minor ninth tail, with no new attacks after 17.5 s.
for frame in [CUES['logo_reveal'],CUES['resolution']]:
    t=clock(2.5); env=(1-np.exp(-t*30))*np.exp(-t*2.7)
    for k,n in enumerate([62,69,72,76]):
        tone=np.sin(2*np.pi*note(n)*t+.2*np.sin(2*np.pi*note(n)*2*t))*env
        add(sfx,tone,frame/30,.034,p=(k-1.5)*.3)

# Short stereo room/delay; tails end smoothly within the 600-frame composition.
for bus in [music,sfx]:
    dry=bus.copy()
    for delay,amount in [(.083,.1),(.167,.08),(.251,.045)]:
        shift=int(delay*SR);bus[shift:]+=dry[:-shift,::-1]*amount
    t=np.arange(N)/SR
    tail=np.minimum((DURATION-t)/.8,1).clip(0)
    head=np.minimum(t/.02,1)
    bus*= (tail*head)[:,None]

def wav(path,signal):
    signal=np.clip(signal,-.999,.999)
    with wave.open(str(path),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
        w.writeframes(np.rint(signal*32767).astype('<i2').tobytes())

wav(OUT/'music.wav',music)
wav(OUT/'sfx.wav',sfx)
mix=music+sfx
peak=np.max(np.abs(mix));mix*=min(1,.88/peak)
wav(OUT/'mix-premaster.wav',mix)
# Trusted FFmpeg loudness normalization: -16 LUFS integrated, -1.5 dBTP ceiling.
measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(OUT/'mix-premaster.wav'),'-af',
 'loudnorm=I=-16:TP=-1.5:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
stats=json.loads(re.findall(r'\{\s*"input_i".*?\}',measure.stderr,re.S)[-1])
settings=(f"loudnorm=I=-16:TP=-1.5:LRA=8:measured_I={stats['input_i']}:"
 f"measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:"
 f"measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true")
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(OUT/'mix-premaster.wav'),
 '-af',settings,'-ar',str(SR),'-c:a','pcm_s16le',str(OUT/'mitroff-master.wav')],check=True)
(OUT/'mix-premaster.wav').unlink()
(OUT/'audio-analysis.json').write_text(json.dumps({'sample_rate':SR,'duration':DURATION,
 'bpm':CUES['bpm'],'normalization_target_lufs':-16,'true_peak_ceiling_dbtp':-1.5,
 'premaster':stats,'method':'procedural FM/additive/noise synthesis; no third-party samples'},indent=2))
print('Score, SFX stems and normalized master written:',OUT)
