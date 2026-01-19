# Build Scripts

This directory contains build scripts for the blog.

## Open Graph Image Generation

The `generate_og_images.py` script automatically generates Open Graph (social media preview) images for all blog posts.

### Features

- Game Boy-inspired 2-bit color palette gradient background
- Automatic text layout with title, super-title, chapter headers, and author
- Proper text wrapping for long titles
- Outputs to `public/og/` directory

### Usage

The script runs automatically during the build process (`npm run build`), but you can also run it manually:

```bash
python3 scripts/generate_og_images.py
```

### Requirements

- Python 3.7+
- Pillow library

Install dependencies:

```bash
pip install -r scripts/requirements.txt
```

### Color Palette

The images use a Game Boy-inspired gradient with these colors:

- `#252525` - Darkest (background bottom)
- `#4b564d` - Dark (background top)
- `#9aa57c` - Light (author, super-title text)
- `#e0e9c4` - Lightest (main title text)

### Output

Images are generated at 1200x630px (standard Open Graph dimensions) and saved as optimized PNGs in `public/og/{slug}.png`.
