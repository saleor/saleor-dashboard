import { DateContext } from "@saleor/components/Date/DateContext";
import { useContext } from "react";

function useCurrentDate(): number {
  const currentDate = useContext(DateContext);

  return currentDate;
}

export default useCurrentDate;
