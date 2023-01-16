import CardTitle from "@dashboard/components/CardTitle";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import Hr from "@dashboard/components/Hr";
import RadioSwitchField from "@dashboard/components/RadioSwitchField";
import useCurrentDate from "@dashboard/hooks/useCurrentDate";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { UserError } from "@dashboard/types";
import { getFieldError } from "@dashboard/utils/errors";
import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";

import FormSpacer from "../FormSpacer";
import DateVisibilitySelector from "./DateVisibilitySelector";
import { visibilityCardMessages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    checkbox: {
      alignItems: "flex-start",
      marginTop: 10,
    },
    children: {
      "& button": {
        margin: "0 9px",
      },
      "& label": {
        marginTop: theme.spacing(2.5),
      },
    },
    date: {
      "& svg": {
        fill: theme.palette.primary.main,
      },
      marginTop: theme.spacing(1),
    },
    label: {
      lineHeight: 1.2,
      marginBottom: 5,
      marginTop: 0,
    },
    listingLabel: {
      marginTop: 9,
    },
    secondLabel: {
      color: theme.palette.text.hint,
      fontSize: 12,
      marginBottom: theme.spacing(2),
    },
    switchField: {
      marginTop: theme.spacing(1),
    },
  }),
  { name: "VisibilityCard" },
);

interface Message {
  visibleLabel: string;
  hiddenLabel: string;
  visibleSecondLabel?: string;
  hiddenSecondLabel: string;
  availableLabel?: string;
  unavailableLabel?: string;
  availableSecondLabel?: string;
  setAvailabilityDateLabel?: string;
}

export interface DateFields {
  publicationDate: string;
  availableForPurchase?: string;
}

export interface VisibilityCardProps {
  children?: React.ReactNode | React.ReactNodeArray;
  data: DateFields & {
    isAvailableForPurchase?: boolean;
    isPublished: boolean;
    visibleInListings?: boolean;
  };
  errors: UserError[];
  disabled?: boolean;
  messages: Message;
  onChange: (event: ChangeEvent) => void;
}

export const VisibilityCard: React.FC<VisibilityCardProps> = props => {
  const {
    children,
    data: {
      availableForPurchase,
      isAvailableForPurchase: isAvailable,
      isPublished,
      publicationDate,
      visibleInListings,
    },
    errors,
    disabled,
    messages,
    onChange,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const dateNow = useCurrentDate();
  const hasAvailableProps =
    isAvailable !== undefined && availableForPurchase !== undefined;

  const visibleMessage = (date: string) =>
    intl.formatMessage(visibilityCardMessages.sinceDate, {
      date: localizeDate(date),
    });

  const handleRadioFieldChange = (type: keyof DateFields) => (
    e: ChangeEvent,
  ) => {
    const { value } = e.target;
    if (!value) {
      onChange({
        target: {
          name: type,
          value: null,
        },
      });
    }
    return onChange(e);
  };

  return (
    <Card>
      <CardTitle title={intl.formatMessage(visibilityCardMessages.title)} />
      <CardContent>
        <RadioSwitchField
          disabled={disabled}
          error={!!getFieldError(errors, "isPublished")}
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
          name={"isPublished" as keyof FormData}
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
          onChange={handleRadioFieldChange("publicationDate")}
        />
        {!isPublished && (
          <DateVisibilitySelector
            buttonText={intl.formatMessage(
              visibilityCardMessages.setPublicationDate,
            )}
            onInputClose={() =>
              onChange({ target: { name: "publicationDate", value: null } })
            }
          >
            <TextField
              error={!!getFieldError(errors, "publicationDate")}
              disabled={disabled}
              label={intl.formatMessage(visibilityCardMessages.publishOn)}
              name="publicationDate"
              type="date"
              fullWidth={true}
              helperText={getFieldError(errors, "publicationDate")?.message}
              value={publicationDate ? publicationDate : ""}
              onChange={onChange}
              className={classes.date}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DateVisibilitySelector>
        )}
        {getFieldError(errors, "isPublished") && (
          <>
            <FormSpacer />
            <Typography color="error">
              {getFieldError(errors, "isPublished")?.message}
            </Typography>
          </>
        )}
        {hasAvailableProps && (
          <>
            <Hr />
            <RadioSwitchField
              className={classes.switchField}
              disabled={disabled}
              error={!!getFieldError(errors, "isAvailableForPurchase")}
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
              name={"isAvailableForPurchase" as keyof FormData}
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
              onChange={handleRadioFieldChange("availableForPurchase")}
            />
            {!isAvailable && (
              <DateVisibilitySelector
                buttonText={messages.setAvailabilityDateLabel}
                onInputClose={() =>
                  onChange({
                    target: { name: "availableForPurchase", value: null },
                  })
                }
              >
                <TextField
                  error={!!getFieldError(errors, "startDate")}
                  disabled={disabled}
                  label={intl.formatMessage(
                    visibilityCardMessages.setAvailableOn,
                  )}
                  name="availableForPurchase"
                  type="date"
                  fullWidth={true}
                  helperText={getFieldError(errors, "startDate")?.message}
                  value={availableForPurchase ? availableForPurchase : ""}
                  onChange={onChange}
                  className={classes.date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </DateVisibilitySelector>
            )}
            {getFieldError(errors, "isAvailableForPurchase") && (
              <>
                <FormSpacer />
                <Typography color="error">
                  {getFieldError(errors, "isAvailableForPurchase")?.message}
                </Typography>
              </>
            )}
          </>
        )}
        {visibleInListings !== undefined && (
          <>
            <Hr />
            <ControlledCheckbox
              className={classes.checkbox}
              name="visibleInListings"
              checked={!visibleInListings}
              disabled={disabled}
              label={
                <>
                  <p className={clsx(classes.label, classes.listingLabel)}>
                    {intl.formatMessage(visibilityCardMessages.hideInListings)}
                  </p>

                  <span className={classes.secondLabel}>
                    {intl.formatMessage(
                      visibilityCardMessages.hideInListingsDescription,
                    )}
                  </span>
                </>
              }
              onChange={event =>
                onChange({
                  ...event,
                  target: {
                    ...event.target,
                    value: !event.target.value,
                  },
                })
              }
            />
          </>
        )}
        <div className={classes.children}>{children}</div>
      </CardContent>
    </Card>
  );
};
VisibilityCard.displayName = "VisibilityCard";
export default VisibilityCard;
