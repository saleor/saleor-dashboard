import { parse as parseQs } from "qs";
import { useMemo } from "react";
import { useLocation } from "react-router";

function useQueryParams<
  TFields extends {
    [k: string]: any;
  }
>() {
  const { search } = useLocation();

  return useMemo(() => {
    const params = parseQs(search) as TFields;

    return params;
  }, [search]);
}

export default useQueryParams;
