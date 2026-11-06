import { type RewardTypeEnum, type RewardValueTypeEnum } from "@dashboard/graphql";
import { type Option } from "@saleor/macaw-ui-next";

import { type Condition } from "./Condition";

export interface RuleChannel {
  id: string;
  name: string;
  currencyCode: string;
}

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
  /**
   * Channels the rule applies in besides `channel`. The rule form edits one channel, but a rule
   * made through the API can have more; the form shows these and keeps them.
   */
  otherChannels?: RuleChannel[];
}
