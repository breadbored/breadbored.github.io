---
layout: post
title: Mario Kart World Toolkit
date: 2025-07-19
categories: ["mariokartworld"]
---

This is a temprorary post for hosting the alpha version of the Mario Kart World Toolkit.

You can download the toolkit from the links below:

- [Windows](/MkWorld.Toolkit_0.0.2_x64-setup.exe)

How to use the Toolkit:

## Windows 

### Setup Instructions

- (Optional) If you want to stream MKWorld with OBS, you must download SplitCam from https://splitcam.com/
    - You need this (for now) because Windows doesn't support multiple applications using the same webcam at the same time. I am trying to develop a built-in virtual camera for the toolkit, but it is not ready yet.
    - I do not have instructions for setting this up. Please refer to the SplitCam documentation for help.
- Download the [Windows](/MkWorld.Toolkit_0.0.2_x64-setup.exe) version of the MKWorld Toolkit.
- Run the installer and follow the instructions.
- Once installed, open MKWorld Toolkit.

### How to choose a track

- First click the top left button and select "Split Config" in the menu.
- Choose the track you want to run, put in the times you want to compare against, and then click the save button at the very bottom of the screen.

### (Optional) How to stream with OBS

- You must have OBS and SplitCam installed.
- Open MKWorld Toolkit
- Open OBS and add a new source.
- Choose "Video Capture Device" and select the SplitCam camera as the device.
- Add a webview source and set the URL to `http://localhost:2025/obs`.
  - Set the size to 800x1080, or whatever size you want the speedrun split UI to be.
- Arrange to flavor.

### How to test your setup

- Open the MKWorld Toolkit.
- Once MKWorld Toolkit is opened, you can navigate to http://localhost:2025/obs in your web browser.
    - You should now see the speedrun split UI.
- In the MKWorld Toolkit, go to the "Camera Capture" tab if you are not already there.
- Select your capture card and then click the "Start Capture Card" button.
- Play a Time Trial!
    - ***NOTE: If none of the following happens, refresh the http://localhost:2025/obs page in your web browser.***
    - Once the timer in game is detected to be 0:00.000, the timer will reset.
    - Once the race starts, the timer will start counting up.
    - Once a lap is completed, the timer will stop and the splits will be updated.
    - Once the race is completed, the timer will stop and the splits will be updated.
    - The timer resets when you restart the race.

### DISCLAIMER

MKWorld Toolkit is in ALPHA. It was originally built for my own personal use on MacOS, and Windows is in an untested state.