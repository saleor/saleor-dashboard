import { useUser } from "@dashboard/auth/useUser";
import { useExtensionsWithLoadingState } from "@dashboard/extensions/hooks/useExtensions";
import { Box } from "@saleor/macaw-ui-next";
import { useParams, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";

import { filterHomeExtensions } from "./filterHomeExtensions";
import { HomeEmptyState } from "./HomeEmptyState";
import { HomeTabPanels } from "./HomeTabPanels";
import { type HomeActiveTab } from "./HomeWidgetTabs";
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

  const { extensions: extensionsByMount, loading } = useExtensionsWithLoadingState(HOMEPAGE_MOUNT);
  const extensions = extensionsByMount.HOMEPAGE_WIDGETS;
  const { fullscreen, widgets } = filterHomeExtensions(extensions, userPermissions);

  if (loading) {
    // No live data yet and no non-empty snapshot: stay blank so the Pulse
    // empty state never appears as a loading placeholder.
    return <Box height="100%" data-test-id="home-extensions-loading" />;
  }

  if (fullscreen.length === 0 && widgets.length === 0) {
    return <HomeEmptyState />;
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
  let activeFullscreenExtension: (typeof fullscreen)[number] | undefined;

  if (isWidgetsRoute) {
    activeTab = { kind: "widgets" };
  } else {
    activeFullscreenExtension = fullscreen.find(extension => extension.id === extensionId);

    // URL points to a missing or unauthorized fullscreen extension - redirect to leftmost tab
    if (!activeFullscreenExtension) {
      return <Redirect to={leftmostUrl!} />;
    }

    activeTab = { kind: "extension", id: activeFullscreenExtension.id };
  }

  return (
    <HomeTabPanels
      fullscreen={fullscreen}
      widgets={widgets}
      activeTab={activeTab}
      showWidgetsTab={widgets.length > 0}
    />
  );
};
