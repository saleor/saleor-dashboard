import { ChannelData } from "@dashboard/channels/utils";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import Hr from "@dashboard/components/Hr";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { TextField } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui";
import { Box, Divider, RadioGroup, Text } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { useStyles } from "../styles";
import { ChannelOpts, ChannelsAvailabilityError, Messages } from "../types";
import { availabilityItemMessages } from "./messages";

export interface ChannelContentProps {
  disabled?: boolean;
  data: ChannelData;
  errors: ChannelsAvailabilityError[];
  messages: Messages;
  onChange: (id: string, data: ChannelOpts) => void;
}

const ChannelContent: React.FC<ChannelContentProps> = ({
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
  const classes = useStyles({});

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
    <Box display="flex" gap={5} flexDirection="column">
      <RadioGroup
        value={isPublished}
        onValueChange={value => {
          onChange(id, {
            ...formData,
            isPublished: value === "true",
            publicationDate:
              !isPublished && !publicationDate ? todayDateUTC : publicationDate,
          });
        }}
        disabled={disabled}
      >
        <RadioGroup.Item id={`${id}-isPublished-true`} value="true">
          <Box display="flex" __alignItems="baseline" gap={5}>
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
        <RadioGroup.Item id={`${id}-isPublished-false`} value="false">
          <Box display="flex" __alignItems="baseline" gap={5}>
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
        <Box>
          <Button
            onClick={() => setPublicationDate(!isPublicationDate)}
            type="button"
          >
            {intl.formatMessage(availabilityItemMessages.setPublicationDate)}
          </Button>
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
              className={classes.date}
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
            value={isAvailable}
            onValueChange={value =>
              onChange(id, {
                ...formData,
                availableForPurchase: !value ? null : availableForPurchase,
                isAvailableForPurchase: value === "true",
              })
            }
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
            <Box>
              <Button onClick={() => setAvailableDate(!isAvailableDate)}>
                {messages.setAvailabilityDateLabel}
              </Button>

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
                  className={classes.date}
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
          <Hr />
          <ControlledCheckbox
            className={classes.checkbox}
            name={`channel:visibleInListings:${id}`}
            checked={!visibleInListings}
            disabled={disabled}
            label={
              <>
                <p className={clsx(classes.label, classes.listingLabel)}>
                  {intl.formatMessage(availabilityItemMessages.hideInListings)}
                </p>
                <span className={classes.secondLabel}>
                  {intl.formatMessage(
                    availabilityItemMessages.hideInListingsDescription,
                  )}
                </span>
              </>
            }
            onChange={e =>
              onChange(id, {
                ...formData,
                visibleInListings: !e.target.value,
              })
            }
          />
        </>
      )}
    </Box>
  );
};
export default ChannelContent;
