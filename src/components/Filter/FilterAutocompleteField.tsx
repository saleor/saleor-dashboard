import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { FormattedMessage } from "react-intl";

import { toggle } from "@saleor/utils/lists";
import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";
import Link from "../Link";
import Checkbox from "../Checkbox";
import Hr from "../Hr";
import { FilterBaseFieldProps } from "./types";

interface FilterAutocompleteFieldProps extends FilterBaseFieldProps {
  displayValues: Record<string, MultiAutocompleteChoiceType[]>;
  setDisplayValues: (
    values: Record<string, MultiAutocompleteChoiceType[]>
  ) => void;
}

const useStyles = makeStyles(
  theme => ({
    hr: {
      backgroundColor: theme.palette.primary.light,
      margin: theme.spacing(1, 0)
    },
    input: {
      padding: "12px 0 9px 12px"
    },
    inputContainer: {
      marginBottom: theme.spacing(1)
    },
    noResults: {
      marginTop: theme.spacing(1)
    },
    option: {
      left: -theme.spacing(0.5),
      position: "relative"
    },
    showMore: {
      display: "inline-block",
      marginTop: theme.spacing(1)
    }
  }),
  { name: "FilterAutocompleteField" }
);

const FilterAutocompleteField: React.FC<FilterAutocompleteFieldProps> = ({
  displayValues,
  filterField,
  setDisplayValues,
  onFilterPropertyChange
}) => {
  const classes = useStyles({});

  const fieldDisplayValues = displayValues[filterField.name];
  const availableOptions = filterField.options.filter(option =>
    fieldDisplayValues.every(
      displayValue => displayValue.value !== option.value
    )
  );
  const displayNoResults =
    availableOptions.length === 0 && fieldDisplayValues.length === 0;
  const displayHr = !(
    (fieldDisplayValues.length === 0 && availableOptions.length > 0) ||
    (availableOptions.length === 0 && fieldDisplayValues.length > 0) ||
    displayNoResults
  );

  const handleChange = (option: MultiAutocompleteChoiceType) => {
    onFilterPropertyChange({
      payload: {
        name: filterField.name,
        update: {
          value: toggle(option.value, filterField.value, (a, b) => a === b)
        }
      },
      type: "set-property"
    });

    setDisplayValues({
      ...displayValues,
      [filterField.name]: toggle(
        option,
        fieldDisplayValues,
        (a, b) => a.value === b.value
      )
    });
  };

  return (
    <div>
      <TextField
        className={classes.inputContainer}
        fullWidth
        name={filterField.name + "_autocomplete"}
        InputProps={{
          classes: {
            input: classes.input
          }
        }}
        onChange={event => filterField.onSearchChange(event.target.value)}
      />
      {fieldDisplayValues.map(displayValue => (
        <div className={classes.option} key={displayValue.value}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterField.value.includes(displayValue.value)}
              />
            }
            label={displayValue.label}
            name={filterField.name}
            onChange={() => handleChange(displayValue)}
          />
        </div>
      ))}
      {displayHr && <Hr className={classes.hr} />}
      {displayNoResults && (
        <Typography className={classes.noResults} color="textSecondary">
          <FormattedMessage defaultMessage="No results" description="search" />
        </Typography>
      )}
      {availableOptions.map(option => (
        <div className={classes.option} key={option.value}>
          <FormControlLabel
            control={
              <Checkbox checked={filterField.value.includes(option.value)} />
            }
            label={option.label}
            name={filterField.name}
            onChange={() => handleChange(option)}
          />
        </div>
      ))}
      {filterField.hasMore && (
        <Link
          className={classes.showMore}
          underline
          onClick={filterField.onFetchMore}
        >
          <FormattedMessage
            defaultMessage="Show more"
            description="search results"
          />
        </Link>
      )}
    </div>
  );
};

FilterAutocompleteField.displayName = "FilterAutocompleteField";
export default FilterAutocompleteField;
