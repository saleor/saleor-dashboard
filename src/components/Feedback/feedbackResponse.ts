import { type Properties, type Survey, SurveyEventProperties } from "posthog-js";

export const feedbackContactEmailProperty = "contact_email";

export type FeedbackSource = "sidebar" | "command_menu" | "prompt";

export type FeedbackProperties = Record<string, string | number | boolean>;

export interface FeedbackContext {
  source: FeedbackSource;
  properties?: FeedbackProperties;
}

/**
 * Properties on every survey event (shown, dismissed, sent). The survey keys and
 * `feedback_source` win over caller properties, and callers can never add the contact email.
 */
export const getFeedbackEventProperties = ({
  survey,
  context,
}: {
  survey: Survey;
  context: FeedbackContext;
}): Properties => {
  const { [feedbackContactEmailProperty]: _email, ...properties } = context.properties ?? {};

  return {
    ...properties,
    feedback_source: context.source,
    [SurveyEventProperties.SURVEY_ID]: survey.id,
    [SurveyEventProperties.SURVEY_NAME]: survey.name,
  };
};

/**
 * Builds a `survey sent` event the same way PostHog's own survey widget does, so responses from
 * the dashboard's form show up in PostHog's survey results.
 */
export const getFeedbackResponseProperties = ({
  survey,
  context,
  feedback,
  contactEmail,
  submissionId,
}: {
  survey: Survey;
  context: FeedbackContext;
  feedback: string;
  /** Present only when the staff member agreed to be contacted. */
  contactEmail: string | undefined;
  submissionId: string;
}): Properties => {
  const [question] = survey.questions;
  const response: Properties = {
    ...getFeedbackEventProperties({ survey, context }),
    [SurveyEventProperties.SURVEY_ITERATION]: survey.current_iteration,
    [SurveyEventProperties.SURVEY_ITERATION_START_DATE]: survey.current_iteration_start_date,
    [SurveyEventProperties.SURVEY_SUBMISSION_ID]: submissionId,
    [SurveyEventProperties.SURVEY_COMPLETED]: true,
    [SurveyEventProperties.SURVEY_QUESTIONS]: [
      { id: question.id, question: question.question, response: feedback },
    ],
    [`$survey_response_${question.id}`]: feedback,
  };

  if (contactEmail) {
    response[feedbackContactEmailProperty] = contactEmail;
  }

  return response;
};
