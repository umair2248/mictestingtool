export const homeSteps = [
  { title: 'Choose your microphone', text: 'Use the system default input or pick a microphone from the selector. If names are hidden, allow microphone access once, stop the test, and choose the device you want to check.' },
  { title: 'Allow browser access', text: 'Click Start Free Microphone Test and approve the microphone permission prompt. Access is needed to capture your voice; opening this page does not start a recording.' },
  { title: 'Speak for 10–15 seconds', text: 'Talk at your normal volume and distance. Watch the input meter and frequency bars respond. Try a sentence you would say on a call, then pause briefly to hear the background noise in playback.' },
  { title: 'Stop and listen back', text: 'Stop recording and press play. Check whether your voice is easy to understand, whether it breaks up, and whether there is hiss, echo, or distortion. Use headphones for a clearer playback check.' },
  { title: 'Download or test again', text: 'Download the audio clip if you want to keep it, or change your setup and make another recording. Your browser chooses the supported recording format; the download button shows the file extension.' },
];

export const homeResults = [
  { title: 'The meter moves and your voice is clear', text: 'This browser is receiving microphone input, and the recording gives you a practical way to judge clarity. This does not guarantee that another app has selected the same microphone.' },
  { title: 'The meter stays at zero', text: 'First make sure the test is recording and you are speaking into the selected device. Check browser permission, a physical mute switch, the input volume, and the microphone connection.' },
  { title: 'Your voice is too quiet', text: 'Move a little closer to the microphone and check the system input gain. Make a second recording at the same speaking volume so you can compare the result. A quiet signal alone does not prove the microphone is faulty.' },
  { title: 'Playback sounds harsh, noisy, or echoing', text: 'Reduce excessive gain if speech sounds distorted. Try a quieter room for steady background noise. Use headphones instead of speakers if you hear an echo or feedback, then repeat the audio test.' },
];

export const homeTroubleshooting = [
  { title: 'Microphone permission is blocked', text: 'Open the site controls beside your browser address bar and allow microphone access. Also check your operating system microphone privacy settings. Reload the page after changing permissions and start a new test.' },
  { title: 'The wrong input device is selected', text: 'A laptop can have several inputs: its built-in microphone, a webcam, a headset, and a USB interface. Choose the intended input in the tester and check the device selected in your calling app separately.' },
  { title: 'The microphone is muted or disconnected', text: 'Check the headset mute button, cable, adapter, and interface power. Reconnect a removable device and refresh the page if it does not appear. For an XLR microphone, check the interface settings and the power requirements of your equipment.' },
  { title: 'Another app or system setting is interfering', text: 'Close other recording apps and try again. If this website can record clearly but a meeting app cannot, check that app’s input selection, mute state, and permissions. A browser test cannot repair a driver or change another app’s settings.' },
];

export const homeDevices = [
  { title: 'Windows computers', text: 'Check the selected input and its level in Windows sound settings, then check microphone access in privacy settings. Return here and make a short test recording after each adjustment.' },
  { title: 'Mac computers', text: 'Check the input device in Sound settings and microphone access in Privacy & Security. Your browser may need to be reopened after a permission change. Use playback to compare your voice before and after adjusting input volume.' },
  { title: 'Android phones and tablets', text: 'Allow microphone access for both the browser app and this website. Disconnect a headset if you want to test the built-in mic. Keep the phone microphone clear of your hand or case while recording.' },
  { title: 'iPhone and iPad', text: 'Use a browser that supports microphone capture and recording on your device. Allow access when prompted. If recording is unavailable, check browser and system permissions, update the browser or operating system, and try again.' },
];

export const homeUseCases = [
  { title: 'Before a meeting or voice chat', text: 'Make a quick mic test before joining Zoom, Google Meet, Microsoft Teams, or Discord. Then check the input selected inside that app; a clear browser recording does not automatically configure the app for you.' },
  { title: 'After connecting a new microphone', text: 'Compare your laptop mic, headset, webcam, or USB microphone using the same sentence and distance. XLR microphones need an audio interface that makes their input available to the browser.' },
  { title: 'Before streaming or recording', text: 'Check that speech is intelligible and that your room is reasonably quiet before opening your recording or streaming software. Its gain, filters, and processing may produce a different final sound.' },
];

export const homeFaqs = [
  { q: 'How can I check a microphone online?', a: 'Choose an input, start the microphone test, allow access, and speak. Watch the meter, then stop and play the recording. A moving meter confirms input activity; listening back helps you check the sound.' },
  { q: 'Is this mic tester free, and do I need an account?', a: 'The online mic tester is free to use. You do not need to sign up, install software, or create an account to record, play back, and download a test clip.' },
  { q: 'Can I hear my microphone while testing?', a: 'Yes. During recording, turn on live monitoring to hear the input. Wear headphones to reduce feedback. You can also stop and play back the clip, which is usually the simplest way to check clarity.' },
  { q: 'Can I download the audio test recording?', a: 'Yes. Stop recording and choose Download recording. The file is saved from your browser to your device. The format depends on browser support, commonly WebM or M4A; the tool does not convert recordings to MP3.' },
  { q: 'Are my microphone recordings uploaded?', a: 'The microphone tester processes your audio locally in your browser and does not upload the recordings. A downloaded file stays on your device unless you choose to share it. Closing or refreshing the page removes access to the unsaved clip.' },
  { q: 'Why does my microphone work here but not in a call?', a: 'Calling apps can have different microphone selections, permissions, mute controls, and audio processing. Select the same input inside the app and run its own audio check. This test checks capture in the browser you are using.' },
  { q: 'Does the microphone test measure decibels or latency?', a: 'The meter shows relative digital input activity, not calibrated sound pressure in decibels. The tool also shows the browser audio context sample rate. It does not measure end-to-end latency or give a microphone quality score.' },
  { q: 'Will this work with my headset, USB mic, or Bluetooth microphone?', a: 'It can test inputs your browser and operating system make available. Connect your device, select its input, and allow access. Device names may appear only after permission is granted, and support varies with browser and equipment.' },
];
