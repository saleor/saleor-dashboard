import { useApolloClient } from "@apollo/client";
import { _GetAttributeChoicesDocument } from "@dashboard/graphql";
import { useState } from "react";

import { FilterElement } from "./FilterElement";
import { FilterValueProvider } from "./FilterValueProvider";

export const useFilterContainer = (valueProvider: FilterValueProvider) => {
  const [value, setValue] = useState(valueProvider.value);

  const client = useApolloClient();

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

  const updateRightOptions = (position: string, options: any) => {
    const index = parseInt(position, 10);
    setValue(v =>
      v.map((el, elIndex) => {
        if (elIndex === index && typeof el != "string") {
          el.updateRightOptions(options);
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

  const fetchOptions = async (position: string) => {
    const index = parseInt(position, 10);
    const filterElement = value[index];

    if (typeof filterElement != "string") {
      const { data, loading } = await client.query({
        query: _GetAttributeChoicesDocument,
        variables: {
          attributeId: filterElement.value.value,
          first: 5,
        },
      });
      const options = data?.attribute.choices.edges.map(({ node }) => ({
        label: node.name,
        value: node.id,
      }));
      updateRightOptions(position, options);
    }
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
    updateRightOptions,
  };
};
