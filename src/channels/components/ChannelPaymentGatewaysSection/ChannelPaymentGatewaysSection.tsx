import { type ChannelPaymentApp } from "@dashboard/channels/hooks/useChannelPaymentApps";
import { resolvePaymentAppConfigureUrl } from "@dashboard/channels/utils/resolvePaymentAppConfigureUrl";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ArrowRight, Package } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./ChannelPaymentGatewaysSection.module.css";
import { messages } from "./messages";

interface ChannelPaymentGatewaysSectionProps {
  apps: ChannelPaymentApp[];
  loading?: boolean;
  hasMoreApps?: boolean;
}

export const ChannelPaymentGatewaysSection = ({
  apps,
  loading = false,
  hasMoreApps = false,
}: ChannelPaymentGatewaysSectionProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <DetailSettingsCard
      data-test-id="channel-payment-gateways"
      title={intl.formatMessage(messages.title)}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage {...messages.subtitle} />
        </Text>
      }
      contentFlush
    >
      {loading ? (
        <Box className={styles.emptyContent} display="flex" flexDirection="column" gap={3}>
          <Skeleton __height="3.5rem" />
          <Skeleton __height="3.5rem" />
        </Box>
      ) : apps.length === 0 ? (
        <Box className={styles.emptyContent} display="flex" flexDirection="column" gap={3}>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.emptyDescription} />
          </Text>
          <Box>
            <Button
              variant="secondary"
              type="button"
              data-test-id="payment-gateways-explore"
              onClick={() => navigate(ExtensionsUrls.resolveExploreExtensionsUrl())}
            >
              <FormattedMessage {...messages.exploreExtensions} />
              <ArrowRight size={iconSize.small} strokeWidth={iconStrokeWidth} />
            </Button>
          </Box>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" className={styles.list}>
          {apps.map(app => (
            <Box
              key={app.id}
              className={styles.row}
              display="flex"
              alignItems="center"
              gap={3}
              data-test-id="payment-gateway-row"
            >
              <Box className={styles.logo} flexShrink="0" aria-hidden>
                {app.logoUrl ? (
                  <Box as="img" src={app.logoUrl} alt="" display="block" maxWidth="100%" />
                ) : (
                  <Package size={iconSize.medium} strokeWidth={iconStrokeWidth} />
                )}
              </Box>
              <Box flexGrow="1" __minWidth="0">
                <Text size={3} fontWeight="medium">
                  {app.name}
                </Text>
              </Box>
              <Button
                variant="secondary"
                size="small"
                type="button"
                data-test-id={`payment-gateway-configure-${app.id}`}
                onClick={() => navigate(resolvePaymentAppConfigureUrl(app))}
              >
                <FormattedMessage {...messages.configure} />
              </Button>
            </Box>
          ))}
          {hasMoreApps ? (
            <Text size={2} color="default2" className={styles.truncatedNotice}>
              <FormattedMessage {...messages.truncatedList} />
            </Text>
          ) : null}
        </Box>
      )}
    </DetailSettingsCard>
  );
};
