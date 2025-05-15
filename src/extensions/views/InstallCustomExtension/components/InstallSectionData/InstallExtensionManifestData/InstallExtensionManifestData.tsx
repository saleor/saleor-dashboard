import { DashboardCard } from "@dashboard/components/Card";
import { ExternalLinkUnstyled } from "@dashboard/extensions/components/ExternalLinkUnstyled";
import { messages } from "@dashboard/extensions/messages";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { InstallDetailsManifestData } from "../../../types";
import { IconsSection } from "./IconsSection";

export const InstallExtensionManifestData = ({
  manifest,
}: {
  manifest: InstallDetailsManifestData;
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={6} alignItems="flex-start">
      <Text size={5} fontWeight="medium">
        <FormattedMessage
          {...messages.installExtensionNameHeader}
          values={{
            extensionName: manifest?.name || "",
          }}
        />
      </Text>

      <IconsSection appLogo={manifest?.brand?.logo.default} />

      <Box display="flex" flexDirection="column" gap={4}>
        <Text size={5} fontWeight="medium">
          <FormattedMessage {...messages.permissions} />
        </Text>
        <div>
          <Text>
            <FormattedMessage {...messages.permissionsExplanation} />
          </Text>
          <Box as="ul" listStyleType="disc" paddingLeft={4} fontSize={3}>
            {manifest?.permissions?.map(permission => (
              <li key={permission.code}>{permission.name}</li>
            ))}
          </Box>
        </div>

        <DashboardCard withBorder gap={1} __width="fit-content">
          <DashboardCard.Title display="flex" gap={2} alignItems="center">
            <ExclamationIcon />
            <FormattedMessage {...messages.infoCardTitle} />
          </DashboardCard.Title>
          <DashboardCard.Content fontSize={3} paddingRight={0}>
            <FormattedMessage
              {...messages.infoCardText}
              values={{
                extensionName: manifest.name ?? "this extension",
                learnMoreLink: manifest.dataPrivacyUrl ? (
                  <ExternalLinkUnstyled href={manifest.dataPrivacyUrl} target="_blank">
                    <FormattedMessage {...messages.infoCardLearnMoreLink} />
                  </ExternalLinkUnstyled>
                ) : null,
              }}
            />
          </DashboardCard.Content>
        </DashboardCard>
      </Box>
    </Box>
  );
};
