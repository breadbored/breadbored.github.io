---
layout: post
title: Pokemon Trading Protocol
date: 2025-01-01
categories: ["pokemon", "gameboy", "game boy", "retro-computing"]
---

I originally posted a breakdown of how trading in Pokémon Red, Blue, and Yellow works as a thread on BlueSky, but I wanted to share it here with additional supporting information (and corrections, becuase it had been over a year since I touched this project when I posted it). Hopefully you enjoy!

https://bsky.app/profile/bread.codes/post/3lcrkdbj7tk2m

https://bsky.app/profile/bread.codes/post/3lcrkdbjhnk2m

Like I said, the GB/C link cable is bastard of SPI. Below is the pinout of the port

```text
    _________   1 -> 5v
   / 1  2  3 \  2 -> RX
  /           \ 3 -> CLK
  |           | 4 -> TX
  |  4  5  6  | 5 -> Unused
  +-----------+ 6 -> GND

* 5v: +5 Volt Power
* RX: Receive Data
* CLK: Clock In/Out (Slave/Master respectively)
* TX: Transmit Data
* Unused: A reserved pin
* GND: Ground
```

You may notice Chip Select is missing. Since the Game Boy only expects to have one master and one slave, so it's not needed for switching between multiple slave devices. 

If you are unfamiliar with serial transfers, you may also notice two pins are for receiving and sending respectively. They are typically wired like so:

```text
  Master        Slave
  | TX --------> RX |
  | RX <-------- TX |
```

This is to trade data at the same time each clock cycle. The master will send the next byte while the slave responds to the previous byte. This ***would*** create a way to perform an optimistic trade where the master assumes the slave has a successful response while it continues to send data until told otherwise, but the Pokémon games send a filler byte between transfers while they wait for a response. These filler bytes will be talked about later, but keep them in mind.

Additionally, the Game Boy is active low, meaning that the clock is normally high and goes low when data is being sent. This is important to know when you are trying to send and read data using a microcontroller.

That is basically all we need to know about the hardware, as this is really about the program that drives this. Connecting to the Game Boy with other hardware may require a minor amount of work to implement this SPI-clone, but beyond that, it is basically unnecessary. My implementation runs on the Game Boy as a homebrew program, so I rely on the hardware to handle shifting data out and in.

From this point forward we will mostly only be talking about the firmeware/software, specifically the `handle_byte` function that is called every time the slave receives a byte, which sends a byte back.

https://bsky.app/profile/bread.codes/post/3lcrkdbjhnl2m

This "pecking order" is literally just both Game Boys sending "I'm master" signals (`0x01`) to each other until the other submits and agknowledges itself as slave (`0x02`). Once they both agree to the arrangement with `0x60`, the Game Boys know their place and can start driving the trade.

***I incorrectly stated on BSky that this is how they decide who drives the clock***. You don't need to be master to drive the clock. The clock-driver is decided by the hardware, and if CLK is held LOW, the hardware sets itself as the "hardware slave." The "software slave" is the one that submits the `0x02` signal.

https://bsky.app/profile/bread.codes/post/3lcrkdbjhnm2m

What I mean by this is that we don't want to be the "hardware master." This ensures that we aren't going too fast for the actual game, and it will let us know when it's ready to continue.

https://bsky.app/profile/bread.codes/post/3lcrkdbjhnn2m

When the master sends us an ACK (acknowledgement) signal (`0x00`), we usually respond with a `0x00`

https://bsky.app/profile/bread.codes/post/3lcrkdbjhno2m

It is entirely possible to be the hardware master, but this was far faster than arbitrary delays to give the game time to ready its response. 

This is also my memory failing me, and conflating software and hardware roles.

---

Above this point we have been talking entirely about how the hardware roles are decided and how the software roles are decided. The software roles are almost entirely handled by this section of code:

