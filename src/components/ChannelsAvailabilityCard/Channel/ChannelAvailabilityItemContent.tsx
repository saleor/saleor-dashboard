import { TextField, Typography } from "@material-ui/core";
import { ChannelData } from "@saleor/channels/utils";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import classNames from "classnames";
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
    <div className={classes.container}>
      <RadioSwitchField
        classes={{
          radioLabel: classes.radioLabel,
        }}
        className={classes.radioField}
        disabled={disabled}
        firstOptionLabel={
          <>
            <p className={classes.label}>{messages.visibleLabel}</p>
            {isPublished &&
              publicationDate &&
              Date.parse(publicationDate) < dateNow && (
                <span className={classes.secondLabel}>
                  {messages.visibleSecondLabel ||
                    visibleMessage(publicationDate)}
                </span>
              )}
          </>
        }
        name="isPublished"
        secondOptionLabel={
          <>
            <p className={classes.label}>{messages.hiddenLabel}</p>
            {publicationDate &&
              !isPublished &&
              Date.parse(publicationDate) >= dateNow && (
                <span className={classes.secondLabel}>
                  {messages.hiddenSecondLabel}
                </span>
              )}
          </>
        }
        value={isPublished}
        onChange={() => {
          onChange(id, {
            ...formData,
            isPublished: !isPublished,
            publicationDate:
              !isPublished && !publicationDate ? todayDateUTC : publicationDate,
          });
        }}
      />
      {!isPublished && (
        <>
          <Typography
            className={classes.setPublicationDate}
            onClick={() => setPublicationDate(!isPublicationDate)}
          >
            {intl.formatMessage(availabilityItemMessages.setPublicationDate)}
          </Typography>
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
        </>
      )}
      {hasAvailableProps && (
        <>
          <Hr />
          <RadioSwitchField
            classes={{
              radioLabel: classes.radioLabel,
            }}
            className={classes.radioField}
            disabled={disabled}
            firstOptionLabel={
              <>
                <p className={classes.label}>{messages.availableLabel}</p>
                {isAvailable &&
                  availableForPurchase &&
                  Date.parse(availableForPurchase) < dateNow && (
                    <span className={classes.secondLabel}>
                      {visibleMessage(availableForPurchase)}
                    </span>
                  )}
              </>
            }
            name={`channel:isAvailableForPurchase:${id}`}
            secondOptionLabel={
              <>
                <p className={classes.label}>{messages.unavailableLabel}</p>
                {availableForPurchase && !isAvailable && (
                  <span className={classes.secondLabel}>
                    {messages.availableSecondLabel}
                  </span>
                )}
              </>
            }
            value={isAvailable}
            onChange={e => {
              const { value } = e.target;
              return onChange(id, {
                ...formData,
                availableForPurchase: !value ? null : availableForPurchase,
                isAvailableForPurchase: value,
              });
            }}
          />
          {!isAvailable && (
            <>
              <Typography
                className={classes.setPublicationDate}
                onClick={() => setAvailableDate(!isAvailableDate)}
              >
                {messages.setAvailabilityDateLabel}
              </Typography>
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
            </>
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
                <p className={classNames(classes.label, classes.listingLabel)}>
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
    </div>
  );
};
export default ChannelContent;
