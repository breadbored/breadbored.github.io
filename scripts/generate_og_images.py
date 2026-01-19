#!/usr/bin/env python3
"""
Generate Open Graph images for blog posts.
Uses a Game Boy-inspired 2-bit dot-matrix gradient color palette.
"""

import os
import re
from pathlib import Path
from typing import Dict, Optional
from PIL import Image, ImageDraw, ImageFont

# Game Boy inspired color palette
COLORS = {
    'darkest': '#252525',
    'dark': '#4b564d',
    'light': '#9aa57c',
    'lightest': '#e0e9c4'
}

# Image dimensions (Open Graph standard)
OG_WIDTH = 1200
OG_HEIGHT = 630

# Text margins and spacing
MARGIN = 80
TITLE_Y_OFFSET = 250


def parse_frontmatter(content: str) -> Dict[str, Optional[str]]:
    """Parse YAML frontmatter from markdown content."""
    parts = content.split('---\n')
    if len(parts) < 3:
        return {}

    frontmatter = {}
    lines = parts[1].split('\n')

    for line in lines:
        if ':' not in line:
            continue

        key, *values = line.split(': ')
        if key and values:
            value = ': '.join(values).strip()
            # Clean up quotes and brackets
            value = value.strip('"\'[]')
            frontmatter[key] = value

    return frontmatter


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    """Wrap text to fit within max_width."""
    words = text.split()
    lines = []
    current_line = []

    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = font.getbbox(test_line)
        width = bbox[2] - bbox[0]

        if width <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]

    if current_line:
        lines.append(' '.join(current_line))

    return lines


def create_gradient_background() -> Image.Image:
    """Create a dot-matrix background with 2x2 pixel grid pattern."""
    img = Image.new('RGB', (OG_WIDTH, OG_HEIGHT))
    pixels = img.load()

    # Dot-matrix grid size (2x2 pixels per "pixel")
    dot_size = 2

    # Parse base color (using 'dark' as solid background)
    r_base = int(COLORS['dark'][1:3], 16)
    g_base = int(COLORS['dark'][3:5], 16)
    b_base = int(COLORS['dark'][5:7], 16)

    # Parse darkest color for grid lines
    r_darkest = int(COLORS['darkest'][1:3], 16)
    g_darkest = int(COLORS['darkest'][3:5], 16)
    b_darkest = int(COLORS['darkest'][5:7], 16)

    # Create dot-matrix pattern over solid background
    for y in range(OG_HEIGHT):
        for x in range(OG_WIDTH):
            # Create dot-matrix pattern: darkest color at grid boundaries
            is_grid_boundary = (x % dot_size == 0) or (y % dot_size == 0)

            if is_grid_boundary:
                # Use darkest color for grid lines
                r = r_darkest
                g = g_darkest
                b = b_darkest
            else:
                # Normal color
                r = r_base
                g = g_base
                b = b_base

            pixels[x, y] = (r, g, b)

    return img


def get_font(size: int) -> ImageFont.FreeTypeFont:
    """Get a font with fallback options."""
    # Custom font path
    custom_font = os.path.join(os.getcwd(), 'public', 'ziplock.ttf')

    font_options = [
        # Custom font
        custom_font,
        # macOS
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        # Linux
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
        # Windows
        'C:\\Windows\\Fonts\\arialbd.ttf',
        'C:\\Windows\\Fonts\\Arial.ttf',
    ]

    for font_path in font_options:
        try:
            if os.path.exists(font_path):
                return ImageFont.truetype(font_path, size)
        except Exception:
            continue

    # Fallback to default
    return ImageFont.load_default()


def generate_og_image(
    title: str,
    super_title: Optional[str] = None,
    chapter_header: Optional[str] = None,
    output_path: str = 'og_image.png'
) -> None:
    """Generate an Open Graph image for a blog post."""

    # Create gradient background
    img = create_gradient_background()
    draw = ImageDraw.Draw(img)

    # Load fonts
    super_font = get_font(36)
    title_font = get_font(64)
    author_font = get_font(32)  # Half the size of title font

    max_text_width = OG_WIDTH - (MARGIN * 2)
    current_y = TITLE_Y_OFFSET

    # Draw super title + chapter header if present
    if super_title or chapter_header:
        header_text = ''
        if super_title and chapter_header:
            header_text = f"{super_title}: {chapter_header}"
        elif super_title:
            header_text = super_title
        elif chapter_header:
            header_text = chapter_header

        # Wrap and draw header
        header_lines = wrap_text(header_text, super_font, max_text_width)
        for line in header_lines:
            bbox = super_font.getbbox(line)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            x = (OG_WIDTH - text_width) // 2

            draw.text(
                (x, current_y),
                line,
                font=super_font,
                fill=COLORS['light']
            )
            current_y += text_height + 10

        current_y += 30  # Space between header and title

    # Draw title
    title_lines = wrap_text(title, title_font, max_text_width)
    for line in title_lines:
        bbox = title_font.getbbox(line)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (OG_WIDTH - text_width) // 2

        draw.text(
            (x, current_y),
            line,
            font=title_font,
            fill=COLORS['lightest']
        )
        current_y += text_height + 15

    # Draw author at bottom
    author = "Bread.Codes"
    bbox = author_font.getbbox(author)
    author_width = bbox[2] - bbox[0]
    author_x = (OG_WIDTH - author_width) // 2
    author_y = OG_HEIGHT - MARGIN - 50

    draw.text(
        (author_x, author_y),
        author,
        font=author_font,
        fill=COLORS['light']
    )

    # Save image
    img.save(output_path, 'PNG', optimize=True)
    print(f"Generated: {output_path}")


def main():
    """Main function to process all blog posts."""
    # Paths
    posts_dir = Path('_posts')
    output_dir = Path('public/og')

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    # Process each markdown file
    if not posts_dir.exists():
        print(f"Error: {posts_dir} directory not found")
        return

    for post_file in posts_dir.glob('*.md'):
        print(f"Processing: {post_file.name}")

        # Read post content
        with open(post_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse frontmatter
        frontmatter = parse_frontmatter(content)

        # Get post details
        title = frontmatter.get('title', 'Untitled')
        super_title = frontmatter.get('super-title')
        chapter_header = frontmatter.get('chapter-header')
        slug = frontmatter.get('slug')

        # Generate slug from title if not provided
        if not slug:
            slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

        # Output path
        output_path = output_dir / f"{slug}.png"

        # Generate image
        generate_og_image(
            title=title,
            super_title=super_title,
            chapter_header=chapter_header,
            output_path=str(output_path)
        )

    print(f"\nGenerated {len(list(posts_dir.glob('*.md')))} Open Graph images in {output_dir}")


if __name__ == '__main__':
    main()
