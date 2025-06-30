import useNavigator from "@dashboard/hooks/useNavigator";
import { parse as parseQs } from "qs";

export const useSearchCriteria = () => {
  const navigate = useNavigator();
  const qs = parseQs(window.location.search.substr(1));

  const query = (qs.q as string) || "";
  const scope = (qs.scope as string) || "all";

  const changeScope = (scope: string) => {
    navigate(`?q=${query}&scope=${scope}`);
  };

  const changeQuery = (query: string) => {
    navigate(`?q=${query}&scope=${scope}`);
  };

  return {
    query,
    scope,
    changeScope,
    changeQuery,
  };
};
