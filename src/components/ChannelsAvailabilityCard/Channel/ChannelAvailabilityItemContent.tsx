import { ChannelData } from "@dashboard/channels/utils";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import {
  Box,
  Checkbox,
  Divider,
  RadioGroup,
  Text,
} from "@saleor/macaw-ui/next";
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

  const parsedDate = new Date(dateNow);
  const todayDateUTC = parsedDate.toISOString().slice(0, 10);

  const visibleMessage = (date: string) =>
    intl.formatMessage(availabilityItemMessages.sinceDate, {
      date: localizeDate(date),
    });
  const formErrors = getFormErrors(
    ["availableForPurchaseDate", "publicationDate"],
    errors,
  );

  return (
    <Box display="flex" gap={6} paddingTop={6} flexDirection="column">
      <RadioGroup
        value={String(isPublished)}
        onValueChange={value => {
          onChange(id, {
            ...formData,
            isPublished: value === "true",
            publicationDate:
              !isPublished && !publicationDate ? todayDateUTC : publicationDate,
          });
        }}
        disabled={disabled}
        display="flex"
        flexDirection="column"
        gap={6}
      >
        <RadioGroup.Item
          id={`${id}-isPublished-true`}
          value="true"
          name="isPublished"
        >
          <Box display="flex" alignItems="baseline" gap={5}>
            <Text>{messages.visibleLabel}</Text>
            {isPublished &&
              publicationDate &&
              Date.parse(publicationDate) < dateNow && (
                <Text variant="caption" color="textNeutralSubdued">
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
          <Box display="flex" alignItems="baseline" gap={5}>
            <Text>{messages.hiddenLabel}</Text>
            {publicationDate &&
              !isPublished &&
              Date.parse(publicationDate) >= dateNow && (
                <Text variant="caption" color="textNeutralSubdued">
                  {messages.hiddenSecondLabel}
                </Text>
              )}
          </Box>
        </RadioGroup.Item>
      </RadioGroup>
      {!isPublished && (
        <Box display="flex" flexDirection="column" alignItems="start" gap={3}>
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
                availableForPurchase: !value ? null : availableForPurchase,
                isAvailableForPurchase: value === "true",
              })
            }
            display="flex"
            flexDirection="column"
            gap={6}
          >
            <RadioGroup.Item
              id={`channel:isAvailableForPurchase:${id}-true`}
              value="true"
            >
              <Box display="flex" __alignItems="baseline" gap={5}>
                <Text>{messages.availableLabel}</Text>
                {isAvailable &&
                  availableForPurchase &&
                  Date.parse(availableForPurchase) < dateNow && (
                    <Text variant="caption" color="textNeutralSubdued">
                      {visibleMessage(availableForPurchase)}
                    </Text>
                  )}
              </Box>
            </RadioGroup.Item>
            <RadioGroup.Item
              id={`channel:isAvailableForPurchase:${id}-false`}
              value="false"
            >
              <Box display="flex" __alignItems="baseline" gap={5}>
                <Text>{messages.unavailableLabel}</Text>
                {availableForPurchase && !isAvailable && (
                  <Text variant="caption" color="textNeutralSubdued">
                    {messages.availableSecondLabel}
                  </Text>
                )}
              </Box>
            </RadioGroup.Item>
          </RadioGroup>
          {!isAvailable && (
            <Box
              display="flex"
              gap={3}
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
                  value={availableForPurchase ? availableForPurchase : ""}
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
          <Text variant="caption" color="textNeutralSubdued">
            {intl.formatMessage(
              availabilityItemMessages.hideInListingsDescription,
            )}
          </Text>
        </>
      )}
    </Box>
  );
};
