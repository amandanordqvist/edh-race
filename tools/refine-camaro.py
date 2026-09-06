#!/usr/bin/env python3
"""Rebuild the EDH GLB's wheels / induction and refinish its retained body.

Requires numpy, Pillow, fast-simplification. No Blender installation or runtime
dependency is needed. Input must be the original Tripo GLB, not this output.
Coordinates retain the source convention: +X nose, +Y up, Z axle.
Dimensions are photographic estimates, not measured engineering dimensions.
"""
import argparse
import io
import json
import math
import struct
from collections import defaultdict
from pathlib import Path

import fast_simplification
import numpy as np
from PIL import Image


def read_glb(path):
    data = Path(path).read_bytes()
    length = struct.unpack_from('<I', data, 12)[0]
    document = json.loads(data[20:20 + length])
    return document, data[28 + length:]


def accessor(doc, binary, index):
    a = doc['accessors'][index]
    view = doc['bufferViews'][a['bufferView']]
    count = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3}[a['type']]
    dtype = {5126: '<f4', 5125: '<u4', 5123: '<u2'}[a['componentType']]
    size = np.dtype(dtype).itemsize
    return np.ndarray((a['count'], count), dtype=dtype, buffer=binary,
                      offset=view.get('byteOffset', 0) + a.get('byteOffset', 0),
                      strides=(view.get('byteStride', count * size), size)).copy()


def normals(points, faces):
    n = np.zeros_like(points)
    face_n = np.cross(points[faces[:, 1]] - points[faces[:, 0]], points[faces[:, 2]] - points[faces[:, 0]])
    for k in range(3):
        np.add.at(n, faces[:, k], face_n)
    return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)


def weld(points, faces):
    _, ids, inverse = np.unique(np.round(points, 6), axis=0, return_index=True, return_inverse=True)
    return points[ids].copy(), inverse[faces]


def smooth(points, faces, iterations=6):
    """Gentle Taubin smoothing removes reconstruction noise without shrinking."""
    edges = np.concatenate([faces[:, [0, 1]], faces[:, [1, 2]], faces[:, [2, 0]]])
    edges = np.unique(np.sort(edges, axis=1), axis=0)
    src = np.r_[edges[:, 0], edges[:, 1]]
    dst = np.r_[edges[:, 1], edges[:, 0]]
    degree = np.bincount(src, minlength=len(points))[:, None]
    for _ in range(iterations):
        for strength in (.36, -.37):
            sums = np.zeros_like(points)
            np.add.at(sums, src, points[dst])
            points += strength * (sums / np.maximum(degree, 1) - points)
    return points


def split_hood(points, faces):
    """Cut the carbon boundary through triangles instead of stair-stepping it."""
    x,y,z = points.T
    width = .098-.033*np.clip((x-.145)/.299,0,1)**2
    distance = np.minimum.reduce([x-.145,.444-x,y-.008,width-abs(z),abs(z)-.021])
    signs = distance[faces]
    inside = np.all(signs>=0,axis=1)
    outside = np.all(signs<=0,axis=1)
    groups = {False:[points[faces[outside]]],True:[points[faces[inside]]]}
    for face in faces[~inside&~outside]:
        vertices, values = points[face],distance[face]
        for carbon_side in [False,True]:
            polygon=[]
            for i in range(3):
                a,b=vertices[i],vertices[(i+1)%3]
                da,db=values[i],values[(i+1)%3]
                keep_a,keep_b=(da>=0,db>=0) if carbon_side else (da<=0,db<=0)
                if keep_a: polygon.append(a)
                if keep_a != keep_b: polygon.append(a+(b-a)*da/(da-db))
            for i in range(1,len(polygon)-1):
                groups[carbon_side].append(np.asarray([[polygon[0],polygon[i],polygon[i+1]]]))
    return {key:np.concatenate(parts).reshape(-1,3) for key,parts in groups.items()}


