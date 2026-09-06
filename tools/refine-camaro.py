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
from scipy.spatial import cKDTree
from scipy.interpolate import CubicSpline, PchipInterpolator


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


def fair_surface(points, faces):
    """Local quadratic surface fits suppress scan ripples, retaining curvature."""
    result=points.copy()
    ns=normals(points,faces)
    tree=cKDTree(points)
    # Fair only the outer shell, not the bars, tires or induction hardware.
    selection=np.flatnonzero((points[:,1]>-.072)&(points[:,0]>-.39)&(points[:,0]<.44))
    for start in range(0,len(selection),512):
        ids=selection[start:start+512]
        distances,neighbours=tree.query(points[ids],k=360)
        n=ns[ids]
        neighbour_normals=ns[neighbours]
        weights=np.exp(-3*(distances/np.maximum(distances[:,-1:],1e-5))**2)
        weights*=np.clip(np.einsum('nki,ni->nk',neighbour_normals,n),0,1)**4
        n=np.sum(neighbour_normals*weights[:,:,None],axis=1)
        n/=np.maximum(np.linalg.norm(n,axis=1,keepdims=True),1e-9)
        helper=np.tile([0,1,0],(len(ids),1))
        helper[abs(n[:,1])>.9]=[0,0,1]
        u=np.cross(n,helper);u/=np.maximum(np.linalg.norm(u,axis=1,keepdims=True),1e-9)
        v=np.cross(n,u)
        delta=(points[neighbours]-points[ids,None,:])/.02
        xx=np.einsum('nki,ni->nk',delta,u)
        yy=np.einsum('nki,ni->nk',delta,v)
        zz=np.einsum('nki,ni->nk',delta,n)
        basis=np.stack([np.ones_like(xx),xx,yy,xx*xx,xx*yy,yy*yy],axis=-1)
        lhs=np.einsum('nki,nk,nkj->nij',basis,weights,basis)
        rhs=np.einsum('nki,nk,nk->ni',basis,weights,zz)
        lhs+=np.eye(6)[None]*1e-6
        solution=np.linalg.solve(lhs,rhs[:,:,None])[:,:,0]
        displacement=np.clip(solution[:,0]*.02,-.0035,.0035)
        result[ids]+=n*displacement[:,None]*.85
    return result


def front_x(y,z):
    return .500-.070*(np.abs(z)/.135)**1.6-.09*np.abs(y+.055)


def front_polygon(model,group,material,polygon,depth=.002):
    # Polygon coordinates are (Z,Y); the surface follows the Camaro nose crown.
    polygon=np.asarray(polygon)
    pending=[np.asarray([polygon[0],polygon[i],polygon[i+1]]) for i in range(1,len(polygon)-1)]
    triangles=[]
    while pending:
        tri=pending.pop()
        lengths=[np.linalg.norm(tri[i]-tri[(i+1)%3]) for i in range(3)]
        edge=int(np.argmax(lengths))
        if lengths[edge]>.005:
            a,b,c=tri[edge],tri[(edge+1)%3],tri[(edge+2)%3]
            mid=(a+b)/2
            pending.extend([np.asarray([a,mid,c]),np.asarray([mid,b,c])])
        else: triangles.append(tri)
    yz=np.concatenate(triangles)
    p=np.asarray([[front_x(y,z)+depth,y,z] for z,y in yz])
    f=np.arange(len(p)).reshape(-1,3)
    n=np.cross(p[f[:,1]]-p[f[:,0]],p[f[:,2]]-p[f[:,0]])
    f[n[:,0]<0]=f[n[:,0]<0,::-1]
    p,f=weld(p,f)
    model.add(group,material,p,f)


def front_border(model,group,material,polygon,width=.0008,depth=.0024):
    p=np.asarray(polygon,float)
    center=p.mean(axis=0)
    offset=p-center
    inner=center+offset*(1-width/np.maximum(np.linalg.norm(offset,axis=1,keepdims=True),1e-6))
    for i in range(len(p)):
        j=(i+1)%len(p)
        front_polygon(model,group,material,[p[i],p[j],inner[j],inner[i]],depth)


