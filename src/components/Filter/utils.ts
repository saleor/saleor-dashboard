import compact from "lodash/compact";

import { FieldType, IFilterElement } from "./types";

export const getByName = (nameToCompare: string) => (obj: { name: string }) =>
  obj.name === nameToCompare;

export const isAutocompleteFilterFieldValid = function<T extends string>({
  value
}: IFilterElement<T>) {
  return !!compact(value).length;
};

export const isFilterFieldValid = function<T extends string>(
  filter: IFilterElement<T>
) {
  const { type } = filter;

  switch (type) {
    case FieldType.boolean:
    case FieldType.autocomplete:
      return isAutocompleteFilterFieldValid(filter);

    default:
      return true;
  }
};

export const isFilterValid = function<T extends string>(
  resultFilters: Array<IFilterElement<T>>,
  filter: IFilterElement<T>
) {
  const { required, active } = filter;

  if (!required || !active) {
    return resultFilters;
  }

  return isFilterFieldValid(filter)
    ? resultFilters
    : [...resultFilters, filter];
};

export const extractInvalidFilters = function<T extends string>(
  filtersData: Array<IFilterElement<T>>,
  filtersDataStructure: Array<IFilterElement<T>>
) {
  return filtersDataStructure.reduce(
    (resultFilters, { name, multipleFields }) => {
      const filter = filtersData.find(getByName(name));

      const shouldExtractChildrenFields =
        filter.active && !!multipleFields?.length;

      if (shouldExtractChildrenFields) {
        return multipleFields
          .map(field => {
            const dataField = filtersData.find(getByName(field.name));
            return { ...dataField, active: true };
          })
          .reduce(isFilterValid, resultFilters);
      }

      return isFilterValid(resultFilters, filter);
    },
    []
  );
};
