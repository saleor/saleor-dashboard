import { ListSearchInput } from "@dashboard/components/ListSearchInput/ListSearchInput";
import { type SearchPageProps } from "@dashboard/types";

interface SearchInputProps extends SearchPageProps {
  placeholder: string;
  showSearchTooltip?: boolean;
}

const SearchInput = ({
  initialSearch,
  onSearchChange,
  placeholder,
  showSearchTooltip = false,
}: SearchInputProps): React.ReactNode => (
  <ListSearchInput
    initialSearch={initialSearch}
    placeholder={placeholder}
    onSearchChange={onSearchChange}
    showTooltip={showSearchTooltip}
  />
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
