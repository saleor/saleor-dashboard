import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import { FormSpacer } from "@saleor/components/FormSpacer";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { DateContext } from "../Date/DateContext";

const styles = (theme: Theme) =>
  createStyles({
    date: {
      "& svg": {
        fill: theme.palette.primary.main
      },
      marginTop: theme.spacing.unit * 4
    },
    expandedSwitchContainer: {
      marginBottom: 0
    },
    switchContainer: {
      marginBottom: -theme.spacing.unit
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
    onChange
  }: VisibilityCardProps) => {
    const intl = useIntl();
    const localizeDate = useDateLocalize();
    const dateNow = React.useContext(DateContext);
    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Visibility",
            description: "section header"
          })}
        />
        <CardContent>
          <div
            className={
              isPublished
                ? classes.expandedSwitchContainer
                : classes.switchContainer
            }
          >
            <ControlledSwitch
              name="isPublished"
              label={intl.formatMessage({
                defaultMessage: "Visible"
              })}
              uncheckedLabel={intl.formatMessage({
                defaultMessage: "Hidden"
              })}
              secondLabel={
                publicationDate
                  ? isPublished
                    ? intl.formatMessage(
                        {
                          defaultMessage: "since {date}"
                        },
                        {
                          date: localizeDate(publicationDate)
                        }
                      )
                    : Date.parse(publicationDate) > dateNow
                    ? intl.formatMessage(
                        {
                          defaultMessage: "will be visible from {date}"
                        },
                        {
                          date: localizeDate(publicationDate)
                        }
                      )
                    : null
                  : null
              }
              checked={isPublished}
              onChange={onChange}
              disabled={disabled}
            />
          </div>
          {!isPublished && (
            <>
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
