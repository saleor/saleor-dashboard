import { type Properties, type Survey, SurveyEventProperties } from "posthog-js";

export const feedbackContactEmailProperty = "contact_email";

/**
 * Builds a `survey sent` event the same way PostHog's own survey widget does, so responses from
 * the dashboard's form show up in PostHog's survey results.
 */
export const getFeedbackResponseProperties = ({
  survey,
  feedback,
  contactEmail,
  submissionId,
}: {
  survey: Survey;
  feedback: string;
  /** Present only when the staff member agreed to be contacted. */
  contactEmail: string | undefined;
  submissionId: string;
}): Properties => {
  const [question] = survey.questions;
  const properties: Properties = {
    [SurveyEventProperties.SURVEY_ID]: survey.id,
    [SurveyEventProperties.SURVEY_NAME]: survey.name,
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
    properties[feedbackContactEmailProperty] = contactEmail;
  }

  return properties;
};
