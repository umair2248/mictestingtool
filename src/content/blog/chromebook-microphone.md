---
title: "How to Turn On the Microphone on a Chromebook (and Test It)"
seoTitle: "How to Turn On & Test Mic on Chromebook"
excerpt: "How to turn on the microphone on a Chromebook, pick the right input, test it in a minute, and fix a Chromebook mic that is not working in Meet, Zoom, Android apps or Linux."
date: "2026-11-22"
modified: "2026-11-22"
image: "/blog/chromebook-microphone/cover.jpg"
imageAlt: "How to turn on the microphone on a Chromebook: Chromebook with the Quick Settings audio panel open and the microphone unmuted"
tags: ["Chromebook", "Testing", "Troubleshooting"]
author: "Mic Testing Tool"
---

Chromebooks don't have a big "microphone on" switch, which is exactly why people get stuck. The mic is usually already on. What turns it "off" is one of four things: the input is muted in Quick Settings, **Microphone access** is switched off in privacy controls, a website was blocked, or the Chromebook is listening to the wrong device, like a headset you forgot was plugged in.

This guide starts with how to turn on the microphone on a Chromebook, then shows you how to test it in about a minute, and then goes through the fixes in the order I'd actually try them when the mic is not working.

## How to turn on the microphone on a Chromebook

Do these three checks in order. Together they take less than a minute and they fix most "my Chromebook mic is off" problems.

### 1. Unmute the mic in Quick Settings

1. Click the **time** in the bottom-right corner of the screen to open Quick Settings.
2. Click the small **arrow** next to the volume slider (on some versions it's an **audio settings** icon). This opens the audio panel.
3. Under **Input**, look at the microphone icon. If it has a line through it, the mic is muted. **Click it to unmute.**
4. Make sure the right microphone is selected. **Internal Mic** (or **Front Mic**) is the built-in one. A USB or Bluetooth headset shows up by name.

![Chromebook Quick Settings audio panel with the Input section, the internal microphone selected and the mute button turned off](/blog/chromebook-microphone/chromebook-quick-settings.svg "Click the time, open the audio panel, and check Input is unmuted.")

### 2. Turn on Microphone access

ChromeOS has a privacy switch that blocks the microphone for every app and website at once. When it's off, apps don't show an error. They just hear silence.

1. Open **Settings** (click the time, then the gear icon).
2. Go to **Security and privacy > Privacy controls**.
3. Turn on **Microphone access**.

![ChromeOS Settings, Security and privacy, Privacy controls, with Microphone access switched on](/blog/chromebook-microphone/chromebook-microphone-access.svg "Settings > Security and privacy > Privacy controls > Microphone access.")

If a site or app tries to use the mic while this is off, ChromeOS usually shows a notice saying the microphone is turned off in settings, with a button to turn it back on. That's the quickest way back.

### 3. Allow the microphone in Chrome

Websites like Google Meet, Zoom in the browser and our mic test need permission from Chrome too.

- When a site asks to **use your microphone**, click **Allow**.
- If you clicked **Block** before, click the **site controls icon** to the left of the web address, switch **Microphone** on, then reload the page.
- To see every blocked site, open Chrome and go to **Settings > Privacy and security > Site settings > Microphone**. Check the default is set to let sites ask, and remove the site from the **Not allowed** list.

At the top of that page there's also a dropdown that picks which microphone Chrome uses. If a headset is selected there but not plugged in, websites will hear nothing.

## Chromebook microphone test

Once the mic is on, test it before your call or class. Here are three ways, quickest first.

### Test the mic in your browser

Open our [free online mic test](/#microphone-test) in Chrome and click **Allow** when asked. Talk at a normal volume: the level bar should jump when you speak and drop back when you stop. Record a few seconds and play it back to hear how you actually sound. Nothing is uploaded, the recording stays on your Chromebook.

This is the most useful test because it goes through the same path Meet, Zoom and Teams use in the browser: Chrome's permission, Chrome's chosen input and the ChromeOS privacy switch.

### Test with the Camera app

Open the **Camera** app from the launcher, switch to **Video**, record ten seconds of yourself talking and play it back. If the clip has sound, the microphone hardware is fine. Many newer Chromebooks also have a **Recorder** app that does the same thing with a live waveform.

### Watch the input level in Settings

Go to **Settings > Device > Audio**. Under **Input**, pick your microphone and speak. You'll see the volume bar react as you talk. This is also where the **input gain** slider lives (more on that in the fixes below).

![Where the microphone is on a Chromebook: small pinholes in the bezel next to the webcam above the screen](/blog/chromebook-microphone/chromebook-mic-location.svg "On most Chromebooks the mic is a pinhole beside the webcam above the screen.")

On almost every Chromebook the microphone is one or two **tiny pinholes next to the webcam** at the top of the screen. Tablets and detachables like the Lenovo Duet may also have one on an edge. A sticker, a webcam cover or a laptop skin over that area can muffle you completely.

### What the results tell you

- **Level bar moves and playback sounds clear:** the mic works. If one app still can't hear you, jump to the Android apps or Linux section below, or check that app's own settings.
- **Camera app records sound but websites hear nothing:** it's a Chrome permission or the wrong mic selected in Chrome. Go back to step 3 above.
- **Total silence everywhere:** check Microphone access is on and the mic isn't muted. Then work down the fixes below.
- **Sound is there but very quiet or crackly:** raise the input gain and check nothing is covering the pinholes.

## Mic not working on Chromebook? Fix it in this order

Test again after each step, and stop as soon as it works.

![Chromebook mic not working: fixes in order, from unmuting and Microphone access to the right input, Chrome site permission, gain, restart, update and Powerwash](/blog/chromebook-microphone/chromebook-fix-order.svg "Start with mute and Microphone access. Powerwash is the very last step.")

### 1. Check mute and Microphone access again

It sounds too simple, but these two cause the majority of cases. A tap in Quick Settings or a privacy setting changed by someone else (common on school Chromebooks) is all it takes. Recheck both from the section above.

### 2. Pick the right input device

Unplug any USB headset, USB hub or docking station, and turn off Bluetooth in Quick Settings for a moment. Then open the audio panel and select **Internal Mic** under Input.

Chromebooks switch to a new device automatically when you plug it in, but they don't always switch back cleanly when you unplug it. Bluetooth earbuds that are still connected in your bag are a classic cause of a "dead" mic.

If you *want* to use a headset, select it here by name and also pick it in the call app's own audio settings.

### 3. Turn up the input gain

Go to **Settings > Device > Audio**. Under **Input**, drag the **input gain** slider to about 70 to 80% and talk. If the level bar barely moved before, this usually fixes it.

On the same page you may see **Noise cancellation**. It's great in noisy rooms, but it can cut off soft speech or make your voice sound robotic. If people say you keep cutting out, turn it off and test again.

### 4. Reset the site permission

If the mic works in the Camera app but not on one website, that site is probably blocked. Click the **site controls icon** next to the web address, turn **Microphone** on, and reload. If that doesn't help, open **Site settings > Microphone**, remove the site from both lists, reload and click **Allow** when asked.

Also close other tabs that might be using the mic. A forgotten Meet tab can hold onto it.

### 5. Restart the Chromebook

A full restart (not just closing the lid) clears a stuck audio service more often than you'd think. Click the time, then the **power** icon, then **Restart**. Test again before doing anything else.

### 6. Update ChromeOS

Go to **Settings > About ChromeOS** and click **Check for updates**. Install anything waiting and restart. Audio bugs on specific models do get fixed this way.

### 7. Try a hard reset

A hard reset restarts the Chromebook's hardware, including the audio chip. It doesn't delete your files.

1. Turn the Chromebook off.
2. Press and hold **Refresh** (the circular arrow key) and tap **Power**.
3. Let go of Refresh when the Chromebook starts.

On tablets, hold **Volume up** and **Power** for 10 seconds instead. Some models use a different method, so check the manufacturer's page if this doesn't work.

### 8. Powerwash (last resort)

If the Camera app, the online test and Settings all show silence after every step above, try a **Powerwash**, which resets the Chromebook to factory settings. It erases everything stored locally, so make sure your files are in Google Drive first. Go to **Settings > System preferences > Reset settings > Powerwash** (on older versions it's under **Advanced > Reset settings**).

School and work Chromebooks may block Powerwash. In that case, talk to your IT admin. If it still fails after a Powerwash, the microphone or its cable is likely damaged and needs a repair.

## Chromebook mic not working in Android apps

Apps from the Play Store have their own microphone permission, separate from Chrome.

1. Open **Settings > Apps > Manage your apps**.
2. Click the app, then **Permissions**.
3. Turn on **Microphone**.

If it's already on, turn it off and on again, then close the app fully and reopen it. Some Android apps also need you to choose a microphone inside their own settings.

## Chromebook mic not working in Linux apps

Linux apps (like Audacity installed through the Linux development environment) can't use the microphone until you allow it. Go to **Settings > About ChromeOS > Developers > Linux development environment** and turn on **Allow Linux to access your microphone**. Then restart Linux by right-clicking the **Terminal** icon and choosing **Shut down Linux**, and open your app again.

## School or work Chromebook microphone not working

On a managed Chromebook, your school or company's admin can switch off the microphone, block sites, or lock Microphone access. If the switch is greyed out with a building or briefcase icon next to it, that setting is controlled by your organisation. Nothing you change on the device will override it. Ask your teacher or IT team to allow the microphone for the app you need.

For more about how ChromeOS handles audio settings, Google's [Chromebook Help](https://support.google.com/chromebook) has official steps for every model.

## Frequently asked questions

### How do I turn on the microphone on my Chromebook?

Click the time, open the audio panel next to the volume slider, and make sure the microphone under **Input** isn't muted. Then check **Settings > Security and privacy > Privacy controls > Microphone access** is on, and click **Allow** when a website asks for the mic.

### How do I test my mic on a Chromebook?

Open the [online mic test](/#microphone-test) in Chrome, click **Allow** and talk. The level bar should move and you can record and play back a short clip. You can also record a video in the Camera app and play it back.

### Why is my Chromebook mic not working on Google Meet?

Usually Meet is blocked in Chrome, or Meet is using a different microphone. Click the site controls icon next to the address and allow the mic, then in Meet open **Settings > Audio** and choose **Internal Mic** or your headset.

### Where is the microphone on a Chromebook?

On most models it's one or two pinholes next to the webcam above the screen. Tablets and detachables may have extra mics on an edge.

### Is there a keyboard shortcut to mute the mic on a Chromebook?

There's no universal one on every model. Most call apps have their own: in Google Meet, **Ctrl + D** turns your mic on and off. To mute the mic for everything, use the mic button in the Quick Settings audio panel.

## Still stuck?

If you're using an external headset and it's the headset that won't work, see our guide on [how to connect and set up a microphone](/blog/how-to-connect-set-up-microphone). For Windows, Mac and phones, our main guide to [fixing a microphone that is not working](/blog/microphone-not-working) covers the rest. And for testing any device, read [how to test your microphone](/blog/how-to-test-your-microphone).
