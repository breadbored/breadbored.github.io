---
layout: post
title: Proprietary Wireless L3 Protocol From Packet Traces
date: 2005-01-01
author: Unknown
categories: ["nintendo", "ds", "nds", "download play", "wireless", "protocol", "reverse engineering", "wmb", "nifi", "rsa"]
---

## Please Note

This is not my work, but I am hosting it here for archival purposes. The source I am rehosting is [here](https://web.archive.org/web/20110723013725/http://www.bottledlight.com/ds/index.php/Wifi/WMBProtocol), which is an archival rehost of a website no longer hosting the content, a website which is rehosting parts of a paper from 2005 by the same author entitled _Inferring a Proprietary Wireless L3 Protocol From Packet Traces_.

This came up in my research for the NDS Download Play protocol and it appears that the only place hosting this content is the WaybackMachine. I am hosting it here for archival purposes. If you are the original author and wish for me to take it down, please contact me at [brad@bread.codes](mailto:brad@bread.codes).

## Archived Content:

Original Note from `bottledlight.com`: This is a reformatted version of the technical content from _Inferring a Proprietary Wireless L3 Protocol From Packet Traces_ paper, and should probably be split up / otherwise wikified at some point. The ... represents a bit of the original paper that was cut.

There was also an associated [presentation](https://web.archive.org/web/20110723013725/http://www.cs.unc.edu/~jasleen/Courses/Fall05/projects/wmb_presentation.pdf) to go with the paper.

....

See [Wireless Basics](https://web.archive.org/web/20110723013725/http://www.bottledlight.com/ds/index.php/Wifi/WirelessBasics) for more 802.11 frame information.

# Available Game Advertisement

WMB uses beacon frames to advertise available games for download. The beacon frames are normally used to advertise available access points in most 802.11 systems, but there is nothing preventing their use in this capacity. The advertisement data is fragmented and stored partially in each [beacon frame](https://web.archive.org/web/20110723013725/http://www.bottledlight.com/ds/index.php/Wifi/WirelessBasics) as the payload of a custom information element (tag: 0xDD).

The DS Download Play menu only lists games when the beacons are broadcasted on one of the following channels: 1, 3, 4, 5, 7, 9, 10, 11, 13, and 14. However, the DS hosting mechanism only seems to transmit on channels 1, 7, and 13 (apparently selected at random).

All beacon frames transmitted by a DS host have the following format:

|     |
| --- |
| 802.11 management frame |
| 802.11 beacon header |
| Supported rates (tagged IE, advertises 1 Mbit and 2 Mbit) |
| DS parameter set (tagged IE, note: Distribution System, not Nintendo DS) |
| TIM vector (tagged IE, transmitted as empty) |
| Custom extension (tagged IE, tag `0xDD`) |

Nintendo specific beacon fragment format (information element code 0xDD):

| Offset | Description |
| --- | --- |
| `0x00` | Manufacturer (`00 09 BF`) |
| `0x03` | `00` |
| `0x04` | `0A 00 00 00` |
| `0x08` | `01 00 40 00` |
| `0x0C` | `24 00 40 00` |
| `0x10` | Randomly generated stream code |
| `0x12` | `70 0B` |
| `0x14` | `00 01 08 00` |
| `0x18` | `24 00 40 00` (varies from game to game) |
| `0x1C` | End of advertisement flag (`00` for non-end, `02` for end packets) |
| `0x1D` | Always `00`, `01`, `02`, or `04` |
| `0x1E` | Number of players already connected |
| `0x1F` | Sequence number (0 .. total\_advertisement\_length) |
| `0x20` | Checksum (2 byte little-endian) |
| `0x22` | Sequence number in non-final packet, # of players in final packet |
| `0x23` | Total advertisement length – 1 (in beacons) |
| `0x24` | Payload size in bytes (2 byte little-endian) |
| `0x26` | Payload begins |

The checksum is a custom algorithm, I have included example source in the appendix.

The advertisement fragments are reordered and assembled according to their internal sequence number, to form the overall advertisement payload, as defined below:

| Offset | Size | Description |
| --- | --- | --- |
| `0x000` | 32  | Icon palette (16 RGB555 entries) |
| `0x020` | 512 | Icon tiles (4x4 8x8 4 bit palletized tiles) |
| `0x220` | 1   | Unknown (0x0B) |
| `0x221` | 1   | Length of hosting name |
| `0x222` | 20  | Name of hosting DS (10 UCS-2) |
| `0x236` | 1   | Max number of players |
| `0x237` | 1   | Unknown (0x00) |
| `0x238` | 96  | Game name (48 UCS-2) |
| `0x298` | 192 | Game description (96 UCS-2) |
| `0x358` | 64  | 00’s if no users are connected |
| `0x398` | 0   | End of data if no users are connected |

The game name and game description are parsed out of the 128 characters stored in the .NDS file banner area. The game name comes from the first line of the banner, and the remaining lines go into the description. No WMB downloads have been observed that had more than 128 characters for these two fields combined, but it should be possible.

The icon format is a standard DS graphics format, constructing the 32x32 icon out of 8x8 pixel tiles, where each pixel is a 4-bit index into a 16-color palette. The 0th palette index is designated as transparent, allowing the background to show through. This also comes from the banner area of the original NDS file.

# Authentication process

Once a user B chooses a download offered by a host A, the following standard 802.11 authentication process observed.

1.  Host A advertises a game in beacon frames as described above
2.  Client B sends an authentication request (sequence 1) to A
3.  Host A replies with an ACK
4.  Host A sends an authentication reply (sequence 2) to B
5.  Client B replies with an association request
6.  Host A replies with an ACK
7.  Host A sends an association response
8.  Client B responds with an ACK

After this, the two are associated, and will remain so until the transfer is complete or one is idle for several seconds, at which point they will de-associate. For more information on the association process, see the 802.11 standard.

# Download process

After authentication:

1.  Host sends Pings (type 0x01, replies are 0x00, 0x07)
2.  Host sends RSA frame (type 0x03, replies 0x08)
3.  Host sends NDS header (type 0x04, replies 0x09)
4.  Host sends ARM9 binary (type 0x04, replies 0x09)
5.  Host sends ARM7 binary (type 0x04, replies 0x09)
6.  Host terminates transfer (type 0x05, no replies)

The WMB protocol ostensibly implements layers 3 to 7 of the OSI network model, but does not define a new type of network addresses. However, it does define a couple of special broadcast-like MAC addresses within the assigned Nintendo namespace (`00:09:BF`).

The three channels or flows used for all communications after the MAC broadcast beacons take the form `03:09:BF:00:00:xx`, where xx is:

*   00 for the main data flow, from host to client
*   10 for the client to host replies
*   03 for the feedback flow, host to client (acknowledges the replies)

Observed commands:

| Command | Description |
| --- | --- |
| 0x01 | Ping / Name request |
| 0x03 | RSA signature frame |
| 0x04 | Data packet |
| 0x05 | Post-idle / unknown |

Observed replies

| Reply ID | Description |
| --- | --- |
| 0x00 | Pong (ping reply) |
| 0x07 | Name reply |
| 0x08 | RSA frame reply |
| 0x09 | Data packet reply |

The host does something unusual with the 802.11 sequence control field, each packet sent out on the 00 flow has a sequence control number 2 greater than the previous one, even if they are sent sequentially. When the host acknowledges a reply (on flow 03) from the client about a particular packet, it uses the sequence number one after the original packet number it sent out on 00. This is the root of one of the major problems in finding a PC card that can transmit WMB packets, as very few cards provide user control over it. Even when a card is capable of ‘raw’ 802.11 transmission, it typically takes care of the sequence control field in hardware or firmware, filling it with a constantly incrementing number.

# Host-to-client packets (on the 0x00 flow)

| 0   | 1   | 2   | 3   | 4   | 5   | 6..e-3 | e-2 | e-1 | e-0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 06  | 01  | 02  | 00  | Size | Flags | Payload | 00  | 02  | 00  |

Notes:

*   The size field is in terms of half-words (16 bits), and includes the flags byte along with the payload (so a size of 0x03 represents a flag byte, a command byte, and 4 bytes of payload).
*   When flags is 0x11, the first byte of the payload is a command. There seems to be no important data when flags is not 0x11 (seen occasionally as 0x01), and ignoring them still results in a complete dump.

The Ping messages (type 0x00) have a payload size of 0x03, but always contain zeroes in the payload. They seem to be used only to keep the connection alive while waiting for the host DS to start the transfer, to prevent a time-out de-association.

The RSA frame format (type 0x03) sends a table of information about the game being downloaded (most of it redundant with the NDS header, see Appendix), as well as the RSA signature for the DS. I have not looked into computing the signature, as homebrew developers are not privy to Nintendo’s private key, making signing a fruitless activity, but it is my understanding that the signature is a 128 byte public key and an 8 byte SHA-1 message digest over the NDS header, ARM9 binary, and ARM7 binary. Notably: the RSA frame itself is not included as part of the data being signed, bringing up various security issues and making Nintendo’s firmware engineers look amateurish at best.

There are several abortive sendings of empty RSA frames with a size field of 0x03, before the real frame is sent (always with a size field of 0x75).

RSA signature frame payload (type 0x03)

| Offset | Size | Description |
| --- | --- | --- |
| `0x00` | `4` | ARM9 execute address |
| `0x04` | `4` | ARM7 execute address |
| `0x08` | `4` | `0x00` |
| `0x0C` | `4` | Header destination |
| `0x10` | `4` | Header destination |
| `0x14` | `4` | Header size (0x160) |
| `0x18` | `4` | `0x00` |
| `0x1C` | `4` | ARM9 destination address |
| `0x20` | `4` | ARM9 destination address |
| `0x24` | `4` | ARM9 binary size |
| `0x28` | `4` | `0x00` |
| `0x2C` | `4` | `0x022C0000` |
| `0x30` | `4` | ARM7 destination address |
| `0x34` | `4` | ARM7 binary size |
| `0x38` | `4` | `0x01` |
| `0x3C` | `136` | Signature block |
| `0xC4` | `36` | `0x00`’s |
| `0xE8` | `0` | End of frame payload |

Notes:

*   The offsets in the table are from after the command byte, i.e. two bytes into the 234 bytes of payload including the flags.
*   The unknown address 0x022C0000 is probably ARM7 related, by comparison with the duplicated header and ARM9 destination addresses 32 and 16 bytes before it, although it has no known significance according to the NDS header.

The data packets (type 0x04) include a transport-layer sequence number inside of the data packet itself, but no destination offset or other mechanism to allow the packets to be processed out-of-order. The only way to place the data at the correct location in memory is to re-order the packets according to the sequence number and process them sequentially.

Data packet (type 0x04)

|0|1|2|3|..|End|
|---|---|---|---|---|---|
|00|\[Sequence#\]||xx|..|yy|

The sequence number is a zero based little-endian number. Each packet only contains data for one of the three destination blocks (header, ARM9, ARM7), so the change-of-destination check only needs to be made on packet boundaries.

# Client to Host Replies (on the 0x10 flow)

The replies from client to host are sent on the 0x10 flow. The client uses an incrementing sequence control number for all of its packets, with no unusual trickery. Each reply is sent as a standard 802.11 data frame (typically as a Data + CF-Acknowledgement), consisting of 10 data bytes for the WMB payload. The first two are always 0x04 0x81, with the third byte indicating the type of reply, and the remaining 7 bytes being reply-specific.

One type of packet frequently sent before a download gets underway is what I have termed the Idle or Pong packet (in response to 0x00 ‘Pings’). It has a reply type field of 0x00, and does not contribute any additional information.

Idle / Pong reply (type 0x00)

|0|1|2|3|4|5|6|7|8|9|
|---|---|---|---|---|---|---|---|---|---|
|`04`|`81`|`00`|`00`|`00`|`00`|`00`|`00`|`00`|`00`|

The name reply (type 0x07) is sent shortly after association is completed, although I am not certain what triggers it. There are a variable number of pings preceding this reply, but most are replied via Pongs. The name reply sends the user-configured DS name (set in the firmware menu) split over four messages (with the 4th byte of the packet specifying which message fragment this is, 1 based). This can be a total length of 10 UCS-2 characters, although all four messages are still sent if it is shorter (padded with nulls to 10 characters, and then 01 and then nulls until the end of the frame).

Name reply (type 0x07)

|0|1|2|3|4|5|6|7|8|9|
|---|---|---|---|---|---|---|---|---|---|
|`04`|`81`|`07`|`01`|\[Character0\]||\[Character1\]||\[Character2\]||
|`04`|`81`|`07`|`02`|\[Character3\]||\[Character4\]||\[Character5\]||
|`04`|`81`|`07`|`03`|\[Character6\]||\[Character7\]||\[Character8\]||
|`04`|`81`|`07`|`04`|\[Character9\]||`01`|`00`|`00`|`00`|

The RSA frame receipt reply contains no extra information; it only acknowledges receipt of a type 0x03 host packet on the main flow (0x00). Bizarrely, the xx bytes in the table below are not driven to a particular value when replying to an RSA frame, and usually contain the same data as the second (of four) name response frames.

|     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |RSA frame receipt reply (type 0x08)
| 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   |
| `04` | `81` | `08` | `xx` | `xx` | `xx` | `xx` | `xx` | `xx` | `xx` |

The data packet receipt reply implements is interesting in that it includes both an immediate acknowledgement and something akin to a cumulative acknowledgement. It specifies the transport layer sequence number for both the packet just received, and the highest continuously addressed packet received.

Data packet receipt reply (type 0x09)

|0|1|2|3|4|5|6|7|8|9|
|---|---|---|---|---|---|---|---|---|---|
|`04`|`81`|`09`|\[Last packet\]||\[Best packet\]||`00`|`00`|`00`|

Notes:

*   \[last packet\] is the packet number being acknowledged
*   \[best packet\] is the highest continuous packet number seen so far
*   Packet IDs are little-endian numbers, like other Nintendo provided data.

# Host to client acknowledgements (on the 0x03 flow)

These packets contain four data bytes, but three are always zero. The first seems to be random, with no connection to the acknowledged data. The actual indication of acknowledgement is the sequence control number of the packet. It is set to be one greater than the sequence control number of the initial host packet (sent on flow 0x00) that the client has just responded to, to indicate that the reply was received.

Host-to-client acknowledgement

|0|1|2|3|
|---|---|---|---|
|`??`|`00`|`00`|`00`|

# Experimental Verification of Protocol

An experiment was setup to test some assumptions about the protocol and verify that clean working dumps of WMB transfers could be made.

1.  The Peanuts program was run on a laptop placed near to a DS running the game Polarium.
2.  The Send a Demo option in the Polarium menu was invoked, and Peanuts was checked to make sure both were operating on the same channel.
3.  Another DS was turned on in a different room, and the hosted Polarium demo was selected in the DS Download Play menu, and the transfer was allowed to complete.
4.  Peanut wrote out a reassembled .NDS file as well as an annotated trace log.
5.  The trace log was checked to make sure the reassembly completed.
6.  The reassembled file was also checked for file integrity with DSgrok.
7.  The WMB program was invoked with the captured demo, and a DS with unmodified firmware (i.e. will reject a game with even a single modified byte due to the RSA signature) was used to download the demo.
8.  The demo ran successfully without the characteristic faded logo lockup indicating a failed signature check, indicating that the capture and reassembly process works, at least for this demo.

# Conclusions and Future Work

The NiFi protocol, simply put, isn’t. Although both PictoChat and the DS Download Play have some similarities indicating that the same people wrote both programs (which seems likely considering they are both part of the same firmware), there is not a common layer 3 / 4 protocol shared between them.

The Nintendo DS does not appear to violate the letter of the 802.11 standard. However, most cards are not capable of providing application level control of the sequence number, and many card drivers do not even allow non-IP transmission over 802.11, filtering out incoming packets and providing no interface to send outbound ones.

The RSA signature frame is a curious design decision. They had to send a signature of the binaries across, but the RSA frame also contains duplicated header fields, including execute addresses. Under other circumstances, this would be a trivial waste of space; except that the signature does not cover the RSA frame itself, and it’s fields are preferentially used over the original header! This means that a DS download server can also operate as a software-based passthrough. Arbitrary code cannot be sent, as the binaries are still signed, but execution can be redirected to a flash cartridge in the GBA slot.

... The additional information in the RSA firmware is ignored by newer versions of the [firmware](https://web.archive.org/web/20110723013725/http://www.bottledlight.com/ds/index.php/Main/Firmware), completely preventing the WifiMe soft-passthrough. ...

The passive method of capture currently implemented in Peanut is sufficient when the client DS is sufficiently far away from the host DS to commonly request the same packet several times. By the very nature of wireless systems, packets have a high loss rate, even when the sender (host) and receiver (laptop) are quite close. If even a single packet is completely lost (i.e. the laptop missed it each time it was (re)transmitted to the client), then reassembly is impossible. The client DS gets around this by not acknowledging packets that were dropped, allowing the host to timeout and retransmit. As a passive snooper, we can’t work around this if the client receives the packet and we do not.

Moving to an active capture system, where Peanut pretends to be a client DS will provide flawless captures every time, and could also lead to a program running on the DS, providing WMB style downloads on DS units that do not have FlashMe installed. As most of the machinery associated with being an active client is common to being an active server, hopefully this would also lead to the first homebrew WMB broadcasts from a DS.

...

# Appendix

The beacon checksum is a custom algorithm, operating over the payload as half-words. Here is an example of how to compute it.

 
// The checksum is computed over halfwords for the last 4 bytes
// of the ninty beacon header, plus the payload
// This func takes length in halfwords
uint16 computeBeaconChecksum(uint16 \* data, int length) {
  uint32 sum = 0;
  for (int j = 0; j < length; j++) sum += \*data++;
  sum = (-((sum >> 16) + (sum & 0xFFFF) + 1)) & 0xFFFF;
  return sum;
}

The .NDS format is the standard format for Nintendo DS programs; it originated on original game cards and also appears to a limited extent in WMB binaries. The WMB process only transfers the first 0x160 bytes of the header, the ARM9 binary, and the ARM7 binary (in that order), ignoring the file name and file allocation tables, the overlay data, and some information stored in the banner (the rest is transmitted partially via the beacon advertisement process).

(No point in duplicating NDS header info here, see the [NDS Format](https://web.archive.org/web/20110723013725/http://www.bottledlight.com/ds/index.php/FileFormats/NDSFormat) page instead.)
