---
title: "How to Connect and Set Up a Microphone on PC or Mac"
seoTitle: "How to Connect & Set Up a Microphone on PC or Mac"
excerpt: "Connect a USB mic or headset to your PC or Mac, turn on microphone access, choose input settings, and check console compatibility before using voice chat."
date: "2026-10-26"
modified: "2026-10-26"
tags: ["Setup", "Microphones", "Windows", "Mac"]
image: "/blog/connect-microphone/cover.jpg"
imageAlt: "How to connect and set up a microphone: USB microphone plugged into a laptop showing Sound input settings"
author: "Mic Testing Tool"
---

To connect and set up a microphone, use the connection your device supports, select the microphone as your sound input, allow access for your browser or recording app, and turn off any mute switch. Then record a short sample to check that the correct microphone is working.

This guide focuses on **connecting hardware and choosing mic settings**. If your microphone is already connected and you mainly want to check the sound, use the [microphone testing how-to guide](/blog/how-to-test-your-microphone) or [open the free microphone test](/#microphone-test).

## Choose the right connection for your microphone

Identify the connector before changing software settings. A plug that fits a socket is not enough to establish audio compatibility.

![Microphone connection types: USB microphone, 3.5 mm headset with one plug, headset with two plugs, XLR microphone with audio interface, and Bluetooth](/blog/connect-microphone/connection-types.svg "Identify your connector first: USB, 3.5 mm, two plugs, XLR or Bluetooth.")

- **USB microphone:** sends digital audio through a USB connection. Use the supplied cable or a compatible data cable. A microphone can receive power without establishing a working data connection.
- **3.5 mm headset:** usually combines headphones and a microphone in a single four-contact TRRS plug. A computer with separate headphone and microphone sockets may need a compatible headset splitter.
- **3.5 mm standalone mic:** may use a different contact arrangement or require an adapter or plug-in power. Check the mic and computer manuals rather than assuming it works in a headphone socket.
- **XLR microphone:** normally connects to a microphone preamp or audio interface, which then connects to the computer. A passive cable does not replace an interface's preamp and conversion functions.
- **Wireless headset:** needs the wireless connection or receiver supported by both the headset and host. A Bluetooth connection on a PC does not establish compatibility with every console.

For a microphone or interface with power requirements, follow its manual. Enable phantom power only when the connected microphone and equipment require and support it; it is not a universal way to turn on a mic.

## How to connect a USB mic to a PC

1. **Place the microphone and connect its cable.** Start with a direct computer USB port while troubleshooting, rather than an unpowered hub.
2. **Wait for device detection.** If the manufacturer requires a driver or setup utility for your model, use its official instructions. Do not install unrelated driver-download software.
3. **Check the microphone's controls.** Turn off hardware mute. If it has separate gain and headphone-volume controls, identify which is which.
4. **Select the microphone as your input.** Open your operating system's sound settings and choose the new device. A connected webcam or laptop mic may still be selected instead.
5. **Choose the input inside your app.** Meeting, game-chat, browser and recording applications can each use a different source.
6. **Make a short recording.** Speak normally, stop and listen. Compare a second sample after changing just one setting.

If the mic lights up but does not appear as an input, check the data cable and try another port. Its headphone socket, if present, may be an output for listening rather than a way to send mic audio to the computer.

## Turn on microphone access and adjust Windows mic settings

There are three different controls to check: physical mute, operating-system access and the app's own input or mute setting. Turning on one does not automatically change the others.

### Windows 11

Open **Settings > System > Sound > Input** and choose your microphone. Open its properties to adjust input volume and use the microphone test where available.

For access, go to **Settings > Privacy & security > Microphone**. Check microphone access and the relevant app permissions, including desktop-app access when applicable. A desktop program may not appear as an individually selectable app.

### Windows 10

Select the input under **Settings > System > Sound**. Microphone permission controls are under **Settings > Privacy > Microphone**; review access for the applications you use.

Microsoft's [microphone troubleshooting guidance](https://support.microsoft.com/en-us/windows/hardware/drivers/fix-microphone-problems) explains these permission and input checks. Controls differ by Windows version, driver and device policy. If an employer manages the PC, some changes may require its administrator.

After changing access, reopen the affected app if necessary. Adjust input gain gradually while speaking normally. Raising headphone playback volume makes you hear more; it does not necessarily increase the recorded microphone level.

## How to connect and set up a microphone on a Mac

Connect the USB microphone or audio interface with a compatible cable and adapter. For an analog headset, verify that your Mac's audio port supports the headset's microphone connection. An output-only adapter cannot provide a microphone input.

![Mac System Settings Sound Input tab with a USB microphone selected, input volume slider and moving input level](/blog/connect-microphone/mac-sound-input.svg "On a Mac: Sound > Input, select the microphone, then watch the input level move.")

Open **Apple menu > System Settings > Sound > Input**, choose the intended microphone and check the input response while speaking. Adjust input volume if your device exposes that setting. Some interfaces use their own hardware gain control instead.

If an app cannot use the microphone, review **System Settings > Privacy & Security > Microphone** and allow it. Follow any prompt to quit and reopen the app. Older macOS versions may use different menu names.

Apple's [sound input settings guide](https://support.apple.com/guide/mac-help/change-the-sound-input-settings-mchlp2567/mac) describes selecting sources and adjusting available input controls. Choose the same device in your meeting or recording app rather than relying on the system choice alone.

## Set up a headset or XLR microphone

### A headset with one or two audio plugs

Check whether the computer has a combined headset port or separate input and output sockets. Use an adapter designed for the headset's contact standard and the computer's ports. A headphone-sharing splitter is not the same as a headset input/output splitter.

If you hear audio but nobody hears your voice, check the headset mute switch, boom connection and selected input. Hearing the headphones confirms the output path, not the microphone path.

Use the [speaker and headphone test](/speaker-test) to check left/right playback, then record the headset microphone separately. The two tests check different signal paths.

### An XLR microphone through an audio interface

Connect the microphone to the interface's appropriate mic input and connect the interface to the computer. Select the interface as the recording source. Follow the interface manufacturer's driver, channel and power instructions.

Begin with modest gain and speak at the distance you expect to use. If you monitor through both the interface and software at once, you may hear a doubled or delayed voice; use the monitoring arrangement described in the interface manual. The browser may expose the interface under its own name rather than the microphone's model name.

## Connecting a USB mic to a PC and console

**PC support does not guarantee console support.** Before moving or buying equipment, check the manufacturer's compatibility list for your exact microphone, console and connection method. USB power, USB audio and voice-chat support are different capabilities.

### PlayStation 5

For a supported headset or USB microphone, check **Settings > Sound > Microphone** on PS5. Select the input and adjust microphone level. You can also access microphone controls through the control centre. Check mute status so the console does not use the controller's microphone when you expect another source.

Sony's [voice-chat troubleshooting instructions](https://www.playstation.com/en-gb/support/games/ps4-voice-chat-issues/) describe changing the input for a controller, headset or USB mic. These settings do not guarantee that every USB model is compatible. Confirm the specific device with its manufacturer.

### Xbox consoles

Do not assume that a USB microphone working on Windows will work when plugged into an Xbox console. Look for explicit support for your console and connection. A compatible controller-connected headset is a different setup from a generic USB desk microphone.

For example, the official [Xbox Stereo Headset](https://www.xbox.com/en-US/accessories/headsets/xbox-stereo-headset/) connects through a controller's 3.5 mm jack. That documented connection is not a blanket compatibility promise for other microphones or adapters.

When using a capture or streaming PC, selecting a microphone in the PC's streaming software does not automatically route it into console party chat. Decide whether you need stream commentary, in-game chat or party chat, then follow a supported connection method for that use.

### Other consoles and adapters

Check the console model, game and voice-chat feature separately. Avoid buying a simple USB-to-audio adapter on the assumption that it adds an unsupported microphone function. The adapter and host must both support the intended audio path.

## Choose microphone settings in your browser and apps

Once the system sees your mic, open the app you actually want to use and choose that input. Check its mute state and run its audio check if available. Browser site permission is separate from app and operating-system permission.

For the online tester, start the test and approve the site's microphone request. If access was previously blocked, update the site's permission and reload. See our [microphone permissions help](/faq) if there is no prompt or no signal.

Noise suppression and automatic gain in a meeting app can change how the same device sounds. Keep your starting position and speaking level consistent, then adjust settings one at a time. There is no single ideal gain percentage for every voice and microphone.

## Confirm your setup with a short recording

[Record a microphone test](/#microphone-test), speak for 10 to 15 seconds, stop, and listen through headphones. Check that you hear the intended microphone, not a laptop or webcam input. Listen for clear speech, distortion, dropouts and unwanted room sound.

A moving meter shows input activity; it does not certify sound quality or console compatibility. Our browser tool cannot change Windows, Mac or console settings for you. It processes the test audio locally and does not upload your recording. Read about [recording privacy and measurement limits](/security).

If your setup still fails, isolate the stage where it stops working:

- **Not listed by the system:** check cable, port, power requirements, compatibility and the manufacturer's setup instructions.
- **Listed but no input activity:** check hardware mute, gain, selected channel and system access.
- **System test works but the app does not:** check the app's source, permissions and mute controls.
- **Mic works on PC but not console:** check explicit support for the console and intended chat feature; changing PC gain is unlikely to fix unsupported hardware.

Use the [full testing and troubleshooting hub](/blog/how-to-test-your-microphone) for interpreting a recording, or [contact support](/contact) with your device model, operating system, connection and error message.

## Frequently asked questions

### How do I turn on my mic?

Unmute the microphone, enable the required system and app permissions, and select the right input. On a browser tester, press Start before expecting a permission prompt. A USB mic does not necessarily have a separate power switch.

### Where are my microphone settings?

On Windows, start with System > Sound > Input. On a Mac, use System Settings > Sound > Input. Also check the app's audio settings and the operating system's microphone privacy controls.

### Can I plug a USB mic into any console?

No universal USB compatibility rule covers every console and mic. Verify the exact model and chat function before relying on it. A USB socket or illuminated microphone does not prove that the console can use its audio.

### Why can I hear my headset but its mic does not work?

The headphones and microphone use separate signal paths. Check the port or adapter, headset mute, input selection and permissions. An output-only connection can play sound without carrying microphone input.

### Do all microphones need phantom power?

No. Requirements depend on the microphone and interface. Use the manufacturer's instructions; do not enable phantom power as a general fix for a silent microphone.

### Does the online test turn on my system microphone for every app?

No. It requests permission for this website and tests the input available to the browser. Other applications and consoles keep their own input, mute and access settings.
