import {
  CheckIfOrderExistsQueryHookResult,
  useCheckIfOrderExistsQuery,
} from "@saleor/graphql";
import useDebounce from "@saleor/hooks/useDebounce";
import { useState } from "react";

function useCheckIfOrderExists(): [
  CheckIfOrderExistsQueryHookResult,
  (query: string) => void,
] {
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
