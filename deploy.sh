#!/bin/bash

# Build the site
npm run build

# Save the current branch name
current_branch=$(git branch --show-current)

# Create and switch to gh-pages branch, creating it if it doesn't exist
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages

# Remove existing files (except .git and .gitignore)
find . -maxdepth 1 ! -name '.git' ! -name '.gitignore' ! -name 'out' -exec rm -rf {} +

# Copy everything from out directory to root
cp -r out/* .

# Remove the out directory after copying
rm -rf out

# Add all files
git add -A

# Commit
git commit -m "Deploy to gh-pages"

# Push to gh-pages
git push origin gh-pages --force

# Return to original branch
git checkout $current_branch
