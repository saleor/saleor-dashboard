import { messages } from "@dashboard/extensions/messages";
import { useIntl } from "react-intl";

import { EmptyListState } from "./EmptyListState";

export const EmptyInstalledList = ({ onSubtitleClick }: { onSubtitleClick: () => void }) => {
  const intl = useIntl();

  return (
    <EmptyListState
      title={intl.formatMessage(messages.noExtensionsInstalled)}
      subtitle={intl.formatMessage(messages.exploreAvailableExtensions)}
      onSubtitleClick={onSubtitleClick}
    />
  );
};
