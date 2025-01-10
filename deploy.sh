#!/bin/bash

# Build the site
echo "Building site..."
npm run build

# Create a temp directory for the build files
echo "Creating temp directory..."
rm -rf temp_deploy
mkdir temp_deploy

# Copy the built files to temp
echo "Copying build files to temp..."
cp -r out/* temp_deploy/

# Store the current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Switch to gh-pages branch (create if it doesn't exist)
echo "Switching to gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
else
    git checkout --orphan gh-pages
    git rm -rf .
fi

# Remove everything except git, gitignore, and temp_deploy
echo "Cleaning directory..."
find . -not -path "./.git*" -not -path "./temp_deploy*" -not -name ".gitignore" -not -name "." -not -name ".." -delete

# Copy the build files from temp
echo "Copying build files to root..."
cp -r temp_deploy/* .
rm -rf temp_deploy

# Stage changes
echo "Staging changes..."
git add .

# Commit
echo "Committing changes..."
git commit -m "Deploy to gh-pages"

# Push
echo "Pushing to gh-pages..."
git push origin gh-pages --force

# Return to original branch
echo "Returning to original branch..."
git checkout "$CURRENT_BRANCH"

echo "Deployment complete!"
