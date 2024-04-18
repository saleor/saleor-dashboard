import { CheckIfOrderExistsQueryHookResult, useCheckIfOrderExistsQuery } from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { useState } from "react";

function useCheckIfOrderExists(): [CheckIfOrderExistsQueryHookResult, (query: string) => void] {
  const [id, setId] = useState("");
  const setIdDebounced = useDebounce(setId);
  const result = useCheckIfOrderExistsQuery({
    skip: id === "",
    variables: {
      id,
    },
  });

  return [result, setIdDebounced];
}
export default useCheckIfOrderExists;
