import { type Survey } from "posthog-js";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import { FeedbackDialog } from "./FeedbackDialog";
import {
  type FeedbackContext,
  type FeedbackProperties,
  type FeedbackSource,
} from "./feedbackResponse";
import { useFeedbackSurveyAvailability } from "./useFeedbackSurveyAvailability";

export interface OpenFeedbackOptions {
  source: FeedbackSource;
  /** Added to survey shown / dismissed / sent. `$survey_*` keys and feedback_source win. */
  properties?: FeedbackProperties;
}

export interface FeedbackSurveyContextValue {
  isAvailable: boolean;
  /** Opens the feedback form in a centered dialog. Does nothing when feedback is unavailable. */
  openFeedback: (options: OpenFeedbackOptions) => void;
  /** Undefined in development without analytics; the form then sends nothing. */
  survey: Survey | undefined;
}

const FeedbackSurveyContext = createContext<FeedbackSurveyContextValue | null>(null);

export const useFeedbackSurvey = (): FeedbackSurveyContextValue => {
  const context = useContext(FeedbackSurveyContext);

  if (!context) {
    throw new Error("useFeedbackSurvey must be used within FeedbackSurveyProvider");
  }

  return context;
};

/** Owns the only PostHog survey subscription and the feedback dialog. */
export const FeedbackSurveyProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const { isAvailable, survey } = useFeedbackSurveyAvailability();
  const [dialog, setDialog] = useState<FeedbackContext | null>(null);
  const closeFeedback = useCallback(() => setDialog(null), []);
  const openFeedback = useCallback(
    ({ source, properties }: OpenFeedbackOptions) => {
      if (isAvailable) setDialog({ source, properties });
    },
    [isAvailable],
  );
  const value = useMemo(
    () => ({ isAvailable, openFeedback, survey }),
    [isAvailable, openFeedback, survey],
  );

  return (
    <FeedbackSurveyContext.Provider value={value}>
      {children}
      {dialog ? <FeedbackDialog survey={survey} context={dialog} onClose={closeFeedback} /> : null}
    </FeedbackSurveyContext.Provider>
  );
};
