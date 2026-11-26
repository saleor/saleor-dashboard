import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  type ElementBox,
  formatElementLabel,
  resolveElementAtPoint,
  resolveElementsInBox,
} from "./elements.ts";
import { buildFrameConcatList, type RecordedFrame } from "./record.ts";
import { buildReviewHtml, serializeForInlineScript, writeReviewHtml } from "./review-html.ts";
import {
  buildOrderedArtifacts,
  computeBeforeAfterPairs,
  type EvidenceEntry,
  formatFeedbackPrompt,
  parseRepoSlug,
  parseRepoUrl,
  type ReviewRunMeta,
} from "./review-model.ts";
import { startReviewServer } from "./review-server.ts";

// ---------------------------------------------------------------------------------------
// 1. DOM hit-map resolution

const sampleElements: ElementBox[] = [
  { x: 0, y: 0, w: 1280, h: 900, tag: "main" },
  { x: 900, y: 800, w: 340, h: 64, tag: "div", testId: "save-bar" },
  { x: 1120, y: 812, w: 96, h: 40, tag: "button", testId: "save-bar-confirm", text: "Save" },
  { x: 1000, y: 812, w: 96, h: 40, tag: "button", testId: "save-bar-cancel", text: "Cancel" },
];

const hit = resolveElementAtPoint(sampleElements, 1150, 830);

assert.strictEqual(hit?.testId, "save-bar-confirm");
assert.strictEqual(formatElementLabel(hit!), 'button[data-test-id="save-bar-confirm"] ("Save")');

const outside = resolveElementAtPoint(sampleElements, 2000, 2000);

assert.strictEqual(outside, undefined);

const inBox = resolveElementsInBox(sampleElements, { x: 980, y: 805, w: 250, h: 55 }, 2);

assert.deepStrictEqual(
  inBox.map(el => el.testId),
  ["save-bar-confirm", "save-bar-cancel"],
);

// ---------------------------------------------------------------------------------------
// 2. Video frame trimming & step timestamp mapping

const rawFrames: RecordedFrame[] = [
  // Hidden setup frames (0..2) -> dropped in normal run
  { file: "000000-0-000-1000.jpg", visible: false, segment: 0, time: 1000 },
  { file: "000001-0-000-2000.jpg", visible: false, segment: 0, time: 2000 },
  { file: "000002-0-000-3000.jpg", visible: false, segment: 0, time: 3000 },
  // Segment 1 (3..4): 250ms apart
  { file: "000003-1-001-3100.jpg", visible: true, segment: 1, time: 3100 },
  { file: "000004-1-001-3350.jpg", visible: true, segment: 1, time: 3350 },
  // Hidden spinner gap (5) -> 5s gap must NOT stretch frame 4
  { file: "000005-0-001-8000.jpg", visible: false, segment: 1, time: 8000 },
  // Segment 2 (6): final frame gets endHoldMs (1500ms)
  { file: "000006-1-002-8500.jpg", visible: true, segment: 2, time: 8500 },
];

const trimmed = buildFrameConcatList(rawFrames, {
  rawDir: "/tmp/raw",
  frameIntervalMs: 50,
  endHoldMs: 1500,
  stepMarks: [
    { label: "Start flow", frameIndex: 3 },
    { label: "Result ready", frameIndex: 6 },
  ],
});

assert.strictEqual(trimmed.keptCount, 3);
// 250ms (3->4) + 50ms (end of seg 1) + 1500ms (endHold) = 1800ms
assert.strictEqual(trimmed.durationMs, 1800);
assert.deepStrictEqual(trimmed.steps, [
  { label: "Start flow", timeMs: 0 },
  { label: "Result ready", timeMs: 300 },
]);

const failureConcat = buildFrameConcatList(rawFrames, {
  rawDir: "/tmp/raw",
  frameIntervalMs: 50,
  keepAll: true,
});

assert.strictEqual(failureConcat.keptCount, rawFrames.length);

assert.throws(
  () =>
    buildFrameConcatList(
      [{ file: "000000-0-000-1000.jpg", visible: false, segment: 0, time: 1000 }],
      { rawDir: "/tmp/raw", frameIntervalMs: 50 },
    ),
  /no visible frames/,
);

// ---------------------------------------------------------------------------------------
// 3. Before / After pairing, artifact ordering & fix prompt formatting