class Model:
    def __init__(self):
        self.doc = {'asset': {'version': '2.0', 'generator': 'EDH photo-reference refinement v1'},
                    'scene': 0, 'scenes': [{'nodes': []}], 'nodes': [], 'meshes': [],
                    'materials': [], 'accessors': [], 'bufferViews': [], 'buffers': [],
                    'extensionsUsed': ['KHR_materials_clearcoat']}
        self.binary = bytearray()
        self.groups = defaultdict(list)

    def view(self, data):
        while len(self.binary) % 4:
            self.binary.append(0)
        index = len(self.doc['bufferViews'])
        self.doc['bufferViews'].append({'buffer': 0, 'byteOffset': len(self.binary), 'byteLength': len(data)})
        self.binary.extend(data)
        return index

    def array(self, data, kind):
        data = np.asarray(data, dtype='<u4' if kind == 'SCALAR' else '<f4')
        a = {'bufferView': self.view(data.tobytes()), 'componentType': 5125 if kind == 'SCALAR' else 5126,
             'count': len(data), 'type': kind}
        if kind == 'VEC3':
            a.update(min=data.min(axis=0).tolist(), max=data.max(axis=0).tolist())
        self.doc['accessors'].append(a)
        return len(self.doc['accessors']) - 1

    def material(self, name, color, metal=0, rough=.4, coat=0):
        m = {'name': name, 'pbrMetallicRoughness': {'baseColorFactor': [*color, 1],
                                                'metallicFactor': metal, 'roughnessFactor': rough}}
        if coat:
            m['extensions'] = {'KHR_materials_clearcoat': {'clearcoatFactor': coat, 'clearcoatRoughnessFactor': .13}}
        self.doc['materials'].append(m)
        return len(self.doc['materials']) - 1

    def add(self, group, material, points, faces, uv=None):
        points, faces = np.asarray(points, float), np.asarray(faces, int)
        area = np.linalg.norm(np.cross(points[faces[:,1]]-points[faces[:,0]],points[faces[:,2]]-points[faces[:,0]]),axis=1)
        faces = faces[area > 1e-12]
        if len(faces):
            self.groups[group].append((material, points, faces, uv))

    def finish(self, path, pivots):
        triangles = 0
        for name, parts in self.groups.items():
            materials = sorted(set(p[0] for p in parts))
            primitives = []
            pivot = np.asarray(pivots.get(name, [0, 0, 0]))
            for material in materials:
                selected = [p for p in parts if p[0] == material]
                points, faces, uvs, offset = [], [], [], 0
                textured = all(p[3] is not None for p in selected)
                for _, p, f, uv in selected:
                    points.append(p - pivot)
                    faces.append(f + offset)
                    if textured:
                        uvs.append(uv)
                    offset += len(p)
                points, faces = np.concatenate(points), np.concatenate(faces)
                # Preserve hard part boundaries; smooth only within each surface.
                ns = np.concatenate([normals(p[1], p[2]) for p in selected])
                attributes = {'POSITION': self.array(points, 'VEC3'), 'NORMAL': self.array(ns, 'VEC3')}
                if textured:
                    attributes['TEXCOORD_0'] = self.array(np.concatenate(uvs), 'VEC2')
                primitives.append({'attributes': attributes, 'indices': self.array(faces.flatten(), 'SCALAR'), 'material': int(material)})
                triangles += len(faces)
            mesh = len(self.doc['meshes'])
            self.doc['meshes'].append({'name': name, 'primitives': primitives})
            self.doc['scenes'][0]['nodes'].append(len(self.doc['nodes']))
            self.doc['nodes'].append({'name': name, 'mesh': mesh, 'translation': pivot.tolist()})
        self.doc['buffers'] = [{'byteLength': len(self.binary)}]
        self.doc['asset']['extras'] = {'referenceImages': ['camaros10.webp', 'camaros11.jpg', 'camaros13.webp', 'camaros14.jpg'],
                                       'triangles': triangles, 'units': 'source normalized units',
                                       'forward': '+X', 'wheelAxle': '+Z', 'wheelPivots': 'edh-wheel-*'}
        js = json.dumps(self.doc, separators=(',', ':')).encode()
        js += b' ' * (-len(js) % 4)
        self.binary.extend(b'\0' * (-len(self.binary) % 4))
        out = struct.pack('<III', 0x46546C67, 2, 28 + len(js) + len(self.binary))
        out += struct.pack('<II', len(js), 0x4E4F534A) + js
        out += struct.pack('<II', len(self.binary), 0x004E4942) + self.binary
        Path(path).write_bytes(out)
        print(f'{path}: {triangles:,} triangles, {len(self.doc["nodes"])} nodes, {len(out)/1024/1024:.2f} MiB')


