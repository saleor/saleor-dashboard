import {
  getFeedbackSurveyId,
  isProductAnalyticsEnabled,
} from "@dashboard/components/ProductAnalytics/config";
import { atom, type PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { type PostHog, type Survey, SurveyQuestionType, SurveyType } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useState } from "react";

import {
  type FeedbackPrompt,
  type FeedbackSource,
  promptProperties,
  surveyShownEvent,
} from "./feedbackSurveyEvents";

interface OpenFeedbackOptions {
  source: FeedbackSource;
  prompt?: FeedbackPrompt;
}

const openedAtom: PrimitiveAtom<OpenFeedbackOptions | null> = atom(
  null as OpenFeedbackOptions | null,
);

/**
 * The Dashboard draws the survey itself, so it only takes a PostHog "API" survey with one
 * free-text question.
 */
const isSupportedFeedbackSurvey = (survey: Survey, surveyId: string): boolean =>
  survey.id === surveyId &&
  survey.type === SurveyType.API &&
  survey.questions.length === 1 &&
  survey.questions[0].type === SurveyQuestionType.Open;

/** The feedback survey, once PostHog has loaded it and it targets the current user. */
const useLoadedFeedbackSurvey = (): Survey | undefined => {
  const posthog = usePostHog();
  const [loaded, setLoaded] = useState<{ client: PostHog; survey: Survey | undefined }>();
  const enabled = isProductAnalyticsEnabled();
  const surveyId = getFeedbackSurveyId();

  useEffect(
    function subscribeToFeedbackSurvey() {
      if (!enabled || !posthog || !surveyId) {
        return;
      }

      let active = true;
      let surveysLoaded = false;
      const updateSurvey = (): void => {
        if (!surveysLoaded) return;

        posthog.getActiveMatchingSurveys(surveys => {
          if (!active) return;

          setLoaded({
            client: posthog,
            survey: surveys.find(survey => isSupportedFeedbackSurvey(survey, surveyId)),
          });
        });
      };
      const unsubscribeSurveys = posthog.onSurveysLoaded((_surveys, context) => {
        surveysLoaded = context?.isLoaded === true && !context.error;

        if (!surveysLoaded) {
          if (active) setLoaded({ client: posthog, survey: undefined });

          return;
        }

        updateSurvey();
      });
      const unsubscribeFlags = posthog.onFeatureFlags(updateSurvey);

      return () => {
        active = false;
        unsubscribeSurveys();
        unsubscribeFlags();
      };
    },
    [enabled, posthog, surveyId],
  );

  return enabled && loaded?.client === posthog ? loaded.survey : undefined;
};

interface FeedbackSurvey {
  /** Whether to show feedback entry points. Always true in development, even without a survey. */
  isAvailable: boolean;
  /** Whether `openSurvey` will actually open the dialog. */
  canOpenSurvey: boolean;
  /** Opens the feedback dialog. Does nothing while the survey isn't loaded. */
  openSurvey: (options: OpenFeedbackOptions) => void;
}

export const useFeedbackSurvey = (): FeedbackSurvey => {
  const posthog = usePostHog();
  const survey = useLoadedFeedbackSurvey();
  const setOpened = useSetAtom(openedAtom);
  const isDev = process.env.NODE_ENV === "development";

  const openSurvey = useCallback(
    (options: OpenFeedbackOptions) => {
      if (!survey) return;

      const { name, properties } = surveyShownEvent(survey, options.source);

      posthog.capture(name, { ...properties, ...promptProperties(options.prompt) });
      setOpened(options);
    },
    [posthog, survey, setOpened],
  );

  return {
    isAvailable: isDev || survey !== undefined,
    canOpenSurvey: survey !== undefined,
    openSurvey,
  };
};

interface FeedbackSurveyDialogState {
  survey: Survey | undefined;
  /** Set while the dialog is open. */
  openedFrom: FeedbackSource | null;
  prompt: FeedbackPrompt | undefined;
  close: () => void;
}

export const useFeedbackSurveyDialog = (): FeedbackSurveyDialogState => {
  const survey = useLoadedFeedbackSurvey();
  const [opened, setOpened] = useAtom(openedAtom);
  const close = useCallback(() => setOpened(null), [setOpened]);

  return { survey, openedFrom: opened?.source ?? null, prompt: opened?.prompt, close };
};