const entries: EvidenceEntry[] = [
  {
    kind: "screenshot",
    file: "001-revA-products-admin-1280-light.png",
    label: "products-admin-1280-light",
    route: "/products/",
    actor: "admin",
    width: 1280,
    theme: "light",
    revision: "revA",
  },
  {
    kind: "screenshot",
    file: "002-revB-products-admin-1280-light.png",
    label: "products-admin-1280-light",
    caption: "Products list after updating primary Create Product button",
    route: "/products/",
    actor: "admin",
    width: 1280,
    theme: "light",
    revision: "revB",
  },
  {
    kind: "screenshot",
    file: "003-orders-before.png",
    label: "before-orders",
    route: "/orders/",
    actor: "admin",
    width: 1280,
    theme: "light",
    tag: "before",
    revision: "revB",
  },
  {
    kind: "screenshot",
    file: "004-orders-after.png",
    label: "after-orders",
    route: "/orders/",
    actor: "admin",
    width: 1280,
    theme: "light",
    tag: "after",
    revision: "revB",
  },
  {
    kind: "screenshot",
    file: "005-customers-admin-1280-light.png",
    label: "customers-admin-1280-light",
    route: "/customers/",
    actor: "admin",
    width: 1280,
    theme: "light",
    revision: "revB",
  },
  {
    kind: "gql",
    file: "006-gql.json",
    label: "gql",
    actor: "admin",
    revision: "revB",
  },
  {
    kind: "video",
    file: "007-create-product.mp4",
    posterFile: "007-create-product.png",
    label: "create-product",
    route: "/products/",
    actor: "admin",
    width: 1280,
    height: 800,
    theme: "light",
    durationMs: 4200,
    steps: [{ label: "Open dialog", timeMs: 0 }],
    revision: "revB",
  },
];

const pairs = computeBeforeAfterPairs(entries);

assert.strictEqual(
  pairs["002-revB-products-admin-1280-light.png"]?.beforeFile,
  "001-revA-products-admin-1280-light.png",
);
assert.strictEqual(pairs["004-orders-after.png"]?.beforeFile, "003-orders-before.png");

const ordered = buildOrderedArtifacts(entries, pairs);

assert.deepStrictEqual(
  ordered.map(a => `${a.kind}:${a.entry.file}`),
  [
    "video:007-create-product.mp4",
    "comparison:002-revB-products-admin-1280-light.png",
    "comparison:004-orders-after.png",
    "screenshot:005-customers-admin-1280-light.png",
  ],
);

assert.strictEqual(
  parseRepoSlug("git@github.com:saleor/saleor-dashboard.git"),
  "saleor/saleor-dashboard",
);
assert.strictEqual(
  parseRepoSlug("https://github.com/saleor/saleor-dashboard.git"),
  "saleor/saleor-dashboard",
);
assert.strictEqual(
  parseRepoUrl("git@github.com:saleor/saleor-dashboard.git"),
  "https://github.com/saleor/saleor-dashboard",
);
assert.strictEqual(
  parseRepoUrl("https://user:secret@github.com/saleor/saleor-dashboard.git"),
  "https://github.com/saleor/saleor-dashboard",
);
assert.strictEqual(
  parseRepoUrl("ssh://git@github.com/saleor/saleor-dashboard.git"),
  "https://github.com/saleor/saleor-dashboard",
);

const runMeta: ReviewRunMeta = {
  id: "test-run-local",
  target: "local",
  saleor: "stable",
  scenario: "default",
  revision: "revB",
  repo: "saleor/saleor-dashboard",
  repoUrl: "https://github.com/saleor/saleor-dashboard",
  branch: "feat/visual-review",
  prNumber: 4242,
  prUrl: "https://github.com/saleor/saleor-dashboard/pull/4242",
  dashboardUrl: "http://localhost:9400/",
  apiUrl: "http://localhost:8400/graphql/",
  evidenceDir: "/tmp/verify-dashboard/test-run-local/evidence",
};

const prompt = formatFeedbackPrompt(
  {
    runId: runMeta.id,
    submittedAt: "2026-11-24T12:00:00.000Z",
    summaryNote: "Overall direction looks good, two small UI fixes needed.",
    approvedFiles: [],
    pins: [
      {
        id: "p1",
        number: 1,
        file: "002-revB-products-admin-1280-light.png",
        kind: "screenshot",
        comment: "Save button overlaps badge at 1280px",
        xPct: 0.9,
        yPct: 0.92,
        xPx: 1150,
        yPx: 830,
        elements: ['button[data-test-id="save-bar-confirm"] ("Save")'],
        comparedWith: "001-revA-products-admin-1280-light.png",
        cropFile: "feedback-crops/pin-1.png",
      },
      {
        id: "p2",
        number: 2,
        file: "007-create-product.mp4",
        kind: "video",
        comment: "Modal flickers when opening",
        xPct: 0.5,
        yPct: 0.5,
        xPx: 640,
        yPx: 400,
        videoTimeSec: 1.4,
        videoStep: "Open dialog",
      },
    ],
  },
  runMeta,
  entries,
);

