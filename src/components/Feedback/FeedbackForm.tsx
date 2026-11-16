import { useUser } from "@dashboard/auth/useUser";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { Box, Button, Checkbox, Text, Textarea } from "@saleor/macaw-ui-next";
import { type Survey, SurveyEventName } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  type FeedbackContext,
  getFeedbackEventProperties,
  getFeedbackResponseProperties,
} from "./feedbackResponse";
import { feedbackMessages } from "./messages";

interface FeedbackFormProps {
  /** Undefined in development without analytics; the form then sends nothing. */
  survey: Survey | undefined;
  context: FeedbackContext;
  /** Called after the feedback is sent. */
  onSent: () => void;
}

/**
 * The feedback text and the opt-in contact checkbox. Mounting it records `survey shown`;
 * unmounting it without sending records `survey dismissed`.
 */
export const FeedbackForm = ({ survey, context, onSent }: FeedbackFormProps): ReactNode => {
  const intl = useIntl();
  const posthog = usePostHog();
  const notify = useNotifier();
  const { user } = useUser();
  const [feedback, setFeedback] = useState("");
  const [contact, setContact] = useState(false);
  const sent = useRef(false);
  const question = survey?.questions[0]?.question || intl.formatMessage(feedbackMessages.question);

  useEffect(
    function captureShownAndDismissed() {
      if (!posthog || !survey) return;

      const properties = getFeedbackEventProperties({ survey, context });

      posthog.capture(SurveyEventName.SHOWN, properties);

      return (): void => {
        if (!sent.current) posthog.capture(SurveyEventName.DISMISSED, properties);
      };
    },
    // One shown/dismissed pair per mounted form.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (posthog && survey) {
      posthog.capture(
        SurveyEventName.SENT,
        getFeedbackResponseProperties({
          survey,
          context,
          feedback: feedback.trim(),
          contactEmail: contact ? user?.email : undefined,
          submissionId: crypto.randomUUID(),
        }),
      );
    }

    sent.current = true;
    notify({ status: "success", text: intl.formatMessage(feedbackMessages.sent) });
    onSent();
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={3}
      data-test-id="feedback-form"
    >
      <Textarea
        label={question}
        helperText={intl.formatMessage(feedbackMessages.sensitiveDataWarning)}
        value={feedback}
        onChange={event => setFeedback(event.target.value)}
        rows={4}
        maxRows={10}
        autoFocus
      />
      <Checkbox checked={contact} onCheckedChange={checked => setContact(checked === true)}>
        <Text size={2}>
          <FormattedMessage {...feedbackMessages.contact} />
        </Text>
      </Checkbox>
      <Box display="flex" justifyContent="flex-end">
        <Button type="submit" variant="primary" disabled={feedback.trim() === ""}>
          <FormattedMessage {...feedbackMessages.send} />
        </Button>
      </Box>
    </Box>
  );
};
