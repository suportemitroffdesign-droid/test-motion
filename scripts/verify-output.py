"""Validate the delivered media, not a mocked render. Requires ffmpeg, ffprobe, numpy."""
from pathlib import Path
import subprocess, json, hashlib, re, struct
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
video=ROOT/'out'/'mitroff-intro.mp4'
assert video.is_file() and video.stat().st_size>100000, 'MP4 missing or empty'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames',
 '-show_streams','-show_format','-of','json',str(video)],text=True))
v=next(s for s in probe['streams'] if s['codec_type']=='video')
a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and (v['width'],v['height'])==(1080,1920)
assert v['r_frame_rate']=='30/1' and int(v['nb_read_frames'])==600
assert abs(float(probe['format']['duration'])-20)<.05
assert a['codec_name']=='aac' and a['channels']==2 and int(a['sample_rate'])==48000
# Decode all images and audio packets. A nonzero result is a failed verification.
subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(video),'-f','null','-'],check=True)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(video),'-map','0:a:0',
 '-f','f32le','-acodec','pcm_f32le','-'])
samples=np.frombuffer(raw,dtype='<f4').reshape(-1,2)
assert abs(len(samples)/48000-20)<.06
rms=float(np.sqrt(np.mean(samples**2)));peak=float(np.max(np.abs(samples)))
assert rms>.01 and peak<1, 'silent track or clipped AAC'
tail_rms=float(np.sqrt(np.mean(samples[-4800:]**2)))
assert tail_rms<.01, 'ending is not a clean decay'
source=json.loads((ROOT/'scripts'/'logo-source.json').read_text())
logo_hash=hashlib.sha256((ROOT/source['file']).read_bytes()).hexdigest()
assert logo_hash==source['sha256'], 'Original logo changed'
# MP4 atom order: moov before mdat makes progressive playback possible.
order=[]
with video.open('rb') as f:
 while True:
  block=f.read(8)
  if len(block)<8:break
  size,kind=struct.unpack('>I4s',block)
  header=8
  if size==1:size=struct.unpack('>Q',f.read(8))[0];header=16
  order.append(kind.decode('ascii',errors='replace'))
  if size==0:break
  f.seek(size-header,1)
assert order.index('moov')<order.index('mdat'), 'MP4 needs fast-start remux'
measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-vn','-af',
 'loudnorm=I=-16:TP=-1.5:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
measured=json.loads(re.findall(r'\{\s*"input_i".*?\}',measure.stderr,re.S)[-1])
report={'status':'passed','video':{'codec':v['codec_name'],'resolution':[v['width'],v['height']],
 'fps':v['r_frame_rate'],'frames':int(v['nb_read_frames']),'duration':float(v['duration']),
 'pixel_format':v['pix_fmt']},'audio':{'codec':a['codec_name'],'channels':a['channels'],
 'sample_rate':int(a['sample_rate']),'duration':len(samples)/48000,'rms':rms,
 'peak':peak,'last_100ms_rms':tail_rms,'integrated_lufs':measured['input_i'],
 'true_peak_dbtp':measured['input_tp']},'logo_original_sha256':logo_hash,
 'full_av_decode':'passed','fast_start':True,'size_bytes':video.stat().st_size,
 'mp4_sha256':hashlib.sha256(video.read_bytes()).hexdigest()}
(ROOT/'out'/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
