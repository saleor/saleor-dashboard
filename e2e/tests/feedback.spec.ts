import type { Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  type Survey,
  SurveyPosition,
  SurveyQuestionType,
  SurveySchedule,
  SurveyType,
  SurveyWidgetType,
} from "posthog-js";

import { parallel } from "../config.ts";
import { expect, test } from "../fixtures/test.ts";
import { repoPath } from "../lib/paths.ts";
import { HomePage } from "../pages/homePage.ts";

const selector = '[data-posthog-feedback-trigger="true"]';
// Includes the selector condition that caused the production circular dependency.
const feedbackSurvey: Survey = {
  id: "feedback-e2e",
  name: "Dashboard feedback",
  description: "",
  type: SurveyType.Widget,
  appearance: {
    widgetType: SurveyWidgetType.Selector,
    widgetSelector: selector,
    position: SurveyPosition.NextToTrigger,
    whiteLabel: true,
    placeholder: "Start typing...",
    displayThankYouMessage: true,
    thankYouMessageHeader: "Thank you for your feedback!",
  },
  conditions: { selector, events: null, cancelEvents: null, actions: null },
  questions: [
    {
      id: "feedback-question-e2e",
      type: SurveyQuestionType.Open,
      question: "What could we improve?",
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
      Boolean(process.env.POSTHOG_EXCLUDED_DOMAINS),
    "Run with the isolated analytics configuration documented in e2e/README.md",
  );

  test("reveals the trigger after loading and opens and submits the real survey", async ({
    page,
  }, testInfo) => {
    // Arrange
    let releaseSurveys: () => void = () => {};
    const waitForSurveys = new Promise<void>(resolve => {
      releaseSurveys = resolve;
    });

    await routePostHog(page, { waitForSurveys });

    const home = new HomePage(page);
    const trigger = page.getByTestId("feedback-button");

    // Act & Assert: hide while loading, then let the SDK evaluate the production selector condition.
    await home.goto();
    await home.expectSignedIn();
    const dismissAnnouncement = page.getByTestId("ripple-video-announcement-dismiss");

    if (await dismissAnnouncement.isVisible()) await dismissAnnouncement.click();
    await expect(trigger).toBeHidden();
    releaseSurveys();
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("PHWidgetSurveyClickListener", "true");
    await expect(page.getByRole("link", { name: "Install Pulse", exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("feedback-available.png") });
    await trigger.click();
    await expect(page.getByText("What could we improve?", { exact: true })).toBeVisible();
    await page.locator(".ph-survey").evaluate(async element => {
      await Promise.all(
        element.getAnimations({ subtree: true }).map(animation => animation.finished),
      );
    });
    await page.screenshot({ path: testInfo.outputPath("feedback-open.png") });
    await page.getByPlaceholder("Start typing...").fill("Feedback regression test");
    await page.getByRole("button", { name: "Submit survey", exact: true }).click();
    await expect(page.getByText("Thank you for your feedback!", { exact: true })).toBeVisible();
  });

  test.describe("from the command menu", () => {
    // PostHog drops events from headless and automated browsers as bot traffic.
    test.use({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
    });

    const openCommandMenu = async (
      page: Page,
      viewport: { width: number; height: number },
      layoutTestId: string,
      captured: CapturedEvent[] = [],
    ): Promise<void> => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => false });
        Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
      });
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
    ]) {
      test(`opens the survey in the ${layout} layout`, async ({ page }, testInfo) => {
        // Arrange
        const captured: CapturedEvent[] = [];

        await openCommandMenu(page, viewport, testId, captured);

        const action = page.getByRole("option", { name: "Share feedback" });

        await expect(action).toHaveAttribute("aria-selected", "true");
        await page.screenshot({ path: testInfo.outputPath(`command-menu-${layout}.png`) });

        // Act
        await page.keyboard.press("Enter");

        // Assert
        await expect(page.getByText("What could we improve?", { exact: true })).toBeVisible();
        await page.locator(".ph-survey").evaluate(async element => {
          await Promise.all(
            element.getAnimations({ subtree: true }).map(animation => animation.finished),
          );
        });
        await page.screenshot({ path: testInfo.outputPath(`survey-${layout}.png`) });
        await page.getByPlaceholder("Start typing...").fill("Command menu feedback");
        await page.getByRole("button", { name: "Submit survey", exact: true }).click();
        await expect(page.getByText("Thank you for your feedback!", { exact: true })).toBeVisible();
        await expect
          .poll(() => captured.find(({ event }) => event === "survey sent"), { timeout: 15_000 })
          .toBeDefined();

        // posthog-js adds displaySurvey properties to "survey sent" only.
        expect(captured.find(({ event }) => event === "survey sent")?.properties).toMatchObject({
          $survey_id: feedbackSurvey.id,
          feedback_source: "command_menu",
        });
      });
    }

    // The survey only matches while a feedback button is on the page, and the drawer
    // mounts its button only when it is open.
    test("hides the action in the drawer layout", async ({ page }, testInfo) => {
      // Arrange & Act
      await openCommandMenu(page, { width: 390, height: 844 }, "sidebar-app-bar");

      // Assert
      await expect(page.getByRole("option", { name: "Share feedback" })).toHaveCount(0);
      await page.screenshot({ path: testInfo.outputPath("command-menu-drawer.png") });
    });
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
      await expect(page.getByTestId("feedback-button")).toHaveCount(1);
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
