#!/usr/bin/env bash

# Removes all changesets from provided release branch and bumps the version

set -e

git fetch --all
git checkout main
git ls-tree --name-only "$1"~1 .changeset/ | grep .md | xargs git rm --ignore-unmatch --
