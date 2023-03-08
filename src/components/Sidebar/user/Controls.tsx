import { useUser } from "@dashboard/auth";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { useTheme } from "@dashboard/theme";
import { useTheme as useLegacyTheme } from "@saleor/macaw-ui";
import {
  Box,
  Button,
  Dropdown,
  List,
  MoreOptionsIcon,
  sprinkles,
  Text,
} from "@saleor/macaw-ui/next";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { ThemeSwitcher } from "./ThemeSwitcher";

const useLegacyThemeHandler = () => {
  const { theme, setTheme } = useTheme();
  const { setTheme: setLegacyTheme } = useLegacyTheme();

  const changeTheme = () => {
    setLegacyTheme(theme === "defaultLight" ? "dark" : "light");
    setTheme(theme === "defaultLight" ? "defaultDark" : "defaultLight");
  };

  const handleStorage = (event: StorageEvent) => {
    if (!["macaw-ui-theme", "activeMacawUITheme"].includes(event.key)) {
      return;
    }

    const isDark = event.newValue.toLowerCase().includes("dark");
    setLegacyTheme(isDark ? "dark" : "light");
    setTheme(isDark ? "defaultDark" : "defaultLight");
  };

  useEffect(() => {
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { changeTheme, theme };
};

export const UserControls = () => {
  const { user, logout } = useUser();
  const { changeTheme, theme } = useLegacyThemeHandler();

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button
          variant="tertiary"
          icon={<MoreOptionsIcon />}
          data-test-id="userMenu"
          size="medium"
        />
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Box __minWidth={192}>
          <List
            padding={5}
            borderRadius={4}
            boxShadow="overlay"
            backgroundColor="surfaceNeutralPlain"
          >
            <Dropdown.Item>
              <List.Item
                borderRadius={4}
                data-test-id="account-settings-button"
              >
                <Link
                  to={staffMemberDetailsUrl(user?.id)}
                  className={sprinkles({
                    display: "block",
                    width: "100%",
                    ...listItemStyles,
                  })}
                >
                  <Text>
                    <FormattedMessage
                      id="NQgbYA"
                      defaultMessage="Account Settings"
                    />
                  </Text>
                </Link>
              </List.Item>
            </Dropdown.Item>
            <Dropdown.Item>
              <List.Item
                onClick={logout}
                {...listItemStyles}
                data-test-id="log-out-button"
              >
                <Text>
                  <FormattedMessage
                    id="qLbse5"
                    defaultMessage="Log out"
                    description="button"
                  />
                </Text>
              </List.Item>
            </Dropdown.Item>
            <Dropdown.Item>
              <List.Item
                display="flex"
                alignItems="center"
                gap={5}
                marginTop={3}
                onClick={changeTheme}
                {...listItemStyles}
                data-test-id="theme-switch"
              >
                <ThemeSwitcher theme={theme} />
              </List.Item>
            </Dropdown.Item>
          </List>
        </Box>
      </Dropdown.Content>
    </Dropdown>
  );
};

const listItemStyles = {
  paddingX: 4,
  paddingY: 5,
  borderRadius: 4,
} as const;
