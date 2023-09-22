#!/usr/bin/env bash

# Removes all changesets from provided release branch and bumps the version

set -e

git fetch --all
git ls-tree --name-only "$1"~1 .changeset/ | grep .md | xargs git rm --ignore-unmatch --

CURRENT_VERSION=$(gh api repos/saleor/saleor-dashboard/releases/latest | jq .tag_name | xargs)
NEW_VERSION=$(npx semver $CURRENT_VERSION -i minor)
npm version "$NEW_VERSION-dev" --git-tag-version false
