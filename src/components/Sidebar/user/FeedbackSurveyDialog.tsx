import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { buttonMessages } from "@dashboard/intl";
import { Button, Textarea } from "@saleor/macaw-ui-next";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { getFeedbackResponse, surveyDismissedEvent, surveySentEvent } from "./feedbackSurveyEvents";
import { useFeedbackSurveyDialog } from "./useFeedbackSurvey";

const messages = defineMessages({
  sent: {
    id: "7RGhGL",
    defaultMessage: "Feedback sent",
    description: "notification after sending the feedback survey",
  },
});

interface FeedbackSurveyDialogViewProps {
  open: boolean;
  question: string;
  description?: string;
  response: string;
  onResponseChange: (response: string) => void;
  onSend: () => void;
  onDismiss: () => void;
}

export const FeedbackSurveyDialogView = ({
  open,
  question,
  description,
  response,
  onResponseChange,
  onSend,
  onDismiss,
}: FeedbackSurveyDialogViewProps): JSX.Element => {
  const canSend = getFeedbackResponse(response) !== undefined;

  return (
    <DashboardModal open={open} onChange={isOpen => !isOpen && onDismiss()}>
      <DashboardModal.Content size="sm">
        {description ? (
          <DashboardModal.Header subtitle={description}>{question}</DashboardModal.Header>
        ) : (
          <DashboardModal.Header>{question}</DashboardModal.Header>
        )}
        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Textarea
              aria-label={question}
              data-test-id="feedback-survey-response"
              rows={5}
              value={response}
              onChange={event => onResponseChange(event.target.value)}
              autoFocus
            />
          </DashboardModal.Inset>
        </DashboardModal.Body>
        <DashboardModal.Actions>
          <BackButton onClick={onDismiss}>
            <FormattedMessage {...buttonMessages.cancel} />
          </BackButton>
          <Button disabled={!canSend} onClick={onSend} data-test-id="feedback-survey-send">
            <FormattedMessage {...buttonMessages.send} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

/** The feedback survey from PostHog, drawn as a Dashboard dialog. */
export const FeedbackSurveyDialog = (): JSX.Element | null => {
  const { survey, openedFrom, close } = useFeedbackSurveyDialog();
  const posthog = usePostHog();
  const notify = useNotifier();
  const intl = useIntl();
  const [response, setResponse] = useState("");

  if (!survey) return null;

  const [question] = survey.questions;

  const handleSend = (): void => {
    const answer = getFeedbackResponse(response);

    if (!openedFrom || !answer) return;

    const { name, properties } = surveySentEvent(survey, openedFrom, answer);

    posthog.capture(name, properties);
    setResponse("");
    close();
    notify({ status: "success", title: intl.formatMessage(messages.sent) });
  };

  const handleDismiss = (): void => {
    if (!openedFrom) return;

    const { name, properties } = surveyDismissedEvent(survey, openedFrom);

    posthog.capture(name, properties);
    setResponse("");
    close();
  };

  return (
    <FeedbackSurveyDialogView
      open={openedFrom !== null}
      question={question.question}
      description={question.description ?? undefined}
      response={response}
      onResponseChange={setResponse}
      onSend={handleSend}
      onDismiss={handleDismiss}
    />
  );
};
