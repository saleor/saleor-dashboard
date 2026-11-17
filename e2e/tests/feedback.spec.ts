import type { Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { type Survey, SurveyQuestionType, SurveySchedule, SurveyType } from "posthog-js";

import { parallel } from "../config.ts";
import { expect, test } from "../fixtures/test.ts";
import { repoPath } from "../lib/paths.ts";
import { HomePage } from "../pages/homePage.ts";

// Shaped like the production survey: PostHog's "API" type, which the Dashboard draws itself.
const feedbackSurvey: Survey = {
  id: "feedback-e2e",
  name: "Dashboard feedback",
  description: "",
  type: SurveyType.API,
  appearance: null,
  conditions: null,
  questions: [
    {
      id: "feedback-question-e2e",
      type: SurveyQuestionType.Open,
      question: "What could we improve?",
      description: "Tell us about something confusing, difficult, or missing.",
      optional: true,
    },
  ],
  schedule: SurveySchedule.Always,
  start_date: "2026-09-14T10:04:07.959280Z",
  end_date: null,
  feature_flag_keys: null,
  linked_flag_key: null,
  targeting_flag_key: null,
  internal_targeting_flag_key: "survey-targeting-feedback-e2e",
  current_iteration: null,
  current_iteration_start_date: null,
};

interface CapturedEvent {
  event: string;
  properties: Record<string, unknown>;
}

interface PostHogResponses {
  surveys?: Survey[];
  waitForSurveys?: Promise<void>;
  block?: "api" | "script";
  captured?: CapturedEvent[];
}

const parseCapturedEvents = (body: string): CapturedEvent[] => {
  const json = body.startsWith("data=")
    ? Buffer.from(decodeURIComponent(body.slice("data=".length)), "base64").toString("utf8")
    : body;
  const parsed: CapturedEvent | CapturedEvent[] = JSON.parse(json);

  return Array.isArray(parsed) ? parsed : [parsed];
};

const routePostHog = async (
  page: Page,
  { surveys = [feedbackSurvey], waitForSurveys, block, captured }: PostHogResponses = {},
): Promise<void> => {
  // Only HTTP responses are controlled; matching and rendering use the installed SDK.
  const script = readFileSync(repoPath("node_modules/posthog-js/dist/surveys.js"), "utf8");

  await page.route("https://posthog.example.test/**", async route => {
    const { pathname } = new URL(route.request().url());

    if (pathname === "/static/surveys.js") {
      if (block === "script") return route.abort("blockedbyclient");

      return route.fulfill({ contentType: "application/javascript", body: script });
    }

    if (pathname === "/api/surveys/") {
      if (block === "api") return route.abort("blockedbyclient");

      await waitForSurveys;

      return route.fulfill({ json: { surveys } });
    }

    const config = { surveys: true, featureFlags: {}, featureFlagPayloads: {} };

    if (pathname.endsWith("/config.js")) {
      return route.fulfill({
        contentType: "application/javascript",
        body: `window._POSTHOG_REMOTE_CONFIG = {phc_feedback_e2e: {config: ${JSON.stringify(config)}}};`,
      });
    }

    // Analytics submissions also stay within the intercepted test endpoint.
    const body = route.request().postData();

    if (captured && body && !pathname.startsWith("/flags")) {
      captured.push(...parseCapturedEvents(body));
    }

    return route.fulfill({ json: config });
  });
};

test.describe("Feedback availability", { tag: parallel() }, () => {
  test.skip(
    !process.env.IS_CLOUD_INSTANCE ||
      process.env.POSTHOG_HOST !== "https://posthog.example.test" ||
      process.env.POSTHOG_KEY !== "phc_feedback_e2e" ||
      process.env.POSTHOG_FEEDBACK_SURVEY_ID !== feedbackSurvey.id ||
      Boolean(process.env.POSTHOG_EXCLUDED_DOMAINS),
    "Run with the isolated analytics configuration documented in e2e/README.md",
  );

  // PostHog drops events from headless and automated browsers as bot traffic.
  test.use({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
    });
  });

  const sendFeedback = async (
    page: Page,
    captured: CapturedEvent[],
    response: string,
  ): Promise<Record<string, unknown> | undefined> => {
    const dialog = page.getByRole("dialog");

    await expect(dialog.getByText("What could we improve?")).toBeVisible();
    const textbox = dialog.getByRole("textbox", { name: "What could we improve?" });
    const send = dialog.getByRole("button", { name: "Send" });

    await textbox.fill(" \n\u200b\u00a0 ");
    await expect(send).toBeDisabled();
    await textbox.fill(response);
    await send.click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText("Feedback sent")).toBeVisible();
    await expect
      .poll(() => captured.find(({ event }) => event === "survey sent"), { timeout: 15_000 })
      .toBeDefined();

    return captured.find(({ event }) => event === "survey sent")?.properties;
  };

  test("reveals the trigger after loading and sends feedback from the sidebar", async ({
    page,
  }, testInfo) => {
    // Arrange
    let releaseSurveys: () => void = () => {};
    const waitForSurveys = new Promise<void>(resolve => {
      releaseSurveys = resolve;
    });
    const captured: CapturedEvent[] = [];

    await routePostHog(page, { waitForSurveys, captured });

    const home = new HomePage(page);
    const trigger = page.getByTestId("feedback-button");

    // Act & Assert: hidden while loading, shown once the survey is ready.
    await home.goto();
    await home.expectSignedIn();
    const dismissAnnouncement = page.getByTestId("ripple-video-announcement-dismiss");

    if (await dismissAnnouncement.isVisible()) await dismissAnnouncement.click();
    await expect(trigger).toBeHidden();
    releaseSurveys();
    await expect(trigger).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("feedback-available.png") });
    await trigger.click();
    await expect(page.getByText("Tell us about something confusing")).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("feedback-open.png") });

    expect(await sendFeedback(page, captured, "Feedback regression test")).toMatchObject({
      $survey_id: feedbackSurvey.id,
      [`$survey_response_${feedbackSurvey.questions[0].id}`]: "Feedback regression test",
      feedback_source: "sidebar",
    });
    expect(captured.find(({ event }) => event === "survey shown")?.properties).toMatchObject({
      $survey_id: feedbackSurvey.id,
      feedback_source: "sidebar",
    });
  });

  test("records a dismissal without the unsent text", async ({ page }) => {
    // Arrange
    const captured: CapturedEvent[] = [];

    await routePostHog(page, { captured });
    await new HomePage(page).goto();
    await new HomePage(page).expectSignedIn();

    const dismissAnnouncement = page.getByTestId("ripple-video-announcement-dismiss");

    if (await dismissAnnouncement.isVisible()) await dismissAnnouncement.click();
    await page.getByTestId("feedback-button").click();

    const dialog = page.getByRole("dialog");

    await dialog.getByRole("textbox", { name: "What could we improve?" }).fill("Not sending this");

    // Act
    await page.keyboard.press("Escape");

    // Assert
    await expect(dialog).toBeHidden();
    await expect
      .poll(() => captured.find(({ event }) => event === "survey dismissed"), { timeout: 15_000 })
      .toBeDefined();
    expect(JSON.stringify(captured)).not.toContain("Not sending this");
  });

  test.describe("from the command menu", () => {
    const openCommandMenu = async (
      page: Page,
      viewport: { width: number; height: number },
      layoutTestId: string,
      captured: CapturedEvent[] = [],
    ): Promise<void> => {
      await routePostHog(page, { captured });

      const home = new HomePage(page);
      const surveysLoaded = page.waitForResponse(response =>
        response.url().includes("/api/surveys/"),
      );

      await home.goto();
      await home.expectSignedIn();
      await surveysLoaded;
      const dismissAnnouncement = page.getByTestId("ripple-video-announcement-dismiss");

      if (await dismissAnnouncement.isVisible()) await dismissAnnouncement.click();
      // Signed in at desktop size; the sidebar switches layout when the viewport changes.
      await page.setViewportSize(viewport);
      await expect(page.getByTestId(layoutTestId)).toBeVisible();
      await page.keyboard.press("ControlOrMeta+k");
      await page.keyboard.type("feedback");
    };

    for (const { layout, viewport, testId } of [
      { layout: "column", viewport: { width: 1280, height: 800 }, testId: "sidebar-column" },
      { layout: "rail", viewport: { width: 900, height: 800 }, testId: "sidebar-rail" },
      { layout: "drawer", viewport: { width: 390, height: 844 }, testId: "sidebar-app-bar" },
    ]) {
      test(`sends feedback in the ${layout} layout`, async ({ page }, testInfo) => {
        // Arrange
        const captured: CapturedEvent[] = [];

        await openCommandMenu(page, viewport, testId, captured);

        const action = page.getByRole("option", { name: "Share feedback" });

        await expect(action).toHaveAttribute("aria-selected", "true");
        await page.screenshot({ path: testInfo.outputPath(`command-menu-${layout}.png`) });

        // Act
        await page.keyboard.press("Enter");

        // Assert
        await page.screenshot({ path: testInfo.outputPath(`survey-${layout}.png`) });
        expect(await sendFeedback(page, captured, "Command menu feedback")).toMatchObject({
          $survey_id: feedbackSurvey.id,
          feedback_source: "command_menu",
        });
      });
    }
  });

  for (const block of ["api", "script"] as const) {
    test(`hides the trigger when the survey ${block} is blocked`, async ({ page }) => {
      // Arrange
      await routePostHog(page, { block });

      const failed = page.waitForEvent("requestfailed", request =>
        request.url().includes(block === "api" ? "/api/surveys/" : "/static/surveys.js"),
      );

      // Act
      await new HomePage(page).goto();
      await new HomePage(page).expectSignedIn();
      await failed;

      // Assert
      await expect(page.getByTestId("feedback-button")).toBeHidden();
      await expect(page.getByRole("button", { name: "Send feedback" })).toHaveCount(0);
    });
  }

  test("hides the trigger when no survey matches", async ({ page }) => {
    // Arrange
    await routePostHog(page, { surveys: [{ ...feedbackSurvey, end_date: "2026-09-30" }] });

    const loaded = page.waitForResponse(response => response.url().includes("/api/surveys/"));

    // Act
    await new HomePage(page).goto();
    await new HomePage(page).expectSignedIn();
    await loaded;

    // Assert
    await expect(page.getByTestId("feedback-button")).toBeHidden();
    await expect(page.getByRole("button", { name: "Send feedback" })).toHaveCount(0);
  });
});
