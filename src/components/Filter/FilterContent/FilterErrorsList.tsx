import { Typography } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import InlineAlert from "@saleor/components/Alert/InlineAlert";
import errorTracker from "@saleor/services/errorTracking";
import React from "react";
import { useIntl } from "react-intl";

import { validationMessages } from "../messages";
import { FilterElement, FilterErrorMessages, FilterErrors } from "../types";

const useStyles = makeStyles(
  theme => ({
    container: {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
      padding: theme.spacing(3, 3, 0, 3),
    },
    listItemTitle: {
      color: theme.palette.primary.contrastText,
    },
    dot: {
      backgroundColor: theme.palette.primary.contrastText,
      marginRight: theme.spacing(1),
      borderRadius: "100%",
      height: 8,
      minHeight: 8,
      width: 8,
      minWidth: 8,
    },
    itemContainer: {
      display: "flex",
      alignItems: "center",
    },
  }),
  { name: "FilterErrorsList" },
);

interface FilterErrorsListProps<T extends string = string> {
  filter: FilterElement<T>;
  errors?: FilterErrors;
  errorMessages?: FilterErrorMessages<T>;
}

const FilterErrorsList: React.FC<FilterErrorsListProps> = ({
  filter: { dependencies },
  errors = [],
  errorMessages,
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const getErrorMessage = (code: string) => {
    try {
      return intl.formatMessage(
        errorMessages?.[code] || validationMessages[code],
        { dependencies: dependencies?.join() },
      );
    } catch (e) {
      errorTracker.captureException(e);
      console.warn("Translation missing for filter error code: ", code);
      return intl.formatMessage(validationMessages.UNKNOWN_ERROR);
    }
  };

  if (!errors.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      {!!errors.length && (
        <InlineAlert>
          {errors.map(code => (
            <div className={classes.itemContainer} key={code}>
              <div className={classes.dot} />
              <Typography className={classes.listItemTitle}>
                {getErrorMessage(code)}
              </Typography>
            </div>
          ))}
        </InlineAlert>
      )}
    </div>
  );
};

export default FilterErrorsList;
