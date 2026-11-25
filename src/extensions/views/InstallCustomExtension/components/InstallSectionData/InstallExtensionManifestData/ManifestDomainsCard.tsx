import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Box, Chip, Text } from "@saleor/macaw-ui-next";
import { type MessageDescriptor, useIntl } from "react-intl";

import {
  type ManifestEndpoint,
  type ManifestEndpointGroup,
  type ManifestEndpointKind,
} from "../../../manifestEndpoints";
import styles from "./InstallExtensionManifestData.module.css";
import { manifestMessages } from "./messages";

const endpointLabels: Record<Exclude<ManifestEndpointKind, "webhook">, MessageDescriptor> = {
  manifest: manifestMessages.endpointManifest,
  app: manifestMessages.endpointApp,
  tokenTarget: manifestMessages.endpointTokenTarget,
  extension: manifestMessages.endpointExtension,
};

type WebhookEndpoint = Extract<ManifestEndpoint, { kind: "webhook" }>;

const isWebhook = (endpoint: ManifestEndpoint): endpoint is WebhookEndpoint =>
  endpoint.kind === "webhook";

const UrlText = ({ url }: { url: string }) => (
  <Text size={2} color="default2" className={`${styles.rowEnd} ${styles.mono}`}>
    {url}
  </Text>
);

export const ManifestDomainsCard = ({ groups }: { groups: ManifestEndpointGroup[] }) => {
  const intl = useIntl();
  // The manifest endpoint is always listed first, so its host is the first group.
  const manifestHost = groups[0]?.host;

  return (
    <DetailSettingsCard
      title={intl.formatMessage(manifestMessages.domains)}
      subtitle={intl.formatMessage(manifestMessages.domainsSubtitle)}
      contentFlush
      data-test-id="install-manifest-domains"
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
          {group.endpoints.map((endpoint, index) =>
            isWebhook(endpoint) ? null : (
              <Box key={`${endpoint.kind}-${index}`} className={styles.row}>
                <Box display="flex" flexDirection="column">
                  <Text size={3}>{intl.formatMessage(endpointLabels[endpoint.kind])}</Text>
                  {endpoint.kind === "tokenTarget" && (
                    <Text size={2} color="default2">
                      {intl.formatMessage(manifestMessages.endpointTokenTargetHint)}
                    </Text>
                  )}
                </Box>
                <UrlText url={endpoint.url} />
              </Box>
            ),
          )}
          {group.endpoints.some(isWebhook) && (
            <Box className={styles.subHeader}>
              <Text size={2} fontWeight="medium" color="default2">
                {intl.formatMessage(manifestMessages.webhooks)}
              </Text>
            </Box>
          )}
          {group.endpoints.filter(isWebhook).map((webhook, index) => (
            <Box key={`webhook-${index}`} className={styles.row} data-test-id="install-webhook-row">
              <Box display="flex" flexDirection="column" __minWidth="0">
                <Text size={3}>{webhook.name}</Text>
                <Text size={2} color="default2" className={styles.mono}>
                  {webhook.events.join(", ")}
                </Text>
              </Box>
              <UrlText url={webhook.url} />
            </Box>
          ))}
        </Box>
      ))}
    </DetailSettingsCard>
  );
};
