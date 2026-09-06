"""Create an editable Blender scene and optional studio render from the GLB.

blender --background --factory-startup --python tools/camaro-blender.py -- \
  --source public/models/pass/camaro.glb --output assets/3d/edh-camaro.blend
"""
import argparse
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

parser=argparse.ArgumentParser()
parser.add_argument('--source',required=True)
parser.add_argument('--output',required=True)
parser.add_argument('--render')
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:])
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(Path(args.source).resolve()))
car_objects=list(bpy.context.scene.objects)
car=bpy.data.collections.new('EDH Camaro · editable model')
bpy.context.scene.collection.children.link(car)
for obj in car_objects:
    for collection in list(obj.users_collection): collection.objects.unlink(obj)
    car.objects.link(obj)
    if obj.type=='MESH':
        for polygon in obj.data.polygons: polygon.use_smooth=True
root=bpy.data.objects.new('EDH Camaro · display scale 5.8',None)
car.objects.link(root)
for obj in car_objects:
    if obj.parent is None: obj.parent=root
root.scale=(5.8,)*3
root.location.z=.608
root['source']='Photo-guided refinement of the existing Tripo Camaro'
root['reference_images']='camaros10.webp, camaros11.jpg, camaros13.webp, camaros14.jpg'
root['notes']='Approximate model, not fabrication CAD. Wheel node origins remain at their hubs.'

studio=bpy.data.collections.new('Studio · excluded from vehicle export')
bpy.context.scene.collection.children.link(studio)
def move_to_studio(obj):
    for collection in list(obj.users_collection): collection.objects.unlink(obj)
    studio.objects.link(obj)
    return obj
def material(name,color,roughness):
    mat=bpy.data.materials.new(name)
    mat.use_nodes=True
    shader=mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value=(*color,1)
    shader.inputs['Roughness'].default_value=roughness
    return mat
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.015))
floor=move_to_studio(bpy.context.object)
floor.name='Studio floor'
floor.data.materials.append(material('Studio charcoal',(.018,.023,.031),.35))
def area(name,location,power,size,color,target=(0,0,.5),shape='DISK',size_y=None):
    data=bpy.data.lights.new(name,'AREA')
    data.energy=power
    data.shape=shape
    data.size=size
    if size_y is not None: data.size_y=size_y
    data.color=color
    obj=bpy.data.objects.new(name,data)
    studio.objects.link(obj)
    obj.location=location
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
area('Key softbox',(2,-4,6),1600,5,(.90,.95,1),shape='RECTANGLE',size_y=2)
area('Roof strip',(-2,1,5),1900,5,(1,.97,.92),shape='RECTANGLE',size_y=1)
area('Blue-side fill',(-3,-4,2),700,4,(.68,.79,1),shape='RECTANGLE',size_y=3)
area('Front fill',(6,2,2.5),1000,3,(1,1,1))
world=bpy.data.worlds.new('Studio environment')
world.use_nodes=True
world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.18,.21,.27,1)
world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.35
bpy.context.scene.world=world
camera_data=bpy.data.cameras.new('Review camera')
camera=bpy.data.objects.new('Review camera',camera_data)
studio.objects.link(camera)
camera.location=(6.4,-7.8,3.2)
target=Vector((.05,0,.7))
camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
camera_data.type='ORTHO'
camera_data.ortho_scale=7.1
bpy.context.scene.camera=camera
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.render.resolution_x=1600
scene.render.resolution_y=1000
scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
scene.render.image_settings.file_format='PNG'
# Open the saved file with the car selected, framed in material preview.
bpy.ops.object.select_all(action='DESELECT')
for obj in car_objects: obj.select_set(True)
bpy.context.view_layer.objects.active=next(obj for obj in car_objects if obj.type=='MESH')
for screen in bpy.data.screens:
    for area_ui in screen.areas:
        if area_ui.type=='VIEW_3D':
            area_ui.spaces.active.region_3d.view_distance=7
            area_ui.spaces.active.region_3d.view_location=(0,0,.6)
            area_ui.spaces.active.shading.type='MATERIAL'
output=Path(args.output).resolve()
output.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(output))
print(f'Saved editable scene: {output}')
if args.render:
    scene.render.filepath=str(Path(args.render).resolve())
    bpy.ops.render.render(write_still=True)
