"""Original conceptual feed texture; no client, actual ad or person imagery."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'public'/'production'
W,H=720,1440
im=Image.new('RGBA',(W,H),'white');d=ImageDraw.Draw(im)
def font(size,bold=False):
 f=ImageFont.truetype(str(ROOT/'public'/'fonts'/'SpaceGrotesk.ttf'),size)
 if bold:f.set_variation_by_axes([700])
 return f
blue='#008CFF';ink='#080808'
d.rounded_rectangle((28,72,92,136),radius=18,outline=ink,width=4);d.ellipse((43,87,77,121),outline=ink,width=4);d.ellipse((76,81,83,88),fill=ink)
d.text((117,82),'anúncio.exemplo',font=font(33,True),fill=ink);d.text((117,125),'ESTUDO FICTÍCIO',font=font(21),fill='#6F7783')
d.line((28,174,W-28,174),fill='#E2E6EC',width=2)
d.rounded_rectangle((28,200,W-28,1140),radius=28,fill='#F0F4FA')
d.text((62,235),'SOM',font=font(95,True),fill=ink);d.text((62,335),'SEM FIO.',font=font(95,True),fill=blue)
product=Image.open(OUT/'product'/'00.png').convert('RGBA');product.thumbnail((630,630));im.alpha_composite(product,((W-product.width)//2,445))
d=ImageDraw.Draw(im);d.text((64,960),'R$ 249,90',font=font(70,True),fill=ink)
d.rounded_rectangle((60,1050,660,1117),radius=18,fill=blue);d.text((234,1062),'QUERO VER',font=font(35,True),fill='white')
# Familiar social controls, kept monochromatic and informational.
d.ellipse((34,1185,70,1221),outline=ink,width=4);d.rounded_rectangle((106,1185,147,1218),radius=10,outline=ink,width=4);d.line((112,1218,105,1232),fill=ink,width=3)
d.polygon([(185,1187),(226,1198),(198,1229)],outline=ink,width=4)
d.text((30,1260),'Clareza muda a percepção.',font=font(30,True),fill=ink)
d.text((30,1310),'Exemplo criado para demonstrar redesign.',font=font(23),fill='#6F7783')
im.save(OUT/'phone-ui.png')
print('Original feed texture created.')
