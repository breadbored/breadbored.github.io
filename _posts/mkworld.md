---
layout: post
title: Mario Kart World Toolkit
date: 2025-07-19
categories: ["mariokartworld"]
---

This is a temporary post for hosting the alpha version of the Mario Kart World Toolkit.

Know what to do and just need the download link? [Go here!](#download)

[Join the brand-new Discord](https://discord.gg/FVscyknKZH) for support, feature requests, bug reports, and to contribute art and code!

How to use the Toolkit:

- [Windows 11 24H2, latest update patch](#windows)
    - [Pre-Setup Instructions (Windows 11 24H2 latest patch)](#pre-setup-instructions-windows-11-24h2-latest-patch)
<!-- - [MacOS](#macos)
    - [Pre-Setup Instructions (MacOS)](#pre-setup-instructions-macos)
- [Linux](#linux)
    - [Debian / Ubuntu / Debian-based Distros](#debian-ubuntu-debian-based-distros)
    - [Others](#others) -->
- [Setup Instructions for All Platforms](#setup-instructions-for-all-platforms)
    - [Download](#download)
    - [How to choose a track](#how-to-choose-a-track)
    - [Set up OBS to use the capture card](#set-up-obs-to-use-the-capture-card)
    - [How to test the program for pre-release testing](#how-to-test-the-program-for-pre-release-testing)
- [DISCLAIMER](#disclaimer)

## Windows

### Pre-Setup Instructions (Windows 11 24H2 latest patch)

When I refer to Windows 11, I mean Windows 11 24H2 with the latest updates installed. There is a patch after 24H2 that adds the ability to use the camera in multiple applications at once, which is required for the MKWorld Toolkit to work with OBS.

Instructions with images can be found [here](https://www.elevenforum.com/t/enable-or-disable-multiple-apps-to-use-camera-in-windows-11.31199/).

- Open Windows 11 Settings with `Win + I`.
- Go to "***Bluetooth & devices***"
- Click "***Cameras***"
- Under ***Connected cameras*** , click on the capture card (e.g. "MiraBox") you want to change this setting for.
- Click on the ***Edit*** button for ***Advanced camera options***.
- Turn `on` or `off` ***Allow multiple apps to use camera at the same time*** for what you want, and click on Apply.

[Continue to setup instructions](#setup-instructions-for-all-platforms).

<!-- ## MacOS

### Pre-Setup Instructions (MacOS)

The app is unsigned because an Apple Developer account is $99/year, so you will need to allow the app to run in your security settings.

- Open System Settings.
- Go to "***Privacy & Security***".
- Scroll down to the "***Security***" section.
- Click on the "***Allow***" button next to the "***MKWorld Toolkit*** app.

[Continue to setup instructions](#setup-instructions-for-all-platforms).

## Linux

### Debian / Ubuntu / Debian-based Distros

All good :D

[Continue to setup instructions](#setup-instructions-for-all-platforms).

### Others

Wait until the source is available... I am refactoring the code on a daily basis until I'm happy with architecture, and it is subject to change frequently. I can't reasonably maintain a complex CI/CD pipeline while the code and dependencies are in flux.

[Continue to setup instructions](#setup-instructions-for-all-platforms). -->

---

## Setup Instructions for All Platforms

### Download

- v0.0.5 (latest)
    - [Windows Download](https://github.com/breadbored/breadbored.github.io/releases/download/v0.0.5/MKWorld.Toolkit_0.0.5_x64-setup.exe)
    <!-- - MacOS
        - [Intel/x86_64 Download]()
        - [Apple Silicon/ARM Download]()
    - Linux
        - [Linux (.deb)]() -->
    - Changes:
        - HUGE performance improvements
        - Attempt History and Export
        - Better capture card support
        - 90% of bugs reported have been fixed
- v0.0.4
    - [Windows Download](https://github.com/breadbored/breadbored.github.io/releases/download/v0.0.4/MKWorld.Toolkit_0.0.4_x64-setup.exe)
    - Changes:
        - Added support for Elgato HD60 series capture cards
        - Added support for YUV2 2-byte pixel format
        - Added support for 4k capture cards
- v0.0.3
    - [Windows Download](https://github.com/breadbored/breadbored.github.io/releases/download/v0.0.3/MKWorld.Toolkit_0.0.3_x64-setup.exe)
    - Changes:
        - Added "Data Consent" dialog for optional error reporting
            - This is ***optional*** and ***off by default***, but if enabled, helps me resolve issues in the app faster and easier for everyone. Please consider enabling it.
            - Data is never shared with anyone except me, and is not used for any other purpose.
        - Added support for Windows 11 camera sharing
        - Fixed a bug where all times would report negative if the game pauses
        - Fixed a bug where auto-splits get triggered when the game is paused or the player falls off the track

### How to choose a track

- Click the top left menu button and select "Split Management" in the menu.
- Choose the track you want to run, put in the times you want to compare against, and then click the save button at the very bottom of the screen.

### Set up OBS to use the capture card:

- Open MKWorld Toolkit
- Open OBS and add a new source.
- Choose "Video Capture Device" and select the capture card as the device.
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