---
title: "Microphone Not Working? How to Fix Your Mic on PC, Laptop, Headset and Phone"
seoTitle: "Mic Not Working? How to Fix Your Microphone (PC & Phone)"
excerpt: "Why isn't my mic working? Find the cause in two minutes, then fix a computer, laptop, headset or phone microphone that is silent, muted, too quiet or echoing."
date: "2026-10-29"
tags: ["Microphones", "Troubleshooting"]
image: "/blog/microphone-not-working/cover.jpg"
imageAlt: "Microphone not working: how to fix a silent, muted or quiet mic on PC, laptop, headset and phone"
author: "Mic Testing Tool"
---

If your microphone is not working, the cause is usually one of five things: the app or browser has no permission to use the mic, the wrong input device is selected, the microphone is muted, the input volume is too low, or the cable or Bluetooth connection is wrong. A broken microphone is the least likely cause.

The fastest way to find which one it is: record yourself in a [free online mic test](/#microphone-test). If the test hears you, the microphone works and the problem is in one app's settings. If the test is silent, the problem is in the device, the connection or your system settings. This guide walks through both cases for Windows PCs, laptops, Macs, headsets and phones, and also explains how to fix microphone echo.

## Quick checklist: fix most mic problems in 60 seconds

Work through these before changing drivers or buying a new microphone:

1. **Check mute.** Look for a mute switch on the headset cable or earcup, a mute button on a USB mic, a muted mic icon in your call app, and a mic mute key (often with a small LED) on laptop keyboards.
2. **Reconnect the microphone.** Unplug it and plug it back in, ideally into a different USB port. For a wireless headset, turn it off and on.
3. **Choose the right input.** In your system sound settings and inside the app, select the microphone you are actually speaking into.
4. **Allow microphone access.** Your operating system and browser both have privacy switches that can block the mic silently.
5. **Close other apps.** Some apps take exclusive control of a microphone. Quit other call, recording and streaming apps.
6. **Restart the app — or the device.** A restart clears stuck audio services and re-detects devices.

Then [run the mic test](/#microphone-test) again. If the level meter moves and you can hear yourself in the playback, your microphone works.

## Step 1: Find out where the problem is

Before you fix anything, narrow down the cause. One quick test tells you a lot:

![Microphone not working flowchart: run the online mic test, check whether the level meter moves and whether playback sounds clear](/blog/microphone-not-working/find-the-problem.svg "One test shows whether the problem is the connection, the settings or one app.")

- **The online test hears you, but Zoom, Teams or Discord does not.** The microphone and system are fine. Go to [Mic works in one place but not in an app](#mic-works-in-one-place-but-not-in-an-app).
- **The online test is silent, and your system sound settings show no input level.** The problem is the connection, the selected device, a privacy setting or the driver. Continue with the computer, laptop or headset sections below.
- **The test hears you, but the sound is quiet, crackly or echoing.** The microphone works but needs adjusting. Jump to [How to fix microphone echo](#how-to-fix-microphone-echo) or [Mic too quiet, crackling or robotic](#mic-too-quiet-crackling-or-robotic).
- **Nothing works on this device, but the mic works on another computer or phone.** The microphone is fine; focus on this device's settings and drivers.
- **The mic fails on every device and every port.** The microphone or its cable is probably faulty.

## Computer mic not working on Windows 11 or Windows 10

Most Windows microphone problems are caused by privacy settings or the wrong default input. Check these in order. For screenshots of each Windows 10 setting, read [how to test and fix a microphone on Windows 10](/blog/how-to-test-microphone-windows-10).

### 1. Turn on microphone access

Windows can block all apps from using the microphone, even when the device is connected correctly.

- **Windows 11:** open **Start > Settings > Privacy & security > Microphone**. Turn on **Microphone access**, **Let apps access your microphone** and **Let desktop apps access your microphone**.
- **Windows 10:** open **Start > Settings > Privacy > Microphone**. Turn on access for this device, **Allow apps to access your microphone** and **Allow desktop apps to access your microphone**.

Browsers such as Chrome and Edge count as desktop apps, so the desktop-app switch matters for online tests and web meetings.

### 2. Select the correct input device

1. Open **Start > Settings > System > Sound**.
2. Under **Input**, choose the microphone you want to use. A laptop may list a built-in microphone array, a webcam mic and a headset at the same time.
3. Open the device's properties and check that it is **allowed** (not disabled) and that **Input volume** is not near zero.
4. Speak and watch the input level bar. If it moves, Windows hears you.

### 3. Check the classic Recording settings

The older Sound control panel shows details the Settings app hides.

1. Search for **Control Panel**, then open **Hardware and Sound > Sound** and select the **Recording** tab.
2. Right-click an empty area and enable **Show Disabled Devices**. If your mic appears as disabled, right-click it and choose **Enable**.
3. Select your microphone and choose **Set Default**.
4. Open **Properties > Levels** and raise the microphone level. If you see **Microphone Boost**, try a small amount.
5. Under **Advanced**, try turning off **Allow applications to take exclusive control of this device** if one app keeps "stealing" the microphone.

### 4. Run the troubleshooter and update the driver

- Run the recording audio troubleshooter. In Windows 11 it is under **Settings > System > Troubleshoot > Other troubleshooters**; newer builds open it through the Get Help app.
- Open **Device Manager**, expand **Audio inputs and outputs**, right-click your microphone and choose **Update driver**. If that does not help, choose **Uninstall device**, then restart the PC so Windows reinstalls it.
- For laptops, install the audio driver from the laptop manufacturer's support page. Generic drivers sometimes miss the built-in microphone array.

Microsoft's own guide to [fixing microphone problems in Windows](https://support.microsoft.com/en-us/windows/hardware/drivers/fix-microphone-problems) covers the same settings with screenshots.

## Microphone on laptop not working

A laptop's built-in microphone usually sits near the webcam or along the keyboard edge. If it has stopped working, check these laptop-specific causes as well as the Windows steps above.

- **Mic mute key.** Many laptops have a function key with a crossed-out microphone icon, sometimes with an indicator light. Press it once (or with **Fn**) and test again.
- **Privacy switch or shutter.** Some business laptops have a physical switch that cuts power to the camera and microphone.
- **A plugged-in headset takes over.** When headphones or a headset are connected, the laptop may switch input to the headset jack. Unplug everything and test the built-in mic on its own.
- **Blocked microphone holes.** A case, sticker or dust can cover the tiny mic openings. Clean them gently with a dry soft brush.
- **Manufacturer audio software.** Apps from Realtek, Dolby, MaxxAudio or the laptop maker can have their own mute or noise-reduction settings. Open them and check the microphone section.
- **Driver after an update.** If the mic stopped after a Windows update, reinstall the audio driver from the laptop manufacturer.

## Mac microphone not working

1. Open **Apple menu > System Settings > Privacy & Security > Microphone** and turn on access for your browser or call app. Quit and reopen the app after changing it.
2. Open **System Settings > Sound > Input** and choose the right microphone. Speak and watch the input level; drag the **Input volume** slider up if the bar barely moves.
3. If the input list is empty, disconnect accessories, restart the Mac, and connect one microphone at a time.

Apple's guide to [changing sound input settings on Mac](https://support.apple.com/guide/mac-help/change-the-sound-input-settings-mchlp2567/mac) shows the input screen for your macOS version.

## Headset microphone not working

A common situation: you can hear sound in the headset, but nobody can hear you. Headphone output and microphone input are separate paths, so one can work while the other fails.

### Wired headset with one 3.5 mm plug

Headsets with a single plug usually have a 4-pole (TRRS) connector carrying both sound and microphone.

- **Your computer has separate pink and green jacks.** Plugged into the green headphone jack, only the sound works. Use a **headset splitter (Y-adapter)** that separates the plug into microphone and headphone plugs, then connect the mic plug to the pink jack.
- **Your computer has one combined jack.** Push the plug all the way in. If Windows or the audio software asks what you connected, choose **Headset** rather than **Headphones**.
- **Adapters and extension cables.** A 3-pole extension cable or adapter can disconnect the microphone. Try connecting the headset directly.

### USB headset

- Plug it directly into the computer rather than a USB hub, and try another port.
- Select the headset itself as the input in system settings and in the app — not "Microphone array" or the webcam.
- Check the inline remote or earcup for a mute button; many USB headsets also have a mute light.

### Bluetooth headset or earbuds

- Bluetooth headsets switch into a separate hands-free (call) mode when the microphone is used. On Windows, the headset can appear as two devices. Choose the one labelled **Headset** or **Hands-Free** as the input.
- If the mic still does not appear, remove the headset from Bluetooth settings, pair it again, and reconnect.
- Some earbuds use the microphone only on one side or turn it off when an earbud is in its case. Wear both earbuds while testing.

For more about connectors, splitters and USB microphones, read our guide to [connecting and setting up a microphone on PC or Mac](/blog/how-to-connect-set-up-microphone).

## Phone microphone not working

If people cannot hear you on calls, voice messages are silent, or one app cannot use the microphone, try these steps on Android or iPhone.

1. **Test with a built-in app.** Record a voice memo or a short video. If the recording works, the microphone works and the problem is in one app's permission or settings.
2. **Check app permissions.**
   - **iPhone and iPad:** open **Settings > Privacy & Security > Microphone** and turn on access for the app.
   - **Android:** open **Settings > Apps**, choose the app, then **Permissions > Microphone** and select **Allow**. On recent Android versions, also check that the **Microphone access** tile in Quick Settings is turned on.
3. **Disconnect Bluetooth.** A connected car kit, earbuds or speaker can take over the microphone. Turn Bluetooth off and test again.
4. **Remove the case and clean the mic holes.** Phones have more than one microphone, usually at the bottom edge and near the top or rear camera. Lint or a tight case can block them.
5. **Restart the phone and install updates.**
6. **Test in the browser.** Open the [online mic test](/#microphone-test) on the phone. If it records clearly, the hardware works.

If the voice recorder is silent even after a restart and with the case removed, the microphone may be damaged. Contact the manufacturer or a repair service.

## Mic works in one place but not in an app

When the online test hears you but a call app does not, the app is using a different microphone, is muted, or has no permission.

![Browser site settings for a meeting website with the Microphone permission switched to Allow before reloading the page](/blog/microphone-not-working/browser-mic-permission.svg "Click the icon left of the address, allow the microphone, then reload.")

- **Zoom:** open **Settings > Audio**, choose your microphone under **Microphone** and click **Test Mic**.
- **Microsoft Teams:** open **Settings > Devices** and select your microphone. Use **Make a test call** to hear a recording.
- **Discord:** open **User Settings > Voice & Video**, choose your **Input Device**, and use **Let's Check**. Check that you are not muted or deafened, and that input mode (voice activity or push-to-talk) is what you expect.
- **Browser meetings (Google Meet and others):** click the icon to the left of the address bar and set **Microphone** to **Allow**. Then pick the mic in the meeting's audio settings. Google's guide to [using your camera and microphone in Chrome](https://support.google.com/chrome/answer/2693767?hl=en) explains the site permission screen.

Also check whether the app has its own noise suppression turned up so high that it removes your voice, and whether the operating system's privacy settings allow desktop apps (see the Windows section above).

## How to fix microphone echo

Echo means others hear their own voice back, or you hear yourself repeated. In most cases your microphone is recording sound coming out of your speakers.

1. **Use headphones.** This is the most effective fix. When sound goes into headphones instead of speakers, the mic cannot pick it up again.
2. **Lower the speaker volume and move the mic away** from speakers if you cannot use headphones.
3. **Turn on echo cancellation** in your call app. Zoom, Teams, Discord and browsers include it, but it is sometimes disabled in "original sound" or studio modes.
4. **Turn off "Listen to this device".** In Windows, open **Sound > Recording**, select your mic, choose **Properties > Listen** and clear **Listen to this device**. When it is on, you hear yourself with a delay.
5. **Leave duplicate audio.** If two devices in the same room are in the same call, each one's microphone picks up the other's speakers. Mute or disconnect the extra device.
6. **Soften the room.** Hard, empty rooms reflect sound. Curtains, a rug or a few cushions reduce room echo, and moving closer to the mic helps more than raising its volume.

After each change, record a short clip in the [mic test](/#microphone-test) and listen back with headphones.

## Mic too quiet, crackling or robotic

The microphone works, but it does not sound right.

- **Too quiet:** move closer to the microphone, raise the input volume in system settings, and check that you are speaking into the front of the mic. Many USB mics pick up from one side only.
- **Distorted or harsh:** lower the input volume or gain; the signal is clipping. Speak at a normal level instead of shouting.
- **Crackling or static:** try another cable and USB port, avoid USB hubs, and move away from phone chargers and power bricks. For 3.5 mm plugs, clean the jack and push the plug fully in.
- **Robotic or cutting out:** usually a Bluetooth or network problem. Move closer to the computer, disconnect other Bluetooth devices, or use a wired connection. In call apps, a weak internet connection can also sound like a broken mic.
- **Background noise:** turn on noise suppression in the call app and move away from fans and keyboards.

## When is the microphone actually broken?

Consider replacing or repairing the microphone only when all of these are true:

- It records nothing on two different computers or phones.
- You tried another cable, port or adapter (for wired mics).
- Mute switches are off and permissions are allowed.
- Another microphone works on the same computer.

If a laptop's built-in microphone is silent on every app after a driver reinstall, while a headset works, the internal mic or its cable may need service. A [webcam and mic test](/webcam-test) is also useful here: many webcams have their own microphone you can use instead.

## Frequently asked questions

### Why isn't my mic working all of a sudden?

Sudden failures usually follow a change: a system update reset privacy settings, a new device became the default input, a headset mute switch was pressed, or another app took control of the microphone. Check permissions and the selected input first, then restart the app.

### How do I know if my microphone is working?

Open the [online microphone test](/#microphone-test), allow access and speak. If the level meter moves and you can hear your voice in the playback, the microphone works. You can also check the input level in your system sound settings.

### Why can people hear me in one app but not another?

Each app chooses its own microphone and has its own mute button and permission. Select the same microphone inside the app that does not work, and make sure the operating system allows that app to use the microphone.

### Why does my headset mic not work on my PC when the sound does?

The headset probably has a single 4-pole plug connected to a headphone-only jack. Use a headset splitter for computers with separate pink and green jacks, or choose "Headset" when the computer asks what you plugged in.

### How do I fix microphone echo on calls?

Wear headphones so your microphone cannot record your speakers, turn on echo cancellation in the call app, turn off "Listen to this device" in Windows, and make sure no second device in the room has joined the same call.

### Can a Windows update stop my microphone working?

Yes. Updates can reset privacy switches, change the default input or replace the audio driver. Recheck **Privacy & security > Microphone**, choose your input again, and reinstall the manufacturer's audio driver if needed.

## Test your microphone again

After each fix, [test your microphone](/#microphone-test) to confirm that it records clearly. Getting ready for a video call? Check your camera and microphone together with the [webcam and mic test](/webcam-test), and make sure you can hear others with the [speaker and headphone test](/speaker-test). For more help, read [how to test your microphone](/blog/how-to-test-your-microphone) or [contact support](/contact).
