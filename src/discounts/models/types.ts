import {
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { DiscountType } from "../types";
import { Condition } from "./Condition";

export interface Rule {
  type: DiscountType;
  id: string;
  name: string;
  description: string | null;
  channel: Option | null;
  rewardType: RewardTypeEnum | null;
  rewardValue: number;
  rewardValueType: RewardValueTypeEnum;
  conditions: Condition[];
  toAPI: () => PromotionRuleInput;
}
