import type { ElementHitMap } from "./elements.ts";
import type { RecordedStep } from "./record.ts";

export interface EvidenceEntry {
  kind?: "screenshot" | "video" | "gql";
  file: string;
  label: string;
  /** Human-readable description of what the reviewer is looking at. */
  caption?: string;
  /** Primary visible page or dialog heading captured from the DOM (fallback for captions). */
  heading?: string;
  url?: string;
  actor?: string;
  route?: string;
  width?: number;
  height?: number;
  theme?: string;
  tag?: string;
  target?: string;
  saleor?: string;
  revision?: string;
  error?: string;
  ariaFile?: string;
  elementsFile?: string;
  posterFile?: string;
  gifFile?: string;
  durationMs?: number;
  steps?: RecordedStep[];
  createdAt?: string;
}

export interface ReviewRunMeta {
  id: string;
  target: string;
  saleor: string;
  scenario: string;
  revision: string;
  repo?: string;
  repoUrl?: string;
  branch?: string;
  prNumber?: number;
  prUrl?: string;
  dashboardUrl: string;
  apiUrl: string;
  evidenceDir: string;
}

/** Extracts `owner/repo` from an SSH or HTTPS git remote URL. */
export const parseRepoSlug = (remoteUrl: string): string | undefined => {
  const trimmed = remoteUrl.trim().replace(/\.git$/, "");
  const ssh = /^[^@]+@[^:]+:(.+)$/.exec(trimmed);

  if (ssh) {
    return ssh[1].replace(/^\/+/, "");
  }

  try {
    const parsed = new URL(trimmed);
    const cleaned = parsed.pathname.replace(/^\/+/, "");

    return cleaned || undefined;
  } catch {
    return undefined;
  }
};

/** Derives a browsable HTTPS repository URL from an SSH or HTTPS git remote URL. */
export const parseRepoUrl = (remoteUrl: string): string | undefined => {
  const trimmed = remoteUrl
    .trim()
    .replace(/\.git$/, "")
    .replace(/\/+$/, "");
  const ssh = /^[^@]+@([^:]+):(.+)$/.exec(trimmed);

  if (ssh) {
    const slug = ssh[2].replace(/^\/+/, "");

    return slug ? `https://${ssh[1]}/${slug}` : undefined;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:" && parsed.protocol !== "ssh:") {
      return undefined;
    }

    const slug = parsed.pathname.replace(/^\/+/, "");

    if (!parsed.host || !slug) {
      return undefined;
    }

    const protocol = parsed.protocol === "http:" ? "http:" : "https:";

    return `${protocol}//${parsed.host}/${slug}`;
  } catch {
    return undefined;
  }
};

export interface ReviewArtifact {
  kind: "video" | "comparison" | "screenshot";
  entry: EvidenceEntry;
  beforeEntry?: EvidenceEntry;
  pairReason?: string;
}

export interface ReviewBundleData {
  run: ReviewRunMeta;
  entries: EvidenceEntry[];
  artifacts: ReviewArtifact[];
  pairs: Record<string, { beforeFile: string; reason: string }>;
  elementsByFile: Record<string, ElementHitMap>;
}

export type PinCategory = "bug" | "layout" | "copy" | "question";

export interface FeedbackPin {
  id: string;
  number: number;
  file: string;
  kind: "screenshot" | "video";
  category?: PinCategory;
  comment: string;
  /** Normalized 0..1 coordinates on the image/video frame. */
  xPct: number;
  yPct: number;
  wPct?: number;
  hPct?: number;
  /** Pixel coordinates in CSS/image space. */
  xPx: number;
  yPx: number;
  wPx?: number;
  hPx?: number;
  /** Video timestamp in seconds when pinning a video frame. */
  videoTimeSec?: number;
  videoStep?: string;
  /** Resolved DOM elements under the pin/box from the captured hit-map. */
  elements?: string[];
  /** Before screenshot file when commenting on a comparison. */
  comparedWith?: string;
  /** Relative crop image path saved on server submission (e.g. `feedback-crops/pin-1.png`). */
  cropFile?: string;
  /** Temporary base64 PNG data URL sent from the browser on submit (stripped before saving JSON). */
  cropDataUrl?: string;
}

export interface FeedbackSubmission {
  runId: string;
  submittedAt: string;
  summaryNote?: string;
  approvedFiles: string[];
  pins: FeedbackPin[];
}

export const inferEntryKind = (entry: EvidenceEntry): "screenshot" | "video" | "gql" => {
  if (entry.kind) {
    return entry.kind;
  }

  if (entry.file.endsWith(".mp4") || entry.file.endsWith(".webm")) {
    return "video";
  }

  if (entry.file.endsWith(".json") || entry.label === "gql") {
    return "gql";
  }

  return "screenshot";
};

