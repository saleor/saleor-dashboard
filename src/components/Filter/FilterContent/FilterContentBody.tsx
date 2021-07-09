import { FormControlLabel, Radio } from "@material-ui/core";
import FormSpacer from "@saleor/components/FormSpacer";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import SingleSelectField from "@saleor/components/SingleSelectField";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import Arrow from "../Arrow";
import FilterAutocompleteField, {
  FilterAutocompleteDisplayValues
} from "../FilterAutocompleteField";
import FilterOptionField from "../FilterOptionField";
import { FilterReducerAction } from "../reducer";
import { FieldType, FilterType, IFilterElement } from "../types";
import FilterRangeField from "./FilterRangeField";
import FilterTextField from "./FilterTextField";
import useStyles from "./styles";
import { filterTestingContext, getIsFilterMultipleChoices } from "./utils";

export interface FilterContentBodyProps<T extends string = string> {
  filter: IFilterElement<T>;
  currencySymbol: string;
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
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.filterSettings}>
      {children}
      {filter.type === FieldType.text && (
        <FilterTextField
          currencySymbol={currencySymbol}
          filter={filter}
          onFilterPropertyChange={onFilterPropertyChange}
        />
      )}
      {[FieldType.date, FieldType.price, FieldType.number].includes(
        filter.type
      ) && (
        <>
          <SingleSelectField
            data-test="filterRangeTypeChoice"
            choices={getIsFilterMultipleChoices(intl)}
            value={filter.multiple ? FilterType.MULTIPLE : FilterType.SINGULAR}
            InputProps={{
              classes: {
                input: classes.fieldInput
              }
            }}
            onChange={event =>
              onFilterPropertyChange({
                payload: {
                  name: filter.name,
                  update: {
                    multiple: event.target.value === FilterType.MULTIPLE
                  }
                },
                type: "set-property"
              })
            }
          />
          <FormSpacer />
          <div className={classes.inputRange}>
            <div>
              <Arrow className={classes.arrow} />
            </div>
            {filter.multiple ? (
              <FilterRangeField
                currencySymbol={currencySymbol}
                filter={filter}
                onFilterPropertyChange={onFilterPropertyChange}
              />
            ) : (
              <FilterTextField
                currencySymbol={currencySymbol}
                filter={filter}
                onFilterPropertyChange={onFilterPropertyChange}
              />
            )}
          </div>
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
      {filter.type === FieldType.autocomplete && filter.multiple && (
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
