#!/usr/bin/env bash

# Removes all changesets from provided release branch and bumps the version

set -e

npx changeset status --verbose --output=status.json || true

VERSION=$(cat status.json | jq '.releases | .[] | select(.name=="saleor-dashboard" and (.type=="minor" or .type=="major")) | .newVersion' | xargs)
rm status.json || true

git fetch --all
git checkout main
git ls-tree --name-only "$1"~1 .changeset/ | grep .md | xargs git rm --ignore-unmatch --

# If there are minor changes (minor release), prepare a new dev version for main
if [ ! -z "$VERSION" ]; then
  NEW_VERSION=$(npx semver $VERSION -i minor)
  npm version "$NEW_VERSION-dev" --git-tag-version false
fi