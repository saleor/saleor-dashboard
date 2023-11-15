import { RewardValueTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

export interface CreateDiscoutFormData {
  name: string;
  description: string;
  dates: {
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    startDate: string;
    startTime: string;
  };
  rules: Rule[];
}

export interface Rule {
  name: string;
  description: string;
  channels: Option[];
  conditions: Condition[];
  rewardValueType: RewardValueTypeEnum;
  rewardValue: number;
}

export interface Condition {
  type: "product" | "category" | "collection" | "variant";
  condition: "is";
  values: Option[];
}
