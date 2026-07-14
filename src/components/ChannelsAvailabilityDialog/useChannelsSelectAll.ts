import { useCallback } from "react";

interface UseChannelsSelectAllParams<T extends { name: string }> {
  channels: T[];
  filteredChannels: T[];
  query: string;
  isSelected: (channel: T) => boolean;
  onChange: (channel: T) => void;
  selected?: number;
  toggleAll?: (items: T[], selected: number) => void;
}

export function useChannelsSelectAll<T extends { name: string }>({
  channels,
  filteredChannels,
  query,
  isSelected,
  onChange,
  selected,
  toggleAll,
}: UseChannelsSelectAllParams<T>) {
  const isSearchActive = query.trim().length > 0;
  const visibleChannels = isSearchActive ? filteredChannels : channels;
  const hasAllVisibleSelected =
    visibleChannels.length > 0 && visibleChannels.every(channel => isSelected(channel));

  const handleToggleAll = useCallback(() => {
    if (isSearchActive) {
      visibleChannels.forEach(channel => {
        if (hasAllVisibleSelected) {
          if (isSelected(channel)) {
            onChange(channel);
          }
        } else if (!isSelected(channel)) {
          onChange(channel);
        }
      });

      return;
    }

    toggleAll?.(channels, selected ?? 0);
  }, [
    channels,
    hasAllVisibleSelected,
    isSearchActive,
    isSelected,
    onChange,
    selected,
    toggleAll,
    visibleChannels,
  ]);

  return { hasAllVisibleSelected, handleToggleAll, isSearchActive };
}
