import { AudioWaveform, Gauge, Headphones, Mic, MousePointerClick, Speaker, Video } from 'lucide-react';

const icons = { mic: Mic, webcam: Video, headphones: Headphones, speaker: Speaker, bass: AudioWaveform, noise: Gauge, mouse: MousePointerClick };

export default function ToolIcon({ name, size = 20 }) {
  const Icon = icons[name] || Mic;
  return <Icon size={size} aria-hidden="true" />;
}
