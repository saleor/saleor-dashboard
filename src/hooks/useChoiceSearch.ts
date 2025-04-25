import { fuzzySearch } from "@dashboard/misc";
import { Option } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";

function useChoiceSearch(choices: Option[]) {
  const [query, setQuery] = useState("");
  const sortedChoices = useMemo(
    () => fuzzySearch(choices, query, ["label"]) || [],
    [choices, query],
  );

  return { search: setQuery, result: sortedChoices };
}

export default useChoiceSearch;
