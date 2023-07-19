import { useEffect, useState } from "react";

import { FilterContainer, FilterElement } from "./FilterElement";

type StateCallback = (el: FilterElement) => void;
type Element = FilterContainer[number];

export const useContainerState = (initialValue: FilterContainer) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (value.length === 0 && initialValue.length > 0) {
      setValue(initialValue);
    }
  }, [initialValue]);

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

  const create = (element: FilterElement) => {
    const newValue: FilterContainer = [];

    if (value.length > 0) {
      newValue.push("AND");
    }

    newValue.push(element);

    setValue(v => v.concat(newValue));
  };

  const createEmpty = () => {
    create(FilterElement.createEmpty())
  };

  return {
    create,
    createEmpty,
    updateAt,
    removeAt,
    value,
  };
};
