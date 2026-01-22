#!/bin/bash

# Exit on any error
set -e

# Function to handle errors
handle_error() {
    echo "Error occurred in line $1"
    # Restore original branch and .env if we've already switched branches
    if [ -n "$CURRENT_BRANCH" ]; then
        echo "Returning to original branch..."
        git checkout "$CURRENT_BRANCH" || true
    fi
    # Restore .env if we backed it up
    if [ -n "$env_value" ]; then
        echo "Restoring .env file..."
        echo "$env_value" >.env || true
    fi
    exit 1
}

# Set up error trap
trap 'handle_error $LINENO' ERR

# echo "Backing up .env file..."
# env_value=$(cat .env)

echo "Building site..."
yarn || {
    echo "yarn install failed"
    exit 1
}
yarn build || {
    echo "yarn build failed"
    exit 1
}

echo "Creating temp directory..."
rm -rf temp_deploy
mkdir temp_deploy || {
    echo "Failed to create temp directory"
    exit 1
}

echo "Copying public files to temp..."
cp -r public/* temp_deploy/ || {
    echo "Failed to copy public files"
    exit 1
}

echo "Copying build files to temp..."
cp -r out/* temp_deploy/ || {
    echo "Failed to copy build files"
    exit 1
}

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Resetting public directory changes..."
git checkout -- public/ || true

echo "Switching to gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages || {
        echo "Failed to checkout gh-pages branch"
        handle_error $LINENO
    }
else
    git checkout --orphan gh-pages || {
        echo "Failed to create gh-pages branch"
        handle_error $LINENO
    }
    git rm -rf . || {
        echo "Failed to clean new branch"
        handle_error $LINENO
    }
fi

echo "Cleaning directory..."
find . -not -path "./.git*" -not -path "./CNAME" -not -path "./.gitattributes" -not -path "./temp_deploy*" -not -name ".gitignore" -not -name "." -not -name ".." -delete || {
    echo "Failed to clean directory"
    handle_error $LINENO
}

echo "Creating .nojekyll file..."
touch .nojekyll || {
    echo "Failed to create .nojekyll file"
    handle_error $LINENO
}

echo "Copying build files to root..."
cp -r temp_deploy/* . || {
    echo "Failed to copy build files to root"
    handle_error $LINENO
}
rm -rf temp_deploy || {
    echo "Failed to remove temp directory"
    handle_error $LINENO
}

echo "Staging changes..."
git add . || {
    echo "Failed to stage changes"
    handle_error $LINENO
}

echo "Committing changes..."
git commit -m "Deploy to gh-pages" || {
    echo "Failed to commit changes"
    handle_error $LINENO
}

echo "Pushing to gh-pages..."
git push origin gh-pages --force || {
    echo "Failed to push to gh-pages"
    handle_error $LINENO
}

echo "Returning to original branch..."
git checkout "$CURRENT_BRANCH" || {
    echo "Failed to return to original branch"
    handle_error $LINENO
}

echo "Deployment complete!"

# echo "Restoring .env file..."
# echo "$env_value" >.env || {
#     echo "Failed to restore .env file"
#     handle_error $LINENO
# }

yarn || {
    echo "Final yarn install failed"
    exit 1
}