def honeycomb(model,polygon,metal):
    p=np.asarray(polygon)
    def inside(point):
        signs=[]
        for i in range(len(p)):
            a,b=p[i],p[(i+1)%len(p)]
            signs.append((b[0]-a[0])*(point[1]-a[1])-(b[1]-a[1])*(point[0]-a[0]))
        return min(signs)>=-1e-9 or max(signs)<=1e-9
    radius=.0054
    for row,yy in enumerate(np.arange(p[:,1].min(),p[:,1].max()+.008,.0081)):
        for zz in np.arange(p[:,0].min(),p[:,0].max()+.01,.0094):
            center=[zz+(row%2)*.0047,yy]
            hexagon=[[center[0]+radius*math.sin(j*math.tau/6),center[1]+radius*math.cos(j*math.tau/6)] for j in range(6)]
            if all(inside(v) for v in hexagon):
                front_border(model,'grille-honeycomb',metal,hexagon,.00055,.0031)


def forged_spoke(model,group,material,center,rim,outer,side,angle):
    p,f=[],[]
    for radius,width,twist,depth in [(.19,.15,0,0),(.34,.14,.04,-.001),(.60,.105,.09,-.004),(.87,.08,.14,-.006),(.98,.07,.15,-.005)]:
        a=angle+twist
        c=np.asarray(center)+[rim*radius*math.cos(a),rim*radius*math.sin(a),outer+side*depth]
        tangent=np.array([-math.sin(a),math.cos(a),0])
        for k in range(8):
            q=k*math.tau/8
            # Chamfered elliptical section produces the flat forged blade highlight.
            p.append(c+tangent*(math.copysign(abs(math.cos(q))**.45,math.cos(q))*rim*width)
                     +np.array([0,0,math.copysign(abs(math.sin(q))**.6,math.sin(q))*.0016]))
    for i in range(4):
        for j in range(8):
            a,b=i*8+j,i*8+(j+1)%8
            f.extend([[a,b,a+8],[b,b+8,a+8]])
    model.add(group,material,p,f)


def intake_hat(model,material):
    p,f=[],[]
    stations=[(.190,.084,.004,.014),(.196,.090,.012,.033),(.209,.096,.017,.044),
              (.237,.096,.017,.0455),(.288,.096,.0165,.0455),(.3045,.096,.0165,.0455)]
    segments=48
    for x,cy,h,w in stations:
        for j in range(segments):
            a=j/segments*math.tau
            y=cy+h*math.copysign(abs(math.cos(a))**.36,math.cos(a))
            z=w*math.copysign(abs(math.sin(a))**.36,math.sin(a))
            p.append([x,y,z])
    for i in range(len(stations)-1):
        for j in range(segments):
            a,b=i*segments+j,i*segments+(j+1)%segments
            f.extend([[a,b,a+segments],[b,b+segments,a+segments]])
    for j in range(1,segments-1): f.append([0,j+1,j])
    model.add('intake-hat',material,p,f)


def partition_triangles(triangles,field):
    """Split a triangle soup on an implicit boundary, sharing exact crossings."""
    flat=triangles.reshape(-1,3)
    signs=field(flat).reshape(-1,3)
    inside=np.all(signs>=0,axis=1)
    outside=np.all(signs<=0,axis=1)
    groups={True:[triangles[inside]],False:[triangles[outside]]}
    for tri,values in zip(triangles[~inside&~outside],signs[~inside&~outside]):
        for positive in [False,True]:
            polygon=[]
            for i in range(3):
                a,b=tri[i],tri[(i+1)%3]
                da,db=values[i],values[(i+1)%3]
                ka,kb=(da>=0,db>=0) if positive else (da<=0,db<=0)
                if ka: polygon.append(a)
                if ka!=kb: polygon.append(a+(b-a)*da/(da-db))
            for i in range(1,len(polygon)-1):
                groups[positive].append(np.asarray([[polygon[0],polygon[i],polygon[i+1]]]))
    return {key:np.concatenate(parts) for key,parts in groups.items()}


