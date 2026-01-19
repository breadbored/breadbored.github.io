#!/usr/bin/env python3
"""
Convert TTF fonts to monospace versions using FontForge.

Usage: fontforge -script make_fonts_mono.py
"""

import fontforge
import psMat
import sys

def make_monospace(input_file, output_file, target_width=None):
    """
    Convert a font to monospace by setting all glyphs to the same width.

    Args:
        input_file: Path to input TTF file
        output_file: Path to output TTF file
        target_width: Fixed width for all glyphs (auto-calculated if None)
    """
    print(f"Opening {input_file}...")
    font = fontforge.open(input_file)

    # If no target width specified, use the median glyph width
    if target_width is None:
        widths = [glyph.width for glyph in font.glyphs() if glyph.width > 0]
        if widths:
            widths.sort()
            target_width = widths[len(widths) // 2]
        else:
            target_width = 1000  # Fallback

    print(f"Target width: {target_width} font units")

    # Set all glyphs to the same width and center them
    glyph_count = 0
    for glyph in font.glyphs():
        if glyph.width > 0:  # Skip empty glyphs
            old_width = glyph.width

            # Get the bounding box to calculate centering
            try:
                bbox = glyph.boundingBox()
                glyph_actual_width = bbox[2] - bbox[0]  # right - left

                # Calculate horizontal offset to center the glyph
                offset = (target_width - glyph_actual_width) / 2 - bbox[0]

                # Transform glyph to center it
                if offset != 0:
                    glyph.transform(psMat.translate(offset, 0))
            except:
                # If no bounding box (empty glyph), just skip centering
                pass

            # Set the advance width
            glyph.width = target_width
            glyph_count += 1

    print(f"Processed {glyph_count} glyphs")

    # Generate the new font file
    print(f"Generating {output_file}...")
    font.generate(output_file)

    font.close()
    print(f"Done! Created {output_file}")

def main():
    # Process public/tape.ttf
    try:
        make_monospace("public/tape.ttf", "public/tape-mono.ttf")
    except Exception as e:
        print(f"Error processing public/tape.ttf: {e}")
        sys.exit(1)

    print()

    # Process public/sins.ttf
    try:
        make_monospace("public/sins.ttf", "public/sins-mono.ttf")
    except Exception as e:
        print(f"Error processing public/sins.ttf: {e}")
        sys.exit(1)

    print("\nAll fonts processed successfully!")
    print("New files: public/tape-mono.ttf, public/sins-mono.ttf")

if __name__ == "__main__":
    main()
