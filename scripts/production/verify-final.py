"""Check the rendered MP4 end to end, including every decoded frame and AAC sample."""
from pathlib import Path
import subprocess,json,hashlib,re,struct
import numpy as np
ROOT=Path(__file__).resolve().parents[2]
video=ROOT/'out'/'mitroff-reels-final.mp4'
timing=json.loads((ROOT/'src/production/voice-timing.json').read_text())
expected=timing['duration_seconds']
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(video)],text=True))
v=next(s for s in probe['streams'] if s['codec_type']=='video')
a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
assert v['color_range']=='tv' and v['color_space']=='bt709'
assert (v['width'],v['height'])==(1080,1920) and v['r_frame_rate']=='30/1'
assert int(v['nb_read_frames'])==timing['duration_frames']
assert abs(float(probe['format']['duration'])-expected)<.06
assert a['codec_name']=='aac' and a['channels']==2 and int(a['sample_rate'])==48000
subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(video),'-f','null','-'],check=True)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(video),'-map','0:a:0','-f','f32le','-acodec','pcm_f32le','-'])
samples=np.frombuffer(raw,dtype='<f4').reshape(-1,2)
rms=float(np.sqrt(np.mean(samples**2)));peak=float(np.max(np.abs(samples)))
tail=float(np.sqrt(np.mean(samples[-4800:]**2)))
assert abs(len(samples)/48000-expected)<.06 and rms>.01 and peak<1
assert tail<.01,'Music does not decay cleanly'
# Read the actual encoded video, not composition stills. Check every thumbnail.
pixels=subprocess.check_output(['ffmpeg','-v','error','-i',str(video),'-an','-vf','scale=108:192,format=gray','-f','rawvideo','-'])
frames=np.frombuffer(pixels,np.uint8).reshape(-1,192,108).astype(np.float32)
means=frames.mean(axis=(1,2));stds=frames.std(axis=(1,2))
empty=np.where((means<2)&(stds<2))[0].tolist()
assert not empty,f'Accidental black frames: {empty}'
motion=[]
for s in timing['scenes']:
 clip=frames[s['start']:s['start']+s['duration']]
 delta=np.abs(np.diff(clip,axis=0)).mean(axis=(1,2))
 max_run=run=0
 for d in delta:
  run=run+1 if d<.025 else 0;max_run=max(run,max_run)
 # The intentional final logo hold is allowed. Other scenes must keep moving.
 assert s['id']=='closing' or max_run<12,f"Frozen animation in {s['id']}"
 motion.append({'scene':s['id'],'mean_pixel_change_per_frame':float(delta.mean()),'longest_near_static_run_frames':max_run})
logo_info=json.loads((ROOT/'scripts/logo-source.json').read_text())
logo_hash=hashlib.sha256((ROOT/logo_info['file']).read_bytes()).hexdigest()
assert logo_hash==logo_info['sha256'],'Original logo changed'
order=[]
with video.open('rb') as f:
 while True:
  block=f.read(8)
  if len(block)<8:break
  size,kind=struct.unpack('>I4s',block);header=8
  if size==1:size=struct.unpack('>Q',f.read(8))[0];header=16
  order.append(kind.decode('ascii',errors='replace'))
  if size==0:break
  f.seek(size-header,1)
assert order.index('moov')<order.index('mdat')
level=subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-vn','-af','loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
measured=json.loads(re.findall(r'\{\s*"input_i".*?\}',level.stderr,re.S)[-1])
mix=json.loads((ROOT/'public/production/audio/mix-report.json').read_text())
assert mix['voice_over_music_db_during_speech']>=12
script=json.loads((ROOT/'scripts/production/narration-script.json').read_text())
assert [s['text'] for s in timing['scenes']]==[s['text'] for s in script]
assert len(timing['scenes'])==5 and timing['time_stretch'] is False
report={'status':'passed','video':{'codec':v['codec_name'],'resolution':[v['width'],v['height']],'fps':30,'frames':len(frames),'duration_seconds':float(v['duration']),'pixel_format':v['pix_fmt'],'color_space':v['color_space'],'color_range':v['color_range']},'audio':{'codec':a['codec_name'],'channels':a['channels'],'sample_rate':int(a['sample_rate']),'rms':rms,'peak':peak,'last_100ms_rms':tail,'integrated_lufs':measured['input_i'],'true_peak_dbtp':measured['input_tp'],'voice_over_music_db':mix['voice_over_music_db_during_speech']},'full_av_decode':'passed','accidental_black_frames':empty,'motion':motion,'logo_original_sha256':logo_hash,'fast_start':True,'palette':json.loads((ROOT/'src/production/palette.json').read_text()),'mp4_sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'size_bytes':video.stat().st_size}
(ROOT/'out/validation-final.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
