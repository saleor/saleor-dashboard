import { FilterElement, IFilter } from "@dashboard/components/Filter";

export const getSelectedFilterAmount = <TFilterKeys extends string = string>(
  menu: IFilter<TFilterKeys>,
  data: Array<FilterElement<TFilterKeys>>,
) =>
  menu.reduce((acc, filterElement) => {
    const dataFilterElement = data.find(({ name }) => name === filterElement.name);

    if (!dataFilterElement) {
      return acc;
    }

    return acc + (dataFilterElement.active ? 1 : 0);
  }, 0);
