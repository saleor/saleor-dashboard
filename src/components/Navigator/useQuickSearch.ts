import { useState } from "react";
import { useIntl } from "react-intl";

import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import { QuickSearchAction } from "./types";
import searchInViews from "./views";

export type QuickSearchMode = "default" | "orders" | "customers";
const threshold = 0.05;
const maxActions = 10;

type UseQuickSearch = [string, FormChange, QuickSearchAction[]];
function useQuickSearch(open: boolean): UseQuickSearch {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<QuickSearchMode>("default");
  const intl = useIntl();

  useModalDialogOpen(open, {
    onClose: () => setQuery("")
  });

  const change = (event: ChangeEvent) => {
    const value = event.target.value;

    setQuery(value);
  };

  return [
    query,
    change,
    [...searchInViews(query, intl)]
      .filter(action => action.score >= threshold)
      .sort((a, b) => (a.score <= b.score ? 1 : -1))
      .slice(0, maxActions)
  ];
}

export default useQuickSearch;
