import { Graphql } from "@dashboard/icons/Graphql";
import { SearchIcon } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { shortcutsMessages } from "./messages";

export const useShortcuts = () => {
  const intl = useIntl();

  const shortcuts = useMemo(
    () => [
      {
        id: "search",
        name: intl.formatMessage(shortcutsMessages.search),
        icon: <SearchIcon />,
        shortcut: "⌘ K",
      },
      {
        id: "playground",
        name: intl.formatMessage(shortcutsMessages.playground),
        icon: <Graphql />,
        shortcut: "⌘ G",
      },
    ],
    [intl],
  );

  return shortcuts;
};
