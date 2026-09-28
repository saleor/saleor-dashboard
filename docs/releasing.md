# Releasing

## Releasing new patch

Patches for the current stable version (for example `3.23`) are released from `main`.
`main` stays compatible with the latest stable Saleor version, so the release branch is
recreated from `main` instead of cherry-picking commits.

1. Run the [New Current Patch Release](https://github.com/saleor/saleor-dashboard/actions/workflows/new-current-patch-release.yml)
   workflow manually (**Run workflow** on `main`). It deletes the release branch (for example
   `3.23`) and recreates it from `main`.
2. The push to the release branch triggers **Deploy Dashboard to staging**, which:
   - opens a release candidate PR (`Release 3.23.x [automated]`) with the changelog generated
     from changesets. If no PR opens, `main` has no unreleased changesets.
   - deploys the release branch to staging, for example `https://323.staging.saleor.cloud`.
3. Test the release candidate on staging. After manual approval, merge the release PR.
4. The merge tags the version (for example `3.23.5`), which triggers:
   - **Create Draft Release**, which opens a draft GitHub release with the changelog for this
     version. Review the release notes and publish the draft manually.
   - **Prepare Sandbox release pull request**, which opens a PR in `saleor-cloud-deployments`.
   - **Cleanup After Release**, which opens a PR that merges the release branch back into `main`
     (version bump and changelog). Merge it.

The current stable version is hardcoded as `3.23` in `new-current-patch-release.yml` and
`cleanup-after-release.yml`. Update both when a new minor version becomes stable.
