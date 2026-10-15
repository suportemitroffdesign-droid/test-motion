"""Original physically lit product and smartphone. Run with Blender 4.x --background --python.
No external meshes, HDRIs, stock photos, client brands or person imagery.
"""
import bpy,math,sys,os
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public'/'production'
mode=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'product'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=64
scene.cycles.use_denoising=False;scene.render.threads_mode='FIXED';scene.render.threads=int(os.getenv('MITROFF_ASSET_THREADS','3'))
scene.render.resolution_x=640;scene.render.resolution_y=640;scene.render.resolution_percentage=100
scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.view_settings.view_transform='AgX'
scene.world.color=(.13,.13,.13)

def mat(name,color,metal=0,rough=.35,emit=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 if emit:p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emit
 return m
black=mat('Satin graphite polymer',(.018,.022,.03),.28,.28)
metal=mat('Brushed anodized aluminium',(.09,.115,.15),.88,.23)
foam=mat('Soft black cushion',(.009,.012,.018),.02,.63)
blue=mat('Electric blue luminous trim',(.0,.26,1),.5,.25,.8)
glass=mat('Black glass',(.012,.015,.022),.35,.14)

def smooth(ob,material):
 ob.data.materials.append(material)
 if ob.type=='MESH':
  for p in ob.data.polygons:p.use_smooth=True
 return ob

def sphere(name,loc,scale,material):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;smooth(o,material);return o

def cube(name,loc,scale,material,bevel=.12):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 mod=o.modifiers.new('Machined rounded edges','BEVEL');mod.width=bevel;mod.segments=6
 o.modifiers.new('Weighted edge normals','WEIGHTED_NORMAL');o.data.materials.append(material);return o

def tube(name,points,radius,material):
 cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.bevel_depth=radius;cu.bevel_resolution=5;sp=cu.splines.new('POLY');sp.points.add(len(points)-1)
 for p,co in zip(sp.points,points):p.co=(*co,1)
 o=bpy.data.objects.new(name,cu);bpy.context.collection.objects.link(o);o.data.materials.append(material);return o

root=bpy.data.objects.new('Animated asset root',None);bpy.context.collection.objects.link(root)
if mode=='product':
 for x in [-1,1]:
  sphere('Outer earcup',(x*1.02,0,.30),(.28,.43,.57),black)
  sphere('Memory foam earpad',(x*.83,-.005,.30),(.16,.40,.53),foam)
  sphere('Anodized cap',(x*1.255,.008,.30),(.04,.31,.42),metal)
  pts=[(x*1.292,math.sin(a)*.33,.30+math.cos(a)*.45) for a in [i/96*math.tau for i in range(97)]]
  tube('Blue earcup ring',pts,.011,blue)
  cube('Adjustable slider',(x*.99,.07,.90),(.14,.21,.52),metal,.055)
  cube('Hinge block',(x*1.035,.02,.66),(.20,.23,.18),black,.065)
 pts=[(1.02*math.cos(a),.07,.92+.92*math.sin(a)) for a in [i/64*math.pi for i in range(65)]]
 tube('Sculpted headband',pts,.105,black)
 pts=[(.98*math.cos(a),.06,.91+.85*math.sin(a)) for a in [i/64*math.pi for i in range(65)]]
 tube('Comfort headband cushion',pts,.085,foam)
 pts=[(1.023*math.cos(a),-.018,.935+.925*math.sin(a)) for a in [i/64*math.pi for i in range(65)]]
 tube('Fine polished band trim',pts,.009,metal)
 root.location=(0,0,0)
 camera_loc=(3.5,-6.5,3.0);target=(0,0,.75);ortho=3.55;folder=OUT/'product';frames=24
elif mode=='phone':
 root.location=(0,0,1.48)
 body=cube('Titanium smartphone body',(0,0,1.48),(1.26,.16,2.60),metal,.13)
 bezel=cube('Black glass bezel',(0,-.093,1.48),(1.215,.025,2.55),glass,.12)
 # Portrait screen texture authored in this project; no borrowed social post.
 image=bpy.data.images.load(str(OUT/'phone-ui.png'));image.pack()
 screen=bpy.data.materials.new('Original conceptual social interface');screen.use_nodes=True;nodes=screen.node_tree.nodes;nodes.clear()
 tex=nodes.new('ShaderNodeTexImage');tex.image=image;emit=nodes.new('ShaderNodeEmission');emit.inputs['Strength'].default_value=.85;out=nodes.new('ShaderNodeOutputMaterial');screen.node_tree.links.new(tex.outputs['Color'],emit.inputs['Color']);screen.node_tree.links.new(emit.outputs[0],out.inputs['Surface'])
 bpy.ops.mesh.primitive_plane_add(size=1,location=(0,-.112,1.48),rotation=(math.pi/2,0,0));o=bpy.context.object;o.name='Original interface screen';o.scale=(1.135,2.40,1);o.data.materials.append(screen)
 cube('Camera island',(0,-.12,2.58),(.34,.025,.074),black,.032)
 cube('Volume keys',(-.642,.005,1.84),(.025,.07,.29),metal,.012)
 cube('Power key',(.642,.005,1.73),(.025,.07,.23),metal,.012)
 camera_loc=(2.4,-6.5,3.3);target=(0,0,1.48);ortho=3.45;folder=OUT/'phone';frames=18

else:
 root.location=(0,0,1.45)
 if mode=='comment':
  cube('Rounded comment bubble',(0,0,1.50),(1.40,.25,.98),blue,.18)
  mesh=bpy.data.meshes.new('Speech tail mesh');mesh.from_pydata([(-.40,-.1,1.13),(-.36,-.1,.78),(.06,-.1,1.13),(-.40,.1,1.13),(-.36,.1,.78),(.06,.1,1.13)],[],[(0,1,2),(3,5,4),(0,3,4,1),(1,4,5,2),(2,5,3,0)]);mesh.update()
  o=bpy.data.objects.new('Speech tail',mesh);bpy.context.collection.objects.link(o);o.data.materials.append(blue);be=o.modifiers.new('Rounded tail','BEVEL');be.width=.05;be.segments=4
  for x in [-.35,0,.35]:sphere('Message dot',(x,-.16,1.52),(.083,.043,.083),mat('White porcelain '+str(x),(.95,.97,1),.1,.25))
 elif mode=='eye':
  pts=[(-.72+1.44*t,-.01,1.45+.39*math.sin(math.pi*t)) for t in [i/40 for i in range(41)]]
  pts +=[(.72-1.44*t,-.01,1.45-.39*math.sin(math.pi*t)) for t in [i/40 for i in range(41)]]
  tube('Dimensional eye outline',pts,.052,blue);sphere('Glass lens',(0,-.02,1.45),(.23,.11,.23),metal);sphere('Blue iris',(0,-.12,1.45),(.15,.035,.15),blue);sphere('Deep pupil',(0,-.154,1.45),(.065,.015,.065),black)
 else:
  if mode=='heart':
   points=[(.038*16*math.sin(t)**3,.038*(13*math.cos(t)-5*math.cos(2*t)-2*math.cos(3*t)-math.cos(4*t))) for t in [i/96*math.tau for i in range(96)]]
  else:points=[(-.42,.68),(.50,-.09),(.07,-.15),(.31,-.55),(.08,-.70),(-.16,-.28),(-.42,-.54)]
  filtered=[]
  for x,z in points:
   if not filtered or (x-filtered[-1][0])**2+(z-filtered[-1][1])**2>.00025:filtered.append((x,z))
  points=filtered;n=len(points)
  verts=[(x,-.09,1.45+z) for x,z in points]+[(x,.09,1.45+z) for x,z in points]
  faces=[tuple(reversed(range(n))),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
  mesh=bpy.data.meshes.new('Solid sculpted '+mode);mesh.from_pydata(verts,[],faces);mesh.update()
  o=bpy.data.objects.new('Sculpted '+mode,mesh);bpy.context.collection.objects.link(o);o.data.materials.append(blue)
  bevel=o.modifiers.new('Controlled soft bevel','BEVEL');bevel.width=.035;bevel.segments=5;bevel.use_clamp_overlap=True
  o.modifiers.new('Weighted studio normals','WEIGHTED_NORMAL')

 camera_loc=(1.8,-6.5,3.1);target=(0,0,1.45);ortho=2.10;folder=OUT/mode;frames=10
 scene.render.resolution_x=400;scene.render.resolution_y=400

bpy.context.view_layer.update()
for obj in list(bpy.context.scene.objects):
 if obj is root:continue
 matrix=obj.matrix_world.copy();obj.parent=root;obj.matrix_world=matrix

# Product photography lighting: huge softboxes and a narrow rim.
def area(name,loc,power,size,color,target):
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;data.color=color
 o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
area('Large soft key',(-3,-4,6),850,5,(.91,.95,1),target)
area('Clean white edge',(4,1,5),1100,3,(.94,.98,1),target)
area('Blue studio rim',(-3,2,2.5),650,3,(.03,.32,1),target)
area('Front bounce',(1,-4,1),180,4,(1,1,1),target)
bpy.ops.object.camera_add(location=camera_loc);camera=bpy.context.object;camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=ortho;scene.camera=camera
folder.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/f'{mode}.blend'))
for index in range(frames):
 root.rotation_euler[2]=math.radians(-27+index/(frames-1)*54)
 root.rotation_euler[1]=math.radians(2*math.sin(index/(frames-1)*math.pi))
 scene.render.filepath=str(folder/f'{index:02}.png');bpy.ops.render.render(write_still=True)
 print('ASSET_FRAME',mode,index,flush=True)
