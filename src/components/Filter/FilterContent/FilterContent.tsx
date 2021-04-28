import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Hr from "@saleor/components/Hr";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { renderCollectionWithDividers } from "@saleor/misc";
import React from "react";

import { FilterReducerAction } from "../reducer";
import {
  FieldType,
  FilterErrorMessages,
  FilterErrors,
  IFilter,
  IFilterElement
} from "../types";
import FilterContentBody, { FilterContentBodyProps } from "./FilterContentBody";
import FilterContentBodyNameField from "./FilterContentBodyNameField";
import FilterContentHeader from "./FilterContentHeader";
import FilterErrorsList from "./FilterErrorsList";

export interface FilterContentProps<T extends string = string> {
  filters: IFilter<T>;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<T>>;
  onClear: () => void;
  onSubmit: () => void;
  currencySymbol?: string;
  dataStructure: IFilter<T>;
  errors?: FilterErrors;
  errorMessages?: FilterErrorMessages<T>;
}

type FilterAutocompleteDisplayValues = Record<
  string,
  MultiAutocompleteChoiceType[]
>;

const FilterContent: React.FC<FilterContentProps> = ({
  currencySymbol,
  errors,
  errorMessages,
  filters,
  onClear,
  onFilterPropertyChange,
  onSubmit,
  dataStructure
}) => {
  const getAutocompleteValuesWithNewValues = (
    autocompleteDisplayValues: FilterAutocompleteDisplayValues,
    filterField: IFilterElement<string>
  ) => {
    if (filterField.type === FieldType.autocomplete) {
      return {
        ...autocompleteDisplayValues,
        [filterField.name]: filterField.displayValues
      };
    }

    return autocompleteDisplayValues;
  };

  const initialAutocompleteDisplayValues = filters.reduce(
    (acc, filterField) => {
      if (filterField.multipleFields) {
        return filterField.multipleFields.reduce(
          getAutocompleteValuesWithNewValues,
          {}
        );
      }

      return getAutocompleteValuesWithNewValues(acc, filterField);
    },
    {}
  );

  const [
    autocompleteDisplayValues,
    setAutocompleteDisplayValues
  ] = useStateFromProps<FilterAutocompleteDisplayValues>(
    initialAutocompleteDisplayValues
  );

  const commonFilterBodyProps: Omit<
    FilterContentBodyProps,
    "filter" | "onFilterPropertyChange"
  > = {
    currencySymbol,
    autocompleteDisplayValues,
    setAutocompleteDisplayValues
  };

  const handleMultipleFieldPropertyChange = function<T extends string>(
    action: FilterReducerAction<T>
  ) {
    const { update } = action.payload;

    onFilterPropertyChange({
      ...action,
      payload: { ...action.payload, update: { ...update, active: true } }
    });
  };

  const getFilterFromCurrentData = function<T extends string>(
    filter: IFilterElement<T>
  ) {
    return filters.find(({ name }) => filter.name === name);
  };

  return (
    <Paper>
      <form
        onSubmit={event => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <FilterContentHeader onClear={onClear} />
        <Hr />
        {dataStructure
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map(filter => (
            <React.Fragment key={filter.name}>
              <FilterContentBodyNameField
                filter={getFilterFromCurrentData(filter)}
                onFilterPropertyChange={onFilterPropertyChange}
              />
              <FilterErrorsList
                errors={errors}
                errorMessages={errorMessages}
                filter={filter}
              />
              {filter.multipleFields ? (
                renderCollectionWithDividers({
                  collection: filter.multipleFields,
                  renderItem: filterField => (
                    <FilterContentBody
                      {...commonFilterBodyProps}
                      onFilterPropertyChange={handleMultipleFieldPropertyChange}
                      filter={{
                        ...getFilterFromCurrentData(filterField),
                        active: getFilterFromCurrentData(filter).active
                      }}
                    >
                      <Typography>{filterField.label}</Typography>
                    </FilterContentBody>
                  )
                })
              ) : (
                <FilterContentBody
                  {...commonFilterBodyProps}
                  onFilterPropertyChange={onFilterPropertyChange}
                  filter={getFilterFromCurrentData(filter)}
                />
              )}
            </React.Fragment>
          ))}
      </form>
    </Paper>
  );
};
FilterContent.displayName = "FilterContent";
export default FilterContent;