```c
uint8_t handle_byte(uint8_t in, uint8_t *out) {
    // ...
    switch (connection_state) { // enum holding the state of the connection
        case NOT_CONNECTED:
            switch (in)
            {
                // The other is the master
                case PKMN_MASTER: // 0x01
                    out[0] = PKMN_SLAVE; // 0x02
                    break;
                case PKMN_BLANK: // 0x00
                    out[0] = PKMN_BLANK; // 0x00
                    break;
                case PKMN_CONNECTED: // 0x60
                    connection_state = CONNECTED; // enum holding the state of the connection
                    out[0] = PKMN_CONNECTED; // 0x60
                    break;
            }
            break;

        // case ...
    }
}
```

https://bsky.app/profile/bread.codes/post/3lcrkdbjhnp2m

Once the above switch statement has concluded that the connection is established, we wait for the game to send us the TRADE_CENTER (`0xD4`) signal to say they are at the counter and are preparing to enter the trade room. Here is the code for this section

```c
uint8_t handle_byte(uint8_t in, uint8_t *out) {
    // ...
    switch (connection_state) { // enum holding the state of the connection
        // case ...

        case CONNECTED:
            switch (in)
            {
                case PKMN_CONNECTED: // 0x60
                    out[0] = PKMN_CONNECTED; // 0x60
                    break;
                case PKMN_TRADE_CENTER: // 0xD4
                    // No byte response known; just move on the next case (we'll discuss later)
                    connection_state = TRADE_CENTER; // enum holding the state of the connection
                    break;
                case PKMN_COLOSSEUM: // 0xD5
                    // We're not implementing this so just break the link
                    connection_state = NOT_CONNECTED; // enum holding the state of the connection
                    out[0] = PKMN_BREAK_LINK; // 0xD6
                    break;
                case PKMN_BREAK_LINK: // 0xD6
                case PKMN_MASTER: // 0x01
                    connection_state = NOT_CONNECTED; // enum holding the state of the connection
                    out[0] = PKMN_BREAK_LINK; // 0xD6
                    break;
                
                // By default, these are just filler bytes, so just echo them back to the master
                default:
                    out[0] = in; // echo back the byte
                    break;
            }
            break;

        case TRADE_CENTER:
            // Protocol for the trade center
            // ...
            break;
        
        // case ...

    }
}
```

https://bsky.app/profile/bread.codes/post/3lcrkdbjimx2m

Let's derail this train...

https://bsky.app/profile/bread.codes/post/3lcrkdbjjm72m

Here is the exceprt of the Trade Center packet:

```c
typedef struct TraderPacket {
    // Name must not exceed 10 characters + 1 STOP_BYTE
    // Any leftover space must be filled with STOP_BYTE (actually I'm not sure that's true, but you should do it)
    unsigned char name[11];
    struct SelectedPokemon selected_pokemon;
    struct PartyMember pokemon[6];
    unsigned char original_trainer_names[6][11];
    unsigned char pokemon_nicknames[6][11];
} TraderPacket;
```

https://bsky.app/profile/bread.codes/post/3lcrkdcok6h2m

https://bsky.app/profile/bread.codes/post/3lcrkdcouw72m

```c
typedef struct PartyMember {
    enum gen_one_dex_t pokemon;
    uint16_t current_hp;
    uint16_t max_hp;
    uint8_t level;
    enum status_condition_t status;
    enum poke_type_t type1;
    enum poke_type_t type2; // If only one type, copy the first
    uint8_t catch_rate_or_held_item; // R/G/B/Y (catch rate), G/S/C (held item), and Stadium (held item) use this byte differently
    enum poke_move_t move1;
    enum poke_move_t move2;
    enum poke_move_t move3;
    enum poke_move_t move4;
    uint16_t original_trainer_id; // In decimal, these are the funny numbers

    // -   Experience is complicated. You must look up the Pokemon you are trying to trade
    //      in the following table and apply the experience points that match the level.
    //      EXP LVL Table for gen 1: https://pwo-wiki.info/index.php/Generation_I_Experience_Charts
    //      That source was the best I could find for Gen 1. If you find another, submit a PR or open an issue and I'll fix it
    // -   Experience is a 24bit number, we will be dropping the MSB to acheive that
    uint32_t experience;

    // Effort Values
    // These are very specific to the Pokemon and who they battled in the past or what vitamins they were fed
    // Luckily, these get recalculated when you level them up, or when you put them in a box and then put them back in your party
    // For this example, I will take the max value and scale it to the level (65535 * 0.40) = 26214
    uint16_t HP_ev;
    uint16_t attack_ev;
    uint16_t defense_ev;
    uint16_t speed_ev;
    uint16_t special_ev;

    // IVs are a 4 bit number, so the max value is 15 (0-15 = 0b0000-0b1111 = 0x0-0xF)
    // These have been broken out for legibility, but will be condensed to only 2 bytes
    uint8_t attack_iv;
    uint8_t defense_iv;
    uint8_t speed_iv;
    uint8_t special_iv;

    uint8_t move1_pp;
    uint8_t move2_pp;
    uint8_t move3_pp;
    uint8_t move4_pp;

    uint16_t attack;
    uint16_t defense;
    uint16_t speed;
    uint16_t special;
} PartyMember;
```

