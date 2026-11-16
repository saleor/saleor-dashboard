import { useUser } from "@dashboard/auth/useUser";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { Box, Button, Checkbox, Popover, Text, Textarea } from "@saleor/macaw-ui-next";
import { type Survey, SurveyEventName, SurveyEventProperties } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { type FormEvent, type ReactNode, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { getFeedbackResponseProperties } from "./feedbackResponse";

const messages = defineMessages({
  question: {
    id: "PFCWLv",
    defaultMessage: "What could we improve?",
    description: "feedback form question when the survey has no question text",
  },
  contact: {
    id: "bpy0b2",
    defaultMessage: "Can we contact you about this by email?",
    description:
      "feedback form checkbox; when ticked, the staff member's email is sent with the feedback",
  },
  send: {
    id: "5FTSod",
    defaultMessage: "Send",
    description: "feedback form submit button",
  },
  sent: {
    id: "QQojCW",
    defaultMessage: "Thanks for your feedback",
    description: "notification after sending feedback",
  },
});

interface FeedbackPopoverProps {
  survey: Survey | undefined;
  side: "top" | "right";
  /** The feedback button. */
  children: ReactNode;
}

export const FeedbackPopover = ({ survey, side, children }: FeedbackPopoverProps): ReactNode => {
  const intl = useIntl();
  const posthog = usePostHog();
  const notify = useNotifier();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [contact, setContact] = useState(false);
  const question = survey?.questions[0]?.question || intl.formatMessage(messages.question);

  const captureSurveyEvent = (event: SurveyEventName): void => {
    if (!posthog || !survey) return;

    posthog.capture(event, {
      [SurveyEventProperties.SURVEY_ID]: survey.id,
      [SurveyEventProperties.SURVEY_NAME]: survey.name,
    });
  };

  const reset = (): void => {
    setFeedback("");
    setContact(false);
  };

  const handleOpenChange = (nextOpen: boolean): void => {
    setOpen(nextOpen);

    if (nextOpen) {
      captureSurveyEvent(SurveyEventName.SHOWN);

      return;
    }

    captureSurveyEvent(SurveyEventName.DISMISSED);
    reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (posthog && survey) {
      posthog.capture(
        SurveyEventName.SENT,
        getFeedbackResponseProperties({
          survey,
          feedback: feedback.trim(),
          contactEmail: contact ? user?.email : undefined,
          submissionId: crypto.randomUUID(),
        }),
      );
    }

    notify({ status: "success", text: intl.formatMessage(messages.sent) });
    setOpen(false);
    reset();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content side={side} align="start" sideOffset={8}>
        {/* Popover.Content puts its grey surface, border and shadow on this wrapper. */}
        <Box borderRadius={4} overflow="hidden">
          <Box
            as="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={3}
            padding={4}
            __width="320px"
            backgroundColor="default1"
            data-test-id="feedback-form"
          >
            <Textarea
              label={question}
              value={feedback}
              onChange={event => setFeedback(event.target.value)}
              rows={4}
              maxRows={10}
              autoFocus
            />
            <Checkbox
              checked={contact}
              onCheckedChange={checked => setContact(checked === true)}
              data-test-id="feedback-contact"
            >
              <Text size={2}>
                <FormattedMessage {...messages.contact} />
              </Text>
            </Checkbox>
            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" variant="primary" disabled={feedback.trim() === ""}>
                <FormattedMessage {...messages.send} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
