import { TextField } from "@material-ui/core";
import { useIntl } from "react-intl";

interface ChannelsAvailabilitySearchFieldProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export const ChannelsAvailabilitySearchField = ({
  query,
  onQueryChange,
}: ChannelsAvailabilitySearchFieldProps) => {
  const intl = useIntl();
  const searchText = intl.formatMessage({
    id: "ybaLoZ",
    defaultMessage: "Search through channels",
  });

  return (
    <TextField
      name="query"
      value={query}
      onChange={event => onQueryChange(event.target.value)}
      label={searchText}
      placeholder={searchText}
      fullWidth
      InputProps={{
        autoComplete: "off",
      }}
    />
  );
};
