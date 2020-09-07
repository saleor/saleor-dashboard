import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import classNames from "classnames";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { DateContext } from "../Date/DateContext";
import FormSpacer from "../FormSpacer";

const useStyles = makeStyles(
  theme => ({
    checkbox: {
      alignItems: "flex-start",
      marginTop: 10
    },
    children: {
      "& button": {
        margin: "0 9px"
      },
      "& label": {
        marginTop: theme.spacing(2.5)
      }
    },
    date: {
      "& svg": {
        fill: theme.palette.primary.main
      },
      marginTop: theme.spacing(3)
    },
    label: {
      lineHeight: 1.2,
      marginBottom: 5,
      marginTop: 0
    },
    listingLabel: {
      marginTop: 9
    },
    secondLabel: {
      color: theme.palette.text.hint,
      fontSize: 12
    },
    setPublicationDate: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      fontSize: 14,
      paddingBottom: 10,
      paddingTop: 0
    }
  }),
  { name: "VisibilityCard" }
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
export interface VisibilityCardProps {
  children?: React.ReactNode | React.ReactNodeArray;
  data: {
    availableForPurchase?: string;
    isAvailableForPurchase?: boolean;
    isPublished: boolean;
    publicationDate: string;
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
      visibleInListings
    },
    errors,
    disabled,
    messages,
    onChange
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const dateNow = React.useContext(DateContext);
  const hasAvailableProps =
    isAvailable !== undefined && availableForPurchase !== undefined;

  const [isPublicationDate, setPublicationDate] = useState(
    publicationDate === null ? true : false
  );
  const [isAvailableDate, setAvailableDate] = useState(
    availableForPurchase === null ? true : false
  );

  const visibleMessage = (date: string) =>
    intl.formatMessage(
      {
        defaultMessage: "since {date}",
        description: "date"
      },
      {
        date: localizeDate(date, "L")
      }
    );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Visibility",
          description: "section header"
        })}
      />
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
          onChange={onChange}
        />
        {!isPublished && (
          <>
            <Typography
              className={classes.setPublicationDate}
              onClick={() => setPublicationDate(!isPublicationDate)}
            >
              {intl.formatMessage({
                defaultMessage: "Set publication date"
              })}
            </Typography>
            {isPublicationDate && (
              <TextField
                error={!!getFieldError(errors, "publicationDate")}
                disabled={disabled}
                label={intl.formatMessage({
                  defaultMessage: "Publish on",
                  description: "publish on date"
                })}
                name="publicationDate"
                type="date"
                fullWidth={true}
                helperText={getFieldError(errors, "publicationDate")?.message}
                value={publicationDate ? publicationDate : ""}
                onChange={onChange}
                className={classes.date}
                InputLabelProps={{
                  shrink: true
                }}
              />
            )}
          </>
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
              onChange={e => {
                const { value } = e.target;
                onChange({
                  target: {
                    name: "availableForPurchase",
                    value: value ? localizeDate(new Date().toString()) : null
                  }
                });
                return onChange(e);
              }}
            />
            {!isAvailable && (
              <>
                <Typography
                  className={classes.setPublicationDate}
                  onClick={() => setAvailableDate(!isAvailable)}
                >
                  {messages.setAvailabilityDateLabel}
                </Typography>
                {isAvailableDate && (
                  <TextField
                    error={!!getFieldError(errors, "startDate")}
                    disabled={disabled}
                    label={intl.formatMessage({
                      defaultMessage: "Set available on",
                      description: "available on date"
                    })}
                    name="availableForPurchase"
                    type="date"
                    fullWidth={true}
                    helperText={getFieldError(errors, "startDate")?.message}
                    value={availableForPurchase ? availableForPurchase : ""}
                    onChange={onChange}
                    className={classes.date}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              </>
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
              checked={visibleInListings}
              disabled={disabled}
              label={
                <>
                  <p
                    className={classNames(classes.label, classes.listingLabel)}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Show in product listings"
                    })}
                  </p>

                  <span className={classes.secondLabel}>
                    {intl.formatMessage({
                      defaultMessage:
                        "Disabling this checkbox will remove product from search and category pages. It will be available on collection pages."
                    })}
                  </span>
                </>
              }
              onChange={onChange}
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
