---
layout: post
title: Gameboy Printer with a RP2040 (Pi Pico) Microcontroller
date: 2022-12-01
categories: ["retro-computing", "microcontrollers"]
---

## Table of Contents

1. [The Project](#the-project)
2. [The Serial Protocol](#the-serial-protocol)
   1. [Definitions](#definitions)
   2. [Diagrams](#diagrams)
   3. [Pseudocode](#pseudocode)
3. [The Gameboy Printer](#the-gameboy-printer)
4. [Important Notes](#important-notes)

<iframe width="536" height="302" src="https://www.youtube.com/embed/EhVYzfLQQ70" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<a href="https://www.patreon.com/bePatron?u=34519148" data-patreon-widget-type="become-patron-button">Become a Patron!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>

## The Project

The objective is to document the Gameboy Printer, it's protocol, and the image format in a single source, and use that information to create a printer driver using a Raspberry Pi Pico.

I originally did this project on the Arduino back in 2014 using a project that was already available, but I'm writing all of this from the ground up to better document, integrate into other Gameboy related projects, and of course bring the Gameboy Printer to the Pi family. The project I originally used was [davedarko/GBPrinter](https://github.com/davedarko/GBPrinter) that generated PHP page to handle generating some of the code, but more recently I found that someone forked that project to bring us the improved [octavifs/GBPrinter](https://github.com/octavifs/GBPrinter) that uses Go for generating images.

The Raspberry Pi company have now released a $4 ARM microcontroller, and I wanted this to be as cheap as possible for other people to try.

## The Serial Protocol

The Gameboy Original/Color/Advance, and by extension the Gameboy Printer, use an SPI-esque protocol to talk to each other. SPI is avery simple synchronous protocol, involving only a TX (outbound data), RX (inbound data), CLK (clock), and the CS (chip select) which the gameboy does not use. The Gameboy excludes the CS pin as it only expects to have a single master device and a single slave device.

### Definitions

- Master
  - The primary device that manages the interaction
- Slave
  - The device being controlled by the master
- CLK
  - Clock
  - A signal that goes `HIGH` then `LOW` to let the slave know that the next piece of data is coming
- TX
  - Digital signal out from the master or slave device. Connects to the other device's RX.
- RX
  - Digital signal in to the master or slave device. Connects to the other device's TX.
- CS
  - Chip Select (unused)
- GND
  - Ground

### Diagrams

Below is the Gameboy Color Cable pinout.

```text
    _________   1 -> 5v*
   / 1  2  3 \  2 -> RX
  /           \ 3 -> CLK
  |           | 4 -> TX
  |  4  5  6  | 5 -> Reserved*
  +-----------+ 6 -> GND

* means we do not need that pin
```

It is important to test these pins with a voltmeter because the inner cable colors are rarely correctly colored on 3rd party cables, and sources that rely on color coded wires may cause damage to your microcontroller. When you use a voltmeter to identify the TX and RX pins, remember that the TX from one end is the RX for the other and vice versa. Below will hopefully clarify what I am saying:

```text
  Master        Slave
  | TX ___   ___ TX |
  |        \/       |
  |        /\       |
  | RX ---   --- RX |
```

Each clock cycle (HIGH/LOW or 1/0) only one bit of data is transferred. Data is sent and read on the rising edge of the clock; rising edge meaning the short ±1 microsecond when the clock goes from LOW to HIGH. The following is an ASCII diagram from the oscilloscope where the number `162` (`0xA2` in hex or `10100010` in binary). The Gameboy has a clock speed of 8192 bits per second (8kb/s), which is 1KB/s or 1 bit every ~122μs.

Both the master and slave can send and receive data at the same time. Once 8 bits have been sent/received they are processed as a byte.

```
Clock: ^ denotes rising edge, * denotes falling edge
TX: sending `10100010` in binary (`0xA2` in hex)
RX: receiving `0b11001100` in binary (`0xCC` in hex)

                       ┏━━━━━━━━┓
    ┏━━━━━━━━━━━━━━━━━━┛ 1 byte ┗━━━━━━━━━━━━━━━━━━┓
       __    __    __    __    __    __    __    __
CLK __/  \__/  \__/  \__/  \__/  \__/  \__/  \__/  \
      ^  *  ^  *  ^  *  ^  *  ^  *  ^  *  ^  *  ^  *
       __          __                      __
TX  __/  \________/  \____________________/  \______
      1     0     1     0     0     0     1     0
       __    __                __    __
RX  __/  \__/  \______________/  \__/  \____________
      1     1     0     0     1     1     0     0
```

### Pseudocode

Generally, the master would look like this pseudocode where it drives the clock:

```
byte data_to_send = 0xA2;
byte data_receiving = 0x00;

// Used for bit-shifting data
int data_bit_position = 0;

// 1 is HIGH, 0 is LOW
state clock_state = 1;

int clock_speed = 8192;

while (data_bit_position < 8) {
  // Flip the state to what we're about to process
  clock_state = clock_state == 1 ? 0 : 1;
  // Send the clock state to the Gameboy Printer cable
  set_clock(clock_state);

  // Send data on rising edge
  if (clock_state == 1) {
    // Send data
    state bit_to_send = (data_to_send >> data_bit_position) & 0b00000001; // Results in  1 or 0
    set_tx(bit_to_send);

    // Receive Data
    data_receiving = (get_rx() << data_bit_position) | data_receiving;

    // Set the position for the next bit
    if (++data_bit_position == 8) {
      // Reset to read and send the next byte
      data_bit_position = 0;
      data_receiving = 0x00;
    }
  }

  // 1,000,000μs in a second
  // Wait 1,000,000/clock_speed in microseconds to match the clock speed
  // Divide it by 2 so that the rising edge and falling edge take place within one cycle period
  sleep_us(1000000 / clock_speed / 2);
}
```

And generally, the slave would look like this pseudocode where it waits for a state change from the clock:

```
byte data_to_send = 0xA2;
byte data_receiving = 0x00;

// Used for bit-shifting data
int data_bit_position = 0;

state last_clock_state = 1;

while (data_bit_position < 8) {
  state current_clock_state = get_clock();

  // Send data on rising edge
  if (current_clock_state == 1 && current_clock_state !== last_clock_state) {
    last_clock_state = current_clock_state;

    // Send data
    state bit_to_send = (data_to_send >> data_bit_position) & 0b00000001; // Results in  1 or 0
    set_tx(bit_to_send);

    // Receive Data
    data_receiving = (get_rx() << data_bit_position) | data_receiving;

    // Set the position for the next bit
    if (++data_bit_position == 8) {
      // Reset to read and send the next byte
      data_bit_position = 0;
      data_receiving = 0x00;
    }
  }
}
```

That pseudocode should give you an idea about what we're working with here.

### The Gameboy Printer

Here's the thing, this is where it gets complicated. I'll try to break it down.

#### Master to Slave

Master TX to Slave RX is described below

##### Magic Bytes (2)

This is the simplest part of the protocol. It never changes. The first byte the master sends is always `0x88` and the second byte is always `0x33`. All this does is tell the printer we are here and that we are about to send something it needs to listen to. That's all!

##### Command Byte (1)

This tells the printer what we want to do.

### Important Notes

#### Voltage Warnings

The Pico is not 5v tolerant and can only send and receive 3.3v. **_Do not hook the Pico directly to the Gameboy Printer._** There is a risk that a 5v signal to the Pico's serial pins will release [the magic smoke](https://en.wikipedia.org/wiki/Magic_smoke). The pi doesn't have any big capacitors so no smoke will be seen, but I think it is a lot scarier when it just silently dies and you don't know why.

The Gameboy Printer can only send and receive 5v, and won't read data from the 3.3v Pico as it doesn't seem to reach the minimum `HIGH` threshold the GBP is trying to read. This doesn't damage anything, but it's a major bummer.

You will need a 3.3v to 5v logic level shifter to safely transmit and receive data, which will avoid both of these issues.