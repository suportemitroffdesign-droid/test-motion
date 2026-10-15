"""Package the final source and rendered deliverables, never reference uploads."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import hashlib,json
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'out';archive=OUT/'mitroff-reels-projeto.zip'
assert json.loads((OUT/'validation-final.json').read_text())['status']=='passed'
assert json.loads((OUT/'browser-playback-final.json').read_text())['status']=='passed'
files=[ROOT/n for n in ['README.md','REFERENCE_NOTES.md','package.json','package-lock.json','tsconfig.json','.gitignore']]
for folder in ['src','public','scripts']:
 files.extend(p for p in (ROOT/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts and not p.name.endswith('.blend1'))
for n in ['mitroff-reels-final.mp4','mitroff-capa.png','review-final.jpg','redesign-review.jpg','transitions-review.jpg','validation-final.json','browser-playback-final.json','mixed-voice-asr.json','audio-integrity-final.json','visual-review.md']:
 p=OUT/n
 if p.is_file():files.append(p)
with ZipFile(archive,'w',ZIP_DEFLATED,compresslevel=6) as z:
 for p in files:z.write(p,p.relative_to(ROOT).as_posix())
with ZipFile(archive) as z:
 assert z.testzip() is None
 assert z.read('public/logo mitroff3.png')==(ROOT/'public/logo mitroff3.png').read_bytes()
 assert z.read('out/mitroff-reels-final.mp4')==(OUT/'mitroff-reels-final.mp4').read_bytes()
 assert not any(n.startswith(('node_modules/','models/','.git/')) or n.endswith('.blend1') for n in z.namelist())
 print(json.dumps({'zip':archive.name,'files':len(z.namelist()),'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'integrity':'passed'},indent=2))
