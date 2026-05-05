import { useUser } from "@dashboard/auth/useUser";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { getUserName } from "@dashboard/misc";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router";
import { Redirect } from "react-router-dom";

import { filterHomeExtensions } from "./filterHomeExtensions";
import { HomeWidgetTabs } from "./HomeWidgetTabs";
import { HomeWidgetView } from "./HomeWidgetView";
import { rippleHomeWidgets } from "./ripples/homeWidgets";
import { homeWidgetUrl } from "./urls";

const HOMEPAGE_MOUNT = ["HOMEPAGE_WIDGETS"] as const;

export const HomePage = () => {
  const { extensionId: rawExtensionId } = useParams<{ extensionId?: string }>();
  const extensionId = rawExtensionId ? decodeURIComponent(rawExtensionId) : undefined;

  const { user } = useUser();
  const userPermissions = user?.userPermissions ?? [];

  const { HOMEPAGE_WIDGETS: extensions } = useExtensions(HOMEPAGE_MOUNT);
  const visibleExtensions = filterHomeExtensions(extensions, userPermissions);

  if (visibleExtensions.length === 0) {
    return (
      <Box paddingX={8} paddingY={9}>
        <Text size={6} fontWeight="bold">
          Welcome
        </Text>
        <Box marginTop={4}>
          <Text>Install an app that registers a HOMEPAGE_WIDGETS extension to see it here.</Text>
        </Box>
      </Box>
    );
  }

  // No extension selected - redirect to first available
  if (!extensionId) {
    return <Redirect to={homeWidgetUrl(visibleExtensions[0].id)} />;
  }

  const activeExtension = visibleExtensions.find(extension => extension.id === extensionId);

  // URL points to a missing or unauthorized extension - redirect to first available
  if (!activeExtension) {
    return <Redirect to={homeWidgetUrl(visibleExtensions[0].id)} />;
  }

  const userName = getUserName(user, true);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box paddingX={6} paddingTop={6} display="flex" alignItems="center" gap={4}>
        <Text size={6} fontWeight="bold" as="h1" data-test-id="welcome-header">
          <FormattedMessage
            id="0+zatS"
            defaultMessage="Hello {userName}, welcome to your Store Dashboard"
            values={{ userName }}
          />
        </Text>
        <Ripple model={rippleHomeWidgets} />
      </Box>
      <Box paddingX={6} paddingTop={4}>
        <HomeWidgetTabs extensions={visibleExtensions} activeExtensionId={activeExtension.id} />
      </Box>
      <Box padding={6} width="100%" __flex="1" __minHeight={0}>
        <HomeWidgetView extension={activeExtension} />
      </Box>
    </Box>
  );
};