const stripBeforeAfterAffix = (label: string): { base: string; side?: "before" | "after" } => {
  const lower = label.toLowerCase();
  const prefixMatch = /^(before|after)[-_.\s]+(.+)$/i.exec(label);

  if (prefixMatch) {
    return {
      base: prefixMatch[2].toLowerCase(),
      side: prefixMatch[1].toLowerCase() as "before" | "after",
    };
  }

  const suffixMatch = /^(.+?)[-_.\s]+(before|after)$/i.exec(label);

  if (suffixMatch) {
    return {
      base: suffixMatch[1].toLowerCase(),
      side: suffixMatch[2].toLowerCase() as "before" | "after",
    };
  }

  return { base: lower };
};

/**
 * Automatically pairs Before/After screenshots so the review board opens straight into
 * Chromatic-style comparisons when a run captured both states.
 *
 * Pairing rules (checked in order):
 * 1. Explicit `tag: "before"` / `tag: "after"` or `before-*` / `after-*` label with the same slot.
 * 2. Same `(route || label, actor, width, theme)` across different revisions (earliest -> latest).
 */
export const computeBeforeAfterPairs = (
  entries: readonly EvidenceEntry[],
): Record<string, { beforeFile: string; reason: string }> => {
  const screenshots = entries.filter(e => inferEntryKind(e) === "screenshot" && !e.error);
  const pairs: Record<string, { beforeFile: string; reason: string }> = {};

  interface GroupBucket {
    befores: EvidenceEntry[];
    afters: EvidenceEntry[];
    untagged: EvidenceEntry[];
  }

  const groups = new Map<string, GroupBucket>();

  for (const entry of screenshots) {
    const parsed = stripBeforeAfterAffix(entry.label);
    const explicitTag = entry.tag?.toLowerCase();
    const side = explicitTag === "before" || explicitTag === "after" ? explicitTag : parsed.side;
    const slotKey = [
      entry.route ?? parsed.base,
      entry.actor ?? "admin",
      entry.width ?? 1280,
      entry.theme ?? "light",
    ].join("|");

    const bucket = groups.get(slotKey) ?? { befores: [], afters: [], untagged: [] };

    if (side === "before") {
      bucket.befores.push(entry);
    } else if (side === "after") {
      bucket.afters.push(entry);
    } else {
      bucket.untagged.push(entry);
    }

    groups.set(slotKey, bucket);
  }

  for (const bucket of groups.values()) {
    if (bucket.befores.length > 0 && bucket.afters.length > 0) {
      const before = bucket.befores[bucket.befores.length - 1];
      const after = bucket.afters[bucket.afters.length - 1];

      pairs[after.file] = { beforeFile: before.file, reason: "before/after" };
      continue;
    }

    if (bucket.befores.length > 0 && bucket.untagged.length > 0) {
      const before = bucket.befores[bucket.befores.length - 1];
      const after = bucket.untagged[bucket.untagged.length - 1];

      pairs[after.file] = { beforeFile: before.file, reason: "before/after" };
      continue;
    }

    if (bucket.untagged.length >= 2) {
      const latest = bucket.untagged[bucket.untagged.length - 1];
      const previous =
        [...bucket.untagged]
          .slice(0, -1)
          .reverse()
          .find(candidate => candidate.revision !== latest.revision) ??
        bucket.untagged[bucket.untagged.length - 2];

      if (previous && previous.file !== latest.file) {
        const reason =
          previous.revision && latest.revision && previous.revision !== latest.revision
            ? `${previous.revision} -> ${latest.revision}`
            : "before/after";

        pairs[latest.file] = { beforeFile: previous.file, reason };
      }
    }
  }

  return pairs;
};

/**
 * Orders visual artifacts for human review:
 * 1. Videos first (if recorded)
 * 2. Before / After comparisons second (consuming their `before` baseline so it isn't shown twice)
 * 3. Plain screenshots with captions last
 * Non-visual entries (like GraphQL dumps) are excluded.
 */
