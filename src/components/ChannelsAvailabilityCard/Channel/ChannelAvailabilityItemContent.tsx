// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import { DateTimeTimezoneField } from "@dashboard/components/DateTimeTimezoneField";
import { StopPropagation } from "@dashboard/components/StopPropagation";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { Box, Checkbox, Divider, RadioGroup, Text } from "@saleor/macaw-ui-next";
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

const getFormData = (data: ChannelData): Partial<ChannelOpts> => {
  const {
    availableForPurchaseAt,
    isAvailableForPurchase,
    isPublished,
    publishedAt,
    visibleInListings,
  } = data;

  return Object.fromEntries(
    Object.entries({
      availableForPurchaseAt,
      isAvailableForPurchase,
      isPublished,
      publishedAt,
      visibleInListings,
    }).filter(([_, value]) => value !== undefined),
  );
};

export const ChannelAvailabilityItemContent: React.FC<ChannelContentProps> = ({
  data,
  disabled,
  errors,
  messages,
  onChange,
}) => {
  const {
    availableForPurchaseAt,
    isAvailableForPurchase: isAvailable,
    isPublished,
    publishedAt,
    visibleInListings,
    id,
  } = data;

  const formData = getFormData(data);

  const dateNow = useCurrentDate();
  const localizeDate = useDateLocalize();
  const [isPublishedAt, setPublishedAt] = useState(!!publishedAt);
  const [isAvailableDate, setAvailableDate] = useState(!!availableForPurchaseAt);
  const intl = useIntl();
  const visibleMessage = (date: string) =>
    intl.formatMessage(availabilityItemMessages.sinceDate, {
      date: localizeDate(date),
    });
  const formErrors = getFormErrors(
    ["availableForPurchaseAt", "publishedAt", "availableForPurchaseAt", "publishedAt"],
    errors,
  );

  return (
    <Box display="flex" gap={3} paddingTop={3} flexDirection="column">
      {/**
       * StopPropagation is used here to block onClick events from RadioGroup that cause throw error in datagrid
       * Datagrid listing for all on click event but RadioGroup emitted couple of events at once
       * Radix issue: https://github.com/radix-ui/primitives/issues/1982
       */}
      <StopPropagation>
        {/* Published/not published */}
        <RadioGroup
          value={String(isPublished)}
          onValueChange={value => {
            onChange(id, {
              ...formData,
              isPublished: value === "true",
              publishedAt,
            });
          }}
          disabled={disabled}
          display="flex"
          flexDirection="column"
        >
          <RadioGroup.Item id={`${id}-isPublished-true`} value="true" name="isPublished">
            <Text>{messages.visibleLabel}</Text>
          </RadioGroup.Item>
          {isPublished && publishedAt && Date.parse(publishedAt) < dateNow && (
            <Text size={2} color="default2">
              {messages.visibleSecondLabel || visibleMessage(publishedAt)}
            </Text>
          )}

          {/* Should be visible all the time, product can be published and this should show since when */}
          {isPublished && (
            <Box display="flex" flexDirection="column" alignItems="start" gap={1} marginTop={2}>
              <Checkbox
                onCheckedChange={(checked: boolean) => {
                  if (!checked) {
                    onChange(id, {
                      ...formData,
                      publishedAt: null,
                    });
                  }

                  setPublishedAt(checked);
                }}
                checked={isPublishedAt}
              >
                {intl.formatMessage(availabilityItemMessages.setPublicationDate)}
              </Checkbox>
              {isPublishedAt && (
                <DateTimeTimezoneField
                  error={!!formErrors.publishedAt}
                  helperText={
                    formErrors.publishedAt
                      ? getProductErrorMessage(formErrors.publishedAt, intl)
                      : ""
                  }
                  disabled={disabled}
                  name={`channel:publicationTime:${id}`}
                  value={publishedAt || ""}
                  onChange={dateTime => {
                    onChange(id, {
                      ...formData,
                      publishedAt: dateTime,
                    });
                  }}
                  fullWidth
                />
              )}
            </Box>
          )}

          <RadioGroup.Item
            id={`${id}-isPublished-false`}
            value="false"
            name="isPublished"
            marginTop={3}
          >
            <Text>{messages.hiddenLabel}</Text>
          </RadioGroup.Item>
          {publishedAt && !isPublished && Date.parse(publishedAt) >= dateNow && (
            <Text size={2} color="default2">
              {messages.hiddenSecondLabel}
            </Text>
          )}
        </RadioGroup>
      </StopPropagation>

      {/* Available/unavailable for purchase */}
      <Divider />
      <RadioGroup
        disabled={disabled}
        name={`channel:isAvailableForPurchase:${id}`}
        value={String(isAvailable)}
        onValueChange={value => {
          onChange(id, {
            ...formData,
            isAvailableForPurchase: value === "true",
          });
        }}
        display="flex"
        flexDirection="column"
      >
        <RadioGroup.Item id={`channel:isAvailableForPurchase:${id}-true`} value="true">
          <Text>{messages.availableLabel}</Text>
        </RadioGroup.Item>
        {isAvailable && availableForPurchaseAt && Date.parse(availableForPurchaseAt) < dateNow && (
          <Text size={2} color="default2">
            {visibleMessage(availableForPurchaseAt)}
          </Text>
        )}

        <RadioGroup.Item
          id={`channel:isAvailableForPurchase:${id}-false`}
          value="false"
          marginTop={3}
        >
          <Text>{messages.unavailableLabel}</Text>
        </RadioGroup.Item>
        {availableForPurchaseAt && !isAvailable && (
          <Text size={2} color="default2">
            {messages.availableSecondLabel}
          </Text>
        )}
      </RadioGroup>

      {/* Should be visible only when product is available for purchase */}
      {!isAvailable && (
        <Box display="flex" gap={1} flexDirection="column" alignItems="start">
          <Checkbox
            onCheckedChange={(checked: boolean) => {
              if (!checked) {
                onChange(id, {
                  ...formData,
                  availableForPurchaseAt: null,
                });
              }

              setAvailableDate(checked);
            }}
            checked={isAvailableDate}
          >
            {messages.setAvailabilityDateLabel}
          </Checkbox>
          {isAvailableDate && (
            <DateTimeTimezoneField
              error={!!formErrors.availableForPurchaseAt}
              disabled={disabled}
              name={`channel:availableForPurchaseAt:${id}`}
              value={availableForPurchaseAt || ""}
              onChange={dateTime => {
                onChange(id, {
                  ...formData,
                  availableForPurchaseAt: dateTime,
                });
              }}
              fullWidth
            />
          )}
        </Box>
      )}

      {/* Hide in product listings */}
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
        <Text cursor="pointer">{intl.formatMessage(availabilityItemMessages.hideInListings)}</Text>
      </Checkbox>
      <Text size={2} color="default2">
        {intl.formatMessage(availabilityItemMessages.hideInListingsDescription)}
      </Text>
    </Box>
  );
};
