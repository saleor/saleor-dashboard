import { useEffect, useState } from "react";

import { FilterContainer, FilterElement } from "./FilterElement";
import { FilterValueProvider } from "./FilterValueProvider";

type StateCallback = (el: FilterElement) => void;
type Element = FilterContainer[number];

const removeConstraint = (container: FilterContainer) => {
  return container.map(el => {
    if (!FilterElement.isFilterElement(el)) return el;

    if (!el.constraint?.existIn(container)) {
      el.clearConstraint();
    }

    return el;
  });
};
const calculateIndexesToRemove = (container: FilterContainer, position: number) => {
  const next = position + 1;
  const previous = position - 1;
  const indexTuple = [position];

  if (typeof container[next] === "string") {
    indexTuple.push(next);

    return indexTuple;
  }

  if (typeof container[previous] === "string") {
    indexTuple.push(previous);
  }

  return indexTuple;
};
const removeElement = (container: FilterContainer, position: number) => {
  const indexTuple = calculateIndexesToRemove(container, position);
  const newContainer = container.filter((_, elIndex) => !indexTuple.includes(elIndex));

  return removeConstraint(newContainer);
};
const removeEmptyElements = (
  container: FilterContainer,
  provider: FilterValueProvider,
): FilterContainer => {
  const emptyIndex = container.findIndex(
    el => FilterElement.isFilterElement(el) && (!provider.isPersisted(el) || el.isEmpty()),
  );

  if (emptyIndex < 0) return container;

  return removeEmptyElements(removeElement(container, emptyIndex), provider);
};

export const useContainerState = (valueProvider: FilterValueProvider) => {
  const [value, setValue] = useState<FilterContainer>([]);

  useEffect(() => {
    if (!valueProvider.loading) {
      setValue(valueProvider.value);
    }
  }, [valueProvider.loading, valueProvider.value]);

  const isFilterElementAtIndex = (
    elIndex: number,
    index: number,
    el: Element,
  ): el is FilterElement => {
    return elIndex === index && FilterElement.isFilterElement(el);
  };
  const updateFilterElement =
    (index: number, cb: StateCallback) => (el: Element, elIndex: number) => {
      if (isFilterElementAtIndex(elIndex, index, el)) {
        cb(el);
      }

      return el;
    };
  const updateAt = (position: string, cb: StateCallback) => {
    const index = parseInt(position, 10);

    setValue(v => v.map(updateFilterElement(index, cb)));
  };
  const getAt = (position: string) => {
    const index = parseInt(position, 10);

    return value[index];
  };
  const updateBySlug = (slug: string, cb: StateCallback) => {
    setValue(v =>
      v.map(el => {
        if (FilterElement.isFilterElement(el) && el.value.value === slug) {
          cb(el);
        }

        return el;
      }),
    );
  };
  const removeAt = (position: string) => {
    const index = parseInt(position, 10);

    setValue(v => removeElement(v, index));
  };

  const createNewValue = (value: FilterContainer, element: FilterElement) => {
    const newValue: FilterContainer = [];

    if (value.length > 0) {
      newValue.push("AND");
    }

    newValue.push(element);

    return newValue;
  };

  const create = (element: FilterElement) => {
    const newValue = createNewValue(value, element);

    setValue(v => v.concat(newValue));
  };

  // This function was created to cover a case when on click outside filter handler
  // fire state update, but applied of those state change happened after create function call,
  // so we have not removed empty values in container
  const createAndRemoveEmpty = (element: FilterElement) => {
    const filteredValue = removeEmptyElements(value, valueProvider);
    const newValue = createNewValue(filteredValue, element);

    setValue(() => filteredValue.concat(newValue));
  };

  const exist = (slug: string) => {
    return value.some(entry => FilterElement.isFilterElement(entry) && entry.value.value === slug);
  };
  const createEmpty = () => {
    create(FilterElement.createEmpty());
  };
  const clear = () => {
    setValue([]);
  };
  const clearEmpty = () => {
    setValue(v => removeEmptyElements(v, valueProvider));
  };

  return {
    create,
    createAndRemoveEmpty,
    exist,
    updateBySlug,
    createEmpty,
    getAt,
    updateAt,
    removeAt,
    value,
    clear,
    clearEmpty,
  };
};
