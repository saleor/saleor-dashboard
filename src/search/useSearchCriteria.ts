import useNavigator from "@dashboard/hooks/useNavigator";
import { parse as parseQs } from "qs";
import { useState } from "react";

export const useSearchCriteria = () => {
  const navigate = useNavigator();

  const qs = parseQs(window.location.search.substr(1));
  const urlQuery = (qs.q as string) || "";
  const urlScope = (qs.scope as string) || "all";

  const [query, setQuery] = useState(urlQuery);
  const [scope, setScope] = useState(urlScope);

  const changeScope = (scope: string) => {
    setScope(scope);
    navigate(`?q=${query}&scope=${scope}`, { replace: true });
  };

  const changeQuery = (query: string) => {
    setQuery(query);
    navigate(`?q=${query}&scope=${scope}`, { replace: true });
  };

  return {
    query,
    scope,
    changeScope,
    changeQuery,
  };
};
