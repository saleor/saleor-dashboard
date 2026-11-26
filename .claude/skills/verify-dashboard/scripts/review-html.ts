import fs from "node:fs";
import path from "node:path";

import type { ElementHitMap } from "./elements.ts";
import {
  buildOrderedArtifacts,
  computeBeforeAfterPairs,
  type EvidenceEntry,
  inferEntryKind,
  type ReviewBundleData,
  type ReviewRunMeta,
} from "./review-model.ts";

/** Escapes JSON for safe embedding inside an inline `<script>` tag. */
export const serializeForInlineScript = (data: unknown): string =>
  JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

/** Reads `index.json` plus adjacent `.elements.json` hit-maps and orders visual artifacts. */
export const loadReviewBundle = (run: ReviewRunMeta): ReviewBundleData => {
  const indexPath = path.join(run.evidenceDir, "index.json");
  const entries: EvidenceEntry[] = fs.existsSync(indexPath)
    ? (JSON.parse(fs.readFileSync(indexPath, "utf8")) as EvidenceEntry[])
    : [];

  const elementsByFile: Record<string, ElementHitMap> = {};

  for (const entry of entries) {
    if (inferEntryKind(entry) !== "screenshot") {
      continue;
    }

    const elementsName = entry.elementsFile ?? entry.file.replace(/\.png$/i, ".elements.json");
    const elementsPath = path.join(run.evidenceDir, elementsName);

    if (fs.existsSync(elementsPath)) {
      try {
        elementsByFile[entry.file] = JSON.parse(
          fs.readFileSync(elementsPath, "utf8"),
        ) as ElementHitMap;
      } catch {
        // Ignore corrupted hit-map files.
      }
    }
  }

  const pairs = computeBeforeAfterPairs(entries);
  const artifacts = buildOrderedArtifacts(entries, pairs);

  return {
    run,
    entries,
    artifacts,
    pairs,
    elementsByFile,
  };
};

/**
 * Hand-drawn graffiti marker swoosh + spray flecks underneath the skewed "Saleor Dev" tag.
 */
const GRAFFITI_SWOOSH_SVG = `<svg class="graffiti-swoosh" viewBox="0 0 180 16" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M4 11.5C38 4.2 104 2.4 171 6.2C143 7.4 98 9.2 66 12.6C88 11.4 126 10.6 154 11.8" stroke="var(--dev-accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88"/>
<circle cx="174.5" cy="4.2" r="1.4" fill="var(--dev-accent)" opacity="0.75"/>
<circle cx="177.2" cy="8.4" r="0.95" fill="var(--ink)" opacity="0.45"/>
<circle cx="168.5" cy="12.2" r="1.05" fill="var(--dev-accent)" opacity="0.55"/>
</svg>`;

const SALEOR_SLASH_MARK_SVG = `<svg class="saleor-mark" width="15" height="11" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M19.7553 4.2H5.18348L0 10.3H14.5719L19.7553 4.2Z" fill="currentColor"/>
</svg>`;

const FAVICON_DATA_URI =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><rect width="28" height="28" rx="7" fill="#0A0A0A"/><path d="M16.8 9.2H9.3L5.6 13.7H13.1L16.8 9.2Z" fill="#FFFEF8"/><path d="M22.4 14.3H14.9L11.2 18.8H18.7L22.4 14.3Z" fill="#818CF8"/></svg>',
  );

