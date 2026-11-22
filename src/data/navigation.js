// Header: Home, a Tools menu with every tool grouped by what it checks, and the blog.
// Features, FAQ and Contact live in the footer.
// localeIndex points at the matching label in each locale's nav list, when one exists.
export const navigation = [
  { label: 'Home', to: '/', localeIndex: 0 },
  { label: 'Tools', mega: true },
  { label: 'Blog', to: '/blog', localeIndex: 2 }
];

export const toolGroups = [
  { title: 'Microphone & camera', tools: [
    { label: 'Online Mic Test', to: '/', icon: 'mic', text: 'Record your voice, play it back and watch the input level.' },
    { label: 'Webcam & Mic Test', to: '/webcam-test', icon: 'webcam', text: 'Live camera preview, resolution, frame rate and mic level.' },
  ] },
  { title: 'Speakers & sound', tools: [
    { label: 'Speaker & Headphone Test', to: '/speaker-test', icon: 'headphones', text: 'Play left and right on their own and check stereo.' },
    { label: 'Surround Sound Test', to: '/surround-sound-test', icon: 'speaker', text: 'Every 5.1 and 7.1 channel, one speaker at a time.' },
    { label: 'Bass & Subwoofer Test', to: '/bass-test', icon: 'bass', text: '20-200 Hz tones and a slow sweep for your sub.' },
  ] },
  { title: 'Room & desk', tools: [
    { label: 'Classroom Noise Meter', to: '/noise-meter', icon: 'noise', text: 'Live noise bar with a too-loud alert and full-screen mode.' },
    { label: 'Mouse Double Click Test', to: '/double-click-test', icon: 'mouse', text: 'Catch a mouse that turns one click into two.', isNew: true },
  ] },
];

export const allTools = toolGroups.flatMap(group => group.tools);
