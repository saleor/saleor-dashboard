import Debounce from "@dashboard/components/Debounce";
import { Search } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";

import { SearchTooltip } from "../../../components/AppLayout/ListFilters/components/SearchTooltip/SearchTooltip";
import styles from "./ModelSearchInput.module.css";

interface ModelSearchInputProps {
  initialSearch: string;
  placeholder: string;
  onSearchChange: (value: string) => void;
  showTooltip?: boolean;
}

export const ModelSearchInput = ({
  initialSearch,
  placeholder,
  onSearchChange,
  showTooltip = true,
}: ModelSearchInputProps) => {
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => setSearch(initialSearch), [initialSearch]);

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

ModelSearchInput.displayName = "ModelSearchInput";
