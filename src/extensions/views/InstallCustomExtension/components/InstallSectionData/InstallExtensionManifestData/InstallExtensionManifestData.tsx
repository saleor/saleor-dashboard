import { Callout } from "@dashboard/components/Callout/Callout";
import { CountPill, countPillFromNumber } from "@dashboard/components/CountPill/CountPill";
import { DetailPageSectionLayout } from "@dashboard/components/DetailPageSectionLayout/DetailPageSectionLayout";
import {
  DetailSection,
  DetailSectionNav,
  type DetailSectionNavItem,
} from "@dashboard/components/DetailSectionNav/DetailSectionNav";
import { useDetailSectionScrollSpy } from "@dashboard/components/DetailSectionNav/useDetailSectionScrollSpy";
import { AppDeprecationNotice } from "@dashboard/extensions/components/AppDeprecation/AppDeprecation";
import { deprecationMessages } from "@dashboard/extensions/messages";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useMemo } from "react";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";
import { fromZodIssue } from "zod-validation-error";

import { type useInstallChecks } from "../../../hooks/useInstallChecks";
import { getManifestEndpoints, groupEndpointsByHost } from "../../../manifestEndpoints";
import { type Manifest } from "../../../types";
import { ManifestConnectionsCard } from "./ManifestConnectionsCard";
import { ManifestHeader } from "./ManifestHeader";
import { ManifestOverviewCard } from "./ManifestOverviewCard";
import { ManifestPermissionsCard } from "./ManifestPermissionsCard";
import { ManifestTrustCallout } from "./ManifestTrustCallout";
import { manifestMessages } from "./messages";

interface ManifestSection {
  id: string;
  title: MessageDescriptor;
  count?: number;
  content: ReactNode;
}

export const InstallExtensionManifestData = ({
  manifest,
  manifestUrl,
  checks,
}: {
  manifest: Manifest;
  manifestUrl: string;
  checks: Pick<
    ReturnType<typeof useInstallChecks>,
    "issues" | "isOfficial" | "deprecation" | "trust"
  >;
}) => {
  const intl = useIntl();
  const groups = useMemo(
    () => groupEndpointsByHost(getManifestEndpoints(manifestUrl, manifest)),
    [manifestUrl, manifest],
  );
  const permissions = manifest.permissions ?? [];

  const sections: ManifestSection[] = [
    {
      id: "install-manifest-overview",
      title: manifestMessages.overview,
      content: <ManifestOverviewCard manifest={manifest} manifestUrl={manifestUrl} />,
    },
    {
      id: "install-manifest-connections",
      title: manifestMessages.connections,
      count: groups.length,
      content: <ManifestConnectionsCard groups={groups} />,
    },
    {
      id: "install-manifest-permissions",
      title: manifestMessages.permissions,
      count: permissions.length,
      content: <ManifestPermissionsCard permissions={permissions} />,
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
    <Box display="flex" flexDirection="column" gap={2}>
      <ManifestHeader
        manifest={manifest}
        manifestHost={groups[0]?.host ?? manifestUrl}
        isOfficial={checks.isOfficial}
      />
      <DetailPageSectionLayout
        nav={
          <DetailSectionNav
            items={navItems}
            activeId={activeId}
            onSelect={selectSection}
            ariaLabel={intl.formatMessage(manifestMessages.navAriaLabel)}
            data-test-id="install-manifest-nav"
          />
        }
      >
        <ManifestTrustCallout
          isOfficial={checks.isOfficial}
          hosts={groups.map(group => group.host)}
          acknowledgement={checks.trust}
        />

        {manifest.deprecationReason && (
          <AppDeprecationNotice reason={manifest.deprecationReason}>
            <Checkbox
              marginTop={2}
              checked={checks.deprecation.acknowledged}
              onCheckedChange={checked => checks.deprecation.setAcknowledged(checked === true)}
              data-test-id="app-deprecation-acknowledgement"
            >
              <Text size={3}>
                <FormattedMessage {...deprecationMessages.installAcknowledgement} />
              </Text>
            </Checkbox>
          </AppDeprecationNotice>
        )}

        {checks.issues && (
          <Callout
            type="error"
            title={intl.formatMessage(manifestMessages.issuesTitle, {
              count: checks.issues.length,
            })}
            data-test-id="install-manifest-issues"
          >
            <Box as="ul" margin={0} paddingLeft={4}>
              {checks.issues.map((issue, index) => (
                <li key={index}>{fromZodIssue(issue).message}</li>
              ))}
            </Box>
          </Callout>
        )}

        {sections.map(section => (
          <DetailSection key={section.id} id={section.id}>
            {section.content}
          </DetailSection>
        ))}
      </DetailPageSectionLayout>
    </Box>
  );
};
