import { DiscountUrlQueryParams } from "@dashboard/discounts/urls";
import React from "react";

interface DiscountDetailsProps {
  id: string;
  params: DiscountUrlQueryParams;
}

export const DiscountDetails = (props: DiscountDetailsProps) => {
  return <div>Discount details</div>;
};
