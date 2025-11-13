import { useIntl } from "react-intl";

import { FilterContainer, FilterElement } from "./FilterElement";
import { leftOperatorsMessages } from "./intl";
import { LeftOperand } from "./LeftOperandsProvider";

type TranslationKeys = keyof typeof leftOperatorsMessages;

export const useTranslate = () => {
  const intl = useIntl();
  const formatLeftOperand = (label: TranslationKeys) => {
    const key = leftOperatorsMessages[label];

    if (!key) return label;

    return intl.formatMessage(leftOperatorsMessages[label]);
  };

  return {
    translateOperandOptions: (operands: LeftOperand[]) =>
      operands.map(el => ({
        ...el,
        label: formatLeftOperand(el.label as TranslationKeys),
      })),
    translateSelectedOperands: (container: FilterContainer) =>
      container.map(el => {
        if (FilterElement.isFilterElement(el)) {
          el.value.setLabel(formatLeftOperand(el.value.label as TranslationKeys));
        }

        return el;
      }),
  };
};
