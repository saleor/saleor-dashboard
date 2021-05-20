import { Typography } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import InlineAlert from "@saleor/components/Alert/InlineAlert";
import { useStyles as useDotStyles } from "@saleor/components/StatusLabel";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { FilterErrorMessages, FilterErrors, IFilterElement } from "../types";

const useStyles = makeStyles(
  theme => ({
    container: {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
      padding: theme.spacing(3, 3, 0, 3)
    },
    listItemTitle: {
      color: theme.palette.primary.contrastText
    },
    dot: {
      backgroundColor: theme.palette.primary.contrastText,
      marginRight: theme.spacing(1)
    },
    itemContainer: {
      display: "flex",
      alignItems: "center"
    }
  }),
  { name: "FilterErrorsList" }
);

interface FilterErrorsListProps<T extends string = string> {
  filter: IFilterElement<T>;
  errors?: FilterErrors;
  errorMessages?: FilterErrorMessages<T>;
}

const FilterErrorsList: React.FC<FilterErrorsListProps> = ({
  filter: { name, multipleFields },
  errors = [],
  errorMessages
}) => {
  const classes = useStyles({});
  const dotClasses = useDotStyles({});
  const intl = useIntl();

  const hasError = (fieldName: string) =>
    !!errors.find(errorName => errorName === fieldName);

  const hasErrorsToShow = () => {
    if (!!multipleFields?.length) {
      return multipleFields.some(multipleField => hasError(multipleField.name));
    }

    return hasError(name);
  };

  if (!errors.length || !hasErrorsToShow()) {
    return null;
  }

  return (
    <div className={classes.container}>
      {!!errors.length && (
        <InlineAlert>
          {errors.map(fieldName => (
            <div className={classes.itemContainer}>
              <div className={classNames(classes.dot, dotClasses.dot)} />
              <Typography className={classes.listItemTitle}>
                {intl.formatMessage(errorMessages?.[fieldName])}
              </Typography>
            </div>
          ))}
        </InlineAlert>
      )}
    </div>
  );
};

export default FilterErrorsList;
