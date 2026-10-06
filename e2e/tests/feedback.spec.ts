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

interface PostHogResponses {
  surveys?: Survey[];
  waitForSurveys?: Promise<void>;
  block?: "api" | "script";
}

const routePostHog = async (
  page: Page,
  { surveys = [feedbackSurvey], waitForSurveys, block }: PostHogResponses = {},
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
