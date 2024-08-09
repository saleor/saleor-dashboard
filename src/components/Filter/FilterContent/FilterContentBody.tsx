// @ts-strict-ignore
import { FilterDateTimeField } from "@dashboard/components/Filter/FilterContent/FilterDateTimeField";
import { FilterNumericField } from "@dashboard/components/Filter/FilterContent/FilterNumericField";
import { FilterSingleSelectField } from "@dashboard/components/Filter/FilterContent/FilterSingleSelectField";
import { useCommonStyles } from "@dashboard/components/Filter/FilterContent/utils";
import { FormControlLabel, Radio, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Option, Skeleton } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";

import FilterAutocompleteField, {
  FilterAutocompleteDisplayValues,
} from "../FilterAutocompleteField";
import { FilterKeyValueField } from "../FilterKeyValueField";
import FilterOptionField from "../FilterOptionField";
import { FilterReducerAction } from "../reducer";
import {
  FieldType,
  FilterElement,
  isFilterDateType,
  isFilterNumericType,
  isFilterType,
} from "../types";

const useStyles = makeStyles(
  theme => ({
    filterSettings: {
      padding: theme.spacing(2, 3),
    },

    option: {
      left: -theme.spacing(0.5),
      position: "relative",
    },
    optionRadio: {
      left: -theme.spacing(0.25),
    },
  }),
  { name: "FilterContentBody" },
);
const filterTestingContext = "filter-field-";

export interface FilterContentBodyProps<K extends string> {
  children?: React.ReactNode;
  filter: FilterElement<K>;
  currencySymbol?: string;
  initialAutocompleteDisplayValues: FilterAutocompleteDisplayValues;
  onFilterPropertyChange: <T extends FieldType>(value: FilterReducerAction<K, T>) => void;
  autocompleteDisplayValues: FilterAutocompleteDisplayValues;
  setAutocompleteDisplayValues: React.Dispatch<React.SetStateAction<Record<string, Option[]>>>;
}

const FilterContentBody = <K extends string = string>({
  filter,
  children,
  currencySymbol,
  onFilterPropertyChange,
  autocompleteDisplayValues,
  setAutocompleteDisplayValues,
  initialAutocompleteDisplayValues,
}: FilterContentBodyProps<K>) => {
  const classes = useStyles({});
  const commonClasses = useCommonStyles({});

  if (!filter) {
    return <Skeleton />;
  }

  return (
    <div className={classes.filterSettings}>
      {children}
      {isFilterType(filter, FieldType.text) && (
        <TextField
          data-test-id={filterTestingContext + filter.name}
          fullWidth
          name={filter.name}
          InputProps={{ classes: { input: commonClasses.input } }}
          value={filter.value[0]}
          onChange={event =>
            onFilterPropertyChange<FieldType.text>({
              payload: {
                name: filter.name,
                update: {
                  value: [event.target.value, filter.value[1]],
                },
              },
              type: "set-property",
            })
          }
        />
      )}
      {isFilterDateType(filter) && (
        <>
          <FilterSingleSelectField
            filter={filter}
            onFilterPropertyChange={onFilterPropertyChange}
          />
          <FilterDateTimeField filter={filter} onFilterPropertyChange={onFilterPropertyChange} />
        </>
      )}
      {isFilterNumericType(filter) && (
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

      {isFilterType(filter, FieldType.options) && (
        <FilterOptionField
          data-test-id={filterTestingContext + filter.name}
          filter={filter}
          onFilterPropertyChange={onFilterPropertyChange}
        />
      )}
      {isFilterType(filter, FieldType.boolean) &&
        filter.options.map(option => (
          <div className={clsx(classes.option, classes.optionRadio)} key={option.value}>
            <FormControlLabel
              control={
                <Radio
                  data-test-id="filter-boolean"
                  data-test-is-checked={filter.value[0] === option.value}
                  checked={filter.value[0] === option.value}
                  color="secondary"
                />
              }
              label={option.label}
              name={filter.name}
              onChange={() =>
                onFilterPropertyChange({
                  payload: {
                    name: filter.name,
                    update: {
                      value: [option.value],
                    },
                  },
                  type: "set-property",
                })
              }
            />
          </div>
        ))}
      {isFilterType(filter, FieldType.keyValue) && (
        <FilterKeyValueField filter={filter} onFilterPropertyChange={onFilterPropertyChange} />
      )}
      {isFilterType(filter, FieldType.autocomplete) && (
        <FilterAutocompleteField
          data-test-id={filterTestingContext + filter.name}
          displayValues={autocompleteDisplayValues}
          filter={filter}
          setDisplayValues={setAutocompleteDisplayValues}
          onFilterPropertyChange={onFilterPropertyChange}
          initialDisplayValues={initialAutocompleteDisplayValues}
        />
      )}
    </div>
  );
};

export default FilterContentBody;
