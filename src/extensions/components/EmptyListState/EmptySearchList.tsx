import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { EmptyListState } from "./EmptyListState";

export const EmptySearchList = ({ onSubtitleClick }: { onSubtitleClick: () => void }) => {
  const intl = useIntl();

  return (
    <EmptyListState
      title={intl.formatMessage(messages.noExtensionsFound)}
      subtitle={intl.formatMessage(messages.clearSearch)}
      onSubtitleClick={onSubtitleClick}
    />
  );
};
