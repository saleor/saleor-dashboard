import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Option, Text } from "@saleor/macaw-ui-next";
import React from "react";

type Choice = {
  id: string;
  name: string;
};

type ChoiceWithAncestors = Choice & {
  ancestors: {
    edges: {
      node: Choice;
    }[];
  };
};

export const getChoicesWithAncestors = (choices: ChoiceWithAncestors[]): Option[] =>
  choices.map(category => {
    const { ancestors } = category;
    const ancestorItems = mapEdgesToItems(ancestors)?.reverse();
    const hasAncestors = !!ancestorItems && ancestorItems.length > 0;

    return {
      value: category.id,
      label: category.name,
      startAdornment: hasAncestors ? (
        <Text
          size={2}
          color="default2"
          marginRight={1}
          key={`ancestor-${category.id}`}
          __display="inline"
          height="100%"
          alignItems="center"
        >
          {ancestorItems.reduce((acc, ancestor) => `${ancestor.name} / ${acc}`, "")}
        </Text>
      ) : undefined,
    };
  });
