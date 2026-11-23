import { type Survey, SurveyQuestionType, SurveyType } from "posthog-js";

export const feedbackSurvey: Survey = {
  id: "feedback-survey",
  name: "Dashboard feedback",
  description: "",
  type: SurveyType.API,
  questions: [
    {
      id: "feedback-question",
      type: SurveyQuestionType.Open,
      optional: true,
      question: "What could we improve in Saleor Dashboard?",
      description: "Tell us about something confusing, difficult, or missing.",
    },
  ],
  appearance: null,
  conditions: null,
  start_date: "2026-09-01",
  end_date: null,
  feature_flag_keys: null,
  linked_flag_key: null,
  targeting_flag_key: null,
  internal_targeting_flag_key: null,
  current_iteration: null,
  current_iteration_start_date: null,
};

export const featureRequestSurvey: Survey = {
  ...feedbackSurvey,
  id: "feature-request-survey",
  name: "Dashboard feature requests",
  questions: [
    {
      id: "feature-request-question",
      type: SurveyQuestionType.Open,
      optional: true,
      question: "What should we build next?",
      description: "Suggest a feature, or tell us what you think of these updates.",
    },
  ],
};
