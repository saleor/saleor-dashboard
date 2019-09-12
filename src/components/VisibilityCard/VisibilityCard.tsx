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
import { FormSpacer } from "@saleor/components/FormSpacer";
import RadioGroupField from "@saleor/components/RadioGroupField";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { DateContext } from "../Date/DateContext";

const styles = (theme: Theme) =>
  createStyles({
    date: {
      "& svg": {
        fill: theme.palette.primary.main
      },
      marginTop: theme.spacing.unit * 3
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
  onChange(event: any);
  translate: string;
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
    onChange,
    translate
  }: VisibilityCardProps) => {
    const intl = useIntl();
    const [isPublicationDate, setPublicationDate] = React.useState(
      publicationDate === null ? true : false
    );
    const localizeDate = useDateLocalize();
    const dateNow = React.useContext(DateContext);
    const isPublishedRadio =
      typeof isPublished !== "boolean"
        ? isPublished
        : isPublished
        ? "true"
        : "false";
    const visibleSecondLabel = publicationDate
      ? isPublished
        ? intl.formatMessage(
            {
              defaultMessage: "since {date}"
            },
            {
              date: localizeDate(publicationDate),
              description: translate
            }
          )
        : null
      : null;
    const hiddenSecondLabel = publicationDate
      ? isPublished
        ? null
        : Date.parse(publicationDate) > dateNow
        ? intl.formatMessage(
            {
              defaultMessage: "will be visible from {date}"
            },
            {
              date: localizeDate(publicationDate),
              description: translate
            }
          )
        : null
      : null;

    const visiblilityPickerChoices = [
      {
        label: intl.formatMessage({
          defaultMessage: "Visible"
        }),
        secondLabel: visibleSecondLabel,
        value: "true"
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Hidden"
        }),
        secondLabel: hiddenSecondLabel,
        value: "false"
      }
    ];
    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Visibility",
            description: "section header"
          })}
        />
        <CardContent>
          <RadioGroupField
            choices={visiblilityPickerChoices}
            disabled={disabled}
            name={"isPublished" as keyof FormData}
            value={isPublishedRadio}
            onChange={onChange}
          />
          {isPublishedRadio === "false" && (
            <>
              {!isPublicationDate && (
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
          <FormSpacer />
          {children}
        </CardContent>
      </Card>
    );
  }
);
VisibilityCard.displayName = "VisibilityCard";
export default VisibilityCard;
