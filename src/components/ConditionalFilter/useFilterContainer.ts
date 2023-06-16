import { useState } from "react";

import { FilterElement } from "./FilterElement";
import { FilterValueProvider } from "./FilterValueProvider";

export const useFilterContainer = (valueProvider: FilterValueProvider) => {
  const [value, setValue] = useState(valueProvider.value);

  const addEmpty = () => {
    const newValue = [];
    if (value.length > 0) {
      newValue.push("OR");
    }

    newValue.push(FilterElement.createEmpty());

    setValue(v => v.concat(newValue));
  };

  const removeAt = (position: string) => {
    const index = parseInt(position);

    if (value.length > 0) {
      setValue(v =>
        v.filter((_, elIndex) => ![index - 1, index].includes(elIndex)),
      );
      return;
    }

    setValue(v => v.filter((_, elIndex) => ![index].includes(elIndex)));
  };

  const updateLeftOperator = (position: string, leftOperator: any) => {
    const index = parseInt(position, 10);
    setValue(v =>
      v.map((el, elIndex) => {
        if (elIndex === index && typeof el != "string") {
          el.updateLeftOperator(leftOperator);
        }

        return el;
      }),
    );
  };

  const updateRightOperator = (position: string, leftOperator: any) => {
    const index = parseInt(position, 10);
    setValue(v =>
      v.map((el, elIndex) => {
        if (elIndex === index && typeof el != "string") {
          el.updateRightOperator(leftOperator);
        }

        return el;
      }),
    );
  };

  const updateCondition = (position: string, conditionValue: any) => {
    const index = parseInt(position, 10);

    setValue(v =>
      v.map((el, elIndex) => {
        if (elIndex === index && typeof el != "string") {
          el.updateCondition(conditionValue);
        }

        return el;
      }),
    );
  };

  const persist = () => {
    valueProvider.persist(value);
  };

  return {
    value,
    persist,
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
  };
};
