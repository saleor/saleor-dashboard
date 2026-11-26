import { Callout } from "@dashboard/components/Callout/Callout";
import { Box, Checkbox, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { type ManifestAcknowledgement } from "../../../hooks/useManifestAcknowledgement";
import { manifestMessages } from "./messages";

export const ManifestTrustCallout = ({
  isOfficial,
  hosts,
  acknowledgement,
}: {
  isOfficial: boolean;
  hosts: string[];
  acknowledgement: ManifestAcknowledgement;
}) => {
  const intl = useIntl();

  if (isOfficial) {
    return (
      <Callout type="info" title={intl.formatMessage(manifestMessages.officialTitle)}>
        <FormattedMessage {...manifestMessages.officialDescription} />
      </Callout>
    );
  }

  return (
    <Callout
      type="warning"
      title={intl.formatMessage(manifestMessages.externalTitle)}
      data-test-id="install-external-warning"
    >
      <Box display="flex" flexDirection="column" gap={3}>
        <FormattedMessage {...manifestMessages.externalDescription} />
        <Checkbox
          checked={acknowledgement.acknowledged}
          onCheckedChange={checked => acknowledgement.setAcknowledged(checked === true)}
          data-test-id="install-external-acknowledgement"
        >
          <Text size={3} color="default1">
            <FormattedMessage
              {...manifestMessages.externalAcknowledgement}
              values={{ domains: intl.formatList(hosts, { type: "conjunction" }) }}
            />
          </Text>
        </Checkbox>
      </Box>
    </Callout>
  );
};
