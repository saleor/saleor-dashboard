# Docker Image Backfill Workflow

This workflow backfills missing Docker images for releases 3.22.27-3.22.30 that failed due to a Dockerfile bug.

## Problem

Releases 3.22.27, 3.22.28, 3.22.29, and 3.22.30 were published to GitHub but their Docker images failed to build because the Dockerfile was missing `pnpm-workspace.yaml` and `.npmrc` in the COPY command.

## Solution

This workflow checks out each release tag, patches the Dockerfile in-memory, builds the Docker image, and pushes it with the correct version tag.

## Usage

### Manual Trigger (Recommended for testing)

1. Go to Actions → "Backfill Docker Images (Temporary)"
2. Click "Run workflow"
3. Enter the release tag (e.g., `3.22.27`)
4. Leave image tag empty (it will default to the release tag)
5. Click "Run workflow"

Test with one version first (e.g., 3.22.27) to verify it works, then run for the remaining versions.

### Batch Backfill

Run the workflow 4 times with these inputs:

- `3.22.27`
- `3.22.28`
- `3.22.29`
- `3.22.30`

## Verification

After each run, verify the image was published:

```bash
docker pull ghcr.io/saleor/saleor-dashboard:3.22.27
docker pull ghcr.io/saleor/saleor-dashboard:3.22.28
docker pull ghcr.io/saleor/saleor-dashboard:3.22.29
docker pull ghcr.io/saleor/saleor-dashboard:3.22.30
```

Check the image labels:

```bash
docker inspect ghcr.io/saleor/saleor-dashboard:3.22.27 | grep -A 5 Labels
```

## What It Does

1. Checks out the exact release tag
2. Patches the Dockerfile:
   - Changes `COPY package.json pnpm-lock.yaml ./` to `COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./`
   - Fixes ENV syntax (adds `=`)
   - Capitalizes `AS` in multi-stage builds
3. Builds multi-platform images (amd64, arm64)
4. Pushes to ghcr.io with the correct version tag

## Cleanup

After successfully backfilling all versions, delete:

- `.github/workflows/backfill-docker-images.yml`
- `BACKFILL.md` (this file)
