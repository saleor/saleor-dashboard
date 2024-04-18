// @ts-strict-ignore
import { removeAtIndex } from "@dashboard/utils/lists";

import useStateFromProps from "./useStateFromProps";

export type FormsetChange<TValue = any> = (id: string, value: TValue) => void;
export interface FormsetAtomicData<TData = {}, TValue = any, TMetadata = any> {
  data: TData;
  metadata?: TMetadata;
  id: string;
  label: string;
  value: TValue;
}
export type FormsetData<TData = {}, TValue = any, TMetadata = any> = Array<
  FormsetAtomicData<TData, TValue, TMetadata>
>;
export type FormsetMetadataChange<TMetadata = any> = (
  id: string,
  metadata: TMetadata,
  merge?: (prev: TMetadata, next: TMetadata) => TMetadata,
) => void;
export interface UseFormsetOutput<TData = {}, TValue = any, TMetadata = any> {
  add: (data: FormsetAtomicData<TData, TValue, TMetadata>) => void;
  change: FormsetChange<TValue>;
  data: FormsetData<TData, TValue, TMetadata>;
  setMetadata: (id: string, metadata: TMetadata) => void;
  get: (id: string) => FormsetAtomicData<TData, TValue>;
  // Used for some rare situations like dataset change
  set: (data: FormsetData<TData, TValue>) => void;
  remove: (id: string) => void;
}
function useFormset<TData = {}, TValue = any, TMetadata = any>(
  initial: FormsetData<TData, TValue>,
): UseFormsetOutput<TData, TValue> {
  const [data, setData] = useStateFromProps<FormsetData<TData, TValue, TMetadata>>(initial || []);

  function addItem(itemData: FormsetAtomicData<TData, TValue, TMetadata>) {
    setData(prevData => [...prevData, itemData]);
  }

  function getItem(id: string): FormsetAtomicData<TData, TValue, TMetadata> {
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

  const setItemMetadata: FormsetMetadataChange = (
    id: string,
    metadata: TMetadata,
    merge?: (prev, next) => TMetadata,
  ) => {
    setData(data =>
      data.map(item =>
        item.id === id
          ? {
              ...item,
              metadata: merge ? merge(item.metadata, metadata) : metadata,
            }
          : item,
      ),
    );
  };

  return {
    add: addItem,
    change: setItemValue,
    data,
    setMetadata: setItemMetadata,
    get: getItem,
    remove: removeItem,
    set: setData,
  };
}

export default useFormset;
