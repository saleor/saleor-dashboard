import { IntlShape } from "react-intl";

import messages from "./messages";
import { SizePropertyEnum } from "./types";

export const getSizeParametersOptions = (intl: IntlShape) => [
  {
    label: intl.formatMessage(messages.diemensionChest),
    value: SizePropertyEnum.CHEST_CIRCUMFERENCE,
  },
  {
    label: intl.formatMessage(messages.dimensionWaist),
    value: SizePropertyEnum.WAIST_CIRCUMFERENCE,
  },
  {
    label: intl.formatMessage(messages.dimensionHips),
    value: SizePropertyEnum.HIPS_CIRCUMFERENCE,
  },
  {
    label: intl.formatMessage(messages.dimensionLength),
    value: SizePropertyEnum.LENGTH,
  },
];
