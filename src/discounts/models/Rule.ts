import { RewardTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { Condition } from "./Condition";

export interface Rule {
  id: string;
  name: string;
  description: string | null;
  channel: Option | null;
  rewardType: RewardTypeEnum | null;
  rewardValue: number | null;
  rewardValueType: RewardValueTypeEnum;
  rewardGifts: Option[];
  conditions: Condition[];
  hasPredicateNestedConditions?: boolean;
}
