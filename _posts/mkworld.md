---
layout: post
title: Mario Kart World Toolkit
date: 2025-07-19
categories: ["mariokartworld"]
---

This is a temprorary post for hosting the alpha version of the Mario Kart World Toolkit.

How to use the Toolkit:

- [Windows](#windows)
    - [Download](#download)
    - [Setup Instructions](#setup-instructions-windows)
    - [How to choose a track](#how-to-choose-a-track)
    - [Optional: How to stream with OBS (Windows 11)](#optional-how-to-stream-with-obs-windows-11)
    - [How to test the program for pre-release testing](#how-to-test-the-program-for-pre-release-testing)
- [DISCLAIMER](#disclaimer)

## Windows

### Download

- [v0.0.4](https://github.com/breadbored/breadbored.github.io/releases/download/v0.0.4/MKWorld.Toolkit_0.0.4_x64-setup.exe) (latest)
    - Changes:
        - Added support for Elgato HD60 series capture cards
        - Added support for YUV2 2-byte pixel format
        - Added support for 4k capture cards
- [v0.0.3](https://github.com/breadbored/breadbored.github.io/releases/download/v0.0.3/MKWorld.Toolkit_0.0.3_x64-setup.exe)
    - Changes:
        - Added "Data Consent" dialog for optional error reporting
            - This is ***optional*** and ***off by default***, but if enabled, helps me resolve issues in the app faster and easier for everyone. Please consider enabling it.
            - Data is never shared with anyone except me, and is not used for any other purpose.
        - Added support for Windows 11 camera sharing
            - This allows you to use the capture card in OBS while also using it in the MKWorld Toolkit (see [Optional: How to stream with OBS (Windows 11)](#optional-how-to-stream-with-obs-windows-11) for instructions).
        - Fixed a bug where all times would report negative if the game pauses
        - Fixed a bug where auto-splits get triggered when the game is paused or the player falls off the track

### Setup Instructions (Windows)

- (Optional) If you want to stream MKWorld with OBS, you must download use Windows 11 (or Mac or Linux when I publish the releases for those platforms).
    - You need this (for now) because Windows 10 doesn't support multiple applications using the same capture card at the same time, but Windows 11 has an option for it you can enable. I am trying to develop a built-in virtual camera for the toolkit for Windows Pre-11 users, but it is not ready yet.
    - See [Optional: How to stream with OBS (Windows 11)](#optional-how-to-stream-with-obs-windows-11) for instructions on how to set this up.
- Download the [Windows](https://github.com/breadbored/breadbored.github.io/releases/download/v0.0.2-alpha/MKWorld.Toolkit_0.0.2_x64-setup.exe) version of the MKWorld Toolkit.
- Run the installer and follow the instructions.
- Once installed, open MKWorld Toolkit.

### How to choose a track

- Click the top left menu button and select "Split Management" in the menu.
- Choose the track you want to run, put in the times you want to compare against, and then click the save button at the very bottom of the screen.

### (Optional) How to stream with OBS (Windows 11)

You must have OBS and Windows 11.

#### Set up your capture card in Windows 11:

Instructions with images can be found [here](https://www.elevenforum.com/t/enable-or-disable-multiple-apps-to-use-camera-in-windows-11.31199/).

- Open Windows 11 Settings with `Win + I`.
- Go to "*_Bluetooth & devices_*"
- Click "*_Cameras_*"
- Under *_Connected cameras_* , click on the capture card (e.g. "MiraBox") you want to change this setting for.
- Click on the *_Edit_* button for *_Advanced camera options_*.
- Turn `on` or `off` *_Allow multiple apps to use camera at the same time_* for what you want, and click on Apply.

#### Set up OBS to use the capture card:

- Open MKWorld Toolkit
- Open OBS and add a new source.
- Choose "Video Capture Device" and select the SplitCam camera as the device.
- Add a webview source and set the URL to `http://localhost:2025/obs`.
  - Set the size to 800x1080, or whatever size you want the speedrun split UI to be.
- Arrange to flavor.

### How to test the program for pre-release testing

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

## DISCLAIMER

MKWorld Toolkit is in ALPHA. It was originally built for my own personal use on MacOS, and Windows is in an untested state.