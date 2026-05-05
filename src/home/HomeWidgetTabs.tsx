import { Tab, TabContainer } from "@dashboard/components/Tab";
import { type Extension } from "@dashboard/extensions/types";
import { SaleorLogo } from "@dashboard/extensions/views/InstallCustomExtension/components/InstallSectionData/InstallExtensionManifestData/SaleorLogo";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Text } from "@saleor/macaw-ui-next";

import { homeWidgetUrl } from "./urls";

const HomeTab = Tab<string>("home-widget-tab");

interface HomeWidgetTabsProps {
  extensions: Extension[];
  activeExtensionId: string | null;
}

export const HomeWidgetTabs = ({ extensions, activeExtensionId }: HomeWidgetTabsProps) => {
  const navigate = useNavigator();

  return (
    <TabContainer>
      {extensions.map(extension => (
        <HomeTab
          key={extension.id}
          isActive={extension.id === activeExtensionId}
          changeTab={() => navigate(homeWidgetUrl(extension.id))}
          testId={`home-widget-tab-${extension.id}`}
        >
          <Box display="inline-flex" alignItems="center" gap={2}>
            <Box
              __width={extension.isSaleorOfficial ? 20 : 0}
              __height={20}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              data-test-id={
                extension.isSaleorOfficial ? `saleor-app-badge-${extension.id}` : undefined
              }
            >
              {extension.isSaleorOfficial && <SaleorLogo />}
            </Box>
            <Box display="inline-flex" flexDirection="column">
              <span>{extension.label}</span>
              <Text size={1} color="default2">
                {extension.app.name}
              </Text>
            </Box>
          </Box>
        </HomeTab>
      ))}
    </TabContainer>
  );
};