Which is serialized like so:

```c
struct PartyMember *pPartyMember = &traderPacket.pokemon[i];
pPartyMember->pokemon = MEW;
pPartyMember->current_hp = 100;
pPartyMember->max_hp = 130;
pPartyMember->level = 40;
pPartyMember->status = NONE;
pPartyMember->type1 = PSYCHIC_TYPE;
pPartyMember->type2 = PSYCHIC_TYPE; // If only one type, copy the first
pPartyMember->catch_rate_or_held_item = 0xFF; // R/G/B/Y (catch rate), G/S/C (held item), and Stadium (held item) use this byte differently
pPartyMember->move1 = TELEPORT;
pPartyMember->move2 = PSYWAVE;
pPartyMember->move3 = PSYCHIC;
pPartyMember->move4 = FLY;
pPartyMember->original_trainer_id = 0xA455; // In decimal, these are the funny numbers

// -   Experience is complicated. You must look up the Pokemon you are trying to trade
//      in the following table and apply the experience points that match the level.
//      EXP LVL Table for gen 1: https://pwo-wiki.info/index.php/Generation_I_Experience_Charts
//      That source was the best I could find for Gen 1. If you find another, submit a PR or open an issue and I'll fix it
// -   Experience is a 24bit number, we will be dropping the MSB to acheive that
pPartyMember->experience = 190148;

// Effort Values
// These are very specific to the Pokemon and who they battled in the past or what vitamins they were fed
// Luckily, these get recalculated when you level them up, or when you put them in a box and then put them back in your party
// For this example, I will take the max value and scale it to the level (65535 * 0.40) = 26214
pPartyMember->HP_ev = 26214;
pPartyMember->attack_ev = 26214;
pPartyMember->defense_ev = 26214;
pPartyMember->speed_ev = 26214;
pPartyMember->special_ev = 26214;

// IVs are a 4 bit number, so the max value is 15 (0-15 = 0b0000-0b1111 = 0x0-0xF)
// These have been broken out for legibility, but will be condensed to only 2 bytes
pPartyMember->attack_iv = 0xF;
pPartyMember->defense_iv = 0xF;
pPartyMember->speed_iv = 0xF;
pPartyMember->special_iv = 0xF;

pPartyMember->move1_pp = 20;
pPartyMember->move2_pp = 15;
pPartyMember->move3_pp = 10;
pPartyMember->move4_pp = 15;

pPartyMember->attack = 100;
pPartyMember->defense = 100;
pPartyMember->speed = 100;
pPartyMember->special = 100;
```

and deserialized like so:

