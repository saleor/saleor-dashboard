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

type HomeExtensionsSplit = ReturnType<typeof filterHomeExtensions>;

const resolveLeftmostTabUrl = (
  fullscreen: HomeExtensionsSplit["fullscreen"],
  widgets: HomeExtensionsSplit["widgets"],
): string | null => {
  if (fullscreen.length > 0) {
    return homeWidgetUrl(fullscreen[0].id);
  }

  if (widgets.length > 0) {
    return homeWidgetsUrl();
  }

  return null;
};

const leftmostTab = (fullscreen: HomeExtensionsSplit["fullscreen"]): HomeActiveTab =>
  fullscreen.length > 0 ? { kind: "extension", id: fullscreen[0].id } : { kind: "widgets" };

/**
 * Canonicalize /home and stale widget URLs with <Redirect>, but keep rendering
 * HomeTabPanels for the destination tab. Returning <Redirect> alone unmounts
 * keep-alive iframes — the sidebar Home item always goes to /home.
 */
const resolveHomeTab = ({
  extensionId,
  isWidgetsRoute,
  fullscreen,
  widgets,
  leftmostUrl,
}: {
  extensionId: string | undefined;
  isWidgetsRoute: boolean;
  fullscreen: HomeExtensionsSplit["fullscreen"];
  widgets: HomeExtensionsSplit["widgets"];
  leftmostUrl: string;
}): { activeTab: HomeActiveTab; redirectTo: string | null } => {
  if (!extensionId && !isWidgetsRoute) {
    return { activeTab: leftmostTab(fullscreen), redirectTo: leftmostUrl };
  }

  if (isWidgetsRoute) {
    if (widgets.length === 0) {
      return { activeTab: leftmostTab(fullscreen), redirectTo: leftmostUrl };
    }

    return { activeTab: { kind: "widgets" }, redirectTo: null };
  }

  const match = fullscreen.find(extension => extension.id === extensionId);

  if (!match) {
    return { activeTab: leftmostTab(fullscreen), redirectTo: leftmostUrl };
  }

  return { activeTab: { kind: "extension", id: match.id }, redirectTo: null };
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

  if (!leftmostUrl) {
    return <HomeEmptyState />;
  }

  const { activeTab, redirectTo } = resolveHomeTab({
    extensionId,
    isWidgetsRoute,
    fullscreen,
    widgets,
    leftmostUrl,
  });

  return (
    <>
      {redirectTo ? <Redirect to={redirectTo} /> : null}
      <HomeTabPanels
        fullscreen={fullscreen}
        widgets={widgets}
        activeTab={activeTab}
        showWidgetsTab={widgets.length > 0}
      />
    </>
  );
};
