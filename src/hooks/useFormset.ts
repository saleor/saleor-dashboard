// @ts-strict-ignore
import { removeAtIndex } from "@dashboard/utils/lists";

import useStateFromProps from "./useStateFromProps";

/** @deprecated Use react-hook-form instead */
export type FormsetChange<TValue = any> = (id: string, value: TValue) => void;

/** @deprecated Use react-hook-form instead */
export interface FormsetAtomicData<TData = {}, TValue = any, TAdditionalData = any> {
  data: TData;
  additionalData?: TAdditionalData;
  id: string;
  label: string;
  value: TValue;
}

/** @deprecated Use react-hook-form instead */
export type FormsetData<TData = {}, TValue = any, TAdditionalData = any> = Array<
  FormsetAtomicData<TData, TValue, TAdditionalData>
>;

/** @deprecated Use react-hook-form instead */
export type FormsetAdditionalDataChange<TAdditionalData = any> = (
  id: string,
  additionalData: TAdditionalData,
  merge?: (prev: TAdditionalData, next: TAdditionalData) => TAdditionalData,
) => void;

/** @deprecated Use react-hook-form instead */
export interface UseFormsetOutput<TData = {}, TValue = any, TAdditionalData = any> {
  add: (data: FormsetAtomicData<TData, TValue, TAdditionalData>) => void;
  change: FormsetChange<TValue>;
  data: FormsetData<TData, TValue, TAdditionalData>;
  setAdditionalData: (
    id: string,
    additionalData: TAdditionalData,
    merge?: (prev: TAdditionalData, next: TAdditionalData) => TAdditionalData,
  ) => void;
  get: (id: string) => FormsetAtomicData<TData, TValue>;
  // Used for some rare situations like dataset change
  set: (data: FormsetData<TData, TValue>) => void;
  remove: (id: string) => void;
}

/** @deprecated Use react-hook-form instead */
function useFormset<TData = {}, TValue = any, TAdditionalData = any>(
  initial: FormsetData<TData, TValue>,
): UseFormsetOutput<TData, TValue> {
  const [data, setData] = useStateFromProps<FormsetData<TData, TValue, TAdditionalData>>(
    initial || [],
  );

  function addItem(itemData: FormsetAtomicData<TData, TValue, TAdditionalData>) {
    setData(prevData => [...prevData, itemData]);
  }

  function getItem(id: string): FormsetAtomicData<TData, TValue, TAdditionalData> {
    return data.find(item => item.id === id);
  }

  function removeItem(id: string) {
    setData(prevData =>
      removeAtIndex(
        prevData,
        prevData.findIndex(item => item.id === id),
      ),
    );
  }

  function setItemValue(id: string, value: TValue) {
    setData(data => {
      const itemIndex = data.findIndex(item => item.id === id);

      return [
        ...data.slice(0, itemIndex),
        {
          ...data[itemIndex],
          value,
        },
        ...data.slice(itemIndex + 1),
      ];
    });
  }

  const setItemMetadata: FormsetAdditionalDataChange = (
    id: string,
    additionalData: TAdditionalData,
    merge?: (prev, next) => TAdditionalData,
  ) => {
    setData(data =>
      data.map(item =>
        item.id === id
          ? {
              ...item,
              additionalData: merge ? merge(item.additionalData, additionalData) : additionalData,
            }
          : item,
      ),
    );
  };

  return {
    add: addItem,
    change: setItemValue,
    data,
    setAdditionalData: setItemMetadata,
    get: getItem,
    remove: removeItem,
    set: setData,
  };
}

export default useFormset;
