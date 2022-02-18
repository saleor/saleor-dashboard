import { Pill, Tooltip } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import messages from "./messages";

export const PreviewPill: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <Tooltip
      title={intl.formatMessage(messages.tooltip)}
      variant="warning"
      placement="bottom-start"
    >
      <Pill
        color="warning"
        size="small"
        label={intl.formatMessage(messages.label)}
      />
    </Tooltip>
  );
};

PreviewPill.displayName = "PreviewPill";
export default PreviewPill;
