---
layout: post
super-title: Chapter 1
slug: butano-series-1
title: Intro to Butano
date: 2026-01-13
categories: ["miniproject", "media", "game boy", "gameboy", "gba", "game boy advance", "gamedev", "butano", "game dev"]
align: left
wider: true
---

## Getting Started

### Prerequisites

While I will be doing all of my development on MacOS and Linux, DevKitPro supports Windows as well. You can find installation instructions for all three platforms on the [DevKitPro website](https://devkitpro.org/wiki/Getting_Started).

#### Software

- [DevKitPro](https://devkitpro.org/wiki/Getting_Started), our toolchain for building GBA homebrew
  - Once installed, install the `gba-dev` package.
    - Windows:
        This is done through the GUI installer. Choose the `gba-dev` package from the list. If you forgot to install it, you can re-run the installer to add it
    - MacOS / Linux terminal:
      - Most systems: `dkp-pacman -S gba-dev`
      - Some distros using vanilla pacman: `pacman -S gba-dev`
- [mGBA](https://mgba.io/downloads.html), an emulator for testing our GBA homebrew
- `git`, for version control
  - Windows: [Git for Windows](https://gitforwindows.org/)
  - MacOS: Install via [Homebrew](https://brew.sh/) with `brew install git`, or download from [git-scm.com](https://git-scm.com/download/mac)
  - Linux: Install via your package manager, e.g. `sudo apt install git` on Debian-based systems

Some flavorful alternatives for the experienced reader who wants to explore beyond the scope of this tutorial:

- Toolchains:
  - [Wonderful Toolchain](https://wonderful.asie.pl/), an alternative GBA homebrew toolchain supported by Butano. For Windows & Linux only.
- Emulators:
  - [Mesen](https://mesen.ca/), an alternative GBA emulator.

### Getting the starter repository

Open your terminal, navigate to your desired directory, and run the following commands to clone the starter repository and navigate into it:

```bash
git clone https://github.com/breadbored/butano-tutorial-series.git butano-tutorial-series
cd butano-tutorial-series
```

In this directory you will find:

```text
butano-tutorial-series/
├─ chapter-1-getting-started/ - Our starting point for this series
├─ chapter-2-assets/          - Our next chapter, covering assets
├─ chapter-3-game-loop/       - Chapter covering the game loop
├─ chapter-4-entities/        - Chapter covering entities and sprites
├─ .gitignore
├─ LICENSE
├─ README.md
```

You can follow along with the tutorial series in its entirety by using the `chapter-1-getting-started` directory as your starting point, and work in that directory (or copy that directory elsewhere) for the duration of the series. The other directories are provided for reference.

### What's Next?

Next we will begin working with assets in Butano. This includes creating and importing sprites, backgrounds, and audio into our project. We will also explore ways to use those assets.

### Chapter Overview

- [Chapter 0 - Introductions and Overview](/posts/butano-series-0): Introducing the series, myself, and what we will be building.
- \[Chapter 1 - Intro to Butano\]: Setting up our development environment.
- \[Work in Progress\] Chapter 2
- \[Work in Progress\] Chapter 3
- \[Work in Progress\] Chapter 4
- \[Work in Progress\] Chapter 5
- \[Work in Progress\] Chapter 6

###### NextPrev "Chapter 0: Introductions","/posts/butano-series-0","Chapter 2: Assets","/posts/butano-series-2"

---

{{_posts/components/gba-communities.md}}

---

{{_posts/components/butano-series-license.md}}
