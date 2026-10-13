"""Package the editable V3 and verified preview, excluding the user's reference media."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'out'
archive=OUT/'mitroff-projeto-v3.zip'
files=[ROOT/name for name in ['README.md','REFERENCE_NOTES.md','package.json','package-lock.json','tsconfig.json','.gitignore']]
for directory in ['src','public','scripts']:
 files.extend(p for p in (ROOT/directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
for name in ['mitroff-intro-v3-preview.mp4','review-v3.jpg','preview-v3.png','validation-v3.json','browser-playback-v3.json','motion-validation-v3.json']:
 path=OUT/name
 if path.is_file():files.append(path)
with ZipFile(archive,'w',ZIP_DEFLATED) as z:
 for path in files:z.write(path,path.relative_to(ROOT).as_posix())
with ZipFile(archive) as z:
 assert z.testzip() is None
 assert z.read('public/logo mitroff3.png')==(ROOT/'public'/'logo mitroff3.png').read_bytes()
 assert z.read('out/mitroff-intro-v3-preview.mp4')==(OUT/'mitroff-intro-v3-preview.mp4').read_bytes()
 print('ZIP verified:',len(z.namelist()),'files,',archive.stat().st_size,'bytes')
