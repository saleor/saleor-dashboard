import { ChannelFragment } from "@dashboard/graphql";
import { useChannelsSearch } from "@dashboard/hooks/useChannelsSearch";
import { FormChange } from "@dashboard/hooks/useForm";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import {
  Card,
  CardContent,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "../CardTitle/CardTitle";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType,
} from "../MultiAutocompleteSelectField";

interface ChannelPermissionProps {
  selectedChannels: string[];
  allChannels: ChannelFragment[];
  channelsDisplayValues: MultiAutocompleteChoiceType[];
  description?: string;
  hasRestrictedChannels: boolean;
  disabled: boolean;
  onChannelChange: FormChange;
  onHasRestrictedChannelsChange: () => void;
}

export const ChannelPermission = ({
  description,
  disabled,
  onHasRestrictedChannelsChange,
  onChannelChange,
  channelsDisplayValues,
  allChannels,
  selectedChannels,
  hasRestrictedChannels,
}: ChannelPermissionProps) => {
  const intl = useIntl();

  const { onQueryChange, filteredChannels } = useChannelsSearch(allChannels);

  return (
    <Card style={{ height: "100%", overflow: "hidden" }}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Channels permissions",
          id: "vz3yxp",
        })}
      ></CardTitle>
      <CardContent style={{ height: "100%" }}>
        {description && (
          <Text as="p" variant="body" size="small" marginBottom={5}>
            {description}
          </Text>
        )}

        <ListItem
          disabled={disabled}
          onClick={onHasRestrictedChannelsChange}
          dense
          button
          data-test-id="restrict-channels"
        >
          <ListItemIcon>
            <Checkbox
              color="secondary"
              edge="start"
              checked={hasRestrictedChannels}
              disabled={disabled}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": "restrictedChannels" }}
            />
          </ListItemIcon>
          <ListItemText
            primary={intl.formatMessage({
              defaultMessage: "Restrict access to channels",
              id: "ay73LS",
            })}
          />
        </ListItem>
        {hasRestrictedChannels && (
          <>
            <Box
              width="100%"
              borderBottomStyle="solid"
              borderBottomWidth={1}
              borderColor="neutralPlain"
              height={1}
              marginTop={9}
              marginBottom={9}
            />
            <Box
              __height="calc(100% - 145px)"
              overflowY="scroll"
              overflowX="hidden"
            >
              <MultiAutocompleteSelectField
                disabled={disabled}
                choices={mapNodeToChoice(filteredChannels)}
                displayValues={channelsDisplayValues}
                fetchChoices={onQueryChange}
                hasMore={false}
                label={intl.formatMessage({
                  defaultMessage: "Channels permissions",
                  id: "vz3yxp",
                })}
                loading={false}
                name="channels"
                onChange={onChannelChange}
                placeholder={intl.formatMessage({
                  defaultMessage: "Search channels",
                  id: "0HBlkO",
                })}
                value={selectedChannels}
                testId="channels"
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};
