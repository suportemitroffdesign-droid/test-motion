"""Brazilian Portuguese male narration. Model inference at native speed, no time stretch."""
from pathlib import Path
import json,hashlib,math,re,os
import numpy as np
import onnxruntime as ort
import soundfile as sf
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[2]
MODELS=Path(os.getenv('MITROFF_MODELS',str(ROOT/'models')))
OUT=ROOT/'public'/'production'/'audio';OUT.mkdir(exist_ok=True,parents=True)
opts=ort.SessionOptions();opts.intra_op_num_threads=2;opts.inter_op_num_threads=1
opts.enable_cpu_mem_arena=True
session=ort.InferenceSession(str(MODELS/'kokoro-v1.0.onnx'),sess_options=opts,providers=['CPUExecutionProvider'])
engine=Kokoro.from_session(session,str(MODELS/'voices-v1.0.bin'))
print('Portuguese male voices:',[n for n in engine.voices.files if n.startswith('pm_')],flush=True)
script=json.loads((ROOT/'scripts'/'production'/'narration-script.json').read_text())
voice='pm_alex';sr=24000;fps=30;pieces=[];current=0;scenes=[]
# A small opening margin lets the hit and first movement precede the first syllable.
lead_frames=6
for index,item in enumerate(script):
 audio,rate,phonemes=engine.create_timed(item['text'],voice=voice,speed=1.0,lang='pt-br')
 assert rate==sr and len(audio)>sr
 sf.write(str(OUT/f"voice-{index+1}.wav"),audio,sr,subtype='PCM_16')
 audio_start=current+lead_frames
 # Leave natural visual breathing room after each paragraph.
 speech_frames=math.ceil(len(audio)/sr*fps)
 tail_frames=12 if index<4 else 64
 duration=lead_frames+speech_frames+tail_frames
 segment=np.zeros(round(duration/fps*sr),np.float32)
 offset=round(lead_frames/fps*sr);segment[offset:offset+len(audio)]=audio
 pieces.append(segment)
 groups=[];group=[]
 for phone in phonemes:
  if phone.phoneme.isspace():
   if group:groups.append(group);group=[]
  else:group.append(phone)
 if group:groups.append(group)
 words=item['text'].split()
 assert len(groups)==len(words),(item['id'],len(groups),len(words),[''.join(p.phoneme for p in g) for g in groups])
 word_cues=[{'word':word,'start':audio_start+round(g[0].start*fps),'end':audio_start+round(g[-1].end*fps)} for word,g in zip(words,groups)]
 scenes.append({**item,'words':word_cues,'start':current,'duration':duration,'speech_start':audio_start,'speech_end':audio_start+speech_frames,'speech_samples':len(audio),'speech_seconds':len(audio)/sr})
 current+=duration
 print(index+1,item['id'],round(len(audio)/sr,3),'seconds; scene',duration,'frames',flush=True)
full=np.concatenate(pieces)
sf.write(str(OUT/'narration.wav'),full,sr,subtype='PCM_16')
meta={'fps':fps,'duration_frames':current,'duration_seconds':current/fps,'voice':voice,'language':'pt-br','tts':'Kokoro-82M v1.0 / kokoro-onnx 0.6.1','speed':1.0,'time_stretch':False,'scenes':scenes,'model_files':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in MODELS.iterdir() if p.name in ['kokoro-v1.0.onnx','voices-v1.0.bin']}}
(ROOT/'src'/'production'/'voice-timing.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
(OUT/'narration-manifest.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
print('NARRATION TOTAL:',current/fps,'seconds',flush=True)
