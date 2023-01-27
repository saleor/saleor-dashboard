import { useUser } from "@dashboard/auth";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import {
  Box,
  DarkModeIcon,
  Dropdown,
  List,
  MoreOptionsIcon,
  sprinkles,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export const UserControls = () => {
  const { user, logout } = useUser();

  return (
    <Dropdown>
      <Dropdown.Trigger>
        {/* TODO: migrate to proper button */}
        <Box
          cursor="pointer"
          display="flex"
          justifyContent="center"
          as="button"
          borderWidth={0}
          backgroundColor={{
            default: "interactiveNeutralHighlightDefault",
            active: "interactiveNeutralHighlightPressing",
            hover: "interactiveNeutralHighlightHovering",
            focus: "interactiveNeutralHighlightFocused",
          }}
        >
          <MoreOptionsIcon />
        </Box>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <List
          padding={3}
          borderRadius={3}
          boxShadow="overlay"
          backgroundColor="surfaceNeutralPlain"
        >
          <Dropdown.Item>
            <List.Item borderRadius={3}>
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
            <List.Item onClick={logout} {...listItemStyles}>
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
              {...listItemStyles}
            >
              <DarkModeIcon color="iconNeutralSubdued" />
              <Text>
                <FormattedMessage
                  id="2r4cTE"
                  defaultMessage="Enable Dark Mode"
                  description="button"
                />
              </Text>
            </List.Item>
          </Dropdown.Item>
        </List>
      </Dropdown.Content>
    </Dropdown>
  );
};

const listItemStyles = {
  paddingX: 3,
  paddingY: 4,
  borderRadius: 3,
} as const;
