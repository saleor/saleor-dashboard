import { CountPill, countPillFromNumber } from "@dashboard/components/CountPill/CountPill";
import { DetailPageSectionLayout } from "@dashboard/components/DetailPageSectionLayout/DetailPageSectionLayout";
import {
  DetailSection,
  DetailSectionNav,
  type DetailSectionNavItem,
} from "@dashboard/components/DetailSectionNav/DetailSectionNav";
import { useDetailSectionScrollSpy } from "@dashboard/components/DetailSectionNav/useDetailSectionScrollSpy";
import { AppConnectionsCard } from "@dashboard/extensions/components/AppDefinition/AppConnectionsCard";
import {
  getAppEndpoints,
  groupEndpointsByHost,
  installedAppDefinition,
} from "@dashboard/extensions/components/AppDefinition/appEndpoints";
import {
  AppOverviewCard,
  MonoText,
  OverviewField,
} from "@dashboard/extensions/components/AppDefinition/AppOverviewCard";
import { manifestMessages } from "@dashboard/extensions/components/AppDefinition/messages";
import { AppDeprecationNotice } from "@dashboard/extensions/components/AppDeprecation/AppDeprecation";
import { type AppQuery } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode, useMemo } from "react";
import { type MessageDescriptor, useIntl } from "react-intl";

import messages from "./messages";
import { PermissionsCard } from "./PermissionsCard";

interface Section {
  id: string;
  title: MessageDescriptor;
  count?: number;
  content: ReactNode;
}

/** What is installed, in the install page's layout. Never shows manifest values. */
export const InstalledAppDetails = ({ app }: { app: NonNullable<AppQuery["app"]> }) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const groups = useMemo(
    () => groupEndpointsByHost(getAppEndpoints(app.manifestUrl, installedAppDefinition(app))),
    [app],
  );
  const permissions = app.permissions ?? [];

  const sections: Section[] = [
    {
      id: "installed-app-overview",
      title: manifestMessages.overview,
      content: (
        <AppOverviewCard
          about={app.aboutApp}
          homepageUrl={app.homepageUrl}
          supportUrl={app.supportUrl}
          dataPrivacyUrl={app.dataPrivacyUrl}
        >
          {app.version && (
            <OverviewField label={intl.formatMessage(messages.version)}>
              <MonoText text={app.version} />
            </OverviewField>
          )}
          {app.created && (
            <OverviewField label={intl.formatMessage(messages.installed)}>
              <MonoText text={localizeDate(app.created)} />
            </OverviewField>
          )}
        </AppOverviewCard>
      ),
    },
    ...(groups.length > 0
      ? [
          {
            id: "installed-app-connections",
            title: manifestMessages.connections,
            count: groups.length,
            content: <AppConnectionsCard groups={groups} />,
          },
        ]
      : []),
    {
      id: "installed-app-permissions",
      title: manifestMessages.permissions,
      count: permissions.length,
      content: <PermissionsCard appId={app.id} permissions={permissions} />,
    },
  ];

  const { activeId, selectSection } = useDetailSectionScrollSpy({
    sectionIds: sections.map(section => section.id),
  });
  const navItems: DetailSectionNavItem[] = sections.map(section => ({
    id: section.id,
    label: (
      <Box as="span" display="inline-flex" alignItems="center" gap={2}>
        {intl.formatMessage(section.title)}
        <CountPill count={countPillFromNumber(section.count ?? 0)} />
      </Box>
    ),
  }));

  return (
    <DetailPageSectionLayout
      nav={
        <DetailSectionNav
          items={navItems}
          activeId={activeId}
          onSelect={selectSection}
          ariaLabel={intl.formatMessage(messages.navAriaLabel)}
          data-test-id="installed-app-nav"
        />
      }
    >
      {app.deprecationReason && <AppDeprecationNotice reason={app.deprecationReason} />}

      {sections.map(section => (
        <DetailSection key={section.id} id={section.id}>
          {section.content}
        </DetailSection>
      ))}
    </DetailPageSectionLayout>
  );
};
