import { isProductAnalyticsEnabled } from "@dashboard/components/ProductAnalytics/config";
import { type PostHog, type Survey, SurveyQuestionType, SurveyType } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

interface FeedbackSurveyAvailability {
  isAvailable: boolean;
  /** Undefined in development without analytics; the form then sends nothing. */
  survey: Survey | undefined;
}

/**
 * The dashboard renders the feedback form itself, so the survey is an API survey whose first
 * question is the open-text feedback question.
 */
const isFeedbackSurvey = (survey: Survey): boolean =>
  survey.type === SurveyType.API && survey.questions[0]?.type === SurveyQuestionType.Open;

export const useFeedbackSurveyAvailability = (): FeedbackSurveyAvailability => {
  const posthog = usePostHog();
  const [availability, setAvailability] = useState<{
    client: PostHog;
    survey: Survey | undefined;
  }>();
  const isDev = process.env.NODE_ENV === "development";
  const enabled = isProductAnalyticsEnabled();

  useEffect(
    function subscribeToFeedbackSurvey() {
      if (!enabled || !posthog) {
        return;
      }

      let active = true;
      let rendererLoaded = false;
      const updateAvailability = (): void => {
        if (!rendererLoaded) return;

        posthog.getActiveMatchingSurveys(surveys => {
          if (!active) return;

          setAvailability({ client: posthog, survey: surveys.find(isFeedbackSurvey) });
        });
      };
      const unsubscribeSurveys = posthog.onSurveysLoaded((_surveys, context) => {
        rendererLoaded = context?.isLoaded === true && !context.error;

        if (!rendererLoaded) {
          if (active) setAvailability({ client: posthog, survey: undefined });

          return;
        }

        updateAvailability();
      });
      const unsubscribeFlags = posthog.onFeatureFlags(updateAvailability);

      return () => {
        active = false;
        unsubscribeSurveys();
        unsubscribeFlags();
      };
    },
    [enabled, posthog],
  );

  const survey = enabled && availability?.client === posthog ? availability.survey : undefined;

  return {
    isAvailable: isDev || survey !== undefined,
    survey,
  };
};
