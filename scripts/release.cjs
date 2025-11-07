#!/usr/bin/env node

// @ts-check

const { execSync } = require("child_process");
const { readFileSync } = require("fs");
const { join } = require("path");

/**
 * Release script that creates a git tag from package.json version
 * and pushes it to remote with --follow-tags
 */
function release() {
  try {
    // Read package.json to get the version
    const packageJsonPath = join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const version = packageJson.version;

    if (!version) {
      console.error("Error: No version found in package.json");
      process.exit(1);
    }

    console.log(`Creating git tag for version: ${version}`);

    // Create git tag
    execSync(`git tag ${version}`, { stdio: "inherit" });

    const [major, minor] = version.split(".");

    const minorTag = `${major}.${minor}`;

    execSync(`git tag ${minorTag} -f`, { stdio: "inherit" });

    console.log(`Pushing tags to remote...`);

    // Push new tag normally. Cherry-pick it only to avoid pushing minor
    execSync(`git push origin tag ${version}`, { stdio: "inherit" });

    // Push minor tag separately with force
    execSync(`git push origin tag ${minorTag} -f`, { stdio: "inherit" });

    console.log(`Successfully created release tags: ${version}, ${minorTag}`);
  } catch (error) {
    console.error("Error during release:", error.message);
    process.exit(1);
  }
}

// Run the release
release();
