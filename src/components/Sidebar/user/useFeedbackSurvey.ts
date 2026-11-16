import { isProductAnalyticsEnabled } from "@dashboard/components/ProductAnalytics/config";
import {
  DisplaySurveyType,
  type PostHog,
  SurveyPosition,
  SurveyType,
  SurveyWidgetType,
} from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useState } from "react";

const feedbackSelector = '[data-posthog-feedback-trigger="true"]';

/** Where the survey was opened from, sent as `feedback_source` with the response. */
type FeedbackSource = "command_menu";

interface FeedbackSurvey {
  isAvailable: boolean;
  /** Opens the feedback survey in the middle of the screen, away from the sidebar button. */
  openSurvey: (options: { source: FeedbackSource }) => void;
}

export const useFeedbackSurvey = (): FeedbackSurvey => {
  const posthog = usePostHog();
  const [availability, setAvailability] = useState<{
    client: PostHog;
    surveyId: string | undefined;
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

          setAvailability({
            client: posthog,
            surveyId: surveys.find(
              survey =>
                survey.type === SurveyType.Widget &&
                survey.appearance?.widgetType === SurveyWidgetType.Selector &&
                survey.appearance.widgetSelector === feedbackSelector,
            )?.id,
          });
        });
      };
      const unsubscribeSurveys = posthog.onSurveysLoaded((_surveys, context) => {
        rendererLoaded = context?.isLoaded === true && !context.error;

        if (!rendererLoaded) {
          if (active) setAvailability({ client: posthog, surveyId: undefined });

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

  const surveyId = enabled && availability?.client === posthog ? availability.surveyId : undefined;

  const openSurvey = useCallback(
    ({ source }: { source: FeedbackSource }) => {
      if (!posthog || !surveyId) return;

      posthog.displaySurvey(surveyId, {
        displayType: DisplaySurveyType.Popover,
        // The sidebar button can be anywhere or nowhere on screen, so open where the caller was.
        position: SurveyPosition.MiddleCenter,
        ignoreConditions: true,
        ignoreDelay: true,
        properties: { feedback_source: source },
      });
    },
    [posthog, surveyId],
  );

  return {
    isAvailable: isDev || surveyId !== undefined,
    openSurvey,
  };
};
