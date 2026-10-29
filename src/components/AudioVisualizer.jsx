import { useEffect, useState } from 'react';
import { englishTool } from '../data/locales';

const BAR_COUNT = 40;
const idle = { bars: Array(BAR_COUNT).fill(4), level: 0 };

export default function AudioVisualizer({ analyserRef, active, sampleRate, text = englishTool }) {
  const [metrics, setMetrics] = useState(idle);
  useEffect(() => {
    if (!active) return;
    let frame;
    let last = 0;
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bins = new Uint8Array(analyser.frequencyBinCount);
    const samples = new Uint8Array(analyser.fftSize);
    // Speech energy sits in the lower bins, so spread bars over the first half of the spectrum.
    const usable = Math.max(BAR_COUNT, Math.floor(bins.length / 2));
    const tick = time => {
      if (time - last >= 70) {
        last = time;
        analyser.getByteFrequencyData(bins);
        analyser.getByteTimeDomainData(samples);
        const rms = Math.sqrt(samples.reduce((sum, value) => sum + ((value - 128) / 128) ** 2, 0) / samples.length);
        setMetrics({ bars: Array.from({ length: BAR_COUNT }, (_, i) => Math.max(4, bins[Math.floor(i * usable / BAR_COUNT)] / 255 * 100)), level: Math.min(100, Math.round(rms * 100)) });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, analyserRef]);
  const visible = active ? metrics : idle;
  // Scale the bar so normal speech (roughly 5–30% RMS) fills a useful part of the track.
  const fill = Math.min(100, Math.round(Math.sqrt(visible.level / 100) * 100));
  return <div className="audio-visualizer">
    <div className="viz-axis"><span>0 Hz</span><span>{sampleRate ? `${(sampleRate / 4000).toFixed(1)} kHz` : text.frequency}</span></div>
    <div className="viz-bars" aria-hidden="true">{visible.bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
    <div className="viz-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={visible.level} aria-label={text.level}><span style={{ width: `${fill}%`, '--meter-track': `${fill ? 10000 / fill : 100}%` }} /></div>
    <div className="viz-level"><p>{text.relative}</p><strong>{visible.level}%</strong></div>
    <p className="viz-limit">{text.limit}</p>
  </div>;
}
