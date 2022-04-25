import { Choice } from "@saleor/components/SingleSelectField";
import { score } from "fuzzaldrin";
import sortBy from "lodash/sortBy";
import { useMemo, useState } from "react";

function useChoiceSearch(choices: Array<Choice<string, string>>) {
  const [query, setQuery] = useState("");

  const sortedChoices = useMemo(
    () =>
      sortBy(
        choices.map(choice => ({
          ...choice,
          score: -score(choice.label as string, query)
        })),
        "score"
      ),
    [choices, query]
  );

  return { search: setQuery, result: sortedChoices };
}

export default useChoiceSearch;
