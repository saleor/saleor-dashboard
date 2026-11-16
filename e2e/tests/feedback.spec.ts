import type { Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { type Survey, SurveyQuestionType, SurveySchedule, SurveyType } from "posthog-js";

import { parallel } from "../config.ts";
import { expect, test } from "../fixtures/test.ts";
import { credentialsFor } from "../lib/actors.ts";
import { repoPath } from "../lib/paths.ts";
import { HomePage } from "../pages/homePage.ts";

const question = "What could we improve?";
const contactLabel = "Can we contact you about this by email?";
// The dashboard renders this API survey itself and reports responses to PostHog.
const feedbackSurvey: Survey = {
  id: "feedback-e2e",
  name: "Dashboard feedback",
  description: "",
  type: SurveyType.API,
  appearance: null,
  conditions: null,
  questions: [{ id: "feedback-question-e2e", type: SurveyQuestionType.Open, question }],
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

  test("reveals the trigger after the survey loads", async ({ page }, testInfo) => {
    // Arrange
    let releaseSurveys: () => void = () => {};
    const waitForSurveys = new Promise<void>(resolve => {
      releaseSurveys = resolve;
    });

    await routePostHog(page, { waitForSurveys });

    const home = new HomePage(page);
    const trigger = page.getByTestId("feedback-button");

    // Act & Assert: hidden while loading, visible once the feedback survey matches.
    await home.goto();
    await home.expectSignedIn();
    const dismissAnnouncement = page.getByTestId("ripple-video-announcement-dismiss");

    if (await dismissAnnouncement.isVisible()) await dismissAnnouncement.click();
    await expect(trigger).toBeHidden();
    releaseSurveys();
    await expect(trigger).toBeVisible();
    await expect(page.getByRole("link", { name: "Install Pulse", exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("feedback-available.png") });
  });

  test.describe("sending feedback", () => {
    // PostHog drops events from headless and automated browsers as bot traffic.
    test.use({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
    });

    for (const contact of [true, false]) {
      test(`sends the email with feedback only when contact is ${contact ? "allowed" : "not allowed"}`, async ({
        page,
      }, testInfo) => {
        // Arrange
        const captured: CapturedEvent[] = [];

        await page.addInitScript(() => {
          Object.defineProperty(navigator, "webdriver", { get: () => false });
          Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
        });
        await routePostHog(page, { captured });

        const home = new HomePage(page);

        await home.goto();
        await home.expectSignedIn();
        const dismissAnnouncement = page.getByTestId("ripple-video-announcement-dismiss");

        if (await dismissAnnouncement.isVisible()) await dismissAnnouncement.click();
        await page.getByTestId("feedback-button").click();

        const form = page.getByTestId("feedback-form");
        const checkbox = form.getByRole("checkbox", { name: contactLabel });

        await form.getByRole("textbox", { name: question }).fill("Contact consent test");
        await expect(checkbox).not.toBeChecked();

        // Act
        if (contact) await checkbox.click();
        await page.screenshot({
          path: testInfo.outputPath(`feedback-form-${contact ? "contact" : "no-contact"}.png`),
        });
        await form.getByRole("button", { name: "Send", exact: true }).click();

        // Assert
        await expect(page.getByText("Thanks for your feedback", { exact: true })).toBeVisible();
        await expect(form).toBeHidden();
        await expect
          .poll(() => captured.find(({ event }) => event === "survey sent"), { timeout: 15_000 })
          .toBeDefined();

        const sent = captured.find(({ event }) => event === "survey sent");

        expect(sent?.properties).toMatchObject({
          $survey_id: feedbackSurvey.id,
          "$survey_response_feedback-question-e2e": "Contact consent test",
        });

        if (contact) {
          expect(sent?.properties.contact_email).toBe(credentialsFor("admin").email);
        } else {
          expect(sent?.properties).not.toHaveProperty("contact_email");
        }

        for (const { event, properties } of captured.filter(
          ({ event }) => event !== "survey sent",
        )) {
          expect(properties, event).not.toHaveProperty("contact_email");
        }
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
      await expect(page.getByTestId("feedback-button")).toHaveCount(0);
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
