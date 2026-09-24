import { useUser } from "@dashboard/auth/useUser";
import { navigationLucideIconProps } from "@dashboard/components/icons";
import { isProductAnalyticsEnabled } from "@dashboard/components/ProductAnalytics/config";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { useTheme } from "@dashboard/theme/hook";
import { useTheme as useLegacyTheme } from "@saleor/macaw-ui";
import { Box, Button, Dropdown, List, sprinkles, Text, Tooltip } from "@saleor/macaw-ui-next";
import { EllipsisVertical, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { rippleGlobalFeedback } from "../ripples/globalFeedback";
import { FeatureFlagsModal } from "./FeatureFlagsModal";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const useLegacyThemeHandler = () => {
  const { theme, setTheme } = useTheme();
  const { setTheme: setLegacyTheme } = useLegacyTheme();
  const changeTheme = () => {
    setLegacyTheme(theme === "defaultLight" ? "dark" : "light");
    setTheme(theme === "defaultLight" ? "defaultDark" : "defaultLight");
  };
  const handleStorage = (event: StorageEvent) => {
    if (!["macaw-ui-theme", "activeMacawUITheme"].includes(event.key || "")) {
      return;
    }

    const isDark = event.newValue?.toLowerCase().includes("dark");

    setLegacyTheme(isDark ? "dark" : "light");
    setTheme(isDark ? "defaultDark" : "defaultLight");
  };

  useEffect(() => {
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { changeTheme, theme };
};

const FeedbackButton = () => {
  const intl = useIntl();

  if (!isProductAnalyticsEnabled()) {
    return null;
  }

  return (
    <Box position="relative" display="inline-flex">
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            variant="tertiary"
            icon={<MessageSquareText {...navigationLucideIconProps} />}
            aria-label={intl.formatMessage({
              id: "41DrcD",
              defaultMessage: "Send feedback",
              description: "global Dashboard feedback button label",
            })}
            data-test-id="feedback-button"
            data-posthog-feedback-trigger="true"
            size="medium"
          />
        </Tooltip.Trigger>
        <Tooltip.Content side="top">
          <Tooltip.Arrow />
          <FormattedMessage
            id="41DrcD"
            defaultMessage="Send feedback"
            description="global Dashboard feedback button label"
          />
        </Tooltip.Content>
      </Tooltip>
      <Box position="absolute" __top="-4px" __right="-4px" __zIndex="1">
        <Ripple model={rippleGlobalFeedback} />
      </Box>
    </Box>
  );
};

export const UserControls = () => {
  const { user, logout } = useUser();
  const { changeTheme, theme } = useLegacyThemeHandler();
  const [open, setOpen] = useState(false);
  const [flagsModalOpen, setFlagsModalOpen] = useState(false);

  return (
    <>
      <Box display="flex" alignItems="center" gap={1}>
        <FeedbackButton />
        <Dropdown
          open={open}
          onOpenChange={value => {
            setOpen(value);
          }}
        >
          <Dropdown.Trigger>
            <Button
              variant="tertiary"
              icon={<EllipsisVertical {...navigationLucideIconProps} />}
              data-test-id="userMenu"
              size="medium"
              onClick={() => setOpen(true)}
            />
          </Dropdown.Trigger>
          <Dropdown.Content align="end">
            <Box __minWidth={192}>
              <List
                padding={2}
                borderRadius={4}
                boxShadow="defaultOverlay"
                backgroundColor="default1"
              >
                <Dropdown.Item>
                  <List.Item
                    borderRadius={4}
                    data-test-id="account-settings-button"
                    onClick={() => setOpen(false)}
                  >
                    <Link
                      to={staffMemberDetailsUrl(user?.id || "")}
                      className={sprinkles({
                        display: "block",
                        width: "100%",
                        ...listItemStyles,
                      })}
                    >
                      <Text>
                        <FormattedMessage id="NQgbYA" defaultMessage="Account Settings" />
                      </Text>
                    </Link>
                  </List.Item>
                </Dropdown.Item>
                <Dropdown.Item>
                  <List.Item {...listItemStyles} onClick={() => setFlagsModalOpen(true)}>
                    <Text>
                      <FormattedMessage
                        id="38dc43"
                        defaultMessage="Features preview"
                        description="Features preview"
                      />
                    </Text>
                  </List.Item>
                </Dropdown.Item>
                <Dropdown.Item>
                  <List.Item onClick={logout} {...listItemStyles} data-test-id="log-out-button">
                    <Text>
                      <FormattedMessage id="qLbse5" defaultMessage="Log out" description="button" />
                    </Text>
                  </List.Item>
                </Dropdown.Item>
                <Dropdown.Item>
                  <List.Item
                    display="flex"
                    alignItems="center"
                    __lineHeight={0}
                    gap={1.5}
                    marginTop={1}
                    onClick={() => {
                      changeTheme();
                      setOpen(false);
                    }}
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
      </Box>
      <FeatureFlagsModal open={flagsModalOpen} onChange={setFlagsModalOpen} />
    </>
  );
};

const listItemStyles = {
  paddingX: 1.5,
  paddingY: 2,
  borderRadius: 4,
} as const;
