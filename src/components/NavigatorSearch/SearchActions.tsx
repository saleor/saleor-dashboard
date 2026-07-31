import { useSearchActions } from "@dashboard/extensions/search-actions/useSearchActions";
import { useEffect } from "react";

import { SearchActionsList } from "./SearchActionsList";

interface SearchActionsProps {
  query: string;
  onActionSelected: () => void;
  onActionsChange: () => void;
}

export const SearchActions = ({ query, onActionSelected, onActionsChange }: SearchActionsProps) => {
  const { actions, context } = useSearchActions();

  // Extensions load asynchronously; let the keyboard navigation re-collect items
  // once the available action list changes.
  useEffect(() => {
    onActionsChange();
  }, [actions.length, onActionsChange]);

  return (
    <SearchActionsList
      actions={actions}
      context={context}
      query={query}
      onActionSelected={onActionSelected}
    />
  );
};
