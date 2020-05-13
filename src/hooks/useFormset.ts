import { removeAtIndex } from "@saleor/utils/lists";

import useStateFromProps from "./useStateFromProps";

export type FormsetChange<TValue = any> = (id: string, value: TValue) => void;
export interface FormsetAtomicData<TData = object, TValue = any> {
  data: TData;
  id: string;
  label: string;
  value: TValue;
}
export type FormsetData<TData = object, TValue = any> = Array<
  FormsetAtomicData<TData, TValue>
>;
export interface UseFormsetOutput<TData = object, TValue = any> {
  add: (data: FormsetAtomicData<TData, TValue>) => void;
  change: FormsetChange<TValue>;
  data: FormsetData<TData, TValue>;
  get: (id: string) => FormsetAtomicData<TData, TValue>;
  // Used for some rare situations like dataset change
  set: (data: FormsetData<TData, TValue>) => void;
  remove: (id: string) => void;
}
function useFormset<TData = object, TValue = any>(
  initial: FormsetData<TData, TValue>
): UseFormsetOutput<TData, TValue> {
  const [data, setData] = useStateFromProps<FormsetData<TData, TValue>>(
    initial || []
  );

  function addItem(itemData: FormsetAtomicData<TData, TValue>) {
    setData(prevData => [...prevData, itemData]);
  }

  function getItem(id: string): FormsetAtomicData<TData, TValue> {
    return data.find(item => item.id === id);
  }

  function removeItem(id: string) {
    setData(prevData =>
      removeAtIndex(
        prevData,
        prevData.findIndex(item => item.id === id)
      )
    );
  }

  function setItemValue(id: string, value: TValue) {
    const itemIndex = data.findIndex(item => item.id === id);
    setData([
      ...data.slice(0, itemIndex),
      {
        ...data[itemIndex],
        value
      },
      ...data.slice(itemIndex + 1)
    ]);
  }

  return {
    add: addItem,
    change: setItemValue,
    data,
    get: getItem,
    remove: removeItem,
    set: setData
  };
}

export default useFormset;
