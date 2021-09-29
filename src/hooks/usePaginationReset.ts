import { useEffect } from "react";

import useNavigator from "./useNavigator";

export const usePaginationReset = (url: string, rowNumber: number) => {
  const navigate = useNavigator();

  useEffect(() => navigate(url, true), [rowNumber]);
};
