import plusIcon from "@assets/images/plus-icon.svg";
import saleorLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import saleorLogoLightMode from "@assets/images/sidebar-default-logo.png";
import { AppAvatar } from "@dashboard/apps/components/AppAvatar/AppAvatar";
import { AppFetchMutation } from "@dashboard/graphql";
import { useTheme } from "@dashboard/theme";
import { Box, DefaultTheme, List, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";

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

        <Box
          as="span"
          aria-hidden="true"
          position="absolute"
          __top="50%"
          __height="2px"
          __transform="translateY(-50%)"
          __width="195px"
          backgroundColor="default3"
          __zIndex="-1"
        ></Box>
      </Box>

      <Box display="flex" flexDirection="column">
        <Text size={5} fontWeight="medium">
          <FormattedMessage {...messages.permissions} />
        </Text>
        <Text>
          <FormattedMessage {...messages.permissionsExplanation} />
        </Text>
        <ul>
          {manifest?.permissions?.map(permission => (
            <li key={permission.code}>{permission.name}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};