def lofted_shell(model,paint,carbon,glass,black,wheel_specs):
    """Photo-proportioned clean shell: longitudinal loft with real arch cutouts.

    These stations are editable artistic dimensions in the source coordinate
    system, not measurements of the physical Five Star body.
    """
    # X, half width, roof/hood centre height, shoulder height.
    stations=np.array([
        [-.423,.139,.026,.024],[-.377,.153,.030,.027],[-.305,.158,.034,.029],
        [-.265,.160,.054,.031],[-.212,.163,.089,.033],[-.145,.157,.109,.035],
        [-.060,.153,.113,.034],[.020,.152,.110,.034],[.065,.153,.093,.035],
        [.110,.157,.061,.036],[.150,.161,.043,.036],[.218,.165,.041,.035],
        [.290,.161,.034,.029],[.355,.153,.023,.018],[.407,.143,.010,.006],
        [.495,.134,.001,-.003],
    ])
    width=PchipInterpolator(stations[:,0],stations[:,1])
    roof=PchipInterpolator(stations[:,0],stations[:,2])
    belt=PchipInterpolator(stations[:,0],stations[:,3])
    rings=196
    circumference=96
    positions=[]
    for xx in np.linspace(stations[0,0],stations[-1,0],rings):
        w,h,b=width(xx),roof(xx),belt(xx)
        # Rounded crown, narrow roof rails, tucked waist and a straight sill.
        half=[[0,h],[.30*w,h-.0007],[.56*w,h-.003],[.79*w,b+.006],
              [.92*w,b+.003],[w,b-.007],[.995*w,-.026],[.973*w,-.052],
              [.986*w,-.085],[.960*w,-.095],[0,-.095]]
        ring=np.asarray(half+[[ -z,y] for z,y in half[-2:0:-1]]+[half[0]])
        t=np.linspace(0,1,len(ring))
        samples=CubicSpline(t,ring,bc_type='periodic')(np.arange(circumference)/circumference)
        for zz,yy in samples:
            x_actual=xx
            if xx>.39:
                blend=(xx-.39)/(.495-.39)
                x_actual=.39+blend*(front_x(yy,zz)-.39)
            positions.append([x_actual,yy,zz])
    positions=np.asarray(positions)
    faces=[]
    for i in range(rings-1):
        for j in range(circumference):
            a,b=i*circumference+j,i*circumference+(j+1)%circumference
            faces.extend([[a,b,a+circumference],[b,b+circumference,a+circumference]])
    triangles=positions[np.asarray(faces)]
    for label,cx,cy,cz,radius,_ in wheel_specs:
        def arch(p,cx=cx,cy=cy,cz=cz,radius=radius):
            return np.maximum(np.hypot(p[:,0]-cx,p[:,1]-cy)-(radius+.0035),.087-p[:,2]*np.sign(cz))
        triangles=partition_triangles(triangles,arch)[True]
    def window_field(p):
        x,y,z=p.T
        roof_y=roof(np.clip(x,stations[0,0],stations[-1,0]))
        a_pillar=.087+.033*np.clip((x-.062)/.080,0,1)
        side=np.minimum.reduce([x+.124,.128-x,y-.041,roof_y-.007-y,abs(z)-a_pillar-.005])
        quarter=np.minimum.reduce([x+.275,-.137-x,y-.042,roof_y-.009-y,abs(z)-.100])
        windshield=np.minimum.reduce([x-.062,.142-x,y-.043,a_pillar-.005-abs(z)])
        rear=np.minimum.reduce([x+.281,-.180-x,y-.044,.087-abs(z)])
        return np.maximum.reduce([side,quarter,windshield,rear])
    pieces=partition_triangles(triangles,window_field)
    glass_triangles=pieces[True]
    shell_points=pieces[False].reshape(-1,3)
    shell_faces=np.arange(len(shell_points)).reshape(-1,3)
    panels=split_hood(shell_points,shell_faces)
    for name,mat,p in [('body-paint',paint,panels[False]),('hood-carbon',carbon,panels[True]),
                       ('cabin-glazing',glass,glass_triangles.reshape(-1,3))]:
        f=np.arange(len(p)).reshape(-1,3)
        p,f=weld(p,f)
        model.add(name,mat,p,f)
    # Crowned front closure; the grille and lamps sit on this same surface.
    last=positions[-circumference:]
    front_polygon(model,'body-front',paint,[[p[2],p[1]] for p in last],0)
    first=positions[:circumference]
    center=np.mean(first,axis=0)
    rear_p=np.vstack([center,first])
    rear_f=[]
    for i in range(circumference):
        tri=[0,i+1,(i+1)%circumference+1]
        if np.cross(rear_p[tri[1]]-rear_p[0],rear_p[tri[2]]-rear_p[0])[0]>0: tri=tri[::-1]
        rear_f.append(tri)
    model.add('body-rear',paint,rear_p,rear_f)
    # Low rear spoiler and two swept end plates, as in the side reference.
    p=[[-.373,.029,-.151],[-.373,.029,.151],[-.435,.040,.151],[-.435,.040,-.151]]
    model.add('rear-spoiler',paint,p,[[0,2,1],[0,3,2]])
    for s in [-1,1]:
        p=[[-.385,.026,s*.151],[-.435,.033,s*.151],[-.432,.058,s*.151],[-.391,.042,s*.151]]
        p=np.asarray(p)
        solid=np.vstack([p-[0,0,.0006],p+[0,0,.0006]])
        f=[[0,1,2],[0,2,3],[4,6,5],[4,7,6]]
        for i in range(4):
            j=(i+1)%4
            f.extend([[i,i+4,j],[j,i+4,j+4]])
        model.add('spoiler-endplates',paint,solid,f)
    # Quiet sill seam follows the body width rather than the old scan dents.
    for s in [-1,1]:
        path=[]
        for xx in np.linspace(-.085,.221,40):
            path.append([xx,-.079,s*float(width(xx))*.995])
        tube(model,'sill-trim',black,path,.00055,6)
    # Door and front-clip gaps, projected onto the smooth side skin.
    skin=positions[positions[:,2]>.09]
    skin_tree=cKDTree(skin[:,[0,1]])
    def side_path(xy,sign,steps=10):
        result=[]
        for a,b in zip(xy[:-1],xy[1:]):
            for t in np.linspace(0,1,steps,endpoint=False):
                q=np.asarray(a)*(1-t)+np.asarray(b)*t
                d,ids=skin_tree.query(q,k=8)
                weights=1/np.maximum(d,1e-5)**2
                z=np.sum(skin[ids,2]*weights)/weights.sum()+.0007
                result.append([q[0],q[1],sign*z])
        return result
    door=[[-.108,.034],[-.096,-.024],[-.080,-.085],[-.064,-.091],[.103,-.091],
          [.126,-.082],[.130,-.030],[.132,.034]]
    for s in [-1,1]:
        tube(model,'door-panel-gaps',black,side_path(door,s),.00045,6)
        handle=[[-.071+.011*math.cos(a),.021+.0038*math.sin(a)] for a in np.linspace(0,math.tau,33)]
        tube(model,'door-handle-recess',black,side_path(handle,s,steps=1),.0005,6)