```c
void party_member_to_bytes(struct PartyMember *pPartyMember, uint8_t *out) {
    uint8_t res[44] = {
        pPartyMember->pokemon,
        (uint8_t) (pPartyMember->current_hp >> 8),
        (uint8_t) (pPartyMember->current_hp & 0x00FF),
        pPartyMember->level,
        pPartyMember->status,
        pPartyMember->type1,
        pPartyMember->type2,
        pPartyMember->catch_rate_or_held_item,
        pPartyMember->move1,
        pPartyMember->move2,
        pPartyMember->move3,
        pPartyMember->move4,
        (uint8_t) (pPartyMember->original_trainer_id >> 8),
        (uint8_t) (pPartyMember->original_trainer_id & 0x00FF),
        (uint8_t) ((pPartyMember->experience & 0x00FF0000) >> 16),
        (uint8_t) ((pPartyMember->experience & 0x0000FF00) >> 8),
        (uint8_t) (pPartyMember->experience & 0x000000FF),
        (uint8_t) (pPartyMember->HP_ev >> 8),
        (uint8_t) (pPartyMember->HP_ev & 0x00FF),
        (uint8_t) (pPartyMember->attack_ev >> 8),
        (uint8_t) (pPartyMember->attack_ev & 0x00FF),
        (uint8_t) (pPartyMember->defense_ev >> 8),
        (uint8_t) (pPartyMember->defense_ev & 0x00FF),
        (uint8_t) (pPartyMember->speed_ev >> 8),
        (uint8_t) (pPartyMember->speed_ev & 0x00FF),
        (uint8_t) (pPartyMember->special_ev >> 8),
        (uint8_t) (pPartyMember->special_ev & 0x00FF),
        (uint8_t) (((pPartyMember->attack_iv & 0xF) << 4) | (pPartyMember->defense_iv & 0xF)),
        (uint8_t) (((pPartyMember->speed_iv & 0xF) << 4) | (pPartyMember->special_iv & 0xF)),
        pPartyMember->move1_pp,
        pPartyMember->move2_pp,
        pPartyMember->move3_pp,
        pPartyMember->move4_pp,
        pPartyMember->level,
        (uint8_t) (pPartyMember->max_hp >> 8),
        (uint8_t) (pPartyMember->max_hp & 0x00FF),
        (uint8_t) (pPartyMember->attack >> 8),
        (uint8_t) (pPartyMember->attack & 0x00FF),
        (uint8_t) (pPartyMember->defense >> 8),
        (uint8_t) (pPartyMember->defense & 0x00FF),
        (uint8_t) (pPartyMember->speed >> 8),
        (uint8_t) (pPartyMember->speed & 0x00FF),
        (uint8_t) (pPartyMember->special >> 8),
        (uint8_t) (pPartyMember->special & 0x00FF),
    };
    for (size_t i = 0; i < 44; i++) {
        out[i] = res[i];
    }
}
```

https://bsky.app/profile/bread.codes/post/3lcrkdegqyx2m

Makes sense, right? Copying from SRAM / RAM is always going to be cheaper than restructuring data. I guess I should have guessed that.

https://bsky.app/profile/bread.codes/post/3lcrkdegqyy2m

https://bsky.app/profile/bread.codes/post/3lcrkdegrya2m

https://bsky.app/profile/bread.codes/post/3lcrkdegryb2m

I just skipped over SO MUCH. I must've been tired when I wrote this BSky post, because it skips a major part of the protocol.

So, that `handle_byte` function I've been talking about before we derailed, it manages the state of the connection. We left off on this part:

```c
case PKMN_TRADE_CENTER: // 0xD4
    // No byte response known; just move on the next case (we'll discuss later)
    connection_state = TRADE_CENTER; // enum holding the state of the connection
    break;
```

You may notice that it doesn't send a byte back to the master. It instead moves on to the next case, which is the `TRADE_CENTER` state. Instead of breaking down the code segments, which are long and illegible, I will explain the logic of the process.

- When in doubt, echo back the input to the output
    - If things get really bad, start the process over from the beginning
- The Trade Center status is in its default state, `INIT`
    - In this case, we are waiting for a `0x00` byte from the master
    - We respond with `0x00` and move to the next state, `READY`
- The TC status is in the `READY` state
    - In this case, we are waiting for a `0xFD` byte from the master
    - We respond with `0xFD` and move to the next state, `AGREED`
