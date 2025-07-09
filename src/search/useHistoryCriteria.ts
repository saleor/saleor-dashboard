import useLocalStorage from "@dashboard/hooks/useLocalStorage";

const MAX_HISTORY_ITEMS = 20;

export const useHistoryCriteria = () => {
  const [history, setHistory] = useLocalStorage<string[]>("search-history", []);

  const addToHistory = (query: string) => {
    if (query.trim() === "") return;

    setHistory((prev: string[]) => {
      const newHistory = prev.filter(item => item !== query);

      return [query, ...newHistory].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const clearItem = (query: string) => {
    setHistory((prev: string[]) => prev.filter(item => item !== query));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addToHistory, clearHistory, clearItem };
};
