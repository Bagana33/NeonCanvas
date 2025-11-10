#!/usr/bin/env zsh
# publish.sh — quick publish helper
# Usage: ./publish.sh [remote-url] [branch]
# Example: ./publish.sh git@github.com:username/neoncanvas_compat.git main

set -e
REMOTE_URL="$1"
BRANCH=${2:-main}

# ensure we're in the repo root (script should be run from project root)
echo "Starting quick publish..."
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
else
  echo "Using existing git repository"
fi

# stage and commit
git add --all
# only commit if there are changes
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "Site: publish $(date -u +"%Y-%m-%dT%H:%M:%UZ")"
  echo "Committed changes."
fi

if [ -n "$REMOTE_URL" ]; then
  # ensure remote exists
  if git remote | grep -q '^origin$'; then
    echo "Remote 'origin' already exists. Setting URL to provided remote."
    git remote set-url origin "$REMOTE_URL"
  else
    git remote add origin "$REMOTE_URL"
  fi
  echo "Pushing to origin/$BRANCH..."
  git branch -M $BRANCH
  git push -u origin $BRANCH
  echo "Push complete."
else
  echo "No remote URL provided. To push your site do the following (example):"
  echo "  git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git"
  echo "  git branch -M $BRANCH"
  echo "  git push -u origin $BRANCH"
fi

echo "Done. If you are deploying to GitHub Pages and want repository to publish at root, name repo <username>.github.io or configure Pages in GitHub settings."
