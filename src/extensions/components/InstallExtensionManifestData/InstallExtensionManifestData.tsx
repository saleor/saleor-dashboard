import plusIcon from "@assets/images/plus-icon.svg";
import saleorLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import saleorLogoLightMode from "@assets/images/sidebar-default-logo.png";
import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { DashboardCard } from "@dashboard/components/Card";
import { AppFetchMutation } from "@dashboard/graphql";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { DATA_PRIVACY_URL } from "@dashboard/links";
import { useTheme } from "@dashboard/theme";
import { Box, DefaultTheme, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";
import { ExternalLinkUnstyled } from "../ExternalLinkUnstyled";

const getSaleorLogoUrl = (theme: DefaultTheme) => {
  switch (theme) {
    case "defaultLight":
      return saleorLogoLightMode;
    case "defaultDark":
      return saleorLogoDarkMode;
    default:
      throw new Error("Invalid theme mode, should not happen.");
  }
};

export const InstallExtensionManifestData = ({
  manifest,
}: {
  manifest: NonNullable<AppFetchMutation["appFetchManifest"]>["manifest"];
}) => {
  const { theme } = useTheme();
  const name = manifest?.name || "";

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Text size={5} fontWeight="medium">
        <FormattedMessage
          {...messages.installExtensionNameHeader}
          values={{
            extensionName: name,
          }}
        />
      </Text>
      <Box
        display="flex"
        justifyContent="space-between"
        padding={2}
        position="relative"
        __width="30rem"
      >
        <Box
          width={12}
          height={12}
          display="flex"
          placeItems="center"
          borderRadius={2}
          overflow="hidden"
        >
          <img src={getSaleorLogoUrl(theme)} alt="" />
        </Box>
        <img src={plusIcon} alt="" />

        <AppAvatar
          size={12}
          logo={
            manifest?.brand?.logo.default
              ? {
                  source: manifest?.brand?.logo.default,
                }
              : undefined
          }
        />

        {/* This is a line between Saleor - Plus icon - App logo */}
        <Box
          as="span"
          aria-hidden="true"
          position="absolute"
          __top="50%"
          __height="2px"
          __transform="translateY(-50%)"
          __width="195px"
          __zIndex="-1"
          __backgroundColor="hsla(0, 0%, 92%, 1)"
        ></Box>
      </Box>

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
                learnMoreLink: (
                  <ExternalLinkUnstyled href={DATA_PRIVACY_URL} target="_blank">
                    <FormattedMessage {...messages.infoCardLearnMoreLink} />
                  </ExternalLinkUnstyled>
                ),
              }}
            />
          </DashboardCard.Content>
        </DashboardCard>
      </Box>
    </Box>
  );
};
