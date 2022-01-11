import { FormControlLabel, Radio, TextField } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { FilterDateTimeField } from "@saleor/components/Filter/FilterContent/FilterDateTimeField";
import { FilterNumericField } from "@saleor/components/Filter/FilterContent/FilterNumericField";
import { FilterSingleSelectField } from "@saleor/components/Filter/FilterContent/FilterSingleSelectField";
import { useCommonStyles } from "@saleor/components/Filter/FilterContent/utils";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import FilterAutocompleteField, {
  FilterAutocompleteDisplayValues
} from "../FilterAutocompleteField";
import FilterOptionField from "../FilterOptionField";
import { FilterReducerAction } from "../reducer";
import { FieldType, IFilterElement } from "../types";

const useStyles = makeStyles(
  theme => ({
    filterSettings: {
      background: fade(theme.palette.primary.main, 0.1),
      padding: theme.spacing(2, 3)
    },

    option: {
      left: -theme.spacing(0.5),
      position: "relative"
    },
    optionRadio: {
      left: -theme.spacing(0.25)
    }
  }),
  { name: "FilterContentBody" }
);

const filterTestingContext = "filter-field";

export interface FilterContentBodyProps<T extends string = string> {
  children?: React.ReactNode;
  filter: IFilterElement<T>;
  currencySymbol?: string;
  initialAutocompleteDisplayValues: FilterAutocompleteDisplayValues;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<T>>;
  autocompleteDisplayValues: FilterAutocompleteDisplayValues;
  setAutocompleteDisplayValues: React.Dispatch<
    React.SetStateAction<Record<string, MultiAutocompleteChoiceType[]>>
  >;
}

const FilterContentBody: React.FC<FilterContentBodyProps> = ({
  filter,
  children,
  currencySymbol,
  onFilterPropertyChange,
  autocompleteDisplayValues,
  setAutocompleteDisplayValues,
  initialAutocompleteDisplayValues
}) => {
  const classes = useStyles({});
  const commonClasses = useCommonStyles({});

  if (!filter) {
    return <Skeleton />;
  }

  const isDateField = [FieldType.date, FieldType.dateTime].includes(
    filter.type
  );
  const isNumericField = [FieldType.price, FieldType.number].includes(
    filter.type
  );

  return (
    <div className={classes.filterSettings}>
      {children}
      {filter.type === FieldType.text && (
        <TextField
          data-test={filterTestingContext}
          data-test-id={filter.name}
          fullWidth
          name={filter.name}
          InputProps={{ classes: { input: commonClasses.input } }}
          value={filter.value[0]}
          onChange={event =>
            onFilterPropertyChange({
              payload: {
                name: filter.name,
                update: {
                  value: [event.target.value, filter.value[1]]
                }
              },
              type: "set-property"
            })
          }
        />
      )}
      {isDateField && (
        <>
          <FilterSingleSelectField
            filter={filter}
            onFilterPropertyChange={onFilterPropertyChange}
          />
          <FilterDateTimeField
            filter={filter}
            onFilterPropertyChange={onFilterPropertyChange}
          />
        </>
      )}
      {isNumericField && (
        <>
          <FilterSingleSelectField
            filter={filter}
            onFilterPropertyChange={onFilterPropertyChange}
          />
          <FilterNumericField
            filter={filter}
            onFilterPropertyChange={onFilterPropertyChange}
            currencySymbol={currencySymbol}
          />
        </>
      )}

      {filter.type === FieldType.options && (
        <FilterOptionField
          data-test={filterTestingContext}
          data-test-id={filter.name}
          filterField={filter}
          onFilterPropertyChange={onFilterPropertyChange}
        />
      )}
      {filter.type === FieldType.boolean &&
        filter.options.map(option => (
          <div
            className={classNames(classes.option, classes.optionRadio)}
            key={option.value}
          >
            <FormControlLabel
              control={
                <Radio
                  data-test="filterBoolean"
                  data-test-is-checked={filter.value[0] === option.value}
                  checked={filter.value[0] === option.value}
                  color="primary"
                />
              }
              label={option.label}
              name={filter.name}
              onChange={() =>
                onFilterPropertyChange({
                  payload: {
                    name: filter.name,
                    update: {
                      value: [option.value]
                    }
                  },
                  type: "set-property"
                })
              }
            />
          </div>
        ))}
      {filter.type === FieldType.autocomplete && (
        <FilterAutocompleteField
          data-test={filterTestingContext}
          data-test-id={filter.name}
          displayValues={autocompleteDisplayValues}
          filterField={filter}
          setDisplayValues={setAutocompleteDisplayValues}
          onFilterPropertyChange={onFilterPropertyChange}
          initialDisplayValues={initialAutocompleteDisplayValues}
        />
      )}
    </div>
  );
};

export default FilterContentBody;
