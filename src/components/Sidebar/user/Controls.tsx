import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { useUser } from "@dashboard/auth/useUser";
import {
  iconSize,
  iconStrokeWidthBySize,
  navigationLucideIconProps,
} from "@dashboard/components/icons";
import { UserAvatar } from "@dashboard/components/UserAvatar/UserAvatar";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { useTheme } from "@dashboard/theme/hook";
import { useTheme as useLegacyTheme } from "@saleor/macaw-ui";
import { Box, Button, Dropdown, List, sprinkles, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CloudIcon, EllipsisVertical, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { useEnvLink } from "../menu/hooks/useEnvLink";
import { RailItem } from "../menu/RailItem";
import { rippleGlobalFeedback } from "../ripples/globalFeedback";
import { sidebarCollapseMessages } from "../sidebarCollapseMessages";
import { SidebarIconSlot } from "../SidebarIconSlot";
import styles from "./Controls.module.css";
import { FeatureFlagsModal } from "./FeatureFlagsModal";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useFeedbackSurvey } from "./useFeedbackSurvey";

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

const goToSaleorCloudMessage = defineMessage({
  id: "EXqb2l",
  defaultMessage: "Go to Saleor Cloud",
});

const feedbackMessage = defineMessage({
  id: "41DrcD",
  defaultMessage: "Send feedback",
  description: "global Dashboard feedback button label",
});

export const FeedbackButton = ({ variant = "button" }: { variant?: "button" | "rail" }) => {
  const intl = useIntl();

  const { isAvailable } = useFeedbackSurvey();

  if (variant === "rail") {
    return (
      <RailItem
        label={intl.formatMessage(feedbackMessage)}
        icon={
          <SidebarIconSlot>
            <MessageSquareText {...navigationLucideIconProps} />
          </SidebarIconSlot>
        }
        adornment={isAvailable && <Ripple model={rippleGlobalFeedback} />}
        hidden={!isAvailable}
      >
        {content => (
          // Same selector contract as the full button: PostHog binds to whichever is mounted.
          <button type="button" data-test-id="feedback-button" data-posthog-feedback-trigger="true">
            {content}
          </button>
        )}
      </RailItem>
    );
  }

  return (
    // PostHog can require this selector to exist before the survey matches.
    // Keep the trigger mounted while hiding it until the survey is ready.
    <Box hidden={!isAvailable} position="relative" display={isAvailable ? "inline-flex" : "none"}>
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            variant="tertiary"
            icon={<MessageSquareText {...navigationLucideIconProps} />}
            aria-label={intl.formatMessage(feedbackMessage)}
            data-test-id="feedback-button"
            data-posthog-feedback-trigger="true"
            size="medium"
          />
        </Tooltip.Trigger>
        <Tooltip.Content side="top">
          <Tooltip.Arrow />
          <FormattedMessage {...feedbackMessage} />
        </Tooltip.Content>
      </Tooltip>
      {isAvailable && (
        <Box position="absolute" __top="-4px" __right="-4px" __zIndex="1">
          <Ripple model={rippleGlobalFeedback} />
        </Box>
      )}
    </Box>
  );
};

/**
 * `collapsed` is the icon rail: the avatar opens the menu, which then also shows who is signed
 * in, since the rail has no room for the name.
 */
export const UserControls = ({ collapsed = false }: { collapsed?: boolean }) => {
  const intl = useIntl();
  const { user, logout } = useUser();
  const { changeTheme, theme } = useLegacyThemeHandler();
  const { isAuthenticatedViaCloud } = useCloud();
  const envLink = useEnvLink();
  const [open, setOpen] = useState(false);
  const [flagsModalOpen, setFlagsModalOpen] = useState(false);

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} flexShrink="0">
        {!collapsed && <FeedbackButton />}
        <Dropdown
          open={open}
          onOpenChange={value => {
            setOpen(value);
          }}
        >
          <Dropdown.Trigger>
            {collapsed ? (
              <button
                type="button"
                className={styles.avatarTrigger}
                data-test-id="userMenu"
                aria-label={intl.formatMessage(sidebarCollapseMessages.accountMenu)}
              >
                {user && <UserAvatar initials={getUserInitials(user)} url={user.avatar?.url} />}
              </button>
            ) : (
              <Button
                variant="tertiary"
                icon={<EllipsisVertical {...navigationLucideIconProps} />}
                data-test-id="userMenu"
                size="medium"
                onClick={() => setOpen(true)}
              />
            )}
          </Dropdown.Trigger>
          <Dropdown.Content align="end" side={collapsed ? "right" : undefined}>
            <Box __minWidth={192} className={collapsed ? styles.railMenu : undefined}>
              <List
                padding={2}
                borderRadius={4}
                boxShadow="defaultOverlay"
                backgroundColor="default1"
              >
                {collapsed && user && (
                  <Box
                    paddingX={1.5}
                    paddingTop={1.5}
                    paddingBottom={2}
                    marginBottom={1}
                    borderBottomWidth={1}
                    borderBottomStyle="solid"
                    borderColor="default1"
                    display="grid"
                    __maxWidth={240}
                  >
                    <Text size={3} fontWeight="medium" className="ellipsis">
                      {getUserName(user, true)}
                    </Text>
                    <Text size={2} color="default2" className="ellipsis">
                      {user.email}
                    </Text>
                  </Box>
                )}
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
                {isAuthenticatedViaCloud && (
                  <Dropdown.Item>
                    <List.Item
                      as="a"
                      href={envLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-test-id="cloud-environment-link"
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      {...listItemStyles}
                    >
                      <CloudIcon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                      <Text>{intl.formatMessage(goToSaleorCloudMessage)}</Text>
                    </List.Item>
                  </Dropdown.Item>
                )}
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
