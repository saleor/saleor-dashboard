import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import { DateContext } from "../Date/DateContext";

const styles = (theme: Theme) =>
  createStyles({
    children: {
      "& button": {
        margin: "0 9px"
      },
      "& label": {
        marginTop: `${theme.spacing.unit * 2.5}px`
      }
    },
    date: {
      "& svg": {
        fill: theme.palette.primary.main
      },
      marginTop: theme.spacing.unit * 3
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
  });

interface VisibilityCardProps extends WithStyles<typeof styles> {
  children?: React.ReactNode | React.ReactNodeArray;
  data: {
    isPublished: boolean;
    publicationDate: string;
  };
  errors: { [key: string]: string };
  disabled?: boolean;
  hiddenMessage: string;
  onChange: (event: React.ChangeEvent<any>) => void;
  visibleMessage: string;
}

export const VisibilityCard = withStyles(styles, {
  name: "VisibilityCard"
})(
  ({
    children,
    classes,
    data: { isPublished, publicationDate },
    errors,
    disabled,
    hiddenMessage,
    onChange,
    visibleMessage
  }: VisibilityCardProps) => {
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
            firstOptionLabel={
              <>
                <p className={classes.label}>
                  {intl.formatMessage({
                    defaultMessage: "Visible"
                  })}
                </p>
                <span className={classes.secondLabel}>
                  {visibleSecondLabel}
                </span>
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
                  error={!!errors.publicationDate}
                  disabled={disabled}
                  label={intl.formatMessage({
                    defaultMessage: "Publish on",
                    description: "publish on date"
                  })}
                  name="publicationDate"
                  type="date"
                  fullWidth={true}
                  helperText={errors.publicationDate}
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
          <div className={classes.children}>{children}</div>
        </CardContent>
      </Card>
    );
  }
);
VisibilityCard.displayName = "VisibilityCard";
export default VisibilityCard;
