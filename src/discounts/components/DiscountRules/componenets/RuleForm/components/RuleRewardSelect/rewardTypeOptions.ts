import { RewardTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

export const getRewardTypeOptions = (intl: IntlShape): Option[] => [
  {
    label: intl.formatMessage({
      defaultMessage: "Subtotal discount",
      id: "BVDaKx",
    }),
    value: RewardTypeEnum.SUBTOTAL_DISCOUNT,
  },
  {
    label: intl.formatMessage({ defaultMessage: "Gift", id: "ZBs2Pb" }),
    value: "GIFT",
  },
];
