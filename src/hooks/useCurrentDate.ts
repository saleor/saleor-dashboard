import { DateContext } from "@dashboard/components/Date/DateContext";
import { useContext } from "react";

function useCurrentDate(): number {
  const currentDate = useContext(DateContext);

  return currentDate;
}

export default useCurrentDate;
