import { getRandomString } from "@saleor/misc";
import { useMemo } from "react";

function useRandomString() {
  const randomString = useMemo(() => getRandomString(), []);

  return randomString;
}
export default useRandomString;
