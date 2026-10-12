"""Acquire selected CC BY 4.0 BodyParts3D meshes using verified ZIP ranges.

The original archive remains on the publisher's server. Local files are cached
outside the website checkout. No downloaded code is executed.
"""
from pathlib import Path
import urllib.request, struct, zipfile, io, zlib, json, concurrent.futures

SOURCE = 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip'
CACHE = Path(__file__).resolve().parents[2] / 'anatomy-source'
CACHE.mkdir(exist_ok=True)
def get_range(start, end):
    request = urllib.request.Request(SOURCE, headers={'Range': f'bytes={start}-{end}'})
    with urllib.request.urlopen(request, timeout=90) as response:
        if response.status != 206:
            raise RuntimeError('Publisher did not honour the bounded range request')
        return response.read(), response.headers['Content-Range']

tail, content_range = get_range(142703898, 142903897)
size = int(content_range.split('/')[-1])
eocd = tail.rfind(b'PK\x05\x06')
fields = struct.unpack_from('<4s4H2LH', tail, eocd)
cd_size, cd_start = fields[5], fields[6]
if cd_start < size - len(tail):
    tail, _ = get_range(cd_start, size - 1)
virtual = io.BytesIO(b'\0' * (size-len(tail)) + tail)
with zipfile.ZipFile(virtual) as archive:
    entries = {Path(info.filename).stem: info for info in archive.infolist() if info.filename.endswith('.obj')}

targets = {
    'FMA7163': 'head', 'FMA61841': 'amygdala', 'FMA62493': 'hippocampus',
    'FMA61857': 'frontal', 'FMA61859': 'frontal', 'FMA61860': 'frontal',
    'FMA61894': 'cortex', 'FMA61896': 'cortex', 'FMA61897': 'cortex',
    'FMA61898': 'cortex', 'FMA61899': 'cortex', 'FMA61906': 'cortex',
    'FMA61907': 'cortex', 'FMA61908': 'cortex', 'FMA61918': 'cortex',
    'FMA62434': 'self', 'FMA67325': 'cortex', 'FMA67944': 'cerebellum',
    'FMA62004': 'brainstem', 'FMA61993': 'brainstem', 'FMA62007': 'deep',
    'FMA62008': 'deep', 'FMA70701': 'auditory', 'FMA70703': 'auditory'
}
selected = {}
for row in (CACHE/'elements.tsv').read_text().splitlines()[1:]:
    fma, label, mesh = row.split('\t')
    if fma in targets:
        selected[mesh] = {'id': mesh, 'fma': fma, 'label': label, 'category': targets[fma]}

def fetch(item):
    mesh, record = item
    dest = CACHE/(mesh+'.obj')
    info = entries[mesh]
    if not dest.exists():
        blob, _ = get_range(info.header_offset, info.header_offset+info.compress_size+4096)
        if blob[:4] != b'PK\x03\x04': raise RuntimeError('Invalid local ZIP header')
        header = struct.unpack_from('<4s5H3L2H', blob)
        start = 30+header[-2]+header[-1]
        compressed = blob[start:start+info.compress_size]
        data = zlib.decompress(compressed, -15) if info.compress_type==8 else compressed
        if len(data)!=info.file_size or zlib.crc32(data)!=info.CRC: raise RuntimeError('Mesh integrity check failed')
        dest.write_bytes(data)
    record['crc32'] = f'{info.CRC:08x}'
    return record

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    records=list(pool.map(fetch,selected.items()))
(CACHE/'selected.json').write_text(json.dumps(records,indent=2))
print(f'Acquired and integrity-checked {len(records)} original anatomical meshes.')
