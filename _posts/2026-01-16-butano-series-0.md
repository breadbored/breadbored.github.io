---
layout: post
chapter-header: Chapter 0
super-title: Butano Series
title: Introductions and Overview
slug: butano-series-0
date: 2026-01-16
categories: ["miniproject", "media", "game boy", "gameboy", "gba", "game boy advance", "gamedev", "butano", "game dev"]
align: left
wider: true
---

[!["Buy Me A Coffee"](/assets/buymeacoffee.png)](https://buymeacoffee.com/breadcodes)

## Preface

Welcome to my tutorial series on Butano, a modern C++ high-level engine for Game Boy Advance homebrew development. This will begin with introductions, then getting our environment setup, and then we will move into building a simple game over the course of several chapters.

If you'd like to skip introductions and get straight to the setup, you can jump to [Chapter 1](/posts/butano-series-1).

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

### Chapter Overview

###### ButanoSeriesNav 0

---

{{_posts/components/gba-communities.md}}

---

{{_posts/components/butano-series-license.md}}