assert.ok(prompt.includes("## Issues to fix (2)"));
assert.ok(prompt.includes('Element: `button[data-test-id="save-bar-confirm"] ("Save")`'));
assert.ok(
  prompt.includes(
    "Compared against: `/tmp/verify-dashboard/test-run-local/evidence/001-revA-products-admin-1280-light.png`",
  ),
);
assert.ok(
  prompt.includes("Crop: `/tmp/verify-dashboard/test-run-local/evidence/feedback-crops/pin-1.png`"),
);
assert.ok(prompt.includes('at `0:01.4` (step: "Open dialog")'));

// ---------------------------------------------------------------------------------------
// 4. HTML escaping & review-server HTTP integration

const escaped = serializeForInlineScript({ text: "</script><img src=x onerror=1>" });

assert.ok(!escaped.includes("</script>"));

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "verify-review-test-"));

try {
  const evDir = path.join(tmpDir, "evidence");

  fs.mkdirSync(evDir, { recursive: true });
  // Minimal 1x1 transparent PNG
  const pngBytes = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  );

  fs.writeFileSync(path.join(evDir, "001-revA-products-admin-1280-light.png"), pngBytes);
  fs.writeFileSync(path.join(evDir, "002-revB-products-admin-1280-light.png"), pngBytes);
  fs.writeFileSync(path.join(evDir, "index.json"), JSON.stringify(entries.slice(0, 2), null, 2));
  fs.writeFileSync(path.join(tmpDir, "secret.txt"), "top-secret");

  const testRun: ReviewRunMeta = { ...runMeta, evidenceDir: evDir };
  const htmlPath = writeReviewHtml(testRun);

  assert.ok(fs.existsSync(htmlPath));
  const renderedHtml = buildReviewHtml({
    run: testRun,
    entries: entries.slice(0, 2),
    artifacts: buildOrderedArtifacts(entries.slice(0, 2), pairs),
    pairs,
    elementsByFile: {},
  });

  assert.ok(renderedHtml.includes("Saleor Dev"));
  assert.ok(renderedHtml.includes("Copy fix prompt"));
  assert.ok(renderedHtml.includes("prefers-color-scheme: dark"));
  assert.ok(renderedHtml.includes("saleor/saleor-dashboard"));
  assert.ok(renderedHtml.includes("feat/visual-review"));
  assert.ok(renderedHtml.includes("#4242"));

  let callbackCalled = false;
  const srv = await startReviewServer({
    run: testRun,
    port: 0,
    onFeedback: () => {
      callbackCalled = true;
    },
  });

  try {
    const health = await fetch(`${srv.url}api/health`);

    assert.strictEqual(health.status, 200);
    assert.deepStrictEqual(await health.json(), { ok: true, runId: testRun.id });

    const pageRes = await fetch(srv.url);

    assert.strictEqual(pageRes.status, 200);
    assert.ok((await pageRes.text()).includes("Saleor Dev"));

    // Byte range request support for media seeking
    const rangeRes = await fetch(`${srv.url}002-revB-products-admin-1280-light.png`, {
      headers: { range: "bytes=0-3" },
    });

    assert.strictEqual(rangeRes.status, 206);
    assert.strictEqual(rangeRes.headers.get("accept-ranges"), "bytes");
    assert.strictEqual((await rangeRes.arrayBuffer()).byteLength, 4);

    // Path traversal blocked
    const traversal = await fetch(`${srv.url}..%2Fsecret.txt`);

    assert.ok(traversal.status === 403 || traversal.status === 404);

    // Submit feedback with base64 crop -> persists JSON, Markdown, and PNG crop file
    const submitRes = await fetch(`${srv.url}api/feedback`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        runId: testRun.id,
        submittedAt: "2026-11-24T12:00:00.000Z",
        approvedFiles: [],
        pins: [
          {
            id: "pin-1",
            number: 1,
            file: "002-revB-products-admin-1280-light.png",
            kind: "screenshot",
            comment: "Broken alignment",
            xPct: 0.5,
            yPct: 0.5,
            xPx: 640,
            yPx: 450,
            cropDataUrl: `data:image/png;base64,${pngBytes.toString("base64")}`,
          },
        ],
      }),
    });

    assert.strictEqual(submitRes.status, 200);
    assert.strictEqual(callbackCalled, true);

    const savedJson = JSON.parse(fs.readFileSync(path.join(evDir, "feedback.json"), "utf8"));

    assert.strictEqual(savedJson.pins.length, 1);
    assert.strictEqual(savedJson.pins[0].cropFile, "feedback-crops/pin-1.png");
    assert.strictEqual(savedJson.pins[0].cropDataUrl, undefined);
    assert.ok(fs.existsSync(path.join(evDir, "feedback-crops", "pin-1.png")));
    assert.ok(
      fs.readFileSync(path.join(evDir, "feedback.md"), "utf8").includes("Broken alignment"),
    );
  } finally {
    await srv.close();
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

console.log("✔ verify-tools tests passed");
