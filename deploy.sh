#!/bin/bash

source ~/.zshrc

echo "Building site..."
yarn build

echo "Creating temp directory..."
rm -rf temp_deploy
mkdir temp_deploy

echo "Copying build files to temp..."
cp -r out/* temp_deploy/

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Switching to gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
else
    git checkout --orphan gh-pages
    git rm -rf .
fi

echo "Cleaning directory..."
find . -not -path "./.git*" -not -path "./CNAME" -not -path "./temp_deploy*" -not -name ".gitignore" -not -name "." -not -name ".." -delete

echo "Creating .nojekyll file..."
touch .nojekyll

echo "Copying build files to root..."
cp -r temp_deploy/* .
rm -rf temp_deploy

echo "Staging changes..."
git add .

echo "Committing changes..."
git commit -m "Deploy to gh-pages"

echo "Pushing to gh-pages..."
git push origin gh-pages --force

echo "Returning to original branch..."
git checkout "$CURRENT_BRANCH"

echo "Deployment complete!"
