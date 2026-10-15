"""Independent local ASR of generated narration; no transcript is supplied to the recognizer."""
from pathlib import Path
import json,re,unicodedata,subprocess,os,argparse
import numpy as np,soundfile as sf
import sherpa_onnx
ROOT=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser();parser.add_argument('--mixed',action='store_true');args=parser.parse_args()
MODEL=Path(os.getenv('MITROFF_MODELS',str(ROOT/'models')))/'sherpa-onnx-whisper-base'
recognizer=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=str(MODEL/'base-encoder.int8.onnx'),decoder=str(MODEL/'base-decoder.int8.onnx'),tokens=str(MODEL/'base-tokens.txt'),language='pt',task='transcribe',num_threads=2,enable_token_timestamps=True)
script=json.loads((ROOT/'scripts'/'production'/'narration-script.json').read_text());results=[]
timing=json.loads((ROOT/'src/production/voice-timing.json').read_text())
def normalized(s):return re.findall(r'\w+',unicodedata.normalize('NFKD',s.lower()).encode('ascii','ignore').decode())
for i,item in enumerate(script):
 if args.mixed:
  scene=timing['scenes'][i]
  command=['ffmpeg','-v','error','-ss',str(scene['start']/30),'-i',str(ROOT/'out/mitroff-reels-final.mp4'),'-t',str(scene['duration']/30)]
 else:command=['ffmpeg','-v','error','-i',str(ROOT/'public'/'production'/'audio'/f'voice-{i+1}.wav')]
 raw=subprocess.check_output(command+['-ar','16000','-ac','1','-f','f32le','-']);a=np.frombuffer(raw,dtype='<f4')
 stream=recognizer.create_stream();stream.accept_waveform(16000,a);recognizer.decode_stream(stream);r=stream.result
 row={'scene':item['id'],'script':item['text'],'transcript':r.text,'tokens':list(r.tokens),'timestamps':list(r.timestamps)}
 results.append(row);print(item['id'],r.text,flush=True)
destination=ROOT/'out/mixed-voice-asr.json' if args.mixed else ROOT/'public/production/audio/voice-asr.json'
destination.write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
