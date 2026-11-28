---
title: "How to Test Your Microphone on a Mac or MacBook (and Fix It)"
seoTitle: "How to Test Mic on Mac & MacBook (Quick Fixes)"
excerpt: "Test the microphone on your Mac or MacBook in under a minute with Sound settings, Voice Memos or an online mic test, then fix a mic that isn't picking up."
date: "2026-11-28"
modified: "2026-11-28"
image: "/blog/mac-microphone-test/cover.jpg"
imageAlt: "Mac microphone test: a MacBook showing the Sound Input settings with a moving input level meter"
tags: ["Mac", "Microphones", "Testing", "Troubleshooting"]
author: "Mic Testing Tool"
---

Before a call, a recording or a class, you want to know one thing: does your Mac actually hear you? macOS doesn't have a "Test microphone" button, but there are three quick ways to check, and each one tells you something slightly different.

This guide shows you **how to test the microphone on a Mac or MacBook** (Air or Pro, built-in mic or external), how to read the result, and **how to fix a MacBook microphone** that isn't picking anything up.

## The quickest way to test your mic on a Mac

If you just want a yes or no, open our [online microphone test](/#microphone-test) in Safari, Chrome or Firefox and click **Allow** when the browser asks for the microphone. Speak normally. If the level meter moves, your Mac's microphone works. Record a few seconds and play it back to hear how you sound.

Nothing is uploaded: the test runs in your browser. It also checks the part most apps rely on, which is whether apps are allowed to use the mic, so it's a good stand-in for Zoom, Google Meet or Teams in the browser.

If the test hears nothing, don't worry yet. Go through the next two checks to see where the sound stops.

## How to check your Mac microphone in System Settings

This check shows whether macOS itself receives sound from the microphone, before any app gets involved.

![Mac System Settings Sound Input tab with the MacBook microphone selected, the input level meter moving and the input volume slider](/blog/mac-microphone-test/mac-sound-input.svg "System Settings > Sound > Input: pick the mic, speak, and watch the input level.")

1. Click the **Apple menu** and choose **System Settings**.
2. Click **Sound** in the sidebar, then the **Input** tab.
3. Select your microphone. The built-in one is called **MacBook Air Microphone**, **MacBook Pro Microphone** or similar. External mics, headsets and AirPods show up by name.
4. Speak. The **Input level** bar should light up as you talk.
5. If the bar barely moves, drag the **Input volume** slider to the right.

On macOS Monterey and earlier, the same screen is in **System Preferences > Sound > Input**. Apple's [sound input settings guide](https://support.apple.com/guide/mac-help/change-the-sound-input-settings-mchlp2567/mac) shows the screen for each macOS version.

**If the meter moves here but the online test is silent**, the mic is fine and the browser doesn't have permission. Skip to [allow microphone access](#allow-microphone-access-for-apps-and-browsers).

## Record yourself with Voice Memos or QuickTime

The input meter shows that sound is arriving, but not how it sounds. To hear yourself, make a short recording:

- **Voice Memos:** open Voice Memos (it's in Applications), click the red **Record** button, talk for ten seconds, click **Done**, then play it back. Apple's guide to [creating a recording on Mac](https://support.apple.com/guide/voice-memos/create-a-recording-vmaa4b813415/mac) covers the details.
- **QuickTime Player:** choose **File > New Audio Recording**. Click the small arrow next to the record button to pick which microphone to use, then record and play it back.

Listen for these problems:

- **Very quiet:** raise the input volume, or move closer to the mic.
- **Muffled:** something is covering the mic, or you're on a Bluetooth headset that has switched to its lower-quality call mode.
- **Hiss or buzzing:** usually an external mic or a cheap adapter. Try another port or cable.
- **Echo:** your speakers are feeding back into the mic. Use headphones.

## Where is the microphone on a MacBook?

MacBook Air and MacBook Pro models have a small array of microphones built in near the keyboard and speaker grilles. You don't need to aim at them exactly, but they work best when nothing is resting on the keyboard area and your hands aren't over the speaker holes.

One thing catches a lot of people out: **the built-in mic turns off when you close the lid.** On Macs with Apple silicon and on Intel MacBooks with the T2 chip, a [hardware microphone disconnect](https://support.apple.com/guide/security/hardware-microphone-disconnect-secbbd20b00b/web) cuts the mic when the lid shuts. If you use your MacBook closed with an external display, plug in a USB mic or headset and choose it in **Sound > Input**.

## Allow microphone access for apps and browsers

If the Mac hears you in System Settings but Zoom, Discord, Chrome or another app doesn't, the app probably isn't allowed to use the microphone.

1. Go to **Apple menu > System Settings > Privacy & Security > Microphone**.
2. Turn on the switch next to the app or browser you're using.
3. Quit the app completely (**Command + Q**) and open it again. Many apps only pick up the change after a restart.

Apple's guide to [controlling access to the microphone on Mac](https://support.apple.com/guide/mac-help/control-access-to-the-microphone-on-mac-mchla1b1e1fe/mac) explains these switches. If an app isn't in the list at all, it hasn't asked for the mic yet. Open it and try to use the mic, and macOS will ask.

Browsers have their own per-site permission too:

- **Safari:** choose **Safari > Settings > Websites > Microphone** and set the site to **Allow** or **Ask**.
- **Chrome:** click the icon to the left of the web address, and turn **Microphone** on for that site.

When any app is using the mic, an orange dot appears in the menu bar. If you see it but you're not on a call, open Control Center to see which app is listening.

## How to fix a microphone on a MacBook

If none of the checks above pick up your voice, work through these fixes in order. Test again after each one.

![MacBook microphone not working: fixes in order from input selection and volume to permissions, closed lid, restarting Core Audio, macOS update and repair](/blog/mac-microphone-test/mac-mic-fix-order.svg "Start with the simple settings. Most Mac mic problems are fixed before step 5.")

1. **Choose the right input.** In **System Settings > Sound > Input**, select the mic you mean to use. After you connect AirPods, a headset or a display with a mic, macOS often switches to it on its own.
2. **Turn up the input volume.** A slider dragged all the way left sounds exactly like a broken mic.
3. **Check the app's own settings.** Zoom, Teams, Discord and OBS each have a microphone menu in their audio settings. Pick the same mic you chose in System Settings, and check you're not muted in the app.
4. **Allow access** in **Privacy & Security > Microphone**, then quit and reopen the app.
5. **Open the lid or use an external mic.** The built-in mic doesn't work with the lid closed.
6. **Disconnect accessories.** Unplug USB hubs, docks, audio interfaces and Bluetooth headsets, then test the built-in mic on its own.
7. **Check Mic Mode.** While you're on a call, open **Control Center** and click **Mic Mode**. **Voice Isolation** cuts background sound but can also cut quiet voices or music. Try **Standard**.
8. **Restart the Mac.** It's simple, but it clears most stuck audio problems.
9. **Restart Core Audio.** If sound stops after waking from sleep, open **Terminal** and run `sudo killall coreaudiod`, then enter your password. macOS restarts its audio service straight away. Close any open calls first.
10. **Update macOS** in **System Settings > General > Software Update**. Audio bugs are often fixed in updates.

If the built-in mic still shows no input level in **Sound > Input** after all of this, even with no accessories connected, the microphone may be faulty. Contact Apple Support or an Apple Authorised Service Provider. Use a USB or Bluetooth headset in the meantime.

## External mics, headsets and AirPods on a Mac

- **USB microphones** work without drivers. Plug one in, select it in **Sound > Input** and test. If it doesn't appear, try another port or cable, and skip any hub.
- **Headsets with a single 3.5 mm plug** (four-pole TRRS) work in the headphone jack of most recent Macs. A headset with separate pink and green plugs needs a USB adapter.
- **AirPods and Bluetooth headsets** appear in the input list once connected. When their mic is in use, sound quality drops because Bluetooth switches to a call mode. If you only want better sound, keep the AirPods for listening and choose the MacBook's built-in mic as input. For more, see [how to test and fix the AirPods microphone](/blog/airpods-microphone).
- **Audio interfaces** with XLR mics: open **Audio MIDI Setup** (in Applications > Utilities) to check the interface is listed and its input isn't muted. Turn on phantom power on the interface if your mic needs it.

## Frequently asked questions

### How do I test my mic on a MacBook?

Open **System Settings > Sound > Input**, select your microphone and speak. If the input level moves, the mic works. To hear yourself, record a short clip in Voice Memos or use our [online mic test](/#microphone-test) and play it back.

### Is there a microphone test on a Mac?

There's no dedicated test button, but the input level meter in **System Settings > Sound > Input** does the same job. Voice Memos and QuickTime Player let you record and play back a test.

### Why is my Mac microphone not picking up my voice?

The usual reasons are the wrong input selected, input volume set too low, the app not allowed in **Privacy & Security > Microphone**, or the MacBook lid closed. Check those four first, then restart the Mac.

### Why does my mic work in System Settings but not in Zoom or Chrome?

macOS hears you, but the app either isn't allowed to use the mic or has a different mic selected. Turn the app on in **Privacy & Security > Microphone**, quit and reopen it, then choose the right microphone in its audio settings.

### Does the MacBook microphone work with the lid closed?

No. On Macs with Apple silicon or the T2 chip, the built-in mic is disconnected in hardware when the lid closes. Use an external mic or headset when you work with the lid shut.

### How do I fix a crackling or distorted mic on a Mac?

Lower the input volume a little, move the mic slightly away from your mouth, and try a different USB port or cable. If it started after waking from sleep, restart the Mac or run `sudo killall coreaudiod` in Terminal.

## Check the rest of your setup

Once the mic works, run the [speaker and headphone test](/speaker-test) and the [webcam test](/webcam-test) before your next call. If the Mac camera is black, see [how to fix a camera that's not working](/blog/camera-not-working). For problems on other devices, read [how to fix a microphone that's not working](/blog/microphone-not-working) or [why your iPhone microphone is not working](/blog/iphone-microphone-not-working).
