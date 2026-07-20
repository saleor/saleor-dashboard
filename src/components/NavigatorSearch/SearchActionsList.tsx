import { type SearchActionContext } from "@dashboard/extensions/search-actions/resolveSearchActionContext";
import { type ContextualSearchAction } from "@dashboard/extensions/search-actions/types";
import { fuzzySearch } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";

interface SearchActionsListProps {
  actions: ContextualSearchAction[];
  context: SearchActionContext;
  query: string;
  onActionSelected: () => void;
}

export const SearchActionsList = ({
  actions,
  context,
  query,
  onActionSelected,
}: SearchActionsListProps) => {
  const searchResults = fuzzySearch(actions, query, ["label"]);

  if (searchResults.length === 0) {
    return null;
  }

  const groupedBySection = Object.groupBy(searchResults, action => action.section);

  return (
    <Box>
      {Object.entries(groupedBySection).map(([section, sectionActions]) => (
        <Box key={section} paddingY={1}>
          <Text fontWeight="medium" size={2} color="default2" paddingX={6}>
            {section}
          </Text>
          {sectionActions?.map(action => (
            <button
              key={action.id}
              id={action.id}
              type="button"
              className="command-menu-item"
              data-test-id={action.id}
              onClick={() => {
                onActionSelected();
                action.onSelect(context);
              }}
            >
              <Box
                className="command-menu-item-content"
                display="flex"
                alignItems="center"
                color="default1"
                gap={2}
                paddingX={6}
                paddingY={1.5}
                role="option"
                tabIndex={-1}
              >
                {action.avatar && (
                  <img src={action.avatar} alt="" width={20} height={20} loading="lazy" />
                )}
                <Text size={2} fontWeight="medium" color="default1">
                  {action.label}
                </Text>
              </Box>
            </button>
          ))}
        </Box>
      ))}
    </Box>
  );
};