def lathe(model, group, mat, center, profile, segments=64):
    """Surface of revolution about Z; profile is a sequence of (radius, z)."""
    points, faces = [], []
    for radius, z in profile:
        for j in range(segments):
            a = j / segments * math.tau
            points.append(np.asarray(center) + [radius * math.cos(a), radius * math.sin(a), z])
    for i in range(len(profile) - 1):
        for j in range(segments):
            a, b = i * segments + j, i * segments + (j + 1) % segments
            faces.extend([[a, b, a + segments], [b, b + segments, a + segments]])
    model.add(group, mat, points, faces)


def tube(model, group, mat, path, radius, segments=10):
    path = np.asarray(path, float)
    points, faces = [], []
    for i, p in enumerate(path):
        direction = path[min(i + 1, len(path) - 1)] - path[max(i - 1, 0)]
        direction /= np.linalg.norm(direction)
        helper = np.array([0, 1, 0]) if abs(direction[1]) < .95 else np.array([0, 0, 1])
        u = np.cross(direction, helper)
        u /= np.linalg.norm(u)
        v = np.cross(direction, u)
        for j in range(segments):
            a = j / segments * math.tau
            points.append(p + radius * (math.cos(a) * u + math.sin(a) * v))
    for i in range(len(path) - 1):
        for j in range(segments):
            a, b = i * segments + j, i * segments + (j + 1) % segments
            faces.extend([[a, b, a + segments], [b, b + segments, a + segments]])
    model.add(group, mat, points, faces)


def box(model, group, mat, center, dimensions, bevel=.001, open_front=False):
    """Beveled rectangular housing, rounded cross-section lofted along X."""
    x, y, z = center
    length, height, width = dimensions
    points, faces = [], []
    for xx, inset in [(x-length/2, bevel), (x-length/2+bevel, 0), (x+length/2-bevel, 0), (x+length/2, bevel)]:
        h, w = height / 2 - inset, width / 2 - inset
        r = min(bevel, h / 2, w / 2)
        for cy, cz, base in [(h-r,w-r,0), (-h+r,w-r,90), (-h+r,-w+r,180), (h-r,-w+r,270)]:
            for k in range(4):
                a = math.radians(base + k * 30)
                points.append([xx, y+cy+r*math.cos(a), z+cz+r*math.sin(a)])
    for i in range(3):
        for j in range(16):
            a, b = i*16+j, i*16+(j+1)%16
            faces.extend([[a,b,a+16], [b,b+16,a+16]])
    for i in range(1,15):
        faces.append([0,i+1,i])
        if not open_front: faces.append([48,48+i,48+i+1])
    model.add(group,mat,points,faces)


