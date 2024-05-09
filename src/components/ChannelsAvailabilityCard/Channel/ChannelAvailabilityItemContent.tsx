// @ts-strict-ignore
import { ChannelData } from "@dashboard/channels/utils";
import { DateTimeTimezoneField } from "@dashboard/components/DateTimeTimezoneField";
import { RadioGroup } from "@dashboard/components/RadioGroup";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { Box, Checkbox, Divider, Input, Text } from "@saleor/macaw-ui-next";
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
    publishedAt,
    visibleInListings,
    id,
  } = data;
  const formData = {
    ...(availableForPurchase !== undefined ? { availableForPurchase } : {}),
    ...(isAvailable !== undefined ? { isAvailableForPurchase: isAvailable } : {}),
    isPublished,
    publishedAt,
    ...(visibleInListings !== undefined ? { visibleInListings } : {}),
  };
  const dateNow = useCurrentDate();
  const localizeDate = useDateLocalize();
  const hasAvailableProps = isAvailable !== undefined && availableForPurchase !== undefined;
  const [isPublishedAt, setPublishedAt] = useState(publishedAt === null);
  const [isAvailableDate, setAvailableDate] = useState(false);
  const intl = useIntl();
  const visibleMessage = (date: string) =>
    intl.formatMessage(availabilityItemMessages.sinceDate, {
      date: localizeDate(date),
    });
  const formErrors = getFormErrors(["availableForPurchaseDate", "publishedAt"], errors);

  return (
    <Box display="flex" gap={3} paddingTop={3} flexDirection="column">
      <RadioGroup
        value={String(isPublished)}
        onValueChange={value => {
          onChange(id, {
            ...formData,
            isPublished: value === "true",
            publishedAt: value === "false" ? null : publishedAt,
          });
        }}
        disabled={disabled}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <RadioGroup.Item id={`${id}-isPublished-true`} value="true" name="isPublished">
          <Box display="flex" alignItems="baseline" gap={2}>
            <Text>{messages.visibleLabel}</Text>
            {isPublished && publishedAt && Date.parse(publishedAt) < dateNow && (
              <Text size={2} color="default2">
                {messages.visibleSecondLabel || visibleMessage(publishedAt)}
              </Text>
            )}
          </Box>
        </RadioGroup.Item>
        <RadioGroup.Item id={`${id}-isPublished-false`} value="false" name="isPublished">
          <Box display="flex" alignItems="baseline" gap={2}>
            <Text>{messages.hiddenLabel}</Text>
            {publishedAt && !isPublished && Date.parse(publishedAt) >= dateNow && (
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
            onCheckedChange={(checked: boolean) => setPublishedAt(checked)}
            checked={isPublishedAt}
          >
            {intl.formatMessage(availabilityItemMessages.setPublicationDate)}
          </Checkbox>
          {isPublishedAt && (
            <Box display="flex" gap={4} width="100%">
              {/* <Input
                error={!!formErrors.publishedAt}
                disabled={disabled}
                label={intl.formatMessage(availabilityItemMessages.publishOn)}
                name={`channel:publishedAt:${id}`}
                type="date"
                helperText={
                  formErrors.publishedAt ? getProductErrorMessage(formErrors.publishedAt, intl) : ""
                }
                value={publishedAt || ""}
                onChange={e =>
                  onChange(id, {
                    ...formData,
                    publishedAt: e.target.value || null,
                  })
                }
                width="100%"
              />


              <Input
                error={!!formErrors.publishedAt}
                disabled={disabled}
                label={intl.formatMessage(availabilityItemMessages.publishOn)}
                name={`channel:publicationTime:${id}`}
                type="time"
                helperText={
                  formErrors.publishedAt ? getProductErrorMessage(formErrors.publishedAt, intl) : ""
                }
                value={publishedAt || ""}
                onChange={e => {
                  console.log(e.target.value);

                  const date = new Date(publishedAt);
                  const time = e.target.value.split(":");
                  date.setHours(parseInt(time[0], 10));
                  date.setMinutes(parseInt(time[1], 10));
                  onChange(id, {
                    ...formData,
                    publishedAt: date.toISOString(),
                  });
                }}
                width="100%"
              /> */}

              <DateTimeTimezoneField
                error={!!formErrors.publishedAt}
                disabled={disabled}
                // label={intl.formatMessage(availabilityItemMessages.publishOn)}
                name={`channel:publicationTime:${id}`}
                // helperText={
                //   formErrors.publishedAt ? getProductErrorMessage(formErrors.publishedAt, intl) : ""
                // }
                value={publishedAt || ""}
                onChange={dateTime =>
                  onChange(id, {
                    ...formData,
                    publishedAt: dateTime,
                  })
                }
              />
            </Box>
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
                availableForPurchase: value === "false" ? null : availableForPurchase,
                isAvailableForPurchase: value === "true",
              })
            }
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <RadioGroup.Item id={`channel:isAvailableForPurchase:${id}-true`} value="true">
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
            <RadioGroup.Item id={`channel:isAvailableForPurchase:${id}-false`} value="false">
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
            <Box display="flex" gap={1} flexDirection="column" alignItems="start">
              <Checkbox
                onCheckedChange={(checked: boolean) => setAvailableDate(checked)}
                checked={isAvailableDate}
              >
                {messages.setAvailabilityDateLabel}
              </Checkbox>
              {isAvailableDate && (
                <Input
                  error={!!formErrors.availableForPurchaseDate}
                  disabled={disabled}
                  label={intl.formatMessage(availabilityItemMessages.setAvailableOn)}
                  name={`channel:availableForPurchase:${id}`}
                  type="date"
                  width="100%"
                  helperText={
                    formErrors.availableForPurchaseDate
                      ? getProductErrorMessage(formErrors.availableForPurchaseDate, intl)
                      : ""
                  }
                  value={availableForPurchase || ""}
                  onChange={e =>
                    onChange(id, {
                      ...formData,
                      availableForPurchase: e.target.value,
                    })
                  }
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
            {intl.formatMessage(availabilityItemMessages.hideInListingsDescription)}
          </Text>
        </>
      )}
    </Box>
  );
};
