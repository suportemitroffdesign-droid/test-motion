"""Extract review images from the delivered MP4, never from still renders."""
from pathlib import Path
import subprocess
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'out';D=OUT/'frames-final';D.mkdir(exist_ok=True)
indices=[0,40,105,126,127,230,288,289,360,476,501,502,545,575,625,680,738,778,779,860,915,960,984,1000,1020,1047]
selection='+'.join(f'eq(n,{n})' for n in indices)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(OUT/'mitroff-reels-final.mp4'),'-vf',f"select='{selection}'",'-fps_mode','vfr',str(D/'%02d.png')],check=True)
images={n:Image.open(D/f'{i+1:02}.png').convert('RGB') for i,n in enumerate(indices)}
def sheet(name,frames,cols,width):
 h=round(width*1920/1080);label=35;rows=(len(frames)+cols-1)//cols
 result=Image.new('RGB',(width*cols,(h+label)*rows),'#171717');draw=ImageDraw.Draw(result)
 font=ImageFont.truetype(str(ROOT/'public/fonts/SpaceGrotesk.ttf'),18)
 for i,n in enumerate(frames):
  x=i%cols*width;y=i//cols*(h+label)
  result.paste(images[n].resize((width,h),Image.Resampling.LANCZOS),(x,y))
  draw.text((x+10,y+h+7),f'{n/30:05.2f}s · frame {n}',font=font,fill='white')
 result.save(OUT/name,quality=94)
sheet('review-final.jpg',[105,230,476,738,960,1020],3,360)
sheet('redesign-review.jpg',[502,545,575,625,680,738],3,360)
sheet('transitions-review.jpg',[0,40,126,127,288,289,501,502,778,779,984,1047],4,270)
images[105].save(OUT/'mitroff-capa.png')
print('Review sheets and 1080x1920 cover extracted from actual MP4')
