import { fuzzySearch } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import * as React from "react";

import { useActionTriggers } from "./useActionTriggers";

interface ActionsProps {
  query: string;
  onActionClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onActionsLoaded: () => void;
}

export const Actions = ({ query, onActionClick, onActionsLoaded }: ActionsProps) => {
  const triggers = useActionTriggers();
  const searchResults = fuzzySearch(triggers, query, ["name"]);

  const groupedBySection = Object.groupBy(searchResults, result => result.section) as Record<
    string,
    {
      Component: React.ComponentType<{
        onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
      }>;
    }[]
  >;

  /*
    This component is rendered later than the parent.
    Since there is slight delay, the DOM operations cannot catch action elements.
    This use effect triggers itself when the component is mounted,
    pretending the actions are "loaded" and they are accessible.
  */
  useEffect(onActionsLoaded, [query]);

  return (
    <Box>
      {Object.entries(groupedBySection).map(([section, actions]) => (
        <Box key={section} paddingY={1}>
          <Text fontWeight="medium" size={2} color="default2" paddingX={6}>
            {section}
          </Text>
          {actions.map(({ Component }, index) => (
            <Component key={index} onClick={onActionClick} />
          ))}
        </Box>
      ))}
    </Box>
  );
};
