import compact from "lodash/compact";

import {
  FieldType,
  FilterElement,
  InvalidFilters,
  ValidationErrorCode,
} from "./types";

export const getByName = (nameToCompare: string) => (obj: { name: string }) =>
  obj.name === nameToCompare;

export const isAutocompleteFilterFieldValid = function<T extends string>({
  value,
}: FilterElement<T>) {
  return !!compact(value).length;
};

export const isNumberFilterFieldValid = function<T extends string>({
  value,
}: FilterElement<T>) {
  const [min, max] = value;

  if (!min && !max) {
    return false;
  }

  return true;
};

export const isFilterFieldValid = function<T extends string>(
  filter: FilterElement<T>,
) {
  const { type } = filter;

  switch (type) {
    case FieldType.number:
      return isNumberFilterFieldValid(filter);
    case FieldType.boolean:
    case FieldType.autocomplete:
      return isAutocompleteFilterFieldValid(filter);
    case FieldType.options:
      return !!filter.value[0];

    default:
      return true;
  }
};

export const isFilterValid = function<T extends string>(
  filter: FilterElement<T>,
) {
  const { required, active } = filter;

  if (!required && !active) {
    return true;
  }

  return isFilterFieldValid(filter);
};

export const extractInvalidFilters = function<T extends string>(
  filtersData: Array<FilterElement<T>>,
  filtersDataStructure: Array<FilterElement<T>>,
): InvalidFilters<T> {
  return filtersDataStructure.reduce(
    (invalidFilters, { name, multipleFields, dependencies }) => {
      const filter = filtersData.find(getByName(name));
      let errors: string[] = [];

      const shouldExtractChildrenFields =
        filter.active && !!multipleFields?.length;

      // if filter is inactive we skip entire validation
      if (!filter.active) {
        return invalidFilters;
      }

      if (!isFilterValid(filter)) {
        errors.push(ValidationErrorCode.VALUE_REQUIRED);
      }

      if (shouldExtractChildrenFields) {
        const multipleFieldErrors = multipleFields
          .map(field => {
            const filter = filtersData.find(getByName(field.name));
            return { ...filter, active: true };
          })
          .filter(el => !isFilterValid(el))
          .map(({ name }) => name);

        errors = [...errors, ...multipleFieldErrors];
      }

      // check if filter depends on other filters
      if (dependencies?.length > 0) {
        const deps = dependencies
          .map(name => {
            const filter = filtersData.find(getByName(name));
            return { ...filter, required: true };
          })
          .filter(el => !isFilterValid(el));

        if (deps.length > 0) {
          errors.push(ValidationErrorCode.DEPENDENCIES_MISSING);
        }
      }

      if (errors.length === 0) {
        return invalidFilters;
      }

      return {
        ...invalidFilters,
        [name]: errors,
      };
    },
    {} as InvalidFilters<T>,
  );
};
