import { Box, Popover } from "@saleor/macaw-ui-next";
import { type ReactNode, useState } from "react";

import { FeedbackForm } from "./FeedbackForm";
import { type FeedbackContext } from "./feedbackResponse";
import { useFeedbackSurvey } from "./FeedbackSurveyProvider";

interface FeedbackPopoverProps {
  side: "top" | "right";
  /** The sidebar feedback button. */
  children: ReactNode;
}

const sidebarContext: FeedbackContext = { source: "sidebar" };

export const FeedbackPopover = ({ side, children }: FeedbackPopoverProps): ReactNode => {
  const { survey } = useFeedbackSurvey();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content side={side} align="start" sideOffset={8}>
        {/* Popover.Content puts its grey surface, border and shadow on this wrapper. */}
        <Box borderRadius={4} overflow="hidden">
          <Box padding={4} __width="320px" backgroundColor="default1">
            <FeedbackForm survey={survey} context={sidebarContext} onSent={() => setOpen(false)} />
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
