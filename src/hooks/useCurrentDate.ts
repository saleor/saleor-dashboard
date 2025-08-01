import { DateContext } from "@dashboard/components/Date/DateContext";
import { useContext } from "react";

/**
 * @deprecated Use `Date.now()` directly instead.
 */
function useCurrentDate(): number {
  const currentDate = useContext(DateContext);

  return currentDate;
}

export default useCurrentDate;
