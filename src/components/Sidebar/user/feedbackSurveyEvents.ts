import { type Properties, type Survey, SurveyEventName, SurveyEventProperties } from "posthog-js";

/** Where the survey was opened from, sent as `feedback_source` with every survey event. */
export type FeedbackSource = "sidebar" | "command_menu" | "whats_new";

/** Copy that replaces the survey question, for entry points where it reads better in context. */
export interface FeedbackPrompt {
  title: string;
  description: string;
}

/** Recorded with every event, so readers in PostHog know what was asked. */
export const promptProperties = (prompt: FeedbackPrompt | undefined): Properties =>
  prompt ? { feedback_prompt: prompt.title } : {};

// The same events and properties PostHog's own survey popup sends, so responses show up in the
// survey's results. See `sendSurveyEvent` in posthog-js.

interface SurveyEvent {
  name: SurveyEventName;
  properties: Properties;
}

const surveyProperties = (survey: Survey, source: FeedbackSource): Properties => ({
  [SurveyEventProperties.SURVEY_NAME]: survey.name,
  [SurveyEventProperties.SURVEY_ID]: survey.id,
  [SurveyEventProperties.SURVEY_ITERATION]: survey.current_iteration,
  [SurveyEventProperties.SURVEY_ITERATION_START_DATE]: survey.current_iteration_start_date,
  feedback_source: source,
});

/** The person property PostHog uses to remember that someone answered or dismissed a survey. */
const interactionProperty = (survey: Survey, action: "responded" | "dismissed"): string =>
  survey.current_iteration
    ? `$survey_${action}/${survey.id}/${survey.current_iteration}`
    : `$survey_${action}/${survey.id}`;

// Whitespace and invisible formatting characters such as zero-width spaces.
const blankEdges = /^[\s\p{Cf}]+|[\s\p{Cf}]+$/gu;

/**
 * The answer worth sending, or `undefined` when nothing visible was typed. Only the edges are
 * trimmed: invisible characters inside the text, such as the joiners in some emoji, are kept.
 */
export const getFeedbackResponse = (text: string): string | undefined =>
  text.replace(blankEdges, "") || undefined;

export const surveyShownEvent = (survey: Survey, source: FeedbackSource): SurveyEvent => ({
  name: SurveyEventName.SHOWN,
  properties: surveyProperties(survey, source),
});

export const surveySentEvent = (
  survey: Survey,
  source: FeedbackSource,
  response: string,
): SurveyEvent => {
  const [question] = survey.questions;

  return {
    name: SurveyEventName.SENT,
    properties: {
      ...surveyProperties(survey, source),
      [SurveyEventProperties.SURVEY_QUESTIONS]: [
        { id: question.id, question: question.question, response },
      ],
      [`$survey_response_${question.id}`]: response,
      [SurveyEventProperties.SURVEY_COMPLETED]: true,
      $set: { [interactionProperty(survey, "responded")]: true },
    },
  };
};

/** Text typed but not sent stays in the browser. */
export const surveyDismissedEvent = (survey: Survey, source: FeedbackSource): SurveyEvent => ({
  name: SurveyEventName.DISMISSED,
  properties: {
    ...surveyProperties(survey, source),
    [SurveyEventProperties.SURVEY_PARTIALLY_COMPLETED]: false,
    $set: { [interactionProperty(survey, "dismissed")]: true },
  },
});
