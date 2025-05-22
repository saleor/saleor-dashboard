import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { Graphql } from "@dashboard/icons/Graphql";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { shortcutsMessages } from "./messages";
import { getShortcutLeadingKey } from "./utils";

export interface Shortcut {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortcut: string;
  action: () => void;
}

export const useShortcuts = (): Shortcut[] => {
  const intl = useIntl();
  const devContext = useDevModeContext();
  const controlKey = getShortcutLeadingKey();
  const handleOpenPlayground = useCallback(() => {
    devContext.setDevModeContent("");
    devContext.setVariables("");
    devContext.setDevModeVisibility(true);
  }, []);

  const shortcuts = useMemo(
    () => [
      {
        id: "playground",
        name: intl.formatMessage(shortcutsMessages.playground),
        icon: <Graphql />,
        shortcut: `${controlKey} + '`,
        action: handleOpenPlayground,
      },
    ],
    [intl],
  );

  return shortcuts;
};
