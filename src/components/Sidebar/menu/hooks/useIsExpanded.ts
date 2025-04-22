import useLocalStorage from "@dashboard/hooks/useLocalStorage";

type Expanded = {
  [key: string]: boolean;
};

export const useIsExpanded = (key: string) => {
  const [expanded, setExpanded] = useLocalStorage<Expanded>("sidebar-sections-expanded", null);

  const toggleExpanded = () => {
    setExpanded(prev => ({ ...prev, [key]: !expanded }));
  };

  return {
    isExpanded: expanded?.[key] ?? true,
    toggleExpanded,
  };
};
