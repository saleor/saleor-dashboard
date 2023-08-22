import { useIntl } from "react-intl";

import { FilterContainer, FilterElement } from "./FilterElement";
import { leftOperatorsMessages } from "./intl";
import { LeftOperand } from "./LeftOperandsProvider";

type TranslationKeys = keyof typeof leftOperatorsMessages;

export const useTranslate = () => {
  const intl = useIntl();

  return {
    translateOperandOptions: (operands: LeftOperand[]) =>
      operands.map(el => ({
        ...el,
        label: intl.formatMessage(
          leftOperatorsMessages[el.label as TranslationKeys],
        ),
      })),
    translateSelectedOperands: (container: FilterContainer) =>
      container.map(el => {
        if (FilterElement.isCompatible(el)) {
          el.value.setLabel(
            intl.formatMessage(
              leftOperatorsMessages[el.value.label as TranslationKeys],
            ),
          );
        }

        return el;
      }),
  };
};
