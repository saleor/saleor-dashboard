import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { buttonMessages } from "@dashboard/intl";
import { Button, Textarea } from "@saleor/macaw-ui-next";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import {
  type FeedbackSource,
  getFeedbackResponse,
  surveyDismissedEvent,
  surveySentEvent,
} from "./feedbackSurveyEvents";
import { useFeedbackSurveyDialog } from "./useFeedbackSurvey";

const messages = defineMessages({
  sent: {
    id: "7RGhGL",
    defaultMessage: "Feedback sent",
    description: "notification after sending the feedback survey",
  },
});

/** Whether the source is another dialog, which closes in the same click this one opens. */
const opensFromDialog: Record<FeedbackSource, boolean> = {
  sidebar: false,
  command_menu: true,
  whats_new: true,
};

interface FeedbackSurveyDialogViewProps {
  open: boolean;
  /** False when replacing another dialog, so the backdrop stays dark between the two. */
  animateIn?: boolean;
  question: string;
  description?: string;
  response: string;
  onResponseChange: (response: string) => void;
  onSend: () => void;
  onDismiss: () => void;
}

export const FeedbackSurveyDialogView = ({
  open,
  animateIn = true,
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
      <DashboardModal.Content size="sm" animateIn={animateIn}>
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

/** The opened PostHog survey, drawn as a Dashboard dialog. */
export const FeedbackSurveyDialog = (): JSX.Element | null => {
  const { dialog, close } = useFeedbackSurveyDialog();
  const posthog = usePostHog();
  const notify = useNotifier();
  const intl = useIntl();
  const [response, setResponse] = useState("");

  if (!dialog) return null;

  const { survey, source, open } = dialog;
  const [question] = survey.questions;

  const handleSend = (): void => {
    const answer = getFeedbackResponse(response);

    if (!answer) return;

    const { name, properties } = surveySentEvent(survey, source, answer);

    posthog.capture(name, properties);
    setResponse("");
    close();
    notify({ status: "success", title: intl.formatMessage(messages.sent) });
  };

  const handleDismiss = (): void => {
    const { name, properties } = surveyDismissedEvent(survey, source);

    posthog.capture(name, properties);
    setResponse("");
    close();
  };

  return (
    <FeedbackSurveyDialogView
      open={open}
      animateIn={!opensFromDialog[source]}
      question={question.question}
      description={question.description ?? undefined}
      response={response}
      onResponseChange={setResponse}
      onSend={handleSend}
      onDismiss={handleDismiss}
    />
  );
};
