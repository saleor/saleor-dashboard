import { DiscountFormData } from "@dashboard/discounts/types";
import { PromotionTypeEnum } from "@dashboard/graphql";

export const initialFormValues: DiscountFormData = {
  type: PromotionTypeEnum.CATALOGUE,
  name: "",
  description: "",
  dates: {
    endDate: "",
    endTime: "",
    hasEndDate: false,
    startDate: "",
    startTime: "",
  },
  rules: [],
};
