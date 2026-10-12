export function audioView(duration,position,zoom){
 if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(position)||!Number.isFinite(zoom)||zoom<1)throw new Error('Invalid audio view');
 const span=duration/zoom,start=Math.max(0,Math.min(duration-span,position-span/2));
 return {start,end:start+span,position:Math.max(0,Math.min(duration,position))};
}
export function audioWindow(analysis,position){
 if(!analysis.windows.length||!Number.isFinite(position))throw new Error('Audio windows unavailable or invalid position');
 const at=Math.max(0,Math.min(analysis.duration,position));
 return analysis.windows[Math.min(analysis.windows.length-1,Math.floor(at*analysis.sampleRate/analysis.windowSamples))];
}
