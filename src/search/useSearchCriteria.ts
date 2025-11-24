import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import { parseQs } from "@dashboard/url-utils";
import { useEffect, useState } from "react";

export const useSearchCriteria = () => {
  const navigate = useNavigator();
  const [lsScope, setLsScope] = useLocalStorage<string>("search-scope", "all");

  const qs = parseQs(window.location.search.substr(1));
  const triggerSearch = (qs.t as string) || false;

  const urlQuery = (qs.q as string) || "";
  const urlScope = (qs.scope as string) || "";

  const [query, setQuery] = useState(urlQuery);
  const [scope, setScope] = useState(urlScope || lsScope);

  const changeScope = (scope: string) => {
    setScope(scope);
    setLsScope(scope);
    navigate(`?q=${query}&scope=${scope}`, { replace: true });
  };

  const changeQuery = (query: string) => {
    setQuery(query);
    navigate(`?q=${query}&scope=${scope}`, { replace: true });
  };

  useEffect(() => {
    if (urlScope) return;

    navigate(`?q=${query}&scope=${lsScope}`, { replace: true });
  }, []);

  useEffect(() => {
    if (!triggerSearch) return;

    changeQuery(urlQuery);
  }, [urlQuery, triggerSearch]);

  return {
    query,
    scope,
    changeScope,
    changeQuery,
  };
};
