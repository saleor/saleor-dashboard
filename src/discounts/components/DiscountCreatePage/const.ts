import { RewardValueTypeEnum } from "@dashboard/graphql";

import { Inputs, Rule } from "./types";

export const initialFormValues: Inputs = {
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

export const initialRuleValues: Rule = {
  channels: [],
  description: "",
  name: "",
  rewardValue: 0,
  rewardValueType: RewardValueTypeEnum.PERCENTAGE,
};
