import fs from "node:fs";
import http, { type IncomingMessage, type Server, type ServerResponse } from "node:http";
import path from "node:path";

import { buildReviewHtml, loadReviewBundle } from "./review-html.ts";
import {
  type FeedbackPin,
  type FeedbackSubmission,
  formatFeedbackPrompt,
  type ReviewRunMeta,
} from "./review-model.ts";

const MAX_BODY_BYTES = 30 * 1024 * 1024;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

export interface SavedFeedbackResult {
  feedbackJson: string;
  feedbackMd: string;
  markdown: string;
  submission: FeedbackSubmission;
}

export interface ReviewServerHandle {
  server: Server;
  url: string;
  port: number;
  close: () => Promise<void>;
}

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  const payload = JSON.stringify(body);

  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store",
  });
  res.end(payload);
};

const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;

    req.on("data", (chunk: Buffer) => {
      total += chunk.length;

      if (total > MAX_BODY_BYTES) {
        reject(new Error("request body too large"));
        req.destroy();

        return;
      }

      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });

const serveFileWithRanges = (req: IncomingMessage, res: ServerResponse, filePath: string) => {
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
  const range = req.headers.range;

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);

    if (!match) {
      res.writeHead(416, { "content-range": `bytes */${stat.size}` });
      res.end();

      return;
    }

    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
      res.writeHead(416, { "content-range": `bytes */${stat.size}` });
      res.end();

      return;
    }

    res.writeHead(206, {
      "content-type": contentType,
      "content-length": end - start + 1,
      "content-range": `bytes ${start}-${end}/${stat.size}`,
      "accept-ranges": "bytes",
      "cache-control": "no-store",
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);

    return;
  }

  res.writeHead(200, {
    "content-type": contentType,
    "content-length": stat.size,
    "accept-ranges": "bytes",
    "cache-control": "no-store",
  });
  fs.createReadStream(filePath).pipe(res);
};

const persistFeedback = (
  run: ReviewRunMeta,
  rawSubmission: FeedbackSubmission,
): SavedFeedbackResult => {
  const cropsDir = path.join(run.evidenceDir, "feedback-crops");
  const pins: FeedbackPin[] = [];

  for (let i = 0; i < (rawSubmission.pins ?? []).length; i += 1) {
    const pin = rawSubmission.pins[i];
    const number = i + 1;
    let cropFile = pin.cropFile;

    if (
      typeof pin.cropDataUrl === "string" &&
      pin.cropDataUrl.startsWith("data:image/png;base64,")
    ) {
      const base64 = pin.cropDataUrl.slice("data:image/png;base64,".length);

      fs.mkdirSync(cropsDir, { recursive: true });
      const rel = `feedback-crops/pin-${number}.png`;

      fs.writeFileSync(path.join(run.evidenceDir, rel), Buffer.from(base64, "base64"));
      cropFile = rel;
    }

    const { cropDataUrl: _ignored, ...rest } = pin;

    pins.push({
      ...rest,
      number,
      ...(cropFile ? { cropFile } : {}),
    });
  }

  const submission: FeedbackSubmission = {
    runId: run.id,
    submittedAt: rawSubmission.submittedAt || new Date().toISOString(),
    ...(rawSubmission.summaryNote?.trim() ? { summaryNote: rawSubmission.summaryNote.trim() } : {}),
    approvedFiles: Array.isArray(rawSubmission.approvedFiles) ? rawSubmission.approvedFiles : [],
    pins,
  };

  const bundle = loadReviewBundle(run);
  const markdown = formatFeedbackPrompt(submission, run, bundle.entries);
  const feedbackJson = path.join(run.evidenceDir, "feedback.json");
  const feedbackMd = path.join(run.evidenceDir, "feedback.md");

  fs.writeFileSync(feedbackJson, JSON.stringify(submission, null, 2), "utf8");
  fs.writeFileSync(feedbackMd, markdown, "utf8");

  return { feedbackJson, feedbackMd, markdown, submission };
};

export interface StartReviewServerOptions {
  run: ReviewRunMeta;
  port?: number;
  onFeedback?: (saved: SavedFeedbackResult) => void;
}

/**
 * Starts a localhost-only HTTP server for interactive evidence review. Always regenerates
 * `review.html` on `/` so newly captured screenshots/videos appear on browser reload.
 */
export const startReviewServer = async ({
  run,
  port = 0,
  onFeedback,
}: StartReviewServerOptions): Promise<ReviewServerHandle> => {
  const rootDir = path.resolve(run.evidenceDir);

  const server = http.createServer(async (req, res) => {
    try {
      const reqUrl = new URL(req.url ?? "/", "http://127.0.0.1");
      const pathname = decodeURIComponent(reqUrl.pathname);

      if (req.method === "GET" && pathname === "/api/health") {
        sendJson(res, 200, { ok: true, runId: run.id });

        return;
      }

      if (req.method === "GET" && pathname === "/api/state") {
        const feedbackPath = path.join(rootDir, "feedback.json");
        let feedback: unknown = null;

        if (fs.existsSync(feedbackPath)) {
          try {
            feedback = JSON.parse(fs.readFileSync(feedbackPath, "utf8"));
          } catch {
            feedback = null;
          }
        }

        sendJson(res, 200, { run, feedback });

        return;
      }

      if (req.method === "POST" && pathname === "/api/feedback") {
        const raw = await readBody(req);
        const parsed = JSON.parse(raw) as FeedbackSubmission;
        const saved = persistFeedback(run, parsed);

        sendJson(res, 200, {
          ok: true,
          feedbackJson: saved.feedbackJson,
          feedbackMd: saved.feedbackMd,
          markdown: saved.markdown,
          pinCount: saved.submission.pins.length,
        });
        onFeedback?.(saved);

        return;
      }

      if (req.method === "GET" && (pathname === "/" || pathname === "/review.html")) {
        const bundle = loadReviewBundle(run);
        const html = buildReviewHtml(bundle);

        fs.writeFileSync(path.join(rootDir, "review.html"), html, "utf8");
        res.writeHead(200, {
          "content-type": "text/html; charset=utf-8",
          "content-length": Buffer.byteLength(html),
          "cache-control": "no-store",
        });
        res.end(html);

        return;
      }

      if (req.method === "GET") {
        const rel = pathname.replace(/^\/+/, "");
        const resolved = path.resolve(rootDir, rel);

        if (resolved !== rootDir && !resolved.startsWith(rootDir + path.sep)) {
          sendJson(res, 403, { error: "forbidden" });

          return;
        }

        if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
          sendJson(res, 404, { error: "not found" });

          return;
        }

        serveFileWithRanges(req, res, resolved);

        return;
      }

      sendJson(res, 405, { error: "method not allowed" });
    } catch (error) {
      sendJson(res, 500, { error: String(error) });
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });

  const addr = server.address();
  const boundPort = typeof addr === "object" && addr ? addr.port : port;
  const url = `http://127.0.0.1:${boundPort}/`;

  return {
    server,
    url,
    port: boundPort,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()));
      }),
  };
};
