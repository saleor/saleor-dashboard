import { FormControlLabel, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { toggle } from "@saleor/utils/lists";
import React from "react";
import { FormattedMessage } from "react-intl";

import Checkbox from "../Checkbox";
import Hr from "../Hr";
import Link from "../Link";
import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";
import { FilterBaseFieldProps } from "./types";

interface FilterAutocompleteFieldProps extends FilterBaseFieldProps {
  displayValues: FilterAutocompleteDisplayValues;
  setDisplayValues: (values: FilterAutocompleteDisplayValues) => void;
  initialDisplayValues: FilterAutocompleteDisplayValues;
}

export type FilterAutocompleteDisplayValues = Record<
  string,
  MultiAutocompleteChoiceType[]
>;

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
      marginBottom: theme.spacing(1),
      paddingTop: theme.spacing(1)
    },
    noResults: {
      marginTop: theme.spacing(1)
    },
    option: {
      left: theme.spacing(-0.5),
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
  onFilterPropertyChange,
  initialDisplayValues,
  ...rest
}) => {
  const classes = useStyles({});

  const fieldDisplayValues = displayValues[filterField.name];
  const initialFieldDisplayValues = initialDisplayValues[filterField.name];
  const availableOptions = filterField.options.filter(option =>
    fieldDisplayValues.every(
      displayValue => displayValue.value !== option.value
    )
  );
  const displayNoResults =
    availableOptions.length === 0 && fieldDisplayValues.length === 0;

  const getUpdatedFilterValue = (option: MultiAutocompleteChoiceType) => {
    if (filterField.multiple) {
      return toggle(option.value, filterField.value, (a, b) => a === b);
    }

    return [option.value];
  };

  const handleChange = (option: MultiAutocompleteChoiceType) => {
    onFilterPropertyChange({
      payload: {
        name: filterField.name,
        update: {
          active: true,
          value: getUpdatedFilterValue(option)
        }
      },
      type: "set-property"
    });

    if (filterField.multiple) {
      setDisplayValues({
        ...displayValues,
        [filterField.name]: toggle(
          option,
          fieldDisplayValues,
          (a, b) => a.value === b.value
        )
      });
    }
  };

  const isValueChecked = (displayValue: MultiAutocompleteChoiceType) =>
    filterField.value.includes(displayValue.value);

  const filteredValuesChecked = initialFieldDisplayValues.filter(
    isValueChecked
  );

  const filteredValuesUnchecked = fieldDisplayValues.filter(
    displayValue => !isValueChecked(displayValue)
  );

  const displayHr = !!filteredValuesChecked.length;

  return (
    <div {...rest}>
      {filterField?.onSearchChange && (
        <TextField
          data-test-id="filter-field-autocomplete-input"
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
      )}
      {filteredValuesChecked.map(displayValue => (
        <div className={classes.option} key={displayValue.value}>
          <FormControlLabel
            control={
              <Checkbox
                data-test-id={
                  "filter-field-autocomplete-selected-" + filterField.value
                }
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
        <Typography
          data-test-id="filter-field-autocomplete-no-results"
          className={classes.noResults}
          color="textSecondary"
        >
          <FormattedMessage defaultMessage="No results" description="search" />
        </Typography>
      )}
      {filteredValuesUnchecked.map(option => (
        <div
          className={classes.option}
          key={option.value}
          data-test-id="filter-option"
        >
          <FormControlLabel
            control={
              <Checkbox
                data-test-id={
                  "filter-field-autocomplete-option-" + filterField.value
                }
                checked={filterField.value.includes(option.value)}
              />
            }
            label={option.label}
            name={filterField.name}
            onChange={() => handleChange(option)}
          />
        </div>
      ))}
      {filterField.hasMore && (
        <Link
          data-test-id="filter-field-autocomplete-has-more"
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
