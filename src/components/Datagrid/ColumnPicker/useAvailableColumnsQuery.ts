import React from "react";

export const useAvailableColumnsQuery = currentCategory => {
  const [query, setQuery] = React.useState<string>("");
  React.useEffect(() => {
    if (currentCategory) {
      setQuery(currentCategory.initialSearch ?? "");
    }
  }, [currentCategory]);

  return { query, setQuery };
};
