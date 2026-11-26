import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { Box, Button, Chip, Text } from "@saleor/macaw-ui-next";
import { Check, Copy, ExternalLink } from "lucide-react";
import { type ReactNode } from "react";
import { type MessageDescriptor, useIntl } from "react-intl";

import styles from "./AppDefinition.module.css";
import { type AppEndpoint, type AppEndpointGroup, type AppEndpointOf } from "./appEndpoints";
import { formatSubscriptionQuery } from "./formatSubscriptionQuery";
import { manifestMessages } from "./messages";

type UrlEndpoint = AppEndpointOf<"manifest" | "app" | "tokenTarget">;

const endpointLabels: Record<UrlEndpoint["kind"], MessageDescriptor> = {
  manifest: manifestMessages.endpointManifest,
  app: manifestMessages.endpointApp,
  tokenTarget: manifestMessages.endpointTokenTarget,
};

const ofKind =
  <Kind extends AppEndpoint["kind"]>(...kinds: Kind[]) =>
  (endpoint: AppEndpoint): endpoint is AppEndpointOf<Kind> =>
    (kinds as string[]).includes(endpoint.kind);

const CopyButton = ({
  label,
  getText,
  icon,
  testId,
}: {
  label: string;
  getText: () => string;
  icon: ReactNode;
  testId: string;
}) => {
  const [copied, copy] = useClipboard();

  return (
    <Button
      type="button"
      variant="tertiary"
      size="small"
      data-visible={copied}
      title={label}
      aria-label={label}
      onClick={() => copy(getText())}
      icon={
        copied ? <Check size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} /> : icon
      }
      data-test-id={testId}
    />
  );
};

/**
 * Every row ends with its actions and a button that copies its URL. They stay collapsed so
 * URLs sit flush right, and slide in on hover or focus. When any row in the card has an
 * extra action, the others reserve its space so all URLs line up while revealed.
 */
const Row = ({
  title,
  detail,
  url,
  actions,
  reserveActionSlot,
  testId,
}: {
  title: ReactNode;
  detail?: ReactNode;
  url: string;
  actions?: ReactNode;
  reserveActionSlot: boolean;
  testId?: string;
}) => {
  const intl = useIntl();

  return (
    <Box className={styles.row} data-test-id={testId}>
      <Box display="flex" flexDirection="column" __minWidth="0">
        <Text size={3}>{title}</Text>
        {detail && (
          <Text size={2} color="default2">
            {detail}
          </Text>
        )}
      </Box>
      <Box display="flex" alignItems="center" __minWidth="0">
        <Text size={2} color="default2" className={`${styles.rowEnd} ${styles.mono}`}>
          {url}
        </Text>
        <Box className={styles.rowActions}>
          {actions ||
            (reserveActionSlot && (
              <Box className={styles.reservedSlot} aria-hidden>
                <Button
                  variant="tertiary"
                  size="small"
                  tabIndex={-1}
                  icon={<Copy size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
                />
              </Box>
            ))}
          <CopyButton
            label={intl.formatMessage(manifestMessages.copyUrl)}
            getText={() => url}
            icon={<Copy size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
            testId="connection-copy-url"
          />
        </Box>
      </Box>
    </Box>
  );
};

const OpenLinkButton = ({ url }: { url: string }) => {
  const intl = useIntl();
  const label = intl.formatMessage(manifestMessages.openInNewTab);

  return (
    <Button
      as="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variant="tertiary"
      size="small"
      title={label}
      aria-label={label}
      icon={<ExternalLink size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
      data-test-id="connection-open-url"
    />
  );
};

/** The manifest and app URL can be opened; webhooks with a query can copy it. */
const hasExtraAction = (endpoint: AppEndpoint): boolean =>
  endpoint.kind === "manifest" ||
  endpoint.kind === "app" ||
  (endpoint.kind === "webhook" && !!endpoint.subscriptionQuery);

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

export const AppConnectionsCard = ({ groups }: { groups: AppEndpointGroup[] }) => {
  const intl = useIntl();
  // The manifest endpoint, when present, is listed first, so its host is the first group.
  const manifestHost = groups[0]?.host;
  const reserveActionSlot = groups.some(group => group.endpoints.some(hasExtraAction));

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
              reserveActionSlot={reserveActionSlot}
              key={endpoint.kind}
              title={intl.formatMessage(endpointLabels[endpoint.kind])}
              detail={
                endpoint.kind === "tokenTarget" &&
                intl.formatMessage(manifestMessages.endpointTokenTargetHint)
              }
              url={endpoint.url}
              actions={hasExtraAction(endpoint) && <OpenLinkButton url={endpoint.url} />}
            />
          ))}
          <SubTable title={manifestMessages.webhooks}>
            {group.endpoints.filter(ofKind("webhook")).map((webhook, index) => (
              <Row
                reserveActionSlot={reserveActionSlot}
                key={`webhook-${index}`}
                title={webhook.name}
                detail={<span className={styles.mono}>{webhook.events.join(", ")}</span>}
                url={webhook.url}
                actions={
                  webhook.subscriptionQuery && (
                    <CopyButton
                      label={intl.formatMessage(manifestMessages.copySubscription)}
                      getText={() => formatSubscriptionQuery(webhook.subscriptionQuery ?? "")}
                      icon={<GraphqlIcon />}
                      testId="connection-copy-subscription"
                    />
                  )
                }
                testId="install-webhook-row"
              />
            ))}
          </SubTable>
          <SubTable title={manifestMessages.extensions}>
            {group.endpoints.filter(ofKind("extension")).map((extension, index) => (
              <Row
                reserveActionSlot={reserveActionSlot}
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
