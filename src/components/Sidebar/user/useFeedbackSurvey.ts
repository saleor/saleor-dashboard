import {
  getFeatureRequestSurveyId,
  getFeedbackSurveyId,
  isProductAnalyticsEnabled,
} from "@dashboard/components/ProductAnalytics/config";
import { atom, type PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { type PostHog, type Survey, SurveyQuestionType, SurveyType } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useState } from "react";

import { type FeedbackSource, surveyShownEvent } from "./feedbackSurveyEvents";

/** Which PostHog survey to ask: general feedback, or feature requests from What's New. */
export type FeedbackSurveyKind = "feedback" | "feature_request";

const surveyIds: Record<FeedbackSurveyKind, () => string | undefined> = {
  feedback: getFeedbackSurveyId,
  feature_request: getFeatureRequestSurveyId,
};

interface DialogSurvey {
  survey: Survey;
  source: FeedbackSource;
  /** False while the dialog animates closed; the survey stays so its text doesn't vanish. */
  open: boolean;
}

const dialogAtom: PrimitiveAtom<DialogSurvey | null> = atom(null as DialogSurvey | null);

/**
 * The Dashboard draws the survey itself, so it only takes a PostHog "API" survey with one
 * free-text question.
 */
const isSupportedFeedbackSurvey = (survey: Survey, surveyId: string): boolean =>
  survey.id === surveyId &&
  survey.type === SurveyType.API &&
  survey.questions.length === 1 &&
  survey.questions[0].type === SurveyQuestionType.Open;

/** The survey, once PostHog has loaded it and it targets the current user. */
const useLoadedSurvey = (kind: FeedbackSurveyKind): Survey | undefined => {
  const posthog = usePostHog();
  const [loaded, setLoaded] = useState<{ client: PostHog; survey: Survey | undefined }>();
  const enabled = isProductAnalyticsEnabled();
  const surveyId = surveyIds[kind]();

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
  /** Opens the survey in the feedback dialog. Does nothing while the survey isn't loaded. */
  openSurvey: (options: { source: FeedbackSource }) => void;
}

export const useFeedbackSurvey = (kind: FeedbackSurveyKind = "feedback"): FeedbackSurvey => {
  const posthog = usePostHog();
  const survey = useLoadedSurvey(kind);
  const setDialog = useSetAtom(dialogAtom);
  const isDev = process.env.NODE_ENV === "development";

  const openSurvey = useCallback(
    ({ source }: { source: FeedbackSource }) => {
      if (!survey) return;

      const { name, properties } = surveyShownEvent(survey, source);

      posthog.capture(name, properties);
      setDialog({ survey, source, open: true });
    },
    [posthog, survey, setDialog],
  );

  return {
    isAvailable: isDev || survey !== undefined,
    canOpenSurvey: survey !== undefined,
    openSurvey,
  };
};

interface FeedbackSurveyDialogState {
  /** The last opened survey and where it was opened from. */
  dialog: DialogSurvey | null;
  close: () => void;
}

export const useFeedbackSurveyDialog = (): FeedbackSurveyDialogState => {
  const [dialog, setDialog] = useAtom(dialogAtom);
  const close = useCallback(
    () => setDialog(current => (current ? { ...current, open: false } : null)),
    [setDialog],
  );

  return { dialog, close };
};
