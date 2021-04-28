import compact from "lodash-es/compact";

import { FieldType, IFilterElement } from "./types";

export const isAutocompleteFilterFieldValid = function<T extends string>({
  value
}: IFilterElement<T>) {
  return !!compact(value).length;
};

export const isFilterValid = function<T extends string>(
  filter: IFilterElement<T>
) {
  const { required, type } = filter;

  if (!required) {
    return true;
  }

  switch (type) {
    case FieldType.autocomplete:
      return isAutocompleteFilterFieldValid(filter);

    default:
      return true;
  }
};