- The TC status is in the `AGREED` state
    - In this case, we are waiting for any byte that is ***NOT*** `0xFD` from the master
    - We respond with `0xFD` and move to the next state, `ANY_IN`
- The TC status is in the `ANY_IN` state
    - ***We set a counter to 0 to count the number of bytes we receive***
    - In this case, we are waiting for any byte from the master
    - We respond with `0xFD` and move to the next state, `WAIT`
- The TC status is in the `WAIT` state
    - If we receive a `0xFD` byte
        - ... we just respond with a `0x00` until we get a different response
    - If we receive a byte that is ***NOT*** `0xFD` 
        - NOTE: We'll be throwing the byte we receive away, but you can keep it if you care about the packet the master is sending us
        - ***We set a counter to 0 to count the number of bytes we receive***
        - We respond with the first byte of our TraderPacket we constructed from the struct earlier
        - We add 1 to the counter
        - We move to the next state, `TRANSFER`
- The TC status is in the `TRANSFER` state
    - In this case, we are waiting for any byte from the master
        - NOTE: We'll be throwing the byte we receive away, but you can keep it if you care about the packet the master is sending us
    - We respond with the next byte of our TraderPacket we constructed from the struct earlier
    - We add 1 to the counter
    - If we have sent all 418 bytes, we move to the next state, `PATCH`
        - Why 418? That's the size of the TraderPacket struct when we deserialized it
- The TC status is in the `PATCH` state
    - If we receive a `0xFD` byte from the master
        - ***We set a counter to 0 to count the number of bytes we receive***
        - We respond with `0xFD`
    - If we receive a byte that is ***NOT*** `0xFD`
        - NOTE: We'll be throwing the byte we receive away, but you can keep it if you care about the packet the master is sending us
        - We respond by echoing back whatever the master sends us
        - We add 1 to the counter
        - If we have sent 197 bytes, we move to the next state, `TRADE_WAIT`
            - Why 197? Because that's how long the trade animation is, and this is just to see if we're still alive
- The TC status is in the `TRADE_WAIT` state
    - If we receive a byte that is `&` with `0x60` to equal `0x60`
        - If we receive a `0x6f`, we respond with `0x6f` and move back to the `READY` state to start over
        - If we receive a `0x60`, we respond with `0x60` and move to the next state, `TRADE_DONE`
    - If we receive a `0x00` byte from the master
        - We respond with `0x00`
        - We move to the next state, `TRADE_DONE`
- The TC status is in the `TRADE_DONE` state
    - We are waiting for a byte from the master that can be `&` with `0x60` to equal `0x60`
        - We always echo back this byte. We are just reading it to see what the status of the trade is
        - If the byte is `0x61`, we go back to `TRADE_WAIT`
        - Otherwise, we're `DONE`
- The TC status is in the `DONE` state
    - We are waiting for `0x00` from the master
        - We respond with `0x00`
        - We move back to the `INIT` state to start over

Here are all the states and what they do:

- `INIT`: Trade has started
- `READY`: Both devices are ready to begin
- `AGREED`: Both devices have agreed where to start
- `ANY_IN`: Waiting for the master to send us data
- `WAIT`: Waiting for the master to send us data
- `TRANSFER`: Sending the TraderPacket to the master
- `PATCH`: Waiting for the animation to finish
- `TRADE_WAIT`: Waiting for the trade to finish
- `TRADE_DONE`: Trade is done
- `DONE`: Connection is done

https://bsky.app/profile/bread.codes/post/3lcrkdegryc2m

Somewhat in correct, please refer to my above correction

https://bsky.app/profile/bread.codes/post/3lcrkdegryd2m

Somewhat in correct, please refer to my above correction

https://bsky.app/profile/bread.codes/post/3lcrkdegtwt2m

https://bsky.app/profile/bread.codes/post/3lcrkdermo32m

Over a year ago, I was working on a YouTube video where I would explain how to counterfeit Pokemon through the trade protocol. Unfortunately, life happens, and I never got to share this the way I wanted to. You can follow @BreadCodes on YouTube if you want to see that kind of content!
