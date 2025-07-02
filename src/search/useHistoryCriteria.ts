import useLocalStorage from "@dashboard/hooks/useLocalStorage";

export const useHistoryCriteria = () => {
  const [history, setHistory] = useLocalStorage<string[]>("search-history", []);

  const addToHistory = (query: string) => {
    if (query.trim() === "") return;

    setHistory((prev: string[]) => {
      const newHistory = prev.filter(item => item !== query);

      return [query, ...newHistory].slice(0, 20);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
};
