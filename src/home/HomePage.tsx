import { useUser } from "@dashboard/auth/useUser";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { getUserName } from "@dashboard/misc";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";
import { useParams, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";

import { filterHomeExtensions } from "./filterHomeExtensions";
import { HomeWidgetsGrid } from "./HomeWidgetsGrid";
import { type HomeActiveTab, HomeWidgetTabs } from "./HomeWidgetTabs";
import { HomeWidgetView } from "./HomeWidgetView";
import { rippleHomeWidgets } from "./ripples/homeWidgets";
import { homeWidgetsUrl, homeWidgetUrl } from "./urls";

const HOMEPAGE_MOUNT = ["HOMEPAGE_WIDGETS"] as const;

export const useHomeRouteParams = () => {
  const { extensionId: rawExtensionId } = useParams<{ extensionId?: string }>();
  const extensionId = rawExtensionId ? decodeURIComponent(rawExtensionId) : undefined;
  const widgetsRouteMatch = useRouteMatch({ path: "/home/widgets", exact: true });

  return {
    extensionId,
    isWidgetsRoute: Boolean(widgetsRouteMatch),
  };
};

const resolveLeftmostTabUrl = (
  fullscreen: ReturnType<typeof filterHomeExtensions>["fullscreen"],
  widgets: ReturnType<typeof filterHomeExtensions>["widgets"],
): string | null => {
  if (fullscreen.length > 0) {
    return homeWidgetUrl(fullscreen[0].id);
  }

  if (widgets.length > 0) {
    return homeWidgetsUrl();
  }

  return null;
};

export const HomePage = () => {
  const { extensionId, isWidgetsRoute } = useHomeRouteParams();

  const { user } = useUser();
  const userPermissions = user?.userPermissions ?? [];

  const { HOMEPAGE_WIDGETS: extensions } = useExtensions(HOMEPAGE_MOUNT);
  const { fullscreen, widgets } = filterHomeExtensions(extensions, userPermissions);

  if (fullscreen.length === 0 && widgets.length === 0) {
    return (
      <Box paddingX={8} paddingY={9}>
        <Text size={6} fontWeight="bold">
          <FormattedMessage
            id="fTLvHX"
            defaultMessage="Welcome"
            description="empty home page title"
          />
        </Text>
        <Box marginTop={4}>
          <Text>
            <FormattedMessage
              id="cxUBO1"
              defaultMessage="Install an app that registers a HOMEPAGE_WIDGETS extension to see it here."
              description="empty home page description"
            />
          </Text>
        </Box>
      </Box>
    );
  }

  const leftmostUrl = resolveLeftmostTabUrl(fullscreen, widgets);

  // Root path - redirect to leftmost tab
  if (!extensionId && !isWidgetsRoute) {
    return <Redirect to={leftmostUrl!} />;
  }

  // /home/widgets but no widget extensions - redirect away
  if (isWidgetsRoute && widgets.length === 0) {
    return <Redirect to={leftmostUrl!} />;
  }

  let activeTab: HomeActiveTab;

  if (isWidgetsRoute) {
    activeTab = { kind: "widgets" };
  } else {
    const activeExtension = fullscreen.find(extension => extension.id === extensionId);

    // URL points to a missing or unauthorized fullscreen extension - redirect to leftmost tab
    if (!activeExtension) {
      return <Redirect to={leftmostUrl!} />;
    }

    activeTab = { kind: "extension", id: activeExtension.id };
  }

  const userName = getUserName(user, true);
  const showWidgetsTab = widgets.length > 0;

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
        <HomeWidgetTabs
          fullscreenExtensions={fullscreen}
          showWidgetsTab={showWidgetsTab}
          activeTab={activeTab}
        />
      </Box>
      <Box padding={6} width="100%" __flex="1" __minHeight={0}>
        {activeTab.kind === "widgets" ? (
          <HomeWidgetsGrid extensions={widgets} />
        ) : (
          <HomeWidgetView
            extension={fullscreen.find(extension => extension.id === activeTab.id)!}
          />
        )}
      </Box>
    </Box>
  );
};
