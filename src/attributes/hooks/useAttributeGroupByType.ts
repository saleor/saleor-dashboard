import useLocalStorage from "@dashboard/hooks/useLocalStorage";

const ATTRIBUTE_LIST_GROUP_BY_TYPE_KEY = "attributeList.groupByType";

export const useAttributeGroupByType = () => {
  const [groupByType, setGroupByType] = useLocalStorage<boolean>(
    ATTRIBUTE_LIST_GROUP_BY_TYPE_KEY,
    true,
  );

  return {
    groupByType,
    setGroupByType,
  };
};
