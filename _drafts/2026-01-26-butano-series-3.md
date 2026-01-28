---
layout: post
chapter-header: Chapter 3
super-title: Butano Series
title: The Game Loop & Scenes
slug: butano-series-3
date: 2026-01-26
categories: ["media", "game boy", "gameboy", "gba", "game boy advance", "gamedev", "butano", "game dev"]
align: left
wider: true
excerpt: In this chapter, we will explore the game loop and scene management using Butano.
---

<center>
    <a href="https://buymeacoffee.com/breadcodes" target="_blank">
        <img src="/assets/buymeacoffee.png" alt="Buy Me A Coffee" style="width: 200px;" />
    </a>
</center>

## The Game Loop and Scenes

In short, a game loop is a loop that runs every frame. A scene is a sub-loop within the game loop, which spins off a new context for a scene or level of a game. Butano does not provide built-in support for scenes and the game loop, but we can do it ourselves.

### What is the Game Loop?

Simply, the game loop is a loop that runs continuously while the game is running. Every iteration of the loop is called a frame. During each frame, the game processes input, updates game state, and renders graphics to the screen.

#### Implementing the Game Loop

```cpp
#include "bn_core.h"

int main() {
    bn::core::init();

    while(true) {
        // Process input
        // Update game state
        // Render graphics

        bn::core::update(); // render the frame
    }
}
```

### What is a Scene?

The game loop can offload logic to sub-loops, such as scenes, which can themselves process input, updates game state, and renders graphics to the screen. Scenes are useful for separating different parts of a game, such as menus, levels, and cut-scenes.

### Implementing Scenes

I will demonstrate a simple scene management system using a variable to track the current scene. Each scene will be represented by a function that contains its own loop. The main game loop will call the appropriate scene function based on the current scene. Once inside the scene function, the process gets stuck in that scene's loop until a condition is met to switch to another scene or exit the game.

```cpp
#include "bn_core.h"

int scene_number = 1; // variable to track the current scene

void scene_1() {
    while(true) {
        // Process input for this scene
        // Update game state for this scene
        // Render graphics for this scene

        if (/* condition to switch to another scene */) {
            scene_number = 2; // switch to scene 2
            break; // exit the scene loop
        }

        bn::core::update(); // render the frame
    }
}

void scene_2() {
    while(true) {
        // Process input for this scene
        // Update game state for this scene
        // Render graphics for this scene

        if (/* condition to switch to another scene */) {
            scene_number = 1; // switch to scene 1
            break; // exit the scene loop
        }

        bn::core::update(); // render the frame
    }
}

int main() {
    bn::core::init();

    while(true) {
        if (scene_number == 1) {
            scene_1(); // switch to the scene
        } else if (scene_number == 2) {
            scene_2(); // switch to the scene
        } else {
            break; // exit the game loop
        }
    }
}
```

### Scopes

We need to understand scopes to appropriately manage variables and their lifetimes within the loops. In C++, scopes are defined by curly braces `{` & `}`. Variables defined within a scope are only accessible within that scope and child scopes, and are destroyed when the scope ends. Here's a visual representation:

```cpp
bool variable_A = true;

void some_function() {
    // can access only A here.
}

// highest scope is at our main function
void main() {
    bool variable_B = true;

    // game loop scope
    while(true) {
        bool variable_C = true;
        
        // scene scope
        while(true) {
            bool variable_D = true;

            // another scope
            if (variable_D) {
                bool variable_E = true;

                some_function(); // loses context of B, C, D, E, but they are not destroyed

                // can access A, B, C, D, E here
            }

            // can access A, B, C, D here; E is destroyed
        }

        // can access A, B, C here; D, E are destroyed
    }

    // can access A, B here; C, D, E are destroyed
}

// can access A here; B, C, D, E are destroyed
```

Understanding when and where a variable is accessible and when it is destroyed is important for logical flow, memory management, and understanding how scenes and the game loop interact.

## Implementing Scenes in Our Butano Project

Now we will finally implement scenes in our Butano project. We will create two simple scenes: a title screen and a gameplay screen. Each scene will have its own loop, and we will switch between them based on user input.

### TODO: Add practical example of scenes in Butano project

## Conclusion

In this chapter, we explored the concepts of the game loop and scenes, and how to implement them in C/C++. By managing scopes effectively, we can create a structured and organized game architecture that separates different parts of the game into manageable sections.

###### ButanoSeriesNav "3","3"

---
---

{{_posts/components/gba-communities.md}}

---

### Support the Series

<center>
    <a href="https://buymeacoffee.com/breadcodes" target="_blank">
        <img src="/assets/buymeacoffee.png" alt="Buy Me A Coffee" style="width: 200px;" />
    </a>
</center>

---

{{_posts/components/butano-series-license.md}}
