import { Input } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface ChannelsAvailabilitySearchFieldProps {
  query: string;
  onQueryChange: (query: string) => void;
  label?: string;
  placeholder?: string;
  inputTestId?: string;
}

export const ChannelsAvailabilitySearchField = ({
  query,
  onQueryChange,
  label,
  placeholder,
  inputTestId,
}: ChannelsAvailabilitySearchFieldProps) => {
  const intl = useIntl();
  const defaultSearchText = intl.formatMessage({
    id: "ybaLoZ",
    defaultMessage: "Search through channels",
  });
  const searchLabel = label ?? defaultSearchText;
  const searchPlaceholder = placeholder ?? defaultSearchText;

  return (
    <Input
      name="query"
      value={query}
      onChange={event => onQueryChange(event.target.value)}
      label={searchLabel}
      placeholder={searchPlaceholder}
      data-test-id={inputTestId}
      autoComplete="off"
    />
  );
};
