import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Text } from "@saleor/macaw-ui-next";
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

export const getChoicesWithAncestors = (choices: ChoiceWithAncestors[]) =>
  choices.map(category => {
    const { ancestors } = category;
    const ancestorItems = mapEdgesToItems(ancestors)?.reverse();
    const hasAncestors = !!ancestorItems && ancestorItems.length > 0;

    return {
      value: category.id,
      label: category.name,
      endAdornment: hasAncestors && (
        <Text size={2} color="default2" marginLeft={2}>
          {ancestorItems.map(ancestor => (
            <>
              <Box as="span" key={ancestor.id} marginRight={1}>
                {`/ ${ancestor.name}`}
              </Box>
            </>
          ))}
        </Text>
      ),
    };
  });
