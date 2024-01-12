import {
  PromotionRuleInput,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { DiscountType } from "../types";
import { CatalogRule } from "./CatalogRule/CatalogRule";
import { Condition } from "./Condition";
import { OrderRule } from "./OrderRule/OrderRule";

export interface BaseRule {
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

export type Rule = OrderRule | CatalogRule;
