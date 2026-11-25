import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Box, Chip, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { type MessageDescriptor, useIntl } from "react-intl";

import { type ManifestEndpoint, type ManifestEndpointGroup } from "../../../manifestEndpoints";
import styles from "./InstallExtensionManifestData.module.css";
import { manifestMessages } from "./messages";

type EndpointOf<Kind extends ManifestEndpoint["kind"]> = Extract<ManifestEndpoint, { kind: Kind }>;
type UrlEndpoint = EndpointOf<"manifest" | "app" | "tokenTarget">;

const endpointLabels: Record<UrlEndpoint["kind"], MessageDescriptor> = {
  manifest: manifestMessages.endpointManifest,
  app: manifestMessages.endpointApp,
  tokenTarget: manifestMessages.endpointTokenTarget,
};

const ofKind =
  <Kind extends ManifestEndpoint["kind"]>(...kinds: Kind[]) =>
  (endpoint: ManifestEndpoint): endpoint is EndpointOf<Kind> =>
    (kinds as string[]).includes(endpoint.kind);

const Row = ({
  title,
  detail,
  url,
  testId,
}: {
  title: ReactNode;
  detail?: ReactNode;
  url: string;
  testId?: string;
}) => (
  <Box className={styles.row} data-test-id={testId}>
    <Box display="flex" flexDirection="column" __minWidth="0">
      <Text size={3}>{title}</Text>
      {detail && (
        <Text size={2} color="default2">
          {detail}
        </Text>
      )}
    </Box>
    <Text size={2} color="default2" className={`${styles.rowEnd} ${styles.mono}`}>
      {url}
    </Text>
  </Box>
);

const SubTable = ({ title, children }: { title: MessageDescriptor; children: ReactNode[] }) => {
  const intl = useIntl();

  if (children.length === 0) {
    return null;
  }

  return (
    <>
      <Box className={styles.subHeader}>
        <Text size={2} fontWeight="medium" color="default2">
          {intl.formatMessage(title)}
        </Text>
      </Box>
      {children}
    </>
  );
};

export const ManifestConnectionsCard = ({ groups }: { groups: ManifestEndpointGroup[] }) => {
  const intl = useIntl();
  // The manifest endpoint is always listed first, so its host is the first group.
  const manifestHost = groups[0]?.host;

  return (
    <DetailSettingsCard
      title={intl.formatMessage(manifestMessages.connections)}
      subtitle={intl.formatMessage(manifestMessages.connectionsSubtitle)}
      contentFlush
      data-test-id="install-manifest-connections"
    >
      {groups.map(group => (
        <Box key={group.host} className={styles.group}>
          {/* The manifest host is already in the page header; only other hosts get a header row. */}
          {group.host !== manifestHost && (
            <Box className={styles.groupHeader}>
              <Text size={2} fontWeight="medium" className={styles.mono}>
                {group.host}
              </Text>
              <Chip
                backgroundColor="critical1"
                borderColor="critical1"
                color="critical1"
                data-test-id="install-different-domain"
              >
                {intl.formatMessage(manifestMessages.differentDomain)}
              </Chip>
            </Box>
          )}
          {group.endpoints.filter(ofKind("manifest", "app", "tokenTarget")).map(endpoint => (
            <Row
              key={endpoint.kind}
              title={intl.formatMessage(endpointLabels[endpoint.kind])}
              detail={
                endpoint.kind === "tokenTarget" &&
                intl.formatMessage(manifestMessages.endpointTokenTargetHint)
              }
              url={endpoint.url}
            />
          ))}
          <SubTable title={manifestMessages.webhooks}>
            {group.endpoints.filter(ofKind("webhook")).map((webhook, index) => (
              <Row
                key={`webhook-${index}`}
                title={webhook.name}
                detail={<span className={styles.mono}>{webhook.events.join(", ")}</span>}
                url={webhook.url}
                testId="install-webhook-row"
              />
            ))}
          </SubTable>
          <SubTable title={manifestMessages.extensions}>
            {group.endpoints.filter(ofKind("extension")).map((extension, index) => (
              <Row
                key={`extension-${index}`}
                title={extension.label}
                detail={
                  <>
                    <span className={styles.mono}>
                      {extension.mountName} · {extension.targetName}
                    </span>
                    {extension.permissions.length > 0 && ` · ${extension.permissions.join(", ")}`}
                  </>
                }
                url={extension.url}
                testId="install-extension-row"
              />
            ))}
          </SubTable>
        </Box>
      ))}
    </DetailSettingsCard>
  );
};
