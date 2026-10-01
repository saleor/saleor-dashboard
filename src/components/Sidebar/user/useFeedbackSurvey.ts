import { isProductAnalyticsEnabled } from "@dashboard/components/ProductAnalytics/config";
import { type PostHog, SurveyType, SurveyWidgetType } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

const feedbackSelector = '[data-posthog-feedback-trigger="true"]';

interface FeedbackSurveyAvailability {
  isAvailable: boolean;
}

export const useFeedbackSurvey = (): FeedbackSurveyAvailability => {
  const posthog = usePostHog();
  const [availability, setAvailability] = useState<{ client: PostHog; available: boolean }>();
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

          setAvailability({
            client: posthog,
            available: surveys.some(
              survey =>
                survey.type === SurveyType.Widget &&
                survey.appearance?.widgetType === SurveyWidgetType.Selector &&
                survey.appearance.widgetSelector === feedbackSelector,
            ),
          });
        });
      };
      const unsubscribeSurveys = posthog.onSurveysLoaded((_surveys, context) => {
        rendererLoaded = context?.isLoaded === true && !context.error;

        if (!rendererLoaded) {
          if (active) setAvailability({ client: posthog, available: false });

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

  const isSurveyAvailable =
    enabled && availability?.client === posthog && availability?.available === true;

  return {
    isAvailable: process.env.NODE_ENV === "development" || isSurveyAvailable,
  };
};
