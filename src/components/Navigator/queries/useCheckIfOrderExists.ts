import gql from "graphql-tag";
import { useState } from "react";

import makeQuery, { UseQueryResult } from "@saleor/hooks/makeQuery";
import useDebounce from "@saleor/hooks/useDebounce";
import {
  CheckIfOrderExists,
  CheckIfOrderExistsVariables
} from "./types/CheckIfOrderExists";

const checkIfOrderExists = gql`
  query CheckIfOrderExists($id: ID!) {
    order(id: $id) {
      id
      status
    }
  }
`;

const useCheckIfOrderExistsQuery = makeQuery<
  CheckIfOrderExists,
  CheckIfOrderExistsVariables
>(checkIfOrderExists);

type UseCheckIfOrderExists = [
  UseQueryResult<CheckIfOrderExists, CheckIfOrderExistsVariables>,
  (query: string) => void
];
function useCheckIfOrderExists(): UseCheckIfOrderExists {
  const [id, setId] = useState("");
  const setIdDebounced = useDebounce(setId);
  const result = useCheckIfOrderExistsQuery({
    skip: id === "",
    variables: {
      id
    }
  });

  return [result, setIdDebounced];
}
export default useCheckIfOrderExists;
