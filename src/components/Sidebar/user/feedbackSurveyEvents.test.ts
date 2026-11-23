import { type Survey } from "posthog-js";

import { feedbackSurvey } from "./feedbackSurvey.fixture";
import { getFeedbackResponse, surveyDismissedEvent, surveySentEvent } from "./feedbackSurveyEvents";

const secondIteration: Survey = {
  ...feedbackSurvey,
  current_iteration: 2,
  current_iteration_start_date: "2026-11-01",
};

it("remembers the answer per survey iteration", () => {
  // Arrange & Act
  const { properties } = surveySentEvent(secondIteration, "sidebar", "Faster search");

  // Assert
  expect(properties).toMatchObject({
    $survey_iteration: 2,
    $survey_iteration_start_date: "2026-11-01",
    $set: { [`$survey_responded/${feedbackSurvey.id}/2`]: true },
  });
});

it("remembers the dismissal per survey iteration", () => {
  // Arrange & Act
  const { properties } = surveyDismissedEvent(secondIteration, "command_menu");

  // Assert
  expect(properties).toMatchObject({
    feedback_source: "command_menu",
    $survey_partially_completed: false,
    $set: { [`$survey_dismissed/${feedbackSurvey.id}/2`]: true },
  });
});

describe("getFeedbackResponse", () => {
  it.each([
    { name: "nothing", text: "" },
    { name: "spaces", text: "   " },
    { name: "line breaks and tabs", text: "\n\t\r\n" },
    { name: "non-breaking spaces", text: "\u00a0\u3000" },
    { name: "zero-width characters", text: "\u200b\u200d\ufeff" },
    { name: "a mix of blank characters", text: " \u200b\n\u00a0\t" },
  ])("treats $name as no answer", ({ text }) => {
    // Arrange & Act
    const response = getFeedbackResponse(text);

    // Assert
    expect(response).toBeUndefined();
  });

  it.each([
    { name: "spaces", text: "  Faster search \n", expected: "Faster search" },
    { name: "zero-width characters", text: "\u200bFaster search\ufeff", expected: "Faster search" },
    { name: "a single character", text: " ? ", expected: "?" },
    { name: "an emoji joined by zero-width joiners", text: " 👨‍👩‍👧 ", expected: "👨‍👩‍👧" },
    {
      name: "line breaks between lines",
      text: "Line one\n\nLine two",
      expected: "Line one\n\nLine two",
    },
  ])("keeps the answer and trims $name", ({ text, expected }) => {
    // Arrange & Act
    const response = getFeedbackResponse(text);

    // Assert
    expect(response).toBe(expected);
  });
});
