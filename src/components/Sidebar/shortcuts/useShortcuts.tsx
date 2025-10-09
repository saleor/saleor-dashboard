import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { useNavigatorSearchContext } from "@dashboard/components/NavigatorSearch/useNavigatorSearchContext";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { TerminalIcon } from "@dashboard/icons/TerminalIcon";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { rippleIntroducedRipples } from "@dashboard/ripples/ripples/introducedRipples";
import { useAllRipplesModalState } from "@dashboard/ripples/state";
import { Box } from "@saleor/macaw-ui-next";
import { GiftIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { LucideIconsWrapper } from "../LucideIconsWrapper";
import { shortcutsMessages } from "./messages";
import { getShortcutLeadingKey } from "./utils";

export interface Shortcut {
  id: string;
  name: string | React.ReactNode;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const useShortcuts = (): Shortcut[] => {
  const intl = useIntl();
  const { setNavigatorVisibility } = useNavigatorSearchContext();
  const devContext = useDevModeContext();
  const controlKey = getShortcutLeadingKey();
  const handleOpenPlayground = useCallback(() => {
    devContext.setDevModeContent("");
    devContext.setVariables("");
    devContext.setDevModeVisibility(true);
  }, []);

  const handleOpenSearch = useCallback(() => {
    setNavigatorVisibility(true);
  }, []);

  const { setModalState } = useAllRipplesModalState();

  const shortcuts = useMemo(
    () => [
      {
        id: "search",
        name: intl.formatMessage(shortcutsMessages.search),
        icon: (
          <Box __marginLeft={"-2px"}>
            <TerminalIcon />
          </Box>
        ),
        shortcut: `${controlKey} + K`,
        action: handleOpenSearch,
      },
      {
        id: "playground",
        name: intl.formatMessage(shortcutsMessages.playground),
        icon: <GraphqlIcon />,
        shortcut: `${controlKey} + '`,
        action: handleOpenPlayground,
      },
      {
        id: "recent-changes-ripples",
        name: (
          <Box>
            {intl.formatMessage(shortcutsMessages.recentChanges)}{" "}
            <Box marginLeft={4} display="inline-block">
              <Ripple model={rippleIntroducedRipples} />
            </Box>
          </Box>
        ),
        icon: (
          <LucideIconsWrapper>
            <GiftIcon />
          </LucideIconsWrapper>
        ),
        action: () => {
          setModalState(true);
        },
      },
    ],
    [intl],
  );

  return shortcuts;
};
