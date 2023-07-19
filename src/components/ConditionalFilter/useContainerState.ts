import { useEffect, useState } from "react";

import { FilterContainer, FilterElement } from "./FilterElement";
import { FilterValueProvider } from "./FilterValueProvider";

type StateCallback = (el: FilterElement) => void;
type Element = FilterContainer[number];

export const useContainerState = (valueProvider: FilterValueProvider) => {
  const [value, setValue] = useState<FilterContainer>([]);

  useEffect(() => {
    if (!valueProvider.loading) {
      setValue(valueProvider.value);
    }
  }, [valueProvider.loading]);

  const isFilterElement = (
    elIndex: number,
    index: number,
    el: Element,
  ): el is FilterElement => {
    return elIndex === index && typeof el !== "string" && !Array.isArray(el);
  };

  const updateFilterElement =
    (index: number, cb: StateCallback) => (el: Element, elIndex: number) => {
      if (isFilterElement(elIndex, index, el)) {
        cb(el);
      }

      return el;
    };

  const updateAt = (position: string, cb: StateCallback) => {
    const index = parseInt(position, 10);
    setValue(v => v.map(updateFilterElement(index, cb)));
  };

  const removeAt = (position: string) => {
    const index = parseInt(position, 10);

    if (value.length > 0) {
      setValue(v =>
        v.filter((_, elIndex) => ![index - 1, index].includes(elIndex)),
      );
      return;
    }

    setValue(v => v.filter((_, elIndex) => ![index].includes(elIndex)));
  };

  const createEmpty = () => {
    const newValue: FilterContainer = [];

    if (value.length > 0) {
      newValue.push("OR");
    }

    newValue.push(FilterElement.createEmpty());

    setValue(v => v.concat(newValue));
  };

  return {
    createEmpty,
    updateAt,
    removeAt,
    value,
  };
};