export const buildOrderedArtifacts = (
  entries: readonly EvidenceEntry[],
  pairs: Record<string, { beforeFile: string; reason: string }> = computeBeforeAfterPairs(entries),
): ReviewArtifact[] => {
  const entryByFile = new Map(entries.map(e => [e.file, e]));
  const consumedBefores = new Set<string>();
  const videos: ReviewArtifact[] = [];
  const comparisons: ReviewArtifact[] = [];
  const plainScreenshots: ReviewArtifact[] = [];

  for (const entry of entries) {
    const kind = inferEntryKind(entry);

    if (kind === "video") {
      videos.push({ kind: "video", entry });
    } else if (kind === "screenshot" && pairs[entry.file]) {
      const pair = pairs[entry.file];
      const beforeEntry = entryByFile.get(pair.beforeFile);

      if (beforeEntry) {
        consumedBefores.add(beforeEntry.file);
        comparisons.push({
          kind: "comparison",
          entry,
          beforeEntry,
          pairReason: pair.reason,
        });
      }
    }
  }

  for (const entry of entries) {
    if (inferEntryKind(entry) !== "screenshot") {
      continue;
    }

    if (pairs[entry.file] || consumedBefores.has(entry.file)) {
      continue;
    }

    plainScreenshots.push({ kind: "screenshot", entry });
  }

  return [...videos, ...comparisons, ...plainScreenshots];
};

const formatVideoTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1).padStart(4, "0");

  return `${mins}:${secs}`;
};

/**
 * Formats user annotations into a concise, actionable fix prompt ready to paste into an
 * AI coding agent (or saved as `feedback.md` on server submission).
 */
export const formatFeedbackPrompt = (
  submission: FeedbackSubmission,
  run: ReviewRunMeta,
  entries: readonly EvidenceEntry[],
): string => {
  const entryByFile = new Map(entries.map(e => [e.file, e]));
  const lines: string[] = [];

  lines.push(`# Dashboard visual review feedback (${run.id})`);
  lines.push("");
  lines.push(
    `- **Revision:** \`${run.revision}\` | **Target:** \`${run.target}\` (${run.saleor}) | **Evidence:** \`${run.evidenceDir}\``,
  );

  if (submission.summaryNote?.trim()) {
    lines.push("");
    lines.push("## Overall note");
    lines.push(submission.summaryNote.trim());
  }

  if (submission.pins.length === 0) {
    lines.push("");
    lines.push("No issues pinned. Everything reviewed looks good.");
  } else {
    lines.push("");
    lines.push(`## Issues to fix (${submission.pins.length})`);

    const pinsByFile = new Map<string, FeedbackPin[]>();

    for (const pin of submission.pins) {
      const list = pinsByFile.get(pin.file) ?? [];

      list.push(pin);
      pinsByFile.set(pin.file, list);
    }

    for (const [file, filePins] of pinsByFile) {
      const entry = entryByFile.get(file);
      const metaParts: string[] = [];

      if (entry?.route) {
        metaParts.push(`route \`${entry.route}\``);
      }

      if (entry?.actor) {
        metaParts.push(`actor \`${entry.actor}\``);
      }

      if (entry?.width) {
        metaParts.push(`${entry.width}px`);
      }

      if (entry?.theme) {
        metaParts.push(entry.theme);
      }

      lines.push("");
      lines.push(`### ${entry?.label ?? file}`);
      if (entry?.caption) {
        lines.push(`- Caption: ${entry.caption}`);
      }
      lines.push(
        `- File: \`${run.evidenceDir}/${file}\`${metaParts.length ? ` (${metaParts.join(", ")})` : ""}`,
      );

      const comparedWith = filePins.find(p => p.comparedWith)?.comparedWith;

      if (comparedWith) {
        lines.push(`- Compared against: \`${run.evidenceDir}/${comparedWith}\``);
      }

      for (const pin of filePins) {
        const location =
          pin.kind === "video" && pin.videoTimeSec !== undefined
            ? `at \`${formatVideoTime(pin.videoTimeSec)}\`${pin.videoStep ? ` (step: "${pin.videoStep}")` : ""}, (${pin.xPx}, ${pin.yPx})`
            : pin.wPx && pin.hPx
              ? `box (${pin.xPx}, ${pin.yPx}, ${pin.wPx}x${pin.hPx})`
              : `point (${pin.xPx}, ${pin.yPx})`;

        const tag = pin.category ? ` [${pin.category}]` : "";

        lines.push(`- **#${pin.number}${tag}** ${location}: ${pin.comment.trim()}`);

        if (pin.elements && pin.elements.length > 0) {
          lines.push(`  - Element: \`${pin.elements.join("`, `")}\``);
        }

        if (pin.cropFile) {
          lines.push(`  - Crop: \`${run.evidenceDir}/${pin.cropFile}\``);
        }
      }
    }
  }

  if (submission.pins.length > 0) {
    lines.push("");
    lines.push(
      "Please fix each pinned issue above, re-capture the affected views with `pnpm verify` (keeping the earlier captures so Before/After diff works), and let me know when the updated review board is ready.",
    );
  }

  return `${lines.join("\n")}\n`;
};
