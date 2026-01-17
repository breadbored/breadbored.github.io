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

My name is Brad, aka "Bread" (as the baristas at coffee shops often call me). Professionally I am a Lead Data Engineer, though most of my experience was in Backend Software Engineering and Database Administration. My favorite language overall is SQL, because I love data transformation and declarative puzzles. My favorite imperative language is probably Rust, though there's such a small gap between Rust and C++.

18 years ago I was gifted Mario Galaxy for the Nintendo Wii, and I was so blown away by the physics of a planetary system that 11 year old me wanted ***nothing*** more than to do that myself. Right away, before I even finished Mario Galaxy, I downloaded a cracked version of Game Maker 5. After about 6 months I published my first "game" to YoYoGames March 14th, 2009 - nearly 18 years ago. I was so proud of myself for doing it - despite how bad it was - that I never stopped chasing that same high.

Early Wii homebrew is how I learned you could even make software for consoles without a devkit, and that became my goal. I made a couple demos and utilities for myself, but I didn't feel like I was quite "there" yet. There wasn't as much help online back then, especially compared to places like Discord today, and I didn't learn how to search documentation properly until years later. I shelved that goal until 2022.

Now that I have a few years of experience with homebrew, and a couple solid years of experience with the GBA through Butano, I want to be the help online that I didn't have.

### Intended Audience

While I will try to keep things as beginner-friendly as possible, I will be writing for an audience that has at least a basic understanding of C++ and minimal game development concepts. Butano is less of a game engine and more of a framework for asset management. As you'll come to find in this series, Butano simplifies most - but not all - aspects of developing a game for the Game Boy Advance.

This is intended for people who are interested in the hobby and it is supposed to be a fun use of your time. This is for people who are driven by the high of making cool shit

Game Dev - and especially Homebrew Game Dev - is largely art, so I want to make this clear sooner rather than later: the use of GenAI tools is discouraged. I know people - including myself - are opinionated on the subject. Opinions expressed are my own and are not a representation of the greater GBA community, however the use of GenAI is not allowed in GBA Game Jams, and I feel that this is a good standard to uphold for learning and hobby purposes. Not only is this supposed to be fun, but copyright infringement is a valid concern for artists.

### What We Will Be Building

Over the course of this series, we will be building a simple puzzle game based on [Klotski](https://en.wikipedia.org/wiki/Klotski), which is often referred to as "sliding block puzzle." The goal of the game is to move - as I call it - "inconveniently" arranged rectangular block, which block each other's paths, to free the target block. I recommend [this video](https://www.youtube.com/watch?v=YGLNyHd2w10) about Klotski for a handful of reasons, only one of which is relevant to this series (how the game works). This game will lay a great foundation for understanding Butano's core features, game loops, entity management, collision, and other game development concepts. For Butano specifically, we'll cover the following major features:

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

### Setup Complete

Thank you for joining me in the first chapter of this tutorial series. In the next post, we will be exploring the use of assets in Butano.

---

### Communities

#### Discord

- Please remember this is ***not my server***, so do not dominate the conversation with questions about this series. The topics are more broad than this series or even Butano itself, so please be respectful of that.
- If you need help, the thing that helps everyone involved is providing your full source code, or if you are unwilling to do that, a "Minimally Reproducible Example" that demonstrates your issue. Not only might you find your problem along the way, but this is a good practice in general when asking for help with programming.
- Please be respectful to @GValiente, the author of Butano, as well as other ***volunteers*** who are ***volunteering*** their time to help you. You are not entitled to their time or labor. I have had people break this rule ***many*** times in ***many*** projects. This is a hobby for everyone involved.
- Please search the channels for your question before asking it. Chances are, someone else has had the same question before you.
- Follow the server rules.

[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/ctGSNxRkg2)

#### Reddit

[r/Homebrew](https://www.reddit.com/r/Homebrew/) - A general homebrew community for all consoles.  
[r/RetroGameDev](https://www.reddit.com/r/RetroGameDev/) - A community for retro game development, including homebrew.  

#### BSky

[@Bread.Codes](https://bsky.app/profile/bread.codes) - My Bluesky profile. Many of the people I follow are into homebrew and retro game development.

#### Support the Community

Want there to be Jams? Want more resources, tutorials, and tools? Support the community by donating to the [OpenCollective](https://opencollective.com/gbadev) for GBADev! Your donations help fund events like [GBAGameJam](https://itch.io/jam/gbagamejam) and support the work of volunteers who create tools and resources for the community.

[![OpenCollective](https://img.shields.io/badge/Support-GBADev-blue?style=for-the-badge&logo=opencollective&logoColor=white)](https://opencollective.com/gbadev)
