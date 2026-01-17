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

## Preface

Welcome to my tutorial series on Butano, a modern C++ high-level engine for Game Boy Advance homebrew development. This will begin with introductions, then getting our environment setup, and then we will move into building a simple game over the course of several chapters.

If you'd like to skip introductions and get straight to the setup, you can jump to the [Prerequisites](#prerequisites) section.

### About Me

My name is Brad, aka "Bread" (as the baristas at coffee shops often call me). I am a hobbyist of many things. Professionally I am a Lead Data Engineer, though most of my experience was in Backend Software Engineering and Database Administration. My favorite language overall is SQL, because I love data transformation and declarative puzzles. My favorite imperative language is probably Rust, though there's such a small gap between Rust and C++ that it's hard to say definitively.

18 years ago I was gifted Mario Galaxy for the Nintendo Wii, and I was so blown away by the physics of a planetary system that 11 year old me wanted ***nothing*** more than to do that myself. Not just on PC, but on the Wii itself. I remember the day I published my first project for PC: March 14th 2009. My goal was always homebrew for consoles, but I wouldn't start seriously pursing that as my primary hobby until around COVID-19 in 2020.

### Intended Audience

While I will try to keep things as beginner-friendly as possible, I will be writing for an audience that has at least a basic understanding of C++ and minimal game development concepts. Butano is less of a game engine and more of a framework for asset management. As you'll come to find in this series, Butano simplifies most - but not all - aspects of developing a game for the Game Boy Advance.

This is intended for people who are interested in the hobby and it is supposed to be a fun use of your time. This series is for people who are driven by the high of making cool stuff.

Game Dev - and especially Homebrew Game Dev - is largely art, so I want to make this clear sooner rather than later: the use of GenAI tools is discouraged. I know people - including myself - are opinionated on the subject. The use of GenAI is not allowed in GBA Game Jams, and I feel that this is a good standard to uphold for learning and hobby purposes. Not only is this supposed to be fun, but copyright infringement is a valid concern for artists.

### What We Will Be Building

Over the course of this series, we will be building a simple puzzle game based on [Klotski](https://en.wikipedia.org/wiki/Klotski), which is often referred to as "sliding block puzzle." The goal of the game is to move - as I call it - "inconveniently" arranged rectangular blocks, which impede each other's paths, to free the target block. I recommend [this video](https://www.youtube.com/watch?v=YGLNyHd2w10) about Klotski for a handful of reasons, only one of which is relevant to this series (how the game works). This game will lay a great foundation for understanding Butano's core features, game loops, entity management, collision, and other game development concepts. For Butano specifically, we'll cover the following major features:

- Sprites
  - Regular
  - Affine
  - Fonts
- Backgrounds
  - Regular
  - Affine
  - Tiles
- Inputs
- Audio
  - Music
  - Sound Effects

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

You can find the next chapter in this series here: [Butano Series - Chapter 2](/butano-series-2).

---

{{_posts/components/gba-communities.md}}
