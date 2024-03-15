// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import { RadioGroup } from "@dashboard/components/RadioGroup";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import { Box, Checkbox, Divider, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { ChannelOpts, ChannelsAvailabilityError, Messages } from "../types";
import { availabilityItemMessages } from "./messages";

export interface ChannelContentProps {
  disabled?: boolean;
  data: ChannelData;
  errors: ChannelsAvailabilityError[];
  messages: Messages;
  onChange: (id: string, data: ChannelOpts) => void;
}

export const ChannelAvailabilityItemContent: React.FC<ChannelContentProps> = ({
  data,
  disabled,
  errors,
  messages,
  onChange,
}) => {
  const {
    availableForPurchase,
    isAvailableForPurchase: isAvailable,
    isPublished,
    publicationDate,
    visibleInListings,
    id,
  } = data;
  const formData = {
    ...(availableForPurchase !== undefined ? { availableForPurchase } : {}),
    ...(isAvailable !== undefined
      ? { isAvailableForPurchase: isAvailable }
      : {}),
    isPublished,
    publicationDate,
    ...(visibleInListings !== undefined ? { visibleInListings } : {}),
  };
  const dateNow = useCurrentDate();
  const localizeDate = useDateLocalize();
  const hasAvailableProps =
    isAvailable !== undefined && availableForPurchase !== undefined;
  const [isPublicationDate, setPublicationDate] = useState(
    publicationDate === null,
  );
  const [isAvailableDate, setAvailableDate] = useState(false);
  const intl = useIntl();

  const visibleMessage = (date: string) =>
    intl.formatMessage(availabilityItemMessages.sinceDate, {
      date: localizeDate(date),
    });
  const formErrors = getFormErrors(
    ["availableForPurchaseDate", "publicationDate"],
    errors,
  );

  return (
    <Box display="flex" gap={3} paddingTop={3} flexDirection="column">
      <RadioGroup
        value={String(isPublished)}
        onValueChange={value => {
          onChange(id, {
            ...formData,
            isPublished: value === "true",
            publicationDate: value === "false" ? null : publicationDate,
          });
        }}
        disabled={disabled}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <RadioGroup.Item
          id={`${id}-isPublished-true`}
          value="true"
          name="isPublished"
        >
          <Box display="flex" alignItems="baseline" gap={2}>
            <Text>{messages.visibleLabel}</Text>
            {isPublished &&
              publicationDate &&
              Date.parse(publicationDate) < dateNow && (
                <Text size={2} color="default2">
                  {messages.visibleSecondLabel ||
                    visibleMessage(publicationDate)}
                </Text>
              )}
          </Box>
        </RadioGroup.Item>
        <RadioGroup.Item
          id={`${id}-isPublished-false`}
          value="false"
          name="isPublished"
        >
          <Box display="flex" alignItems="baseline" gap={2}>
            <Text>{messages.hiddenLabel}</Text>
            {publicationDate &&
              !isPublished &&
              Date.parse(publicationDate) >= dateNow && (
                <Text size={2} color="default2">
                  {messages.hiddenSecondLabel}
                </Text>
              )}
          </Box>
        </RadioGroup.Item>
      </RadioGroup>
      {!isPublished && (
        <Box display="flex" flexDirection="column" alignItems="start" gap={1}>
          <Checkbox
            onCheckedChange={(checked: boolean) => setPublicationDate(checked)}
            checked={isPublicationDate}
          >
            {intl.formatMessage(availabilityItemMessages.setPublicationDate)}
          </Checkbox>
          {isPublicationDate && (
            <TextField
              error={!!formErrors.publicationDate}
              disabled={disabled}
              label={intl.formatMessage(availabilityItemMessages.publishOn)}
              name={`channel:publicationDate:${id}`}
              type="date"
              fullWidth={true}
              helperText={
                formErrors.publicationDate
                  ? getProductErrorMessage(formErrors.publicationDate, intl)
                  : ""
              }
              value={publicationDate || ""}
              onChange={e =>
                onChange(id, {
                  ...formData,
                  publicationDate: e.target.value || null,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        </Box>
      )}
      {hasAvailableProps && (
        <>
          <Divider />
          <RadioGroup
            disabled={disabled}
            name={`channel:isAvailableForPurchase:${id}`}
            value={String(isAvailable)}
            onValueChange={value =>
              onChange(id, {
                ...formData,
                availableForPurchase:
                  value === "false" ? null : availableForPurchase,
                isAvailableForPurchase: value === "true",
              })
            }
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <RadioGroup.Item
              id={`channel:isAvailableForPurchase:${id}-true`}
              value="true"
            >
              <Box display="flex" __alignItems="baseline" gap={2}>
                <Text>{messages.availableLabel}</Text>
                {isAvailable &&
                  availableForPurchase &&
                  Date.parse(availableForPurchase) < dateNow && (
                    <Text size={2} color="default2">
                      {visibleMessage(availableForPurchase)}
                    </Text>
                  )}
              </Box>
            </RadioGroup.Item>
            <RadioGroup.Item
              id={`channel:isAvailableForPurchase:${id}-false`}
              value="false"
            >
              <Box display="flex" __alignItems="baseline" gap={2}>
                <Text>{messages.unavailableLabel}</Text>
                {availableForPurchase && !isAvailable && (
                  <Text size={2} color="default2">
                    {messages.availableSecondLabel}
                  </Text>
                )}
              </Box>
            </RadioGroup.Item>
          </RadioGroup>
          {!isAvailable && (
            <Box
              display="flex"
              gap={1}
              flexDirection="column"
              alignItems="start"
            >
              <Checkbox
                onCheckedChange={(checked: boolean) =>
                  setAvailableDate(checked)
                }
                checked={isAvailableDate}
              >
                {messages.setAvailabilityDateLabel}
              </Checkbox>
              {isAvailableDate && (
                <TextField
                  error={!!formErrors.availableForPurchaseDate}
                  disabled={disabled}
                  label={intl.formatMessage(
                    availabilityItemMessages.setAvailableOn,
                  )}
                  name={`channel:availableForPurchase:${id}`}
                  type="date"
                  fullWidth={true}
                  helperText={
                    formErrors.availableForPurchaseDate
                      ? getProductErrorMessage(
                          formErrors.availableForPurchaseDate,
                          intl,
                        )
                      : ""
                  }
                  value={availableForPurchase || ""}
                  onChange={e =>
                    onChange(id, {
                      ...formData,
                      availableForPurchase: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            </Box>
          )}
        </>
      )}
      {visibleInListings !== undefined && (
        <>
          <Divider />
          <Checkbox
            name={`channel:visibleInListings:${id}`}
            id={`channel:visibleInListings:${id}`}
            checked={!visibleInListings}
            disabled={disabled}
            onCheckedChange={checked => {
              onChange(id, {
                ...formData,
                visibleInListings: !checked,
              });
            }}
          >
            <Text cursor="pointer">
              {intl.formatMessage(availabilityItemMessages.hideInListings)}
            </Text>
          </Checkbox>
          <Text size={2} color="default2">
            {intl.formatMessage(
              availabilityItemMessages.hideInListingsDescription,
            )}
          </Text>
        </>
      )}
    </Box>
  );
};
