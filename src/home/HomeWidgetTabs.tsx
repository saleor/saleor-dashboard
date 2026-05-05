import { Tab, TabContainer } from "@dashboard/components/Tab";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { type Extension } from "@dashboard/extensions/types";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Blocks } from "lucide-react";

import { isExternalAppUrl } from "./isExternalAppUrl";
import { homeWidgetUrl } from "./urls";

const HomeTab = Tab<string>("home-widget-tab");

interface HomeWidgetTabsProps {
  extensions: Extension[];
  activeExtensionId: string | null;
}

const resolveExtensionUrl = (extension: Extension): string =>
  isUrlAbsolute(extension.url) ? extension.url : `${extension.app.appUrl}${extension.url}`;

export const HomeWidgetTabs = ({ extensions, activeExtensionId }: HomeWidgetTabsProps) => {
  const navigate = useNavigator();

  return (
    <TabContainer>
      {extensions.map(extension => {
        const isExternal = isExternalAppUrl(resolveExtensionUrl(extension));

        return (
          <HomeTab
            key={extension.id}
            isActive={extension.id === activeExtensionId}
            changeTab={() => navigate(homeWidgetUrl(extension.id))}
            testId={`home-widget-tab-${extension.id}`}
          >
            <Box display="inline-flex" alignItems="center" gap={2}>
              <Box display="inline-flex" flexDirection="column">
                <span>{extension.label}</span>
                <Text size={1} color="default2">
                  {extension.app.name}
                </Text>
              </Box>
              {isExternal && <Blocks />}
            </Box>
          </HomeTab>
        );
      })}
    </TabContainer>
  );
};
