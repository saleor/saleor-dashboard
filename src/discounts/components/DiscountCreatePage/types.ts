import { RewardValueTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

export interface Inputs {
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
  rewardValueType: RewardValueTypeEnum;
  rewardValue: number;
}
