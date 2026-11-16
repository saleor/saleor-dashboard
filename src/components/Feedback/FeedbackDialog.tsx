import { DashboardModal } from "@dashboard/components/Modal";
import { type Survey } from "posthog-js";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { FeedbackForm } from "./FeedbackForm";
import { type FeedbackContext } from "./feedbackResponse";
import { feedbackMessages } from "./messages";

interface FeedbackDialogProps {
  survey: Survey | undefined;
  context: FeedbackContext;
  onClose: () => void;
}

/** The feedback form for callers without an anchor, such as the command menu. */
export const FeedbackDialog = ({ survey, context, onClose }: FeedbackDialogProps): ReactNode => (
  <DashboardModal open onChange={onClose}>
    <DashboardModal.Content size="xs">
      <DashboardModal.Header>
        <FormattedMessage {...feedbackMessages.sendFeedback} />
      </DashboardModal.Header>
      <DashboardModal.Body>
        <DashboardModal.Inset>
          <FeedbackForm survey={survey} context={context} onSent={onClose} />
        </DashboardModal.Inset>
      </DashboardModal.Body>
    </DashboardModal.Content>
  </DashboardModal>
);
