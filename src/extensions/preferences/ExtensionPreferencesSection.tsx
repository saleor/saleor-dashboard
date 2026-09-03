import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { iconSize, iconStrokeWidth, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Link } from "@dashboard/components/Link";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { useExtensionsWithLoadingState } from "@dashboard/extensions/hooks/useExtensions";
import { type Extension } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ArrowRight, ChevronRight, Package } from "lucide-react";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { PREFERENCE_ENABLED_MOUNTS } from "./constants";
import styles from "./ExtensionPreferencesSection.module.css";
import { ExtensionPreferenceStateControl } from "./ExtensionPreferenceStateControl";
import { groupExtensionsByApp } from "./groupExtensionsByApp";
import { extensionPreferencesMessages as m } from "./messages";
import { useExtensionPreferences } from "./useExtensionPreferences";
import { getWidgetLocationHref, isWidgetMount, widgetMountMessages } from "./widgetMountLabel";
import { isWidgetShown } from "./widgetPreferenceState";

export const ExtensionPreferencesSection = (): React.ReactNode => {
  const intl = useIntl();
  const navigate = useNavigator();
  const userPermissions = useUserPermissions();
  const { extensions: extensionsByMount, loading } =
    useExtensionsWithLoadingState(PREFERENCE_ENABLED_MOUNTS);
  const { getState, setState, isSaving } = useExtensionPreferences();
  const emptyIcon = <Package size={iconSize.small} strokeWidth={iconStrokeWidth} />;

  const groups = useMemo(() => {
    const all: Extension[] = Object.values(extensionsByMount).flat();
    const visible = all.filter(extension =>
      hasPermissions(userPermissions ?? [], extension.permissions),
    );

    return groupExtensionsByApp(visible);
  }, [extensionsByMount, userPermissions]);

  return (
    <DetailSettingsCard
      data-test-id="extension-preferences"
      title={intl.formatMessage(m.sectionTitle)}
      intro={
        <Text size={3} color="default2">
          {intl.formatMessage(m.sectionSubtitle)}
        </Text>
      }
      contentFlush
    >
      {loading ? (
        <Box
          className={styles.emptyContent}
          display="flex"
          flexDirection="column"
          gap={3}
          aria-busy="true"
          data-test-id="extension-preferences-loading"
        >
          <Skeleton __height="3.5rem" />
          <Skeleton __height="3.5rem" />
        </Box>
      ) : groups.length === 0 ? (
        <Box className={styles.emptyState} data-test-id="extension-preferences-empty">
          <Box className={styles.emptyLeading}>
            <Box className={styles.emptyIcon} aria-hidden>
              {emptyIcon}
            </Box>
            <Box className={styles.emptyCopy}>
              <Text size={3} fontWeight="medium">
                {intl.formatMessage(m.emptyTitle)}
              </Text>
              <Text size={2} color="default2">
                {intl.formatMessage(m.emptyDescription)}
              </Text>
            </Box>
          </Box>
          <Box className={styles.emptyAction}>
            <Button
              variant="secondary"
              type="button"
              data-test-id="extension-preferences-explore"
              onClick={() => navigate(ExtensionsUrls.resolveExploreExtensionsUrl())}
            >
              {intl.formatMessage(m.exploreExtensions)}
              <ArrowRight size={iconSize.small} strokeWidth={iconStrokeWidth} />
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {groups.map(group => {
            const appName = group.app.name ?? group.app.id;
            const logo = group.app.brand?.logo.default;
            const appHref = ExtensionsUrls.resolveViewManifestExtensionUrl(group.app.id);

            return (
              <Box
                key={group.app.id}
                className={styles.group}
                data-test-id="extension-preference-app"
              >
                <Box className={styles.header}>
                  <Link
                    href={appHref}
                    color="secondary"
                    underline={false}
                    inline={false}
                    className={styles.appLink}
                    data-test-id="extension-preference-app-link"
                  >
                    <Box className={styles.appAvatar} aria-hidden>
                      {logo ? (
                        <Box as="img" src={logo} alt="" className={styles.appAvatarImage} />
                      ) : (
                        <Package size={12} strokeWidth={iconStrokeWidth} />
                      )}
                    </Box>
                    <Text size={3} fontWeight="medium" as="span" className={styles.appName}>
                      {appName}
                    </Text>
                  </Link>
                </Box>
                <Box className={styles.widgets}>
                  {group.extensions.map(extension => {
                    const state = getState(extension);
                    const location = isWidgetMount(extension.mountName)
                      ? intl.formatMessage(widgetMountMessages[extension.mountName])
                      : extension.mountName;
                    const locationHref = getWidgetLocationHref(extension.mountName);

                    return (
                      <Box
                        key={extension.id}
                        className={styles.row}
                        data-test-id="extension-preference-row"
                      >
                        <Box className={styles.identity}>
                          {locationHref ? (
                            <Text size={3} color="default2" className={styles.location}>
                              <MicrocopyLink to={locationHref}>{location}</MicrocopyLink>
                            </Text>
                          ) : (
                            <Text size={3} color="default2" className={styles.location}>
                              {location}
                            </Text>
                          )}
                          <ChevronRight
                            size={iconSize.small}
                            strokeWidth={iconStrokeWidthBySize.small}
                            aria-hidden
                            className={styles.chevron}
                          />
                          <Text
                            size={3}
                            color={isWidgetShown(state) ? "default1" : "default2"}
                            className={styles.widgetName}
                          >
                            {extension.label}
                          </Text>
                        </Box>
                        <ExtensionPreferenceStateControl
                          value={state}
                          disabled={isSaving}
                          onChange={next => setState(extension, next)}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </DetailSettingsCard>
  );
};
