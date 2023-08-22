import { useIntl } from "react-intl";

import { FilterContainer, FilterElement } from "./FilterElement";
import { leftOperatorsMessages } from "./intl";
import { LeftOperand } from "./LeftOperandsProvider";

export const useTranslate = () => {
  const intl = useIntl();

  return {
    translateOperandOptions: (operands: LeftOperand[]) =>
      operands.map(el => ({
        ...el,
        label: intl.formatMessage(leftOperatorsMessages[el.label]),
      })),
    translateSelectedOperands: (container: FilterContainer) =>
      container.map(el => {
        if (FilterElement.isCompatible(el)) {
          el.value.setLabel(
            intl.formatMessage(leftOperatorsMessages[el.value.label]),
          );
        }

        return el;
      }),
  };
};
