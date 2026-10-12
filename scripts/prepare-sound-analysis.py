"""Reproduce the fictional audio visual from the checked-in PCM WAV.

Run with Python 3, from any directory. No packages or network are needed.
This analyses audio, not a person or brain activity.
"""
import json
import math
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/anatomy/spoken-name.wav'
TARGET = SOURCE.with_name('spoken-analysis.json')
with wave.open(str(SOURCE), 'rb') as sound:
    assert sound.getnchannels() == 1 and sound.getsampwidth() == 2
    rate = sound.getframerate()
    count = sound.getnframes()
    pcm = struct.unpack('<' + 'h' * count, sound.readframes(count))

step, size = 128, 512
peak = max(abs(x) for x in pcm) or 1
amplitude = [round(max(abs(x) for x in pcm[i:i+step]) / peak, 5)
             for i in range(0, count, step)]
weights = [.5 - .5 * math.cos(2 * math.pi * n / (size-1)) for n in range(size)]
# Exclude DC; keep the positive-frequency bins through Nyquist.
cosines = [[math.cos(2 * math.pi * k * n / size) for n in range(size)] for k in range(1, size//2+1)]
sines = [[math.sin(2 * math.pi * k * n / size) for n in range(size)] for k in range(1, size//2+1)]
windows = []
for offset in range(0, count, size):
    block = list(pcm[offset:offset+size])
    level = max(abs(x) for x in block) / 32768
    block += [0] * (size-len(block))
    weighted = [x / 32768 * w for x, w in zip(block, weights)]
    power = []
    for cosine, sine in zip(cosines, sines):
        real = sum(x*c for x, c in zip(weighted, cosine))
        imaginary = sum(x*s for x, s in zip(weighted, sine))
        power.append(real*real + imaginary*imaginary)
    total = sum(power)
    bands = [sum(p for k, p in enumerate(power, 1) if k*rate/size < 500),
             sum(p for k, p in enumerate(power, 1) if 500 <= k*rate/size < 2000),
             sum(p for k, p in enumerate(power, 1) if k*rate/size >= 2000)]
    windows.append({'time': offset/rate,
                    'bands': [round(b/total, 5) if total else 0 for b in bands],
                    'peakHz': round((power.index(max(power))+1)*rate/size) if total else 0,
                    'level': round(level, 6)})

analysis = {'name': 'Amelia', 'sampleRate': rate, 'duration': count/rate,
            'amplitudeStep': step/rate, 'windowSamples': size,
            'bandEdgesHz': [500, 2000], 'amplitude': amplitude, 'windows': windows,
            'method': 'Peak absolute PCM amplitude per 128 samples, normalised to the recording peak; 512-sample Hann-window DFT, positive frequencies excluding DC, grouped by spectral power. Relative values, not calibrated loudness.',
            'source': 'Local fictional speech synthesis: spoken-name.wav'}
TARGET.write_text(json.dumps(analysis, separators=(',', ':')) + '\n', encoding='utf-8')
print(f'Analysed {count} PCM samples: {len(amplitude)} amplitude bins, {len(windows)} spectral windows.')
