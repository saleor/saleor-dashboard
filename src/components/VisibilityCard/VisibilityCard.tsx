import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
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
      fontSize: "14px",
      paddingTop: "15px",
      textDecoration: "underline"
    }
  }),
  { name: "VisibilityCard" }
);

interface VisibilityCardProps {
  children?: React.ReactNode | React.ReactNodeArray;
  data: {
    isPublished: boolean;
    publicationDate: string;
  };
  errors: UserError[];
  disabled?: boolean;
  hiddenMessage: string;
  onChange: (event: React.ChangeEvent<any>) => void;
  visibleMessage: string;
}

export const VisibilityCard: React.FC<VisibilityCardProps> = props => {
  const {
    children,
    data: { isPublished, publicationDate },
    errors,
    disabled,
    hiddenMessage,
    onChange,
    visibleMessage
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();
  const [isPublicationDate, setPublicationDate] = React.useState(
    publicationDate === null ? true : false
  );
  const dateNow = React.useContext(DateContext);
  const visibleSecondLabel = publicationDate
    ? isPublished
      ? visibleMessage
      : null
    : null;
  const hiddenSecondLabel = publicationDate
    ? isPublished
      ? null
      : Date.parse(publicationDate) > dateNow
      ? hiddenMessage
      : null
    : null;

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
                  defaultMessage: "Visible"
                })}
              </p>
              <span className={classes.secondLabel}>{visibleSecondLabel}</span>
            </>
          }
          name={"isPublished" as keyof FormData}
          secondOptionLabel={
            <>
              <p className={classes.label}>
                {intl.formatMessage({
                  defaultMessage: "Hidden"
                })}
              </p>
              <span className={classes.secondLabel}>{hiddenSecondLabel}</span>
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
        <div className={classes.children}>{children}</div>
      </CardContent>
    </Card>
  );
};
VisibilityCard.displayName = "VisibilityCard";
export default VisibilityCard;
