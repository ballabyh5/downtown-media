#!/usr/bin/env bash
# One-shot: init repo, commit, create public GitHub repo, push.
# Requires: gh CLI (brew install gh) and `gh auth login` already done.
# Run from inside the Downtown Media folder.

set -euo pipefail

REPO_NAME="downtown-media"

# Clean any half-formed repo state from earlier session
rm -rf .git

git init -b main
git config user.email "ballabyh5@gmail.com"
git config user.name "Yash Ballabh"

git add .
git commit -m "Initial commit: Downtown Media static site"

# Create the GitHub repo (public) and push
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push

echo ""
echo "Done. Next:"
echo "  1. Go to https://github.com/$(gh api user -q .login)/$REPO_NAME/settings/pages"
echo "  2. Under 'Build and deployment > Source', pick 'GitHub Actions'"
echo "  3. Watch the Actions tab for the first deploy"
