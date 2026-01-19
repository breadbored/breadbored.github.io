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

##### Development Tools

- [DevKitPro](https://devkitpro.org/wiki/Getting_Started), our toolchain for building GBA homebrew
  - Once installed, install the `gba-dev` package.
    - Windows:
        This is done through the GUI installer. Choose the `gba-dev` package from the list. If you forgot to install it, you can re-run the installer to add it
    - MacOS / Linux terminal:
      - Most systems: `dkp-pacman -S gba-dev`
      - Some distros using vanilla pacman: `pacman -S gba-dev`
- [mGBA](https://mgba.io/downloads.html), an emulator for testing our GBA homebrew.
  - Supports GDB debugging as well for breakpoints and memory inspection.
- `git`, for version control
  - Windows: [Git for Windows](https://gitforwindows.org/)
    - For the remainder of this tutorial, you will be using the Git Bash terminal so that the commands match those shown for MacOS and Linux.
  - MacOS: Install via [Homebrew](https://brew.sh/) with `brew install git`, or download from [git-scm.com](https://git-scm.com/download/mac)
  - Linux: Install via your package manager, e.g. `sudo apt install git` on Debian-based systems

Some flavorful alternatives for the experienced reader who wants to explore beyond the scope of this tutorial:

- Toolchains:
  - [Wonderful Toolchain](https://wonderful.asie.pl/), an alternative GBA homebrew toolchain supported by Butano.
    - For Windows & Linux only!
- Emulators:
  - [VisualBoyAdvance-M (VBA-M)](https://github.com/visualboyadvance-m/visualboyadvance-m), a popular alternative emulator for GBA homebrew development.
    - It supports debugging with gdb like mGBA, which is very useful
  - [Mesen](https://mesen.ca/), an alternative emulator that supports GBA, has a color mode that more closely matches the original screen, and has a great debugger.

Finally, you will need a code editor. This is the most highly subjective part of the setup, so I will leave it up to you. 

If you are a beginner, don't use a basic text editor or an IDE that requires extensive configuration unless you really know what you're doing. Beginners will fall into the trap of simple text editors or misconfigurations, and run into errors they don't know how to debug. IDEs are designed to help you with debugging and code management. Experienced developers may prefer text editors or highly configurable IDEs, but they also know how to debug issues that arise from using them.

I have included configurations for the following editors in the repository:

|**Editor**|**Pros**|**Cons**|**Notes**|
|:---:|:---:|:---:|:---:|
|[Visual Studio Code](https://code.visualstudio.com/)|Supports every OS<br/>Free and open source<br/>Extensive plugin ecosystem<br/>Supports many languages and frameworks<br/>Supports GDB debugging with the right extensions<br/>Integrated git support|Can be resource-intensive with many extensions<br/>Built on Electron and Chromium, which comes with its own set of trade-offs|Popular choice|
|[Zed](https://zed.dev/)|Free and open source<br/>Fast and modern features<br/>Built on Rust for memory safety<br/>Good language support<br/>Integrated git support|Newer IDE with a smaller ecosystem|I like it a lot. I use it for my job.|
|Any editor that uses clangd for C++ language server support|Clangd provides smart code analysis, autocompletion, and error checking|Requires configuration to set up clangd and integrate with the editor|Flexible option for advanced users|

Editors that I recommend but did not include configurations for:

|**Editor**|**Pros**|**Cons**|**Notes**|
|:---:|:---:|:---:|:---:|
|[CLion](https://www.jetbrains.com/clion/)|First-class C++ support with smart code analysis<br/>Integrated debugger<br/>Great refactoring tools|Paid product (free trial and free licenses for students and open source contributors)<br/>More resource-intensive than VS Code|My preferred IDE for C++ development|
|[Visual Studio](https://visualstudio.microsoft.com/)|Powerful IDE with extensive features<br/>Excellent debugging and profiling tools<br/>Strong C++ support|Primarily Windows-focused<br/>Can be resource-intensive|Great for Windows users|
|[Vim / Neovim](https://neovim.io/)|Extremely lightweight and fast<br/>Highly customizable with plugins<br/>Powerful keyboard-centric editing|Steeper learning curve<br/>Requires configuration for optimal C++ support|Great for those who prefer terminal-based editors|

##### Art Tools

\* What we will be using in this series.

- Visual Asset Options:
  - [Aseprite (paid)](https://www.aseprite.org/)\*, a pixel art tool for creating sprites and animations.
    - Paid software, but worth the investment. I have bought this software 3 times across different computers because I use it so much.
  - [Aseprite (source)](https://github.com/aseprite/aseprite/releases), the open source version of Aseprite that you can compile yourself.
    - Lacks some features of the paid version, but still very capable.
  - [GIMP](https://www.gimp.org/), a free and open source image editor.
    - More general-purpose than Aseprite, but can be used for pixel art as well.
  - [Krita](https://krita.org/en/), another free and open source image editor.
    - Also more general-purpose, but has good support for pixel art.

- Audio Assets Options:
  - [OpenMPT](https://openmpt.org/)\*, a free and open source tracker for creating music.
    - Supports exporting to formats compatible with GBA homebrew.
    - Windows "only" software, but can be run on MacOS & Linux with Wine (requires `wine`).
      - MacOS
        - Install [Homebrew](https://brew.sh/) if you haven't already with `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
        - Run `brew install --cask wine-stable` to install Wine.
      - Linux
        - Install Wine via your package manager, e.g. `sudo apt install wine` on Debian-based systems.
  - [Furnace Tracker](https://tildearrow.org/furnace/), a free and open source tracker designed for chiptune music.
    - Cross-platform and lightweight.
    - "Supports" making GBA music, but the only format it can export that is compatible is VGM, which means you can only make Game Boy / Color music. Luckily, the GBA is backwards compatible with GB/C audio, but you cannot take advantage of the GBA's 2 PCM channels.
      - This could be a misunderstanding on my part; please correct me if I'm wrong!

### Getting the starter repository

From here on out, if you are on Windows, "terminal" means the Git-Bash terminal. It is important to use Git-Bash because many commands will not work correctly in Command Prompt or PowerShell.

Open your terminal, navigate to your desired directory, and run the following commands to clone the starter repository and navigate into it:

```bash
# Clone the repository and navigate into it
git clone https://github.com/breadbored/butano-tutorial-series.git butano-tutorial-series
cd butano-tutorial-series

# Initialize git submodules, which includes Butano itself and an extension for Fonts
git submodule update --init --recursive
```

In this directory you will find:

```text
butano-tutorial-series/
├─ chapter-1-getting-started/   - Our starting point for this series
├─ .gitignore
├─ LICENSE
├─ README.md
```

You can follow along with the tutorial series in its entirety by using the `chapter-1-getting-started` directory as your starting point, and work in that directory (or copy that directory elsewhere) for the duration of the series. The other directories are provided for reference. For the purposes of this tutorial, we will be working in the `chapter-1-getting-started` directory.

```bash
cd chapter-1-getting-started
```

Now let's build and run our starter project to ensure everything is working correctly.

```bash
make
```

To start the game in mGBA (without debugging with gdb) you can run:

```bash
make run
```

Once you see the mGBA window pop up with our starter project running, congratulations! Your development environment is set up correctly!

### What's Next?

Next we will begin working with assets in Butano. This includes creating and importing sprites, backgrounds, and audio into our project. We will also explore ways to use those assets.

### Chapter Overview

###### ButanoSeriesNav "1","1"

---
---

{{_posts/components/gba-communities.md}}

---

{{_posts/components/butano-series-license.md}}
