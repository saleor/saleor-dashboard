import { useIntl } from "react-intl";

import { localizeStaticFilterLabel } from "./displayMessages";
import { type FilterContainer, FilterElement } from "./FilterElement/FilterElement";
import { type LeftOperand } from "./LeftOperandsProvider";

export const useTranslate = () => {
  const intl = useIntl();

  return {
    translateOperandOptions: (operands: LeftOperand[]) =>
      operands.map(el => ({
        ...el,
        label: localizeStaticFilterLabel(el.label, el.type, el.slug, intl),
      })),
    translateSelectedOperands: (container: FilterContainer) =>
      container.map(el => {
        if (FilterElement.isFilterElement(el)) {
          el.value.setLabel(
            localizeStaticFilterLabel(el.value.label, el.value.type, el.value.value, intl),
          );
        }

        return el;
      }),
  };
};