class Model:
    def __init__(self):
        self.doc = {'asset': {'version': '2.0', 'generator': 'EDH photo-reference clean-shell v2'},
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


def build(source, output, retained_shell=False):
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
    paint = model.material('EDH / metallic cobalt clearcoat', [.002,.038,.195], .45,.26,1)
    carbon = model.material('Carbon / satin hood and intake', [.007,.008,.011], .06,.35,.35)
    glass = model.material('Polycarbonate / smoked glazing', [.007,.015,.025], 0,.15,.15)
    model.doc['materials'][glass]['pbrMetallicRoughness']['baseColorFactor'][3] = .35
    model.doc['materials'][glass]['alphaMode'] = 'BLEND'
    rubber = model.material('Drag slick / rubber', [.004,.005,.007],0,.86)
    metal = model.material('Machined aluminium', [.56,.61,.67], .92,.22)
    darkmetal = model.material('Anodised graphite', [.033,.043,.056], .75,.34)
    black = model.material('Intake / interior shadow', [.003,.004,.006],0,.94)
    steel = model.material('Exhaust / heat-tinted stainless', [.32,.27,.20],.85,.32)
    red = model.material('Fuel fittings / red anodised', [.42,.015,.008],.7,.25)
    blue_metal = model.material('Fuel fittings / blue anodised', [.016,.09,.32],.75,.24)
    lens = model.material('Headlamp / smoked projector glass', [.025,.065,.105],.45,.13,.8)
    led = model.material('Headlamp / silver-white LED', [.72,.84,.95],.45,.2)
    grille_metal = model.material('Grille / graphite aluminium', [.14,.16,.18],.75,.38)
    model.doc['materials'][led]['emissiveFactor']=[.10,.14,.18]
    detail = model.material('Retained fascia / reference albedo', [1,1,1],.25,.42)

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
    if retained_shell:
        for _ in range(3): positions=fair_surface(positions,inverse[faces])
    points = positions[inverse]
    # Replace the scan's rippled front surface with a continuous crowned fascia.
    front=(points[:,0]>.398)&(points[:,1]<.003)&(points[:,1]>-.099)
    yy,zz=points[front,1],points[front,2]
    weight=np.clip((points[front,0]-.398)/.028,0,1)
    points[front,0]+=(front_x(yy,zz)-points[front,0])*weight
    # Keep the original continuous fender edge. Recess the old tire surface
    # behind the clean new wheels rather than cutting holes through the shell.
    recess_z = np.sign(points[:,2])*np.minimum(abs(points[:,2]),.109)
    points[:,2] += tire_recess*(recess_z-points[:,2])
    shell_faces=faces[((material_ids==paint)|(material_ids==carbon))&(~remove)]
    shell=split_hood(points,shell_faces)
    for mat in sorted(set(material_ids[~remove])):
        if not retained_shell and mat!=darkmetal: continue
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

    if not retained_shell:
        lofted_shell(model,paint,carbon,glass,black,wheel_specs)

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
            forged_spoke(model,name,metal if label.startswith('f') else darkmetal,center,rim,outer,s,a)
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
    intake_hat(model,carbon)
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
            path=[[xx,-.058,s*.080],[xx,-.073,s*.104],[xx-.003,-.084,s*.145],[xx-.012,-.077,s*.167]]
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
    # Camaro fascia: crowned grille panels, fine honeycomb and projector lenses.
    upper=[[-.077,-.007],[.077,-.007],[.083,-.020],[-.083,-.020]]
    front_polygon(model,'grille-upper',black,upper)
    front_border(model,'grille-trim',darkmetal,upper,.0011)
    for yy in [-.010,-.017]:
        front_polygon(model,'upper-grille-bars',grille_metal,[[-.074,yy],[.074,yy],[.074,yy+.0007],[-.074,yy+.0007]],.003)
    for s in [-1,1]:
        lower=[[s*.004,-.049],[s*.069,-.049],[s*.082,-.087],[s*.004,-.089]]
        front_polygon(model,'grille-lower',black,lower)
        front_border(model,'grille-trim',metal,lower,.00075)
        honeycomb(model,lower,grille_metal)
        light=[[s*.080,-.007],[s*.126,-.008],[s*.124,-.016],[s*.111,-.021],[s*.085,-.020]]
        front_polygon(model,'headlamp-housings',black,light,.0028)
        front_border(model,'headlamp-bezels',metal,light,.0010,.0031)
        running=[[s*.084,-.017],[s*.111,-.018],[s*.120,-.014]]
        path=[[front_x(y,z)+.0036,y,z] for z,y in running]
        tube(model,'headlamp-led',led,path,.0009,8)
        for zz in [.092,.104,.116]:
            ring=[[s*(zz+.0032*math.cos(i*math.tau/24)),-.012+.0031*math.sin(i*math.tau/24)] for i in range(24)]
            front_polygon(model,'headlamp-projectors',lens,ring,.0034)
            front_border(model,'headlamp-projectors',metal,ring,.00042,.0036)
            pupil=[[s*(zz+.0014*math.cos(i*math.tau/16)),-.012+.0014*math.sin(i*math.tau/16)] for i in range(16)]
            front_polygon(model,'headlamp-optics',led,pupil,.0038)
        duct=[[s*.092,-.053],[s*.122,-.054],[s*.125,-.083],[s*.090,-.083]]
        front_polygon(model,'brake-ducts',black,duct)
        for yy in [-.068,-.074,-.080]:
            front_polygon(model,'brake-duct-louvres',darkmetal,[[s*.094,yy],[s*.122,yy],[s*.122,yy+.0015],[s*.094,yy+.0015]],.003)
        front_polygon(model,'running-lamps',led,[[s*.095,-.059],[s*.120,-.059],[s*.120,-.061],[s*.095,-.061]],.0031)
    bowtie=[[-.014,-.002],[-.006,-.002],[-.006,-.004],[.006,-.004],[.006,-.002],[.014,-.002],
            [.014,.002],[.006,.002],[.006,.004],[-.006,.004],[-.006,.002],[-.014,.002]]
    bowtie=[[z,y-.0135] for z,y in bowtie]
    front_border(model,'chevrolet-bowtie',metal,bowtie,.0010,.004)
    front_polygon(model,'front-splitter',carbon,[[-.129,-.0915],[.129,-.0915],[.131,-.095],[-.131,-.095]],.0026)
    model.finish(output,pivots)


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',required=True)
    parser.add_argument('--output',default='public/models/pass/camaro.glb')
    parser.add_argument('--retained-shell',action='store_true',help='Use the old smoothed reconstruction instead of the new clean loft.')
    args=parser.parse_args()
    build(args.source,args.output,args.retained_shell)
