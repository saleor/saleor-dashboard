import sideBarDefaultLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { useLegacyThemeHandler } from "@dashboard/components/Sidebar/user/Controls";
import { Avatar, Box, Dropdown, List, Text } from "@saleor/macaw-ui/next";
import React from "react";

const commonListStyles = {
  paddingX: 1.5,
  paddingY: 2,
  borderRadius: 4,
  gap: 2,
} as const;

const hardcodedData = [
  {
    link: "https://automation-dashboard.staging.saleor.cloud/dashboard?saleorPluginId=cloud_auth.CloudAuthorizationPlugin",
    initials: "AU",
    // based on info.json
    type: "sandbox",
    color: "decorative2",
    name: "Automation",
  },
  {
    link: "https://v315.staging.saleor.cloud/dashboard?saleorPluginId=cloud_auth.CloudAuthorizationPlugin",
    initials: "3.5",
    type: "sandbox",
    color: "decorative2",
    name: "v3.5",
  },
  {
    link: "https://master.staging.saleor.cloud/dashboard?saleorPluginId=cloud_auth.CloudAuthorizationPlugin",
    initials: "MA",
    type: "production",
    color: "decorative1",
    name: "Master",
  },
] as const;

export const MountingPoint = () => {
  const { theme } = useLegacyThemeHandler();
  const logo =
    theme === "defaultLight" ? sideBarDefaultLogo : sideBarDefaultLogoDarkMode;

  return (
    <Box display="flex" gap={3} alignItems="center" paddingX={4} paddingY={5}>
      <Dropdown>
        <Dropdown.Trigger>
          <Box cursor="pointer">
            <Avatar.Store src={logo} scheme="decorative2" size="small" />
          </Box>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Box>
            <List
              padding={2}
              borderRadius={4}
              boxShadow="overlay"
              backgroundColor="surfaceNeutralPlain"
            >
              {hardcodedData.map((item, idx) => (
                <Dropdown.Item key={`hardcoded-url-${idx}`}>
                  <List.Item {...commonListStyles}>
                    <Box
                      as="a"
                      href={item.link}
                      display="flex"
                      gap={3}
                      alignItems="center"
                    >
                      <Avatar.Store
                        initials={item.initials}
                        size="small"
                        scheme={item.color}
                      />
                      <Box display="flex" flexDirection="column">
                        <Text>{item.name}</Text>
                        <Text
                          variant="caption"
                          size="small"
                          textTransform="uppercase"
                          color="textNeutralSubdued"
                        >
                          {item.type}
                        </Text>
                      </Box>
                    </Box>
                  </List.Item>
                </Dropdown.Item>
              ))}
              {/* <Dropdown.Item>
                <List.Item {...commonListStyles}>
                  <Box
                    as="a"
                    href="https://automation-dashboard.staging.saleor.cloud/dashboard?saleorPluginId=cloud_auth.CloudAuthorizationPlugin"
                    display="flex"
                    gap={3}
                  >
                    <Avatar.Store
                      initials="AU"
                      size="small"
                      scheme="decorative1"
                    />
                    <Text>Automation</Text>
                  </Box>
                </List.Item>
              </Dropdown.Item>
              <Dropdown.Item>
                <List.Item {...commonListStyles}>
                  <Box
                    as="a"
                    display="flex"
                    gap={3}
                    href="https://master.staging.saleor.cloud/dashboard?saleorPluginId=cloud_auth.CloudAuthorizationPlugin"
                  >
                    <Avatar.Store
                      initials="MA"
                      size="small"
                      scheme="decorative2"
                    />
                    <Text>Master</Text>
                  </Box>
                </List.Item>
              </Dropdown.Item> */}
              <Dropdown.Item>
                <List.Item {...commonListStyles}>
                  <Avatar.Store
                    initials="CL"
                    size="small"
                    scheme="decorative3"
                  />
                  <Text
                    as="a"
                    href="https://staging-cloud.saleor.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cloud
                  </Text>
                </List.Item>
              </Dropdown.Item>
            </List>
          </Box>
        </Dropdown.Content>
      </Dropdown>
      <Text variant="bodyStrong" size="small">
        Saleor Dashboard
      </Text>
    </Box>
  );
};
