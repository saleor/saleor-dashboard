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
  level: number;
  parent: {
    id: string;
    name: string;
  } | null;
};

const getAncestorsLabel = (choice: ChoiceWithAncestors): string => {
  const { parent, level, ancestors } = choice;

  if (level === 0) {
    return "";
  }

  if (level === 1) {
    return `${parent?.name} / ` || "";
  }

  const ancestor = mapEdgesToItems(ancestors)?.[0];

  const parentLabel = parent?.name ?? null;
  const rootCategoryLabel = ancestor?.name || null;

  return `${rootCategoryLabel} ${level > 2 ? "/ ... /" : "/"} ${parentLabel} / `;
};

export const getChoicesWithAncestors = (choices: ChoiceWithAncestors[]): Option[] =>
  choices.map(category => {
    const hasAncestors = category.level > 0;

    return {
      value: category.id,
      label: category.name,
      startAdornment: hasAncestors ? (
        <Text
          size={2}
          color="default2"
          key={`ancestor-${category.id}`}
          __display="inline"
          height="100%"
          alignItems="center"
        >
          {getAncestorsLabel(category)}
        </Text>
      ) : undefined,
    };
  });
