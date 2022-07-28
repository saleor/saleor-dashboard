import useStateFromProps from "./useStateFromProps";

function useListActions<TData>(
  initial: TData[] = [],
  compareFunc: (a: TData, b: TData) => boolean = (a, b) => a === b,
) {
  const [listElements, setListElements] = useStateFromProps(initial);

  function isSelected(data: TData) {
    return !!listElements.find(listElement => compareFunc(listElement, data));
  }

  function add(data: TData) {
    setListElements([...listElements, data]);
  }

  function remove(data: TData) {
    setListElements(
      listElements.filter(listElement => !compareFunc(listElement, data)),
    );
  }

  function reset() {
    setListElements([]);
  }

  function toggle(data: TData) {
    if (isSelected(data)) {
      remove(data);
    } else {
      add(data);
    }
  }

  function set(data: TData[]) {
    setListElements(data);
  }

  return {
    add,
    isSelected,
    listElements,
    remove,
    reset,
    set,
    toggle,
  };
}
export default useListActions;
