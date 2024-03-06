import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { useNavigatorSearchContext } from "@dashboard/components/NavigatorSearch/useNavigatorSearchContext";
import { Graphql } from "@dashboard/icons/Graphql";
import { SearchIcon } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { shortcutsMessages } from "./messages";
import { getShortcutLeadingKey } from "./utils";

export const useShortcuts = () => {
  const intl = useIntl();
  const devContext = useDevModeContext();
  const { setNavigatorVisibility } = useNavigatorSearchContext();

  const controlKey = getShortcutLeadingKey();

  const handleOpenPlayground = useCallback(() => {
    devContext.setDevModeContent("");
    devContext.setVariables("");
    devContext.setDevModeVisibility(true);
  }, []);

  const handleOpenSearch = useCallback(() => {
    setNavigatorVisibility(true);
  }, []);

  const shortcuts = useMemo(
    () => [
      {
        id: "search",
        name: intl.formatMessage(shortcutsMessages.search),
        icon: <SearchIcon />,
        shortcut: `${controlKey} + K`,
        action: handleOpenSearch,
      },
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
