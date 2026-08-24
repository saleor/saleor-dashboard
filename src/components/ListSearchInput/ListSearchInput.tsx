import Debounce from "@dashboard/components/Debounce";
import { Search } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";

import { SearchTooltip } from "../AppLayout/ListFilters/components/SearchTooltip/SearchTooltip";
import styles from "./ListSearchInput.module.css";

interface ListSearchInputProps {
  initialSearch: string;
  placeholder: string;
  onSearchChange: (value: string) => void;
  showTooltip?: boolean;
}

export const ListSearchInput = ({
  initialSearch,
  placeholder,
  onSearchChange,
  showTooltip = true,
}: ListSearchInputProps): JSX.Element => {
  const [search, setSearch] = useState(initialSearch);

  useEffect(
    function syncSearchFromUrl() {
      setSearch(initialSearch);
    },
    [initialSearch],
  );

  return (
    <Debounce debounceFn={onSearchChange} time={500}>
      {debounceSearchChange => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;

          setSearch(value);
          debounceSearchChange(value);
        };

        return (
          <div className={styles.wrapper}>
            <Search size={16} color="var(--mu-colors-text-default2)" />
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder={placeholder}
              className={styles.input}
              data-test-id="search-input"
            />
            {showTooltip && <SearchTooltip />}
          </div>
        );
      }}
    </Debounce>
  );
};

ListSearchInput.displayName = "ListSearchInput";
