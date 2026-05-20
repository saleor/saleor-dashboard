import { DashboardCard } from "@dashboard/components/Card";
import { AppAvatar } from "@dashboard/extensions/components/AppAvatar/AppAvatar";
import { type Extension } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Text } from "@saleor/macaw-ui-next";

import { ExtensionIframe } from "./ExtensionIframe";

interface HomeWidgetCellProps {
  extension: Extension;
}

const MIN_CELL_HEIGHT = 320;

export const HomeWidgetCell = ({ extension }: HomeWidgetCellProps) => {
  const navigate = useNavigator();
  const logo = extension.app.brand?.logo.default;
  const appPageUrl = ExtensionsUrls.resolveViewManifestExtensionUrl(extension.app.id, {});

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <Box display="flex" alignItems="center" gap={2} width="100%">
          <AppAvatar size={6} logo={logo ? { source: logo } : undefined} />
          <Box display="flex" flexDirection="column" flexGrow="1" minWidth={0}>
            <Text size={3} fontWeight="medium">
              {extension.label}
            </Text>
            <Text
              as="a"
              size={2}
              color="default2"
              href={appPageUrl}
              onClick={e => {
                e.preventDefault();
                navigate(appPageUrl);
              }}
            >
              {extension.app.name}
            </Text>
          </Box>
        </Box>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          __minHeight={MIN_CELL_HEIGHT}
        >
          <ExtensionIframe extension={extension} height="100%" loaderType="skeleton" />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
