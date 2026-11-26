import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import type { Locator, Page } from "@playwright/test";

export interface RecordedFrame {
  file: string;
  visible: boolean;
  segment: number;
  time: number;
}

export interface RecordedStep {
  label: string;
  timeMs: number;
}

export interface RawStepMark {
  label: string;
  frameIndex: number;
}

export interface ConcatBuildResult {
  lines: string[];
  keptCount: number;
  durationMs: number;
  steps: RecordedStep[];
}

export interface VideoEncodingResult {
  mp4: string;
  poster: string;
  gif?: string;
  durationMs: number;
  steps: RecordedStep[];
}

const GIF_LIMIT_BYTES = 10_000_000;

/** Verifies `ffmpeg` is on PATH; throws a clear install hint otherwise. */
export const ensureFfmpeg = (): void => {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
  } catch {
    throw new Error("ffmpeg is required for video recording - install with `brew install ffmpeg`");
  }
};

/**
 * Turns captured frames into an `ffmpeg` concat demuxer script and maps step markers onto
 * the trimmed output timeline. Hidden frames are dropped, and gaps between segments do not
 * stretch the last frame before a cut. On failure (`keepAll: true`), every frame is kept so
 * what led up to the error stays visible.
 */
export const buildFrameConcatList = (
  frames: readonly RecordedFrame[],
  {
    rawDir,
    frameIntervalMs,
    keepAll = false,
    endHoldMs = 1500,
    stepMarks = [],
  }: {
    rawDir: string;
    frameIntervalMs: number;
    keepAll?: boolean;
    endHoldMs?: number;
    stepMarks?: readonly RawStepMark[];
  },
): ConcatBuildResult => {
  const indexed = frames.map((frame, originalIndex) => ({
    ...frame,
    originalIndex,
  }));

  const kept = keepAll
    ? indexed.map(frame => ({ ...frame, segment: 0 }))
    : indexed.filter(frame => frame.visible);

  if (kept.length === 0) {
    throw new Error("no visible frames recorded - call step() or show() in the flow");
  }

  const lines: string[] = [];
  const startOffsetByOriginal = new Map<number, number>();
  let elapsedMs = 0;

  for (let i = 0; i < kept.length; i += 1) {
    const current = kept[i];
    const next = kept[i + 1];
    const isLast = i === kept.length - 1;
    const end =
      next && next.segment === current.segment
        ? next.time
        : isLast
          ? current.time + endHoldMs
          : current.time + frameIntervalMs;
    const durationMs = Math.max(end - current.time, 1);

    startOffsetByOriginal.set(current.originalIndex, elapsedMs);
    const fullPath = path.join(rawDir, current.file).replace(/'/g, "'\\''");

    lines.push(`file '${fullPath}'`);
    lines.push(`duration ${durationMs / 1000}`);
    elapsedMs += durationMs;
  }

  // Repeat last file as required by ffmpeg's concat demuxer so the final duration is respected.
  const lastPath = path.join(rawDir, kept[kept.length - 1].file).replace(/'/g, "'\\''");

  lines.push(`file '${lastPath}'`);

  // Map each step's raw frame index onto the first kept frame at or after that index.
  const steps: RecordedStep[] = [];

  for (const mark of stepMarks) {
    let matchedTimeMs: number | undefined;

    for (const frame of kept) {
      if (frame.originalIndex >= mark.frameIndex) {
        matchedTimeMs = startOffsetByOriginal.get(frame.originalIndex);
        break;
      }
    }

    steps.push({
      label: mark.label,
      timeMs: Math.round(matchedTimeMs ?? elapsedMs),
    });
  }

  return {
    lines,
    keptCount: kept.length,
    durationMs: Math.round(elapsedMs),
    steps,
  };
};

/** Encodes a GIF stepping down in width until it fits GitHub's 10 MB inline limit. */
export const encodeGif = (mp4Path: string, gifPath: string): void => {
  const startWidth = Number(process.env.VERIFY_GIF_WIDTH ?? 1440);
  const widths = [startWidth, 1200, 1000, 800, 640].filter(
    (width, index, all) => Number.isFinite(width) && width > 0 && all.indexOf(width) === index,
  );

  for (const width of widths) {
    execFileSync("ffmpeg", [
      "-loglevel",
      "error",
      "-y",
      "-i",
      mp4Path,
      "-vf",
      `fps=10,scale='min(${width},iw)':-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle`,
      gifPath,
    ]);

    if (fs.statSync(gifPath).size < GIF_LIMIT_BYTES) {
      return;
    }
  }
};

export interface FlowRecordingControls {
  step: (label: string) => Promise<void>;
  pause: (ms?: number) => Promise<void>;
  show: () => void;
  hide: () => void;
}

export interface RecordPageOptions {
  page: Page;
  outDir: string;
  baseName: string;
  mask: Locator[];
  gif?: boolean;
  fps?: number;
  runFlow: (controls: FlowRecordingControls) => Promise<unknown>;
}

/**
 * Polls Retina JPEG frames from `page` while `runFlow` executes, honoring `step()` / `show()` /
 * `hide()` cuts and masking Cloud PII on every frame, then encodes H.264 MP4 + final poster PNG
 * (+ optional GIF).
 */
export const recordPageFlow = async ({
  page,
  outDir,
  baseName,
  mask,
  gif = false,
  fps = Number(process.env.VERIFY_VIDEO_FPS ?? 20),
  runFlow,
}: RecordPageOptions): Promise<{
  result: unknown;
  video: VideoEncodingResult;
  failure?: unknown;
}> => {
  ensureFfmpeg();
  fs.mkdirSync(outDir, { recursive: true });

  const rawDir = path.join(outDir, `.raw-${baseName}`);
  const frameIntervalMs = 1000 / Math.max(1, fps);

  fs.mkdirSync(rawDir, { recursive: true });

  let frameCount = 0;
  let capturing = true;
  let visible = false;
  let segment = 0;
  const stepMarks: RawStepMark[] = [];

  const captureLoop = (async () => {
    while (capturing) {
      const started = Date.now();

      try {
        const data = await page.screenshot({
          type: "jpeg",
          quality: 92,
          timeout: 1000,
          caret: "initial",
          mask,
        });
        const tag = `${visible ? 1 : 0}-${String(segment).padStart(3, "0")}`;
        const file = `${String(frameCount++).padStart(6, "0")}-${tag}-${started}.jpg`;

        fs.writeFileSync(path.join(rawDir, file), data);
      } catch {
        // Navigation or transient screenshot timeout; next tick retries.
      }

      const wait = Math.max(0, frameIntervalMs - (Date.now() - started));

      if (wait > 0) {
        await new Promise(resolve => setTimeout(resolve, wait));
      }
    }
  })();

  const pause = (ms = 1000) => page.waitForTimeout(ms);

  const show = () => {
    if (!visible) {
      segment += 1;
      visible = true;
    }
  };

  const hide = () => {
    visible = false;
  };

  const step = async (label: string) => {
    console.log(`step: ${label}`);
    await page
      .evaluate(caption => {
        let bar = document.getElementById("__verify_dashboard_caption");

        if (!bar) {
          bar = document.createElement("div");
          bar.id = "__verify_dashboard_caption";
          Object.assign(bar.style, {
            position: "fixed",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "2147483647",
            padding: "10px 16px",
            font: "600 18px system-ui, -apple-system, sans-serif",
            color: "#fff",
            background: "rgba(17, 17, 17, 0.84)",
            pointerEvents: "none",
          });
          document.documentElement.appendChild(bar);
        }

        bar.textContent = caption;
      }, label)
      .catch(() => undefined);

    stepMarks.push({ label, frameIndex: frameCount });
    show();
    await pause(700);
  };

  let result: unknown;
  let failure: unknown;
  const poster = path.join(outDir, `${baseName}.png`);
  const failureShot = path.join(outDir, `${baseName}-failed.png`);

  try {
    result = await runFlow({ step, pause, show, hide });
    show();
    await pause(1500);
    await page.screenshot({ path: poster, mask });
  } catch (error) {
    failure = error;
    await page.screenshot({ path: failureShot, mask }).catch(() => undefined);
  } finally {
    capturing = false;
    await captureLoop;
  }

  try {
    const parsedFrames: RecordedFrame[] = fs
      .readdirSync(rawDir)
      .filter(file => file.endsWith(".jpg"))
      .sort()
      .map(file => {
        const [, vis, seg, time] = file.slice(0, -4).split("-");

        return {
          file,
          visible: vis === "1",
          segment: Number(seg),
          time: Number(time),
        };
      });

    const concat = buildFrameConcatList(parsedFrames, {
      rawDir,
      frameIntervalMs,
      keepAll: Boolean(failure),
      stepMarks,
    });

    const listPath = path.join(rawDir, "frames.txt");

    fs.writeFileSync(listPath, concat.lines.join("\n"));

    const mp4 = path.join(outDir, `${baseName}.mp4`);

    execFileSync("ffmpeg", [
      "-loglevel",
      "error",
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-vf",
      "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      mp4,
    ]);

    const resolvedPoster = fs.existsSync(poster)
      ? poster
      : fs.existsSync(failureShot)
        ? failureShot
        : poster;

    if (!fs.existsSync(resolvedPoster)) {
      execFileSync("ffmpeg", [
        "-loglevel",
        "error",
        "-y",
        "-sseof",
        "-0.5",
        "-i",
        mp4,
        "-frames:v",
        "1",
        "-update",
        "1",
        resolvedPoster,
      ]);
    }

    let gifPath: string | undefined;

    if (gif && !failure) {
      gifPath = path.join(outDir, `${baseName}.gif`);
      encodeGif(mp4, gifPath);
    }

    return {
      result,
      failure,
      video: {
        mp4,
        poster: resolvedPoster,
        ...(gifPath ? { gif: gifPath } : {}),
        durationMs: concat.durationMs,
        steps: concat.steps,
      },
    };
  } finally {
    fs.rmSync(rawDir, { recursive: true, force: true });
  }
};
