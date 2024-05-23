import { useApolloClient } from "@apollo/client";
import { useState } from "react";

import { InitialOrderState } from "./InitialOrderState";

export const useInitialOrderState = () => {
  const client = useApolloClient();
  const [data, setData] = useState<InitialOrderState>(InitialOrderState.empty());
  const [loading, setLoading] = useState(true);

  return {
    data,
    loading: false,
  };
};