def build(source, output):
    doc, binary = read_glb(source)
    if len(doc['meshes']) != 1 or 'tripo' not in doc['meshes'][0]['name']:
        raise ValueError('Use the original Tripo GLB as source; refusing to refine an already refined asset.')
    primitive = doc['meshes'][0]['primitives'][0]
    points = accessor(doc,binary,primitive['attributes']['POSITION'])
    uv = accessor(doc,binary,primitive['attributes']['TEXCOORD_0'])
    faces = accessor(doc,binary,primitive['indices']).reshape(-1,3)
    image_info = doc['images'][doc['textures'][doc['materials'][0]['pbrMetallicRoughness']['baseColorTexture']['index']]['source']]
    image_view = doc['bufferViews'][image_info['bufferView']]
    image_bytes = binary[image_view.get('byteOffset',0):image_view.get('byteOffset',0)+image_view['byteLength']]
    image = np.asarray(Image.open(io.BytesIO(image_bytes)).convert('RGB'))
    h,w = image.shape[:2]
    sampled = image[np.clip((uv[:,1]*h).astype(int),0,h-1),np.clip((uv[:,0]*w).astype(int),0,w-1)] / 255
    colors = sampled[faces].mean(axis=1)
    centroid = points[faces].mean(axis=1)
    x,y,z = centroid.T
    r,g,b = colors.T
    blue = (b > r*1.30) & (b > g*1.42)
    model = Model()
    paint = model.material('EDH / metallic cobalt clearcoat', [.004,.065,.255], .65,.28,1)
    carbon = model.material('Carbon / satin hood and intake', [.016,.020,.027], .28,.32,.4)
    glass = model.material('Polycarbonate / smoked glazing', [.028,.050,.075], .05,.18,.5)
    model.doc['materials'][glass]['pbrMetallicRoughness']['baseColorFactor'][3] = .52
    model.doc['materials'][glass]['alphaMode'] = 'BLEND'
    rubber = model.material('Drag slick / rubber', [.012,.014,.017],0,.83)
    metal = model.material('Machined aluminium', [.56,.61,.67], .92,.22)
    darkmetal = model.material('Anodised graphite', [.033,.043,.056], .75,.34)
    black = model.material('Intake / interior shadow', [.003,.004,.006],0,.94)
    steel = model.material('Exhaust / heat-tinted stainless', [.32,.27,.20],.85,.32)
    red = model.material('Fuel fittings / red anodised', [.42,.015,.008],.7,.25)
    blue_metal = model.material('Fuel fittings / blue anodised', [.016,.09,.32],.75,.24)
    detail = model.material('Retained fascia / reference albedo', [1,1,1],.25,.42)
    model.doc['images'] = [{'mimeType':image_info['mimeType'],'bufferView':model.view(image_bytes)}]
    model.doc['textures'] = [{'source':0}]
    model.doc['materials'][detail]['pbrMetallicRoughness']['baseColorTexture'] = {'index':0}

    wheel_specs = [('rl',-.177,-.0345,.117,.0695,.073), ('rr',-.177,-.0345,-.117,.0695,.073),
                   ('fl',.298,-.0545,.132,.0495,.025), ('fr',.298,-.0545,-.132,.0495,.025)]
    remove = np.zeros(len(faces),bool)
    old_tires = np.zeros(len(faces),bool)
    tire_recess = np.zeros(len(points))
    for _,cx,cy,cz,radius,width in wheel_specs:
        near_side = z * np.sign(cz) > .072
        rear = cx<0
        old_cy = -.048 if rear else -.0545
        rx,ry = (.079,.065) if rear else (.060,.055)
        ellipse = ((x-cx)/rx)**2+((y-old_cy)/ry)**2 < 1.0
        old_tires |= near_side & ellipse & ~blue
        pv=points
        q=np.sqrt(((pv[:,0]-cx)/rx)**2+((pv[:,1]-old_cy)/ry)**2)
        weight=np.clip((.94-q)/.27,0,1)
        weight=weight*weight*(3-2*weight)
        tire_recess=np.maximum(tire_recess,weight*(pv[:,2]*np.sign(cz)>.072))
    # Replace the reconstructed induction unit, whose back face was sealed.
    remove |= (x>.208)&(x<.312)&(abs(z)<.063)&(y>.032)
    # Remove old asymmetric exhaust blobs; four separated zoomies replace each bank.
    remove |= (x>.14)&(x<.232)&(y<-.067)&(abs(z)>.105)
    # Use clean authored paint across the shell; only the front fascia needs
    # its original image for the Camaro lamp / grille graphics.
    material_ids = np.full(len(faces),paint)
    material_ids[(x>.425)&(y<.014)] = detail
    material_ids[blue] = paint
    material_ids[(b>g*1.25)&(r>g*1.2)&(b>.30)] = paint
    # Current car has clean blue sides, no purple stripe or old rear sponsor sheet.
    side = (abs(z)>.095)&(y<.024)&(x>-.403)&(x<.417)
    material_ids[side] = paint
    # Glazing keeps the reconstructed outlines, separated from blue pillars.
    glazing = (y>.035)&(x>-.285)&(x<.166)&(~blue)
    material_ids[glazing] = glass
    hood_width = .098-.033*np.clip((x-.145)/.299,0,1)**2
    hood = (x>.145)&(x<.444)&(y>.008)&(abs(z)<hood_width)
    material_ids[hood] = carbon
    material_ids[hood & (abs(z)<.021)] = paint
    material_ids[(x<-.406)&(~blue)] = darkmetal
    material_ids[(y<-.078)&(abs(z)<.09)] = black
    material_ids[(x<-.30)&(y<-.050)&(abs(z)<.115)] = darkmetal
    material_ids[old_tires] = rubber
    material_names = {paint:'body-paint',carbon:'hood-carbon',glass:'cabin-glazing',detail:'fascia-details',darkmetal:'rear-hardware',black:'undertray',rubber:'retained-wheel-wells'}

    # Weld UV seams before smoothing, then transfer positions back to the UV mesh.
    welded, ids, inverse = np.unique(np.round(points,6),axis=0,return_index=True,return_inverse=True)
    del welded
    positions = smooth(points[ids].astype(float), inverse[faces], 20)
    points = positions[inverse]
    # Keep the original continuous fender edge. Recess the old tire surface
    # behind the clean new wheels rather than cutting holes through the shell.
    recess_z = np.sign(points[:,2])*np.minimum(abs(points[:,2]),.109)
    points[:,2] += tire_recess*(recess_z-points[:,2])
    shell_faces=faces[((material_ids==paint)|(material_ids==carbon))&(~remove)]
    shell=split_hood(points,shell_faces)
    for mat in sorted(set(material_ids[~remove])):
        selected = faces[(material_ids==mat)&(~remove)]
        ids, inverse = np.unique(selected,return_inverse=True)
        p, f = points[ids], inverse.reshape(-1,3)
        if mat in [paint,carbon]:
            p=shell[mat==carbon]
            f=np.arange(len(p)).reshape(-1,3)
        if mat != detail:
            p,f = weld(p,f)
            if len(f)>200:
                p,f = fast_simplification.simplify(p,f,target_reduction=.62,agg=5,preserve_border=True)
            model.add(material_names[mat],mat,p,f)
        else:
            model.add(material_names[mat],mat,p,f,uv[ids])

    pivots = {}
    for label,cx,cy,cz,radius,width in wheel_specs:
        name = f'edh-wheel-{label}'
        center = [cx,cy,cz]
        pivots[name] = center
        s = np.sign(cz)
        half = width/2
        rim = radius*(.66 if label.startswith('r') else .75)
        profile = [(rim,-half*.97),(radius*.88,-half),(radius*.98,-half*.8),(radius,-half*.48),
                   (radius,half*.48),(radius*.98,half*.8),(radius*.88,half),(rim,half*.97)]
        lathe(model,name,rubber,center,profile,80)
        # Deep barrel, rolled polished lip and five spokes / beadlock rear hub.
        lathe(model,name,metal,center,[(rim,-half),(rim*.95,-half),(rim*.95,half),(rim,half),(rim,half-.002)],80)
        outer = s*(half+.0005)
        lathe(model,name,metal,center,[(rim*.91,outer-s*.004),(rim*.97,outer),(rim,outer),(rim,outer-s*.002)],80)
        disc=[(0,outer-s*.015),(rim*.91,outer-s*.015)]
        lathe(model,name,darkmetal,center,disc[::-1] if s>0 else disc,64)
        well=[(0,-s*half),(radius*.98,-s*half)]
        lathe(model,'wheel-tubs',black,center,well[::-1] if s>0 else well,64)
        lathe(model,name,metal,center,[(0,outer-s*.006),(rim*.22,outer-s*.006),(rim*.24,outer),(0,outer)],48)
        for j in range(5):
            a = j*math.tau/5
            start = [cx+rim*.18*math.cos(a),cy+rim*.18*math.sin(a),cz+outer]
            end = [cx+rim*.92*math.cos(a+.13),cy+rim*.92*math.sin(a+.13),cz+outer-s*.007]
            tube(model,name,metal if label.startswith('f') else darkmetal,[start,end],rim*.07,8)
        bolt_count = 16 if label.startswith('r') else 5
        for j in range(bolt_count):
            a = j*math.tau/bolt_count
            rr = rim*(.89 if label.startswith('r') else .32)
            bolt = [cx+rr*math.cos(a),cy+rr*math.sin(a),cz+outer]
            lathe(model,name,metal,bolt,[(.0013,-.001),(.0013,.001)],6)

    # Finned blower case, manifold and a forward-facing rectangular carbon hat.
    box(model,'blower-case',darkmetal,[.251,.041,0],[.111,.018,.080],.002)
    box(model,'blower-case',metal,[.250,.052,0],[.095,.025,.067],.004)
    for i in range(9):
        xx = .211+i*.0094
        box(model,'blower-fins',darkmetal,[xx,.054,0],[.0018,.023,.070],.0005)
    box(model,'intake-neck',darkmetal,[.237,.072,0],[.062,.018,.054],.003)
    box(model,'intake-hat',carbon,[.249,.096,0],[.111,.033,.091],.005,open_front=True)
    # Inset black throat + thin metal rim and the 4 x 2 aperture dividers.
    box(model,'intake-throat',black,[.296,.096,0],[.001,.026,.081],.002)
    for zz in [-.042,.042]:
        tube(model,'intake-lip',metal,[[.306,.083,zz],[.307,.109,zz]],.001,8)
    for yy in [.082,.110]:
        tube(model,'intake-lip',metal,[[.306,yy,-.041],[.306,yy,.041]],.001,8)
    for zz in [-.020,0,.020]:
        box(model,'intake-grid',darkmetal,[.307,.096,zz],[.0018,.026,.0018],.0004)
    box(model,'intake-grid',darkmetal,[.307,.096,0],[.002,.0018,.082],.0004)
    # Belt drive on the nose end of the blower. Cylinders run along X.
    for yy,rr in [(.064,.014),(.025,.010)]:
        path = [[.301,yy,0],[.306,yy,0]]
        tube(model,'blower-drive',metal,path,rr,40)
    for zz in [-.011,.011]:
        tube(model,'blower-belt',rubber,[[.307,.025,zz],[.307,.063,zz*1.27]],.0026,8)
    for s in [-1,1]:
        box(model,'exhaust-surround',paint,[.184,-.084,s*.146],[.104,.036,.008],.001)
        box(model,'exhaust-recess',black,[.184,-.084,s*.151],[.098,.025,.001],.001)
        # Red / blue AN fittings and curved fuel lines.
        for xx in [.220,.259,.284]:
            tube(model,'fuel-lines',darkmetal,[[xx,.045,s*.038],[xx-.006,.070,s*.044],[xx-.018,.087,s*.038]],.0018,10)
            tube(model,'fuel-fittings',red,[[xx,.045,s*.039],[xx,.053,s*.041]],.003,6)
            tube(model,'fuel-fittings',blue_metal,[[xx-.018,.083,s*.038],[xx-.018,.089,s*.038]],.0025,6)
        # Four swept open-ended exhaust primaries per side.
        for i in range(4):
            xx=.155+i*.017
            path=[[xx,-.058,s*.080],[xx,-.073,s*.104],[xx-.003,-.084,s*.137],[xx-.010,-.079,s*.154]]
            tube(model,'exhaust-zoomies',steel,path,.0057,16)
            end=np.array(path[-1]); direction=end-np.array(path[-2]);direction/=np.linalg.norm(direction)
            tube(model,'exhaust-ports',black,[end-direction*.003,end+direction*.0002],.0046,16)
    # Cage is visible through the separate polycarbonate panes.
    for xx in [-.11,.045]:
        tube(model,'cabin-rollcage',metal,[[xx,-.052,-.112],[xx,.067,-.108],[xx,.091,-.072],
                                          [xx,.091,.072],[xx,.067,.108],[xx,-.052,.112]],.0027,10)
    for s in [-1,1]:
        tube(model,'cabin-rollcage',metal,[[-.11,.088,s*.075],[.045,.088,s*.075],[.130,.025,s*.105]],.0023,10)
        tube(model,'cabin-rollcage',metal,[[-.11,-.041,s*.112],[.075,.025,s*.114]],.0023,10)
    tube(model,'cabin-rollcage',metal,[[-.11,-.04,-.110],[-.11,.069,.105]],.0025,10)
    box(model,'cabin-interior',black,[-.045,-.031,0],[.19,.055,.15],.009)
    model.finish(output,pivots)


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',required=True)
    parser.add_argument('--output',default='public/models/pass/camaro.glb')
    args=parser.parse_args()
    build(args.source,args.output)