/** Generates a minimal, Cypress/Playwright-style Saleor DevTools visual review UI. */
export const buildReviewHtml = (bundle: ReviewBundleData): string => {
  const payload = serializeForInlineScript(bundle);
  const titleCtx = [
    bundle.run.branch ?? bundle.run.revision,
    bundle.run.prNumber ? `#${bundle.run.prNumber}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const title = `Saleor Dev — ${titleCtx}`.replace(/[<>&"]/g, "");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light dark" />
<link rel="icon" type="image/svg+xml" href="${FAVICON_DATA_URI}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" />
<title>${title}</title>
<style>
  :root {
    color-scheme: light dark;
    --bg: #fffef8;
    --sidebar-bg: #faf8f1;
    --surface: #ffffff;
    --subtle: #f1efe6;
    --hover-row: rgba(10, 10, 10, 0.04);
    --active-row: #ffffff;
    --border: #e4e1d6;
    --border-strong: #c2beb0;
    --ink: #0a0a0a;
    --ink-2: #2b2b29;
    --muted: #6c6a61;
    --header-bg: rgba(255, 254, 248, 0.92);
    --emblem-bg: #0a0a0a;
    --emblem-border: #0a0a0a;
    --emblem-fg: #fffef8;
    --dev-accent: #4f46e5;
    --dev-accent-soft: rgba(79, 70, 229, 0.09);
    --dev-accent-border: rgba(79, 70, 229, 0.24);
    --tag-shadow: rgba(79, 70, 229, 0.24);
    --cta-bg: #0a0a0a;
    --cta-ink: #fffef8;
    --cta-hover: #262626;
    --cta-badge-bg: rgba(255, 254, 248, 0.18);
    --cta-badge-ink: #fffef8;
    --pin: #dc2626;
    --pin-soft: rgba(220, 38, 38, 0.12);
    --pin-ring: #ffffff;
    --hover-outline: #0a0a0a;
    --hover-fill: rgba(10, 10, 10, 0.06);
    --hover-tag-bg: #0a0a0a;
    --hover-tag-ink: #fffef8;
    --knob-bg: #0a0a0a;
    --knob-ink: #fffef8;
    --knob-ring: #ffffff;
    --toast-bg: #0a0a0a;
    --toast-ink: #fffef8;
    --grid-dot: rgba(10, 10, 10, 0.075);
    --radius: 10px;
    --sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow: 0 10px 28px rgba(0, 0, 0, 0.07);
    --shadow-pop: 0 18px 44px rgba(0, 0, 0, 0.16);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0b0b0d;
      --sidebar-bg: #0f0f12;
      --surface: #141419;
      --subtle: #1c1c23;
      --hover-row: rgba(247, 246, 240, 0.04);
      --active-row: #1a1a22;
      --border: #25252e;
      --border-strong: #3d3d4a;
      --ink: #f7f6f0;
      --ink-2: #d6d4cc;
      --muted: #8e8d96;
      --header-bg: rgba(11, 11, 13, 0.9);
      --emblem-bg: #18181f;
      --emblem-border: #32323f;
      --emblem-fg: #f7f6f0;
      --dev-accent: #818cf8;
      --dev-accent-soft: rgba(129, 140, 248, 0.12);
      --dev-accent-border: rgba(129, 140, 248, 0.3);
      --tag-shadow: rgba(129, 140, 248, 0.34);
      --cta-bg: #f7f6f0;
      --cta-ink: #0b0b0d;
      --cta-hover: #e4e2d8;
      --cta-badge-bg: rgba(11, 11, 13, 0.14);
      --cta-badge-ink: #0b0b0d;
      --pin: #ef4444;
      --pin-soft: rgba(239, 68, 68, 0.16);
      --pin-ring: #0b0b0d;
      --hover-outline: #f7f6f0;
      --hover-fill: rgba(247, 246, 240, 0.08);
      --hover-tag-bg: #f7f6f0;
      --hover-tag-ink: #0b0b0d;
      --knob-bg: #f7f6f0;
      --knob-ink: #0b0b0d;
      --knob-ring: #0b0b0d;
      --toast-bg: #f7f6f0;
      --toast-ink: #0b0b0d;
      --grid-dot: rgba(247, 246, 240, 0.075);
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.35);
      --shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
      --shadow-pop: 0 20px 52px rgba(0, 0, 0, 0.68);
    }
  }

  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  button, input, textarea { font: inherit; color: inherit; }
  button { cursor: pointer; }
  code { font-family: var(--mono); font-size: 12px; }

  /* Full-height Cypress/Playwright-style runner shell */
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  /* Minimal Saleor Dev top bar */
  .header {
    height: 54px;
    flex-shrink: 0;
    background: var(--header-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    z-index: 30;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }
  .graffiti-logo {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 5px 5px 2px;
    transform: rotate(-3deg) skewX(-6deg) translateY(1px);
    transform-origin: center center;
    user-select: none;
    flex-shrink: 0;
  }
  .saleor-mark {
    display: block;
    color: var(--ink);
    flex-shrink: 0;
    transform: translateY(-1px);
  }
  .graffiti-text {
    position: relative;
    z-index: 2;
    font-family: "Permanent Marker", "Marker Felt", "Bradley Hand", cursive;
    font-size: 20px;
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: 0.025em;
    color: var(--ink);
    text-shadow: 1.8px 1.8px 0 var(--tag-shadow);
    white-space: nowrap;
  }
  .graffiti-text .dev {
    color: var(--dev-accent);
    margin-left: 5px;
  }
  .graffiti-swoosh {
    position: absolute;
    left: 14px;
    right: -3px;
    bottom: 0px;
    width: calc(100% - 11px);
    height: 9px;
    z-index: 1;
    pointer-events: none;
  }
  .run-context {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--muted);
    background: var(--subtle);
    border: 1px solid var(--border);
    padding: 3px 10px;
    border-radius: 999px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .run-context a {
    color: inherit;
    text-decoration: none;
  }
  .run-context .ctx-repo { color: var(--muted); }
  .run-context a.ctx-repo:hover {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .run-context .ctx-sep { opacity: 0.45; }
  .run-context .ctx-branch {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--ink-2);
    font-weight: 500;
  }
  .run-context a.ctx-branch:hover {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .run-context .ctx-pr {
    display: inline-flex;
    align-items: center;
    padding: 0 6px;
    margin-left: 2px;
    border-radius: 999px;
    background: var(--dev-accent-soft);
    border: 1px solid var(--dev-accent-border);
    color: var(--dev-accent);
    font-weight: 600;
    text-decoration: none;
  }
  .run-context a.ctx-pr:hover { text-decoration: underline; text-underline-offset: 2px; }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Monochrome buttons — zero red */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.01em;
    white-space: nowrap;
    transition: background 120ms, border-color 120ms, color 120ms;
  }
  .btn:hover { border-color: var(--ink); }
  .btn.primary {
    background: var(--cta-bg);
    border-color: var(--cta-bg);
    color: var(--cta-ink);
  }
  .btn.primary:hover {
    background: var(--cta-hover);
    border-color: var(--cta-hover);
  }
  .btn.sm { padding: 5px 11px; font-size: 12.5px; }
  .btn.icon {
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 999px;
    font-size: 13px;
  }
  .btn.ghost {
    border-color: transparent;
    background: transparent;
    color: var(--muted);
  }
  .btn.ghost:hover { color: var(--ink); background: var(--subtle); border-color: transparent; }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn:disabled:hover { border-color: var(--border); }
  .count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 19px;
    height: 19px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--cta-badge-bg);
    color: var(--cta-badge-ink);
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  /* Two-pane workspace */
  .workspace {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
  }

  /* Left artifact explorer sidebar */
  .sidebar {
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .sidebar-list {
    flex: 1;
    overflow-y: auto;
    padding: 14px 10px 18px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .nav-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .nav-group-label {
    font-family: var(--mono);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 10px 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-item {
    width: 100%;
    text-align: left;
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--ink-2);
    transition: background 110ms, border-color 110ms, color 110ms;
  }
  .nav-item:hover {
    background: var(--hover-row);
    color: var(--ink);
  }
  .nav-item.active {
    background: var(--active-row);
    border-color: var(--border);
    color: var(--ink);
    box-shadow: var(--shadow-sm);
  }
  .nav-icon {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
  }
  .nav-item.active .nav-icon { color: var(--dev-accent); }
  .nav-item-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .nav-item-title {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .nav-item.active .nav-item-title { font-weight: 600; }
  .nav-item-sub {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .nav-pin-pill {
    flex-shrink: 0;
    margin-top: 2px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--subtle);
    border: 1px solid var(--border);
    color: var(--ink);
    font-family: var(--mono);
    font-size: 10.5px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-variant-numeric: tabular-nums;
  }

  .sidebar-foot {
    flex-shrink: 0;
    padding: 11px 14px;
    border-top: 1px solid var(--border);
    font-family: var(--mono);
    font-size: 10.5px;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .sidebar-foot .kbd-hint { opacity: 0.8; }

  /* Right single-artifact stage */
  .stage {
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    background: var(--bg);
    background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
    background-size: 22px 22px;
  }
  .stage-inner {
    width: 100%;
    padding: 20px 24px 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .stage-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .stage-title-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .artifact-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .artifact-eyebrow .idx { color: var(--dev-accent); }
  .stage-title {
    margin: 0;
    font-size: 21px;
    font-weight: 600;
    letter-spacing: -0.025em;
    color: var(--ink);
  }
  .stage-caption {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
  }
  .stage-caption a {
    color: inherit;
    text-decoration: none;
  }
  .stage-caption a:hover {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .stage-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .step-nav {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 4px;
  }

  /* Segmented control for Before/After modes */
  .segmented {
    display: inline-flex;
    background: var(--subtle);
    border: 1px solid var(--border);
    padding: 3px;
    border-radius: 999px;
    gap: 2px;
  }
  .segmented button {
    border: none;
    background: transparent;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--muted);
    transition: background 120ms, color 120ms;
  }
  .segmented button.active {
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow-sm);
  }

  /* Captioned media figure (caption bar sits above the frame so it is always visible without scrolling) */
  .media-figure {
    margin: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
  }
  .media-caption {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding: 10px 14px;
    background: var(--sidebar-bg);
    border-bottom: 1px solid var(--border);
    border-radius: calc(var(--radius) - 1px) calc(var(--radius) - 1px) 0 0;
  }
  .media-caption-main {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    flex: 1 1 260px;
  }
  .cap-tag {
    flex-shrink: 0;
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 999px;
    background: var(--subtle);
    border: 1px solid var(--border);
    color: var(--muted);
  }
  .cap-tag.accent {
    background: var(--dev-accent-soft);
    border-color: var(--dev-accent-border);
    color: var(--dev-accent);
  }
  .media-caption-text {
    font-size: 13.5px;
    line-height: 1.45;
    color: var(--ink);
    font-weight: 450;
  }
  .media-caption-meta {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--muted);
  }
  .media-figure > .surface-wrap,
  .media-figure > .slider-wrap,
  .media-figure > .video-box {
    border: none;
    box-shadow: none;
    border-radius: 0 0 calc(var(--radius) - 1px) calc(var(--radius) - 1px);
  }
  .media-figure > img.static-img,
  .media-figure > .surface-wrap img.main-img,
  .media-figure > .surface-wrap canvas.diff-canvas,
  .media-figure > .surface-wrap .css-diff-stack img.base {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0 0 calc(var(--radius) - 1px) calc(var(--radius) - 1px);
  }

  /* Interactive image / diff surface */
  .surface-wrap {
    position: relative;
    display: block;
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    user-select: none;
    cursor: crosshair;
  }
  .surface-wrap img.main-img,
  .surface-wrap canvas.diff-canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: calc(var(--radius) - 1px);
    pointer-events: none;
  }
  .surface-hint {
    font-size: 12px;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .hover-box {
    position: absolute;
    pointer-events: none;
    border: 1.5px solid var(--hover-outline);
    background: var(--hover-fill);
    border-radius: 3px;
    display: none;
    z-index: 15;
  }
  .hover-tag {
    position: absolute;
    pointer-events: none;
    left: 0;
    top: -24px;
    background: var(--hover-tag-bg);
    color: var(--hover-tag-ink);
    font-family: var(--mono);
    font-size: 11px;
    padding: 2px 7px;
    border-radius: 4px;
    white-space: nowrap;
    max-width: 340px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .drag-box {
    position: absolute;
    pointer-events: none;
    border: 2px dashed var(--pin);
    background: var(--pin-soft);
    border-radius: 3px;
    display: none;
    z-index: 6;
  }

  /* Pins on images/diffs */
  .pin-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--pin);
    color: #fff;
    font-size: 11.5px;
    font-weight: 700;
    border: 2px solid var(--pin-ring);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.28);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 8;
    transition: transform 100ms;
  }
  .pin-marker:hover { transform: translate(-50%, -50%) scale(1.16); z-index: 12; }
  .pin-rect {
    position: absolute;
    border: 2px solid var(--pin);
    background: var(--pin-soft);
    border-radius: 4px;
    z-index: 7;
    cursor: pointer;
  }
  .pin-rect .pin-tag {
    position: absolute;
    top: -11px;
    left: -11px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--pin);
    border: 2px solid var(--pin-ring);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
  }

  /* Side-by-side */
  .side-by-side {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    align-items: start;
  }
  .compare-col {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
  }
  .col-label {
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .compare-col > img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  /* Slider */
  .slider-wrap {
    position: relative;
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    user-select: none;
    background: var(--surface);
  }
  .slider-wrap img.before-img {
    display: block;
    width: 100%;
    height: auto;
    pointer-events: none;
  }
  .slider-after {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .slider-after img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
    display: block;
  }
  .slider-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--knob-bg);
    cursor: ew-resize;
    z-index: 10;
  }
  .slider-knob {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--knob-bg);
    color: var(--knob-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    border: 2px solid var(--knob-ring);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
  }
  .slider-badge {
    position: absolute;
    top: 12px;
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(10, 10, 10, 0.8);
    color: #fff;
    font-family: var(--mono);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    pointer-events: none;
    z-index: 9;
  }
  .slider-badge.left { left: 12px; }
  .slider-badge.right { right: 12px; }

  /* Diff */
  .diff-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 12.5px;
    color: var(--muted);
  }
  .diff-stat {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--pin);
    font-weight: 600;
  }
  .css-diff-stack { position: relative; width: 100%; }
  .css-diff-stack img.base { display: block; width: 100%; height: auto; border-radius: calc(var(--radius) - 1px); }
  .css-diff-stack img.over {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
    mix-blend-mode: difference;
    border-radius: calc(var(--radius) - 1px);
    pointer-events: none;
  }

  /* Video */
  .video-box {
    position: relative;
    background: #0b0b0d;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .video-box video {
    width: 100%;
    display: block;
    max-height: 76vh;
  }
  .video-pin-overlay {
    position: absolute;
    inset: 0;
    cursor: crosshair;
    background: rgba(0, 0, 0, 0.18);
    display: none;
    z-index: 9;
  }
  .video-pin-overlay.active { display: block; }
  .video-pin-banner {
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--toast-bg);
    color: var(--toast-ink);
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 500;
    box-shadow: var(--shadow-pop);
    pointer-events: none;
  }
  .step-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .step-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 11px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 12.5px;
    color: var(--ink-2);
    transition: border-color 120ms;
  }
  .step-chip:hover { border-color: var(--ink); }
  .step-chip .t { font-family: var(--mono); font-size: 11.5px; color: var(--muted); }

  /* Inline bug comments for active artifact */
  .pin-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .pin-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .pin-row-main {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
  }
  .pin-num {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
    border-radius: 50%;
    background: var(--pin);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pin-body {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .pin-text { font-size: 13.5px; color: var(--ink); white-space: pre-wrap; word-break: break-word; }
  .pin-meta {
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--muted);
    word-break: break-word;
  }
  .pin-row-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  /* Popover */
  .popover {
    position: fixed;
    z-index: 50;
    width: 330px;
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    padding: 14px;
    box-shadow: var(--shadow-pop);
    display: none;
    flex-direction: column;
    gap: 10px;
  }
  .popover.open { display: flex; }
  .popover-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 13px;
  }
  .el-chip {
    font-family: var(--mono);
    font-size: 11.5px;
    background: var(--subtle);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 5px 8px;
    color: var(--ink-2);
    word-break: break-word;
  }
  .popover textarea {
    width: 100%;
    min-height: 78px;
    resize: vertical;
    padding: 9px 10px;
    border-radius: 7px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--ink);
    outline: none;
    font-size: 13px;
  }
  .popover textarea:focus { border-color: var(--ink); }
  .popover-actions { display: flex; justify-content: flex-end; gap: 8px; }

  .empty {
    padding: 64px 20px;
    text-align: center;
    color: var(--muted);
    background: var(--surface);
    border: 1px dashed var(--border);
    border-radius: var(--radius);
  }

  .toast {
    position: fixed;
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--toast-bg);
    color: var(--toast-ink);
    padding: 9px 16px;
    border-radius: 999px;
    font-weight: 500;
    font-size: 13px;
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    transition: opacity 150ms;
    box-shadow: var(--shadow-pop);
  }
  .toast.show { opacity: 1; }

  @media (max-width: 860px) {
    .app { height: auto; min-height: 100vh; overflow: visible; }
    .workspace { grid-template-columns: 1fr; }
    .sidebar { border-right: none; border-bottom: 1px solid var(--border); max-height: 260px; }
    .side-by-side { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="app">
  <header class="header">
    <div class="brand">
      <div class="graffiti-logo" aria-label="Saleor Dev">
        ${SALEOR_SLASH_MARK_SVG}
        <span class="graffiti-text">Saleor<span class="dev">Dev</span></span>
        ${GRAFFITI_SWOOSH_SVG}
      </div>
      <div class="run-context" id="runContext"></div>
    </div>
    <div class="header-actions" id="headerActions"></div>
  </header>

  <div class="workspace">
    <aside class="sidebar" aria-label="Artifacts">
      <div class="sidebar-list" id="sidebarList"></div>
      <div class="sidebar-foot">
        <span>Saleor Dev</span>
        <span class="kbd-hint">↑↓ navigate</span>
      </div>
    </aside>

    <main class="stage" id="stageScroll">
      <div class="stage-inner" id="stage"></div>
    </main>
  </div>
</div>

<div class="popover" id="pinPopover">
  <div class="popover-head">
    <span id="popoverTitle">Add bug comment</span>
    <button class="btn sm ghost" id="popoverCloseBtn" aria-label="Close">✕</button>
  </div>
  <div class="el-chip" id="popoverElement" style="display:none"></div>
  <textarea id="popoverInput" placeholder="Describe what is wrong or should change..."></textarea>
  <div class="popover-actions">
    <button class="btn sm" id="popoverCancelBtn">Cancel</button>
    <button class="btn sm primary" id="popoverSaveBtn">Save (⌘↵)</button>
  </div>
</div>

<div class="toast" id="toast"></div>

<script id="verify-data" type="application/json">${payload}</script>
<script>
(() => {
  const DATA = JSON.parse(document.getElementById("verify-data").textContent);
  const IS_SERVER = location.protocol === "http:" || location.protocol === "https:";
  const STORAGE_KEY = "saleor-verify-review:" + DATA.run.id;

  const loadPins = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.pins)) return parsed.pins;
      }
    } catch {}
    return [];
  };

  const state = {
    selectedIndex: 0, // Artifacts are pre-ordered: video first -> comparisons -> plain screenshots
    pins: loadPins(),
    compareMode: {},  // file -> "side" | "slider" | "diff"
    sliderPct: {},    // file -> 0..100
  };

  const renumber = () => state.pins.forEach((p, i) => { p.number = i + 1; });
  renumber();

  const saveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ pins: state.pins }));
    } catch {}
  };

  const $ = (id) => document.getElementById(id);
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v !== undefined && v !== null) node.setAttribute(k, String(v));
    }
    for (const child of children) {
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    }
    return node;
  };

  const svgIcon = (paths) => {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    for (const spec of paths) {
      const node = document.createElementNS(ns, spec.tag);
      for (const [k, v] of Object.entries(spec.attrs)) node.setAttribute(k, v);
      svg.appendChild(node);
    }
    return svg;
  };

  const copyIconSvg = () => svgIcon([
    { tag: "rect", attrs: { x: "5.5", y: "5.5", width: "8", height: "8", rx: "1.5", stroke: "currentColor", "stroke-width": "1.4" } },
    { tag: "path", attrs: { d: "M3.5 10.5H3a1.5 1.5 0 0 1-1.5-1.5V3A1.5 1.5 0 0 1 3 1.5h6A1.5 1.5 0 0 1 10.5 3v.5", stroke: "currentColor", "stroke-width": "1.4", "stroke-linecap": "round" } },
  ]);

  const artifactIconSvg = (kind) => {
    if (kind === "video") {
      return svgIcon([
        { tag: "circle", attrs: { cx: "8", cy: "8", r: "6.2", stroke: "currentColor", "stroke-width": "1.3" } },
        { tag: "path", attrs: { d: "M6.8 5.5L11 8L6.8 10.5V5.5Z", fill: "currentColor" } },
      ]);
    }
    if (kind === "comparison") {
      return svgIcon([
        { tag: "rect", attrs: { x: "2", y: "3", width: "12", height: "10", rx: "1.8", stroke: "currentColor", "stroke-width": "1.3" } },
        { tag: "path", attrs: { d: "M8 2V14", stroke: "currentColor", "stroke-width": "1.3", "stroke-linecap": "round" } },
      ]);
    }
    return svgIcon([
      { tag: "rect", attrs: { x: "2", y: "3", width: "12", height: "10", rx: "1.8", stroke: "currentColor", "stroke-width": "1.3" } },
      { tag: "circle", attrs: { cx: "5.6", cy: "6.4", r: "1.1", fill: "currentColor" } },
      { tag: "path", attrs: { d: "M2.5 11.5L6.2 8.2L9 10.7L11.2 8.8L13.5 11", stroke: "currentColor", "stroke-width": "1.2", "stroke-linecap": "round", "stroke-linejoin": "round" } },
    ]);
  };

  let toastTimer;
  const showToast = (msg) => {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    return m + ":" + (sec % 60).toFixed(1).padStart(4, "0");
  };

  const formatIndex = (i) => String(i + 1).padStart(2, "0");

  const humanizeLabel = (label) =>
    String(label || "")
      .replace(/^(before|after)[-_\\s]+/i, "")
      .replace(/[-_\\s]+(before|after)$/i, "")
      .replace(/-(admin|anonymous|product|order|staff|user)(-\\d+-(light|dark))?$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\\b\\w/g, (c) => c.toUpperCase())
      .trim() || label;

  const renderCaption = (entry) => {
    const wrap = el("span", { class: "stage-caption" });
    const parts = [];
    if (entry.route) {
      let href = entry.url || "";
      if (!href && DATA.run.dashboardUrl) {
        try { href = new URL(entry.route, DATA.run.dashboardUrl).href; } catch {}
      }
      parts.push(
        href
          ? el("a", { href, target: "_blank", rel: "noopener noreferrer", text: entry.route })
          : entry.route,
      );
    }
    if (entry.actor) parts.push(entry.actor);
    if (entry.width) parts.push(entry.width + "px");
    if (entry.theme) parts.push(entry.theme);
    if (entry.durationMs) parts.push(formatTime(entry.durationMs / 1000));
    parts.forEach((part, i) => {
      if (i > 0) wrap.append(" · ");
      wrap.append(part);
    });
    return wrap;
  };

  const describeEntry = (entry, opts = {}) => {
    if (entry.caption && entry.caption.trim()) return entry.caption.trim();
    const name = humanizeLabel(entry.label);
    const heading = entry.heading && entry.heading.trim();
    const subject =
      heading && heading.toLowerCase() !== name.toLowerCase()
        ? name + " (“" + heading + "”)"
        : name;
    const where = entry.route ? " on " + entry.route : "";
    const viewBits = [];
    if (entry.width) viewBits.push(entry.width + (entry.height ? "×" + entry.height : "px"));
    if (entry.theme) viewBits.push(entry.theme + " mode");
    if (entry.actor) viewBits.push(entry.actor === "anonymous" ? "signed out" : "as " + entry.actor);
    const view = viewBits.length ? " — " + viewBits.join(", ") : "";

    if (opts.role === "before") {
      return "Baseline " + subject + where + " before changes" + view + ".";
    }
    if (opts.role === "after") {
      return "Updated " + subject + where + " after changes" + view + ".";
    }
    if (opts.role === "slider") {
      return "Interactive Before / After comparison of " + subject + where + view + ".";
    }
    if (opts.role === "diff") {
      return "Pixel differences highlighted in red between Before and After on " + subject + where + ".";
    }
    if (opts.role === "video") {
      const steps = (entry.steps || []).map((st) => st.label).filter(Boolean);
      const stepSummary = steps.length ? ": " + steps.slice(0, 4).join(" → ") + (steps.length > 4 ? " → …" : "") : "";
      return "Recorded walkthrough of " + subject + where + view + stepSummary + (stepSummary ? "" : ".");
    }
    return subject + where + view + ".";
  };

  const buildFigure = ({ tag, accent, text, meta, content }) =>
    el("figure", { class: "media-figure" }, [
      el("figcaption", { class: "media-caption" }, [
        el("span", { class: "media-caption-main" }, [
          tag ? el("span", { class: "cap-tag" + (accent ? " accent" : ""), text: tag }) : null,
          el("span", { class: "media-caption-text", text }),
        ]),
        meta ? el("span", { class: "media-caption-meta" }, Array.isArray(meta) ? meta : [meta]) : null,
      ]),
      content,
    ]);

  const subMetaFor = (entry) => {
    const parts = [];
    if (entry.width) parts.push(entry.width + "px");
    if (entry.theme) parts.push(entry.theme);
    if (entry.durationMs) parts.push(formatTime(entry.durationMs / 1000));
    if (!parts.length && entry.route) parts.push(entry.route);
    return parts.join(" · ");
  };

  // DOM hit-map resolution
  const specificity = (e) => {
    const area = Math.max(1, e.w * e.h);
    const bonus = (e.testId ? 0.55 : 1) * (e.role || e.tag === "button" || e.tag === "a" ? 0.8 : 1);
    return area * bonus;
  };
  const formatEl = (e) => {
    let s = e.tag;
    if (e.testId) s += '[data-test-id="' + e.testId + '"]';
    if (e.role && e.role !== e.tag) s += '[role="' + e.role + '"]';
    const label = e.name || e.text;
    return label ? s + ' ("' + label + '")' : s;
  };
  const resolvePoint = (file, xPct, yPct) => {
    const map = DATA.elementsByFile[file];
    if (!map || !map.elements?.length) return null;
    const x = xPct * map.docWidth;
    const y = yPct * map.docHeight;
    const hits = map.elements.filter((e) => x >= e.x && x <= e.x + e.w && y >= e.y && y <= e.y + e.h);
    if (!hits.length) return null;
    hits.sort((a, b) => specificity(a) - specificity(b));
    return hits[0];
  };
  const resolveBox = (file, boxPct) => {
    const map = DATA.elementsByFile[file];
    if (!map || !map.elements?.length) return [];
    const bx = boxPct.x * map.docWidth, by = boxPct.y * map.docHeight;
    const bw = boxPct.w * map.docWidth, bh = boxPct.h * map.docHeight;
    const scored = [];
    for (const e of map.elements) {
      const xo = Math.max(0, Math.min(e.x + e.w, bx + bw) - Math.max(e.x, bx));
      const yo = Math.max(0, Math.min(e.y + e.h, by + bh) - Math.max(e.y, by));
      const area = xo * yo;
      if (area <= 0) continue;
      const cov = area / Math.max(1, e.w * e.h);
      scored.push({ e, score: specificity(e) / Math.max(0.1, cov) });
    }
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, 3).map((s) => s.e);
  };

  const imageCache = new Map();
  const loadImage = (src) => {
    if (imageCache.has(src)) return imageCache.get(src);
    const p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    imageCache.set(src, p);
    return p;
  };

  const renderPinCrop = async (pin) => {
    if (!IS_SERVER || pin.kind !== "screenshot") return pin.cropDataUrl;
    try {
      const img = await loadImage(pin.file);
      const cx = pin.wPct ? (pin.xPct + pin.wPct / 2) * img.naturalWidth : pin.xPct * img.naturalWidth;
      const cy = pin.hPct ? (pin.yPct + pin.hPct / 2) * img.naturalHeight : pin.yPct * img.naturalHeight;
      const padW = pin.wPct ? Math.max(pin.wPct * img.naturalWidth + 140, 320) : 360;
      const padH = pin.hPct ? Math.max(pin.hPct * img.naturalHeight + 140, 240) : 260;
      const sx = Math.max(0, Math.min(img.naturalWidth - padW, cx - padW / 2));
      const sy = Math.max(0, Math.min(img.naturalHeight - padH, cy - padH / 2));
      const sw = Math.min(padW, img.naturalWidth - sx);
      const sh = Math.min(padH, img.naturalHeight - sy);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(sw);
      canvas.height = Math.round(sh);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3;
      if (pin.wPct && pin.hPct) {
        ctx.strokeRect(
          pin.xPct * img.naturalWidth - sx,
          pin.yPct * img.naturalHeight - sy,
          pin.wPct * img.naturalWidth,
          pin.hPct * img.naturalHeight,
        );
      } else {
        ctx.beginPath();
        ctx.arc(cx - sx, cy - sy, 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      return canvas.toDataURL("image/png");
    } catch {
      return undefined;
    }
  };

  const buildFixPrompt = () => {
    const entryByFile = new Map(DATA.entries.map((e) => [e.file, e]));
    const lines = [
      "# Dashboard visual review feedback (" + DATA.run.id + ")",
      "",
      "- **Revision:** \`" + DATA.run.revision + "\` | **Target:** \`" + DATA.run.target + "\` (" + DATA.run.saleor + ") | **Evidence:** \`" + DATA.run.evidenceDir + "\`",
      "",
      "## Issues to fix (" + state.pins.length + ")",
    ];

    const byFile = new Map();
    for (const pin of state.pins) {
      if (!byFile.has(pin.file)) byFile.set(pin.file, []);
      byFile.get(pin.file).push(pin);
    }

    for (const [file, filePins] of byFile) {
      const entry = entryByFile.get(file);
      const meta = [];
      if (entry?.route) meta.push("route \`" + entry.route + "\`");
      if (entry?.actor) meta.push("actor \`" + entry.actor + "\`");
      if (entry?.width) meta.push(entry.width + "px");
      if (entry?.theme) meta.push(entry.theme);
      lines.push("", "### " + (entry?.label ?? file));
      lines.push("- File: \`" + DATA.run.evidenceDir + "/" + file + "\`" + (meta.length ? " (" + meta.join(", ") + ")" : ""));
      const cmp = filePins.find((p) => p.comparedWith)?.comparedWith;
      if (cmp) lines.push("- Compared against: \`" + DATA.run.evidenceDir + "/" + cmp + "\`");
      for (const pin of filePins) {
        const loc = pin.kind === "video" && pin.videoTimeSec !== undefined
          ? "at \`" + formatTime(pin.videoTimeSec) + "\`" + (pin.videoStep ? ' (step: "' + pin.videoStep + '")' : "") + ", (" + pin.xPx + ", " + pin.yPx + ")"
          : pin.wPx && pin.hPx
            ? "box (" + pin.xPx + ", " + pin.yPx + ", " + pin.wPx + "x" + pin.hPx + ")"
            : "point (" + pin.xPx + ", " + pin.yPx + ")";
        lines.push("- **#" + pin.number + "** " + loc + ": " + pin.comment.trim());
        if (pin.elements?.length) lines.push("  - Element: \`" + pin.elements.join("\`, \`") + "\`");
        if (pin.cropFile) lines.push("  - Crop: \`" + DATA.run.evidenceDir + "/" + pin.cropFile + "\`");
      }
    }

    lines.push("", "Please fix each pinned issue above, re-capture the affected views with \`pnpm verify\` (keeping earlier captures so Before/After diff works), and let me know when ready.");
    return lines.join("\\n") + "\\n";
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  };

  const copyFixPrompt = async () => {
    if (state.pins.length === 0) return;
    let promptText = buildFixPrompt();
    if (IS_SERVER) {
      try {
        const pinsWithCrops = [];
        for (const pin of state.pins) {
          pinsWithCrops.push({ ...pin, cropDataUrl: pin.cropDataUrl || (await renderPinCrop(pin)) });
        }
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            runId: DATA.run.id,
            submittedAt: new Date().toISOString(),
            approvedFiles: [],
            pins: pinsWithCrops,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.markdown) promptText = json.markdown;
          await copyToClipboard(promptText);
          showToast("Fix prompt copied & saved to feedback.json");
          return;
        }
      } catch {}
    }
    await copyToClipboard(promptText);
    showToast("Fix prompt copied to clipboard");
  };

  // Pin popover
  let pendingPin = null;
  const openPopover = (draft, clientX, clientY) => {
    pendingPin = draft;
    const pop = $("pinPopover");
    $("popoverTitle").textContent = draft.id ? "Edit comment #" + draft.number : "Add bug comment";
    const elBox = $("popoverElement");
    if (draft.elements?.length) {
      elBox.textContent = draft.elements.join("  ·  ");
      elBox.style.display = "block";
    } else if (draft.videoTimeSec !== undefined) {
      elBox.textContent = "Frame " + formatTime(draft.videoTimeSec) + (draft.videoStep ? " · " + draft.videoStep : "");
      elBox.style.display = "block";
    } else {
      elBox.style.display = "none";
    }
    $("popoverInput").value = draft.comment || "";
    const left = Math.max(12, Math.min(window.innerWidth - 344, clientX + 12));
    const top = Math.max(12, Math.min(window.innerHeight - 230, clientY + 12));
    pop.style.left = left + "px";
    pop.style.top = top + "px";
    pop.classList.add("open");
    setTimeout(() => $("popoverInput").focus(), 10);
  };
  const closePopover = () => {
    pendingPin = null;
    $("pinPopover").classList.remove("open");
  };
  const savePopover = () => {
    if (!pendingPin) return;
    const comment = $("popoverInput").value.trim();
    if (!comment) { $("popoverInput").focus(); return; }
    if (pendingPin.id) {
      const existing = state.pins.find((p) => p.id === pendingPin.id);
      if (existing) existing.comment = comment;
    } else {
      const id = "pin-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
      state.pins.push({ ...pendingPin, id, comment, number: state.pins.length + 1 });
    }
    renumber();
    saveDraft();
    closePopover();
    render();
  };

  $("popoverCloseBtn").onclick = closePopover;
  $("popoverCancelBtn").onclick = closePopover;
  $("popoverSaveBtn").onclick = savePopover;
  $("popoverInput").addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") savePopover();
    if (e.key === "Escape") closePopover();
  });

  const selectArtifact = (idx) => {
    if (!DATA.artifacts.length) return;
    state.selectedIndex = Math.max(0, Math.min(DATA.artifacts.length - 1, idx));
    closePopover();
    render();
    $("stageScroll").scrollTop = 0;
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePopover();
      document.querySelectorAll(".video-pin-overlay.active").forEach((n) => n.classList.remove("active"));
      return;
    }
    const tag = document.activeElement?.tagName;
    if (tag === "TEXTAREA" || tag === "INPUT" || $("pinPopover").classList.contains("open")) return;
    if (e.key === "ArrowDown" || e.key === "j") {
      e.preventDefault();
      selectArtifact(state.selectedIndex + 1);
    } else if (e.key === "ArrowUp" || e.key === "k") {
      e.preventDefault();
      selectArtifact(state.selectedIndex - 1);
    }
  });

  // Mount click/drag pinning + DOM hover highlight on any image/canvas surface
  const mountSurface = (wrap, entry, mediaEl, comparedWith) => {
    const hoverBox = el("div", { class: "hover-box" }, [el("span", { class: "hover-tag" })]);
    const hoverTag = hoverBox.firstChild;
    const dragBox = el("div", { class: "drag-box" });
    wrap.append(hoverBox, dragBox);

    const hitMap = DATA.elementsByFile[entry.file];
    let dragStart = null;

    wrap.addEventListener("pointermove", (e) => {
      const rect = mediaEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      if (dragStart) {
        Object.assign(dragBox.style, {
          display: "block",
          left: Math.min(dragStart.xPct, xPct) * 100 + "%",
          top: Math.min(dragStart.yPct, yPct) * 100 + "%",
          width: Math.abs(xPct - dragStart.xPct) * 100 + "%",
          height: Math.abs(yPct - dragStart.yPct) * 100 + "%",
        });
        return;
      }

      const hit = resolvePoint(entry.file, xPct, yPct);
      if (hit && hitMap) {
        Object.assign(hoverBox.style, {
          display: "block",
          left: (hit.x / hitMap.docWidth) * 100 + "%",
          top: (hit.y / hitMap.docHeight) * 100 + "%",
          width: (hit.w / hitMap.docWidth) * 100 + "%",
          height: (hit.h / hitMap.docHeight) * 100 + "%",
        });
        hoverTag.textContent = formatEl(hit);
      } else {
        hoverBox.style.display = "none";
      }
    });

    wrap.addEventListener("pointerleave", () => { hoverBox.style.display = "none"; });

    wrap.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest(".pin-marker, .pin-rect")) return;
      const rect = mediaEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dragStart = {
        xPct: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        yPct: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
        clientX: e.clientX,
        clientY: e.clientY,
      };
      wrap.setPointerCapture(e.pointerId);
    });

    wrap.addEventListener("pointerup", (e) => {
      if (!dragStart) return;
      const start = dragStart;
      dragStart = null;
      dragBox.style.display = "none";
      const rect = mediaEl.getBoundingClientRect();
      const endXPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const endYPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const dist = Math.hypot(e.clientX - start.clientX, e.clientY - start.clientY);
      const docW = hitMap?.docWidth || mediaEl.naturalWidth || mediaEl.width || rect.width;
      const docH = hitMap?.docHeight || mediaEl.naturalHeight || mediaEl.height || rect.height;

      if (dist > 14) {
        const xPct = Math.min(start.xPct, endXPct);
        const yPct = Math.min(start.yPct, endYPct);
        const wPct = Math.abs(endXPct - start.xPct);
        const hPct = Math.abs(endYPct - start.yPct);
        const matched = resolveBox(entry.file, { x: xPct, y: yPct, w: wPct, h: hPct }).map(formatEl);
        openPopover({
          file: entry.file,
          kind: "screenshot",
          xPct, yPct, wPct, hPct,
          xPx: Math.round(xPct * docW),
          yPx: Math.round(yPct * docH),
          wPx: Math.round(wPct * docW),
          hPx: Math.round(hPct * docH),
          elements: matched,
          comparedWith: comparedWith || undefined,
        }, e.clientX, e.clientY);
      } else {
        const hit = resolvePoint(entry.file, endXPct, endYPct);
        openPopover({
          file: entry.file,
          kind: "screenshot",
          xPct: endXPct, yPct: endYPct,
          xPx: Math.round(endXPct * docW),
          yPx: Math.round(endYPct * docH),
          elements: hit ? [formatEl(hit)] : [],
          comparedWith: comparedWith || undefined,
        }, e.clientX, e.clientY);
      }
    });

    for (const pin of state.pins.filter((p) => p.file === entry.file)) {
      if (pin.wPct && pin.hPct) {
        wrap.appendChild(el("div", {
          class: "pin-rect",
          style: "left:" + (pin.xPct * 100) + "%;top:" + (pin.yPct * 100) + "%;width:" + (pin.wPct * 100) + "%;height:" + (pin.hPct * 100) + "%",
          onClick: (ev) => { ev.stopPropagation(); openPopover(pin, ev.clientX, ev.clientY); },
        }, [el("span", { class: "pin-tag", text: String(pin.number) })]));
      } else {
        wrap.appendChild(el("button", {
          class: "pin-marker",
          style: "left:" + (pin.xPct * 100) + "%;top:" + (pin.yPct * 100) + "%",
          text: String(pin.number),
          title: pin.comment,
          onClick: (ev) => { ev.stopPropagation(); openPopover(pin, ev.clientX, ev.clientY); },
        }));
      }
    }
  };

  const renderInlinePins = (file, videoEl) => {
    const filePins = state.pins.filter((p) => p.file === file);
    if (filePins.length === 0) return null;
    return el("div", { class: "pin-list" }, filePins.map((pin) => {
      const metaParts = [];
      if (pin.videoTimeSec !== undefined) {
        metaParts.push("at " + formatTime(pin.videoTimeSec) + (pin.videoStep ? " (" + pin.videoStep + ")" : ""));
      }
      if (pin.elements?.length) metaParts.push(pin.elements[0]);
      return el("div", { class: "pin-row" }, [
        el("div", { class: "pin-row-main" }, [
          el("span", { class: "pin-num", text: String(pin.number) }),
          el("div", { class: "pin-body" }, [
            el("div", { class: "pin-text", text: pin.comment }),
            metaParts.length ? el("div", { class: "pin-meta", text: metaParts.join(" · ") }) : null,
          ]),
        ]),
        el("div", { class: "pin-row-actions" }, [
          videoEl && pin.videoTimeSec !== undefined
            ? el("button", {
                class: "btn sm ghost",
                text: "Jump",
                onClick: () => { videoEl.currentTime = pin.videoTimeSec; videoEl.pause(); },
              })
            : null,
          el("button", {
            class: "btn sm ghost",
            text: "Edit",
            onClick: (ev) => openPopover(pin, ev.clientX - 330, ev.clientY),
          }),
          el("button", {
            class: "btn sm ghost",
            text: "✕",
            "aria-label": "Delete comment",
            onClick: () => {
              state.pins = state.pins.filter((p) => p.id !== pin.id);
              renumber();
              saveDraft();
              render();
            },
          }),
        ]),
      ]);
    }));
  };

  const renderDiffView = (container, beforeEntry, entry) => {
    const beforeFile = beforeEntry.file;
    const stat = el("span", { class: "diff-stat", text: "Computing pixel diff..." });
    const wrap = el("div", { class: "surface-wrap" });
    container.append(
      buildFigure({
        tag: "Diff",
        accent: true,
        text: describeEntry(entry, { role: "diff" }),
        meta: [stat, "· Click or drag to comment"],
        content: wrap,
      }),
    );

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    Promise.all([loadImage(beforeFile), loadImage(entry.file)]).then(([imgA, imgB]) => {
      try {
        const w = Math.max(imgA.naturalWidth, imgB.naturalWidth);
        const h = Math.max(imgA.naturalHeight, imgB.naturalHeight);
        const cA = document.createElement("canvas"); cA.width = w; cA.height = h;
        const cB = document.createElement("canvas"); cB.width = w; cB.height = h;
        cA.getContext("2d").drawImage(imgA, 0, 0);
        cB.getContext("2d").drawImage(imgB, 0, 0);
        const dA = cA.getContext("2d").getImageData(0, 0, w, h).data;
        const dB = cB.getContext("2d").getImageData(0, 0, w, h).data;

        const out = document.createElement("canvas");
        out.width = w; out.height = h;
        out.className = "diff-canvas";
        const ctxOut = out.getContext("2d");
        const outImg = ctxOut.createImageData(w, h);
        const dst = outImg.data;
        let changed = 0;

        for (let i = 0; i < dB.length; i += 4) {
          const diff = Math.abs(dA[i] - dB[i]) + Math.abs(dA[i + 1] - dB[i + 1]) + Math.abs(dA[i + 2] - dB[i + 2]) + Math.abs(dA[i + 3] - dB[i + 3]);
          if (diff > 54) {
            changed += 1;
            dst[i] = prefersDark ? 239 : 220;
            dst[i + 1] = prefersDark ? 68 : 38;
            dst[i + 2] = prefersDark ? 68 : 38;
            dst[i + 3] = 255;
          } else {
            const lum = Math.round(dB[i] * 0.299 + dB[i + 1] * 0.587 + dB[i + 2] * 0.114);
            const muted = prefersDark ? Math.round(lum * 0.22 + 24) : Math.round(lum * 0.25 + 185);
            dst[i] = muted; dst[i + 1] = muted; dst[i + 2] = muted; dst[i + 3] = 255;
          }
        }
        ctxOut.putImageData(outImg, 0, 0);
        stat.textContent = ((changed / (w * h)) * 100).toFixed(2) + "% pixels changed";
        wrap.appendChild(out);
        mountSurface(wrap, entry, out, beforeFile);
      } catch {
        stat.textContent = "Visual blend diff";
        const stack = el("div", { class: "css-diff-stack" }, [
          el("img", { class: "base", src: beforeFile, alt: "Before" }),
          el("img", { class: "over", src: entry.file, alt: "After" }),
        ]);
        wrap.appendChild(stack);
        mountSurface(wrap, entry, stack.querySelector("img.base"), beforeFile);
      }
    }).catch(() => {
      stat.textContent = "Could not load images for diff";
    });
  };

  const branchIconSvg = () => svgIcon([
    { tag: "circle", attrs: { cx: "4.5", cy: "3.5", r: "1.6", stroke: "currentColor", "stroke-width": "1.3" } },
    { tag: "circle", attrs: { cx: "4.5", cy: "12.5", r: "1.6", stroke: "currentColor", "stroke-width": "1.3" } },
    { tag: "circle", attrs: { cx: "11.5", cy: "6", r: "1.6", stroke: "currentColor", "stroke-width": "1.3" } },
    { tag: "path", attrs: { d: "M4.5 5.2V10.8M11.5 7.6C11.5 10 9.6 10.6 6.2 10.8", stroke: "currentColor", "stroke-width": "1.3", "stroke-linecap": "round" } },
  ]);

  const renderHeader = () => {
    const ctx = $("runContext");
    ctx.textContent = "";
    const parts = [];
    const baseRepoUrl =
      DATA.run.repoUrl ||
      (DATA.run.repo && DATA.run.repo.includes("/") ? "https://github.com/" + DATA.run.repo : "");
    if (DATA.run.repo) {
      parts.push(
        baseRepoUrl
          ? el("a", {
              class: "ctx-repo",
              href: baseRepoUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              text: DATA.run.repo,
            })
          : el("span", { class: "ctx-repo", text: DATA.run.repo }),
      );
    }
    if (DATA.run.branch) {
      if (parts.length) parts.push(el("span", { class: "ctx-sep", text: "/" }));
      const branchPath = DATA.run.branch.split("/").map(encodeURIComponent).join("/");
      const branchHref = DATA.run.prUrl || (baseRepoUrl ? baseRepoUrl + "/tree/" + branchPath : "");
      parts.push(
        branchHref
          ? el("a", {
              class: "ctx-branch",
              href: branchHref,
              target: "_blank",
              rel: "noopener noreferrer",
            }, [branchIconSvg(), DATA.run.branch])
          : el("span", { class: "ctx-branch" }, [branchIconSvg(), DATA.run.branch]),
      );
    }
    if (DATA.run.prNumber) {
      const prLabel = "#" + DATA.run.prNumber;
      const prHref = DATA.run.prUrl || (baseRepoUrl ? baseRepoUrl + "/pull/" + DATA.run.prNumber : "");
      if (prHref) {
        parts.push(el("a", {
          class: "ctx-pr",
          href: prHref,
          target: "_blank",
          rel: "noopener noreferrer",
          text: prLabel,
        }));
      } else {
        parts.push(el("span", { class: "ctx-pr", text: prLabel }));
      }
    }
    if (!parts.length) {
      parts.push(el("span", { class: "ctx-branch", text: DATA.run.revision }));
    }
    ctx.append(...parts);
    const actions = $("headerActions");
    actions.textContent = "";
    if (state.pins.length > 0) {
      actions.appendChild(el("button", {
        class: "btn primary",
        id: "copyFixBtn",
        onClick: copyFixPrompt,
      }, [
        copyIconSvg(),
        "Copy fix prompt",
        el("span", { class: "count-badge", text: String(state.pins.length) }),
      ]));
    }
  };

  const renderSidebar = () => {
    const list = $("sidebarList");
    list.textContent = "";
    if (!DATA.artifacts.length) {
      list.appendChild(el("div", { class: "nav-group-label", text: "No artifacts" }));
      return;
    }

    const groups = [
      { kind: "video", label: "Recordings" },
      { kind: "comparison", label: "Before / After" },
      { kind: "screenshot", label: "Screenshots" },
    ];

    for (const group of groups) {
      const items = DATA.artifacts
        .map((artifact, index) => ({ artifact, index }))
        .filter((item) => item.artifact.kind === group.kind);
      if (!items.length) continue;

      list.appendChild(el("div", { class: "nav-group" }, [
        el("div", { class: "nav-group-label" }, [
          el("span", { text: group.label }),
          el("span", { text: String(items.length) }),
        ]),
        ...items.map(({ artifact, index }) => {
          const pinCount = state.pins.filter((p) => p.file === artifact.entry.file).length;
          return el("button", {
            class: "nav-item" + (index === state.selectedIndex ? " active" : ""),
            "data-artifact-index": String(index),
            title: describeEntry(artifact.entry, { role: artifact.kind === "video" ? "video" : undefined }),
            onClick: () => selectArtifact(index),
          }, [
            el("span", { class: "nav-icon" }, [artifactIconSvg(artifact.kind)]),
            el("span", { class: "nav-item-text" }, [
              el("span", { class: "nav-item-title", text: humanizeLabel(artifact.entry.label) }),
              el("span", { class: "nav-item-sub", text: subMetaFor(artifact.entry) }),
            ]),
            pinCount > 0 ? el("span", { class: "nav-pin-pill", text: String(pinCount) }) : null,
          ]);
        }),
      ]));
    }
  };

  const renderStepNav = () =>
    el("div", { class: "step-nav" }, [
      el("button", {
        class: "btn icon",
        "aria-label": "Previous artifact",
        title: "Previous (↑)",
        disabled: state.selectedIndex <= 0 ? "true" : undefined,
        onClick: () => selectArtifact(state.selectedIndex - 1),
        text: "←",
      }),
      el("button", {
        class: "btn icon",
        "aria-label": "Next artifact",
        title: "Next (↓)",
        disabled: state.selectedIndex >= DATA.artifacts.length - 1 ? "true" : undefined,
        onClick: () => selectArtifact(state.selectedIndex + 1),
        text: "→",
      }),
    ]);

  const renderStage = () => {
    const stage = $("stage");
    stage.textContent = "";

    if (!DATA.artifacts.length) {
      stage.appendChild(el("div", { class: "empty", text: "No screenshots or recordings captured yet." }));
      return;
    }

    const idx = Math.max(0, Math.min(DATA.artifacts.length - 1, state.selectedIndex));
    const artifact = DATA.artifacts[idx];
    const entry = artifact.entry;

    const eyebrowLabel =
      artifact.kind === "video"
        ? "Recording"
        : artifact.kind === "comparison"
          ? "Before / After"
          : "Screenshot";

    const eyebrow = el("span", { class: "artifact-eyebrow" }, [
      el("span", { class: "idx", text: formatIndex(idx) + "/" + formatIndex(DATA.artifacts.length - 1) }),
      " · " + eyebrowLabel,
    ]);

    const controls = el("div", { class: "stage-controls" });
    const head = el("div", { class: "stage-head" }, [
      el("div", { class: "stage-title-group" }, [
        eyebrow,
        el("h1", { class: "stage-title", text: humanizeLabel(entry.label) }),
        renderCaption(entry),
      ]),
      controls,
    ]);
    stage.appendChild(head);

    if (artifact.kind === "video") {
      const videoEl = el("video", {
        src: entry.file,
        poster: entry.posterFile || "",
        controls: "true",
        playsinline: "true",
      });
      const overlay = el("div", { class: "video-pin-overlay" }, [
        el("div", { class: "video-pin-banner", text: "Click the paused frame to pin a bug (Esc to cancel)" }),
      ]);

      overlay.addEventListener("click", (e) => {
        const rect = videoEl.getBoundingClientRect();
        const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        const tSec = Number(videoEl.currentTime.toFixed(1));
        const activeStep = (entry.steps || []).filter((s) => s.timeMs / 1000 <= tSec + 0.2).at(-1)?.label;
        let cropDataUrl;
        if (IS_SERVER && videoEl.videoWidth) {
          try {
            const c = document.createElement("canvas");
            c.width = videoEl.videoWidth; c.height = videoEl.videoHeight;
            const ctx = c.getContext("2d");
            ctx.drawImage(videoEl, 0, 0);
            ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 6;
            ctx.beginPath(); ctx.arc(xPct * c.width, yPct * c.height, 22, 0, Math.PI * 2); ctx.stroke();
            cropDataUrl = c.toDataURL("image/png");
          } catch {}
        }
        overlay.classList.remove("active");
        openPopover({
          file: entry.file,
          kind: "video",
          xPct, yPct,
          xPx: Math.round(xPct * (videoEl.videoWidth || rect.width)),
          yPx: Math.round(yPct * (videoEl.videoHeight || rect.height)),
          videoTimeSec: tSec,
          videoStep: activeStep,
          cropDataUrl,
        }, e.clientX, e.clientY);
      });

      controls.append(
        el("button", {
          class: "btn sm",
          text: "Pin frame",
          onClick: () => { videoEl.pause(); overlay.classList.add("active"); },
        }),
        renderStepNav(),
      );

      stage.appendChild(
        buildFigure({
          tag: "Recording",
          accent: true,
          text: describeEntry(entry, { role: "video" }),
          meta: "Click Pin frame to comment",
          content: el("div", { class: "video-box" }, [videoEl, overlay]),
        }),
      );
      if (entry.steps?.length) {
        stage.appendChild(el("div", { class: "step-chips" }, entry.steps.map((s) => el("button", {
          class: "step-chip",
          onClick: () => { videoEl.currentTime = s.timeMs / 1000; videoEl.play().catch(() => {}); },
        }, [
          el("span", { class: "t", text: formatTime(s.timeMs / 1000) }),
          el("span", { text: s.label }),
        ]))));
      }
      const pinsNode = renderInlinePins(entry.file, videoEl);
      if (pinsNode) stage.appendChild(pinsNode);
      return;
    }

    if (artifact.kind === "comparison") {
      const beforeFile = artifact.beforeEntry.file;
      const mode = state.compareMode[entry.file] || "side";
      controls.append(
        el("div", { class: "segmented" }, [
          ["side", "Side by side"],
          ["slider", "Slider"],
          ["diff", "Diff"],
        ].map(([m, label]) => el("button", {
          class: mode === m ? "active" : "",
          text: label,
          onClick: () => { state.compareMode[entry.file] = m; render(); },
        }))),
        renderStepNav(),
      );

      const body = el("div", { style: "display:flex;flex-direction:column;gap:10px" });
      if (mode === "side") {
        const afterImg = el("img", { class: "main-img", src: entry.file, alt: describeEntry(entry, { role: "after" }) });
        const afterWrap = el("div", { class: "surface-wrap" }, [afterImg]);
        mountSurface(afterWrap, entry, afterImg, beforeFile);
        body.appendChild(el("div", { class: "side-by-side" }, [
          buildFigure({
            tag: "Before",
            text: describeEntry(artifact.beforeEntry, { role: "before" }),
            content: el("img", { class: "static-img", src: beforeFile, alt: describeEntry(artifact.beforeEntry, { role: "before" }) }),
          }),
          buildFigure({
            tag: "After",
            accent: true,
            text: describeEntry(entry, { role: "after" }),
            meta: "Click or drag to comment",
            content: afterWrap,
          }),
        ]));
      } else if (mode === "slider") {
        const pct = state.sliderPct[entry.file] ?? 50;
        const wrap = el("div", { class: "slider-wrap" });
        const beforeImg = el("img", { class: "before-img", src: beforeFile, alt: "Before" });
        const afterLayer = el("div", { class: "slider-after", style: "clip-path:inset(0 0 0 " + pct + "%)" }, [
          el("img", { src: entry.file, alt: "After" }),
        ]);
        const handle = el("div", { class: "slider-handle", style: "left:" + pct + "%" }, [
          el("div", { class: "slider-knob", text: "⇄" }),
        ]);
        wrap.append(
          beforeImg,
          afterLayer,
          el("span", { class: "slider-badge left", text: "Before" }),
          el("span", { class: "slider-badge right", text: "After" }),
          handle,
        );
        let dragging = false;
        const update = (clientX) => {
          const r = wrap.getBoundingClientRect();
          const next = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
          state.sliderPct[entry.file] = next;
          afterLayer.style.clipPath = "inset(0 0 0 " + next + "%)";
          handle.style.left = next + "%";
        };
        handle.addEventListener("pointerdown", (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
        wrap.addEventListener("pointermove", (e) => { if (dragging) update(e.clientX); });
        wrap.addEventListener("pointerup", () => { dragging = false; });
        wrap.addEventListener("click", (e) => { if (!dragging) update(e.clientX); });
        body.appendChild(
          buildFigure({
            tag: "Slider",
            accent: true,
            text: describeEntry(entry, { role: "slider" }),
            meta: "Drag handle to compare",
            content: wrap,
          }),
        );
      } else {
        renderDiffView(body, artifact.beforeEntry, entry);
      }

      stage.appendChild(body);
      const pinsNode = renderInlinePins(entry.file);
      if (pinsNode) stage.appendChild(pinsNode);
      return;
    }

    // Plain screenshot with caption
    controls.appendChild(renderStepNav());
    const captionText = describeEntry(entry);
    const img = el("img", { class: "main-img", src: entry.file, alt: captionText });
    const wrap = el("div", { class: "surface-wrap" }, [img]);
    mountSurface(wrap, entry, img, null);
    stage.appendChild(
      buildFigure({
        tag: "Screenshot",
        text: captionText,
        meta: "Click or drag to comment",
        content: wrap,
      }),
    );
    const pinsNode = renderInlinePins(entry.file);
    if (pinsNode) stage.appendChild(pinsNode);
  };

  const render = () => {
    renderHeader();
    renderSidebar();
    renderStage();
  };

  if (IS_SERVER) {
    fetch("/api/state").then((r) => r.json()).then((srv) => {
      if (srv.feedback && state.pins.length === 0 && Array.isArray(srv.feedback.pins) && srv.feedback.pins.length > 0) {
        state.pins = srv.feedback.pins;
        renumber();
        render();
      }
    }).catch(() => {});
  }

  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", () => render());
  }

  render();
})();
</script>
</body>
</html>`;
};

/** Writes/updates `review.html` inside `run.evidenceDir` and returns its absolute path. */
export const writeReviewHtml = (run: ReviewRunMeta): string => {
  const bundle = loadReviewBundle(run);
  const html = buildReviewHtml(bundle);
  const outPath = path.join(run.evidenceDir, "review.html");

  fs.writeFileSync(outPath, html, "utf8");

  return outPath;
};
