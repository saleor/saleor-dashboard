/*
  Runs before `pnpm dev`. Reports the state of the private Saleor Cloud extensions submodule at
  src/cloud-extensions/src: which commit and branch are checked out, whether that differs from the
  pinned commit, and whether the tracked branch has newer commits. It only prints; it never
  changes the checkout and never fails, so the dev server always starts.
*/
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const SUBMODULE = "src/cloud-extensions/src";
const FETCH_TIMEOUT_MS = 5000;

export interface CloudExtensionsState {
  // Branch recorded in .gitmodules
  trackedBranch: string;
  // Commit the Dashboard index pins
  pinned: string;
  checkedOut: string;
  // Empty when HEAD is detached, as after `pnpm cloud:setup`
  localBranch: string;
  // Remote branches that contain the checked-out commit
  remoteBranches: string[];
  // Commits on origin/<trackedBranch> missing from the checkout; null when that couldn't be read
  behind: number | null;
  dirty: boolean;
}

const short = (sha: string): string => sha.slice(0, 7);

export function describeCloudExtensions(state: CloudExtensionsState): string[] {
  const where = state.remoteBranches.length
    ? `in ${state.remoteBranches.join(", ")}`
    : "not pushed to any remote branch";
  const lines = [
    `Saleor Cloud extensions: ${short(state.checkedOut)} (${state.localBranch || "detached"}, ${where}), tracking ${state.trackedBranch}`,
  ];

  if (state.checkedOut !== state.pinned) {
    lines.push(
      `  ! The checkout differs from the pinned commit ${short(state.pinned)}. Run \`pnpm cloud:setup\` to check out the pinned commit, or commit the new pointer.`,
    );
  }

  if (state.behind === null) {
    lines.push(`  Could not read origin/${state.trackedBranch}, so staleness was not checked.`);
  } else if (state.behind > 0) {
    lines.push(
      `  ! Stale: ${state.behind} commit(s) behind origin/${state.trackedBranch}. Run \`pnpm cloud:update\` to move to its latest commit, then commit the new pointer.`,
    );
  }

  if (state.dirty) {
    lines.push(`  ! ${SUBMODULE} has uncommitted changes.`);
  }

  return lines;
}

const git = (args: string[], timeout?: number): string | null => {
  const result = spawnSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    timeout,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });

  return result.status === 0 ? result.stdout.trim() : null;
};

const readState = (): CloudExtensionsState => {
  const sub = ["-C", SUBMODULE];
  const trackedBranch =
    git(["config", "-f", ".gitmodules", "submodule.cloud-extensions.branch"]) ?? "main";
  const fetched = git([...sub, "fetch", "--quiet", "origin"], FETCH_TIMEOUT_MS) !== null;
  const behindCount = fetched
    ? git([...sub, "rev-list", "--count", `HEAD..origin/${trackedBranch}`])
    : null;

  return {
    trackedBranch,
    pinned: git(["rev-parse", `:${SUBMODULE}`]) ?? "",
    checkedOut: git([...sub, "rev-parse", "HEAD"]) ?? "",
    localBranch: git([...sub, "branch", "--show-current"]) ?? "",
    remoteBranches: (
      git([...sub, "branch", "-r", "--contains", "HEAD", "--format=%(refname:short)"]) ?? ""
    )
      .split("\n")
      .filter(Boolean)
      .slice(0, 3),
    behind: behindCount === null ? null : Number(behindCount),
    dirty: Boolean(git([...sub, "status", "--porcelain"])),
  };
};

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    if (existsSync(path.join(ROOT, SUBMODULE, "index.ts"))) {
      console.log(describeCloudExtensions(readState()).join("\n"));
    } else {
      console.log(
        "Saleor Cloud extensions are not checked out, so they render nothing. Saleor team: run `pnpm cloud:setup`.",
      );
    }
  } catch (error) {
    console.log(`Could not check Saleor Cloud extensions: ${String(error)}`);
  }
}
