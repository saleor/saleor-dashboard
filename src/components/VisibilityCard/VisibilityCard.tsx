import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { DateContext } from "../Date/DateContext";
import FormSpacer from "../FormSpacer";

const useStyles = makeStyles(
  theme => ({
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
      lineHeight: 1,
      margin: 0
    },
    secondLabel: {
      fontSize: 12
    },
    setPublicationDate: {
      color: theme.palette.primary.main,
      cursor: "pointer",
      fontSize: 14,
      paddingBottom: 10,
      paddingTop: 5,
      textDecoration: "underline"
    }
  }),
  { name: "VisibilityCard" }
);

interface VisibilityCardProps {
  children?: React.ReactNode | React.ReactNodeArray;
  data: {
    availableForPurchase?: string;
    isAvailable?: boolean;
    isPublished: boolean;
    publicationDate: string;
  };
  errors: UserError[];
  disabled?: boolean;
  hiddenMessage?: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const VisibilityCard: React.FC<VisibilityCardProps> = props => {
  const {
    children,
    data: { availableForPurchase, isAvailable, isPublished, publicationDate },
    errors,
    disabled,
    hiddenMessage,
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
        date: localizeDate(date)
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
              <p className={classes.label}>
                {intl.formatMessage({
                  defaultMessage: "Published"
                })}
              </p>
              {isPublished && publicationDate && (
                <span className={classes.secondLabel}>
                  {visibleMessage(publicationDate)}
                </span>
              )}
            </>
          }
          name={"isPublished" as keyof FormData}
          secondOptionLabel={
            <>
              <p className={classes.label}>
                {intl.formatMessage({
                  defaultMessage: "Not published"
                })}
              </p>
              {publicationDate &&
                !isPublished &&
                Date.parse(publicationDate) > dateNow &&
                (hiddenMessage || (
                  <span className={classes.secondLabel}>
                    {intl.formatMessage(
                      {
                        defaultMessage: "will become published on {date}",
                        description: "publication date"
                      },
                      {
                        date: localizeDate(publicationDate)
                      }
                    )}
                  </span>
                ))}
            </>
          }
          value={isPublished}
          onChange={onChange}
        />
        {!isPublished && (
          <>
            {!isPublished && (
              <Typography
                className={classes.setPublicationDate}
                onClick={() => setPublicationDate(!isPublicationDate)}
              >
                {intl.formatMessage({
                  defaultMessage: "Set publication date"
                })}
              </Typography>
            )}
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
              error={!!getFieldError(errors, "isAvailable")}
              firstOptionLabel={
                <>
                  <p className={classes.label}>
                    {intl.formatMessage({
                      defaultMessage: "Available for purchase"
                    })}
                  </p>
                  {isAvailable && availableForPurchase && (
                    <span className={classes.secondLabel}>
                      {visibleMessage(availableForPurchase)}
                    </span>
                  )}
                </>
              }
              name={"isAvailable" as keyof FormData}
              secondOptionLabel={
                <>
                  <p className={classes.label}>
                    {intl.formatMessage({
                      defaultMessage: "Unavailable for purchase"
                    })}
                  </p>
                  {availableForPurchase &&
                    !isAvailable &&
                    Date.parse(availableForPurchase) > dateNow && (
                      <span className={classes.secondLabel}>
                        {intl.formatMessage(
                          {
                            defaultMessage: "will become available on {date}",
                            description: "product"
                          },
                          {
                            date: localizeDate(availableForPurchase)
                          }
                        )}
                      </span>
                    )}
                </>
              }
              value={isAvailable}
              onChange={onChange}
            />
            {!isAvailable && (
              <>
                <Typography
                  className={classes.setPublicationDate}
                  onClick={() => setAvailableDate(!isAvailable)}
                >
                  {intl.formatMessage({
                    defaultMessage: "Set availability date"
                  })}
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
            {getFieldError(errors, "isAvailable") && (
              <>
                <FormSpacer />
                <Typography color="error">
                  {getFieldError(errors, "isAvailable")?.message}
                </Typography>
              </>
            )}
          </>
        )}
        <div className={classes.children}>{children}</div>
      </CardContent>
    </Card>
  );
};
VisibilityCard.displayName = "VisibilityCard";
export default VisibilityCard;
