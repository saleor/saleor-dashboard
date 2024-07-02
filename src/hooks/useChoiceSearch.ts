import { Choice } from "@dashboard/components/SingleSelectField";
import { fuzzySearch } from "@dashboard/misc";
import { useMemo, useState } from "react";

function useChoiceSearch(choices: Array<Choice<string, string>>) {
  const [query, setQuery] = useState("");
  const sortedChoices = useMemo(
    () => fuzzySearch(choices, query, ["label"]) || [],
    [choices, query],
  );

  return { search: setQuery, result: sortedChoices };
}

export default useChoiceSearch;
