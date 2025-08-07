#!/usr/bin/env bash

# Removes all changesets from provided release branch and bumps the version

set -e

git diff --name-only origin/"$1" .changeset/ | xargs git rm --
pnpm version preminor --preid dev --git-tag-version false
