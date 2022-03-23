import { InputAdornment, TextField, Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import Skeleton from "@saleor/components/Skeleton";
import CustomerAddressChoiceCard from "@saleor/customers/components/CustomerAddressChoiceCard";
import { AddressFragment } from "@saleor/graphql";
import { SearchIcon } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { dialogMessages as messages } from "./messages";
import { useStyles } from "./styles";
import { parseQuery, stringifyAddress } from "./utils";

export interface OrderCustomerAddressesSearchProps {
  selectedCustomerAddressId: string;
  customerAddresses: AddressFragment[];
  loading?: boolean;
  temporarilySelectedAddress?: AddressFragment;
  setTemporaryAddress: (address: AddressFragment) => void;
}

const OrderCustomerAddressesSearch: React.FC<OrderCustomerAddressesSearchProps> = props => {
  const {
    customerAddresses,
    loading,
    temporarilySelectedAddress,
    setTemporaryAddress
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const [query, setQuery] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredCustomerAddresses = customerAddresses.filter(address => {
    const parsedAddress = stringifyAddress(address);

    return parsedAddress.search(new RegExp(parseQuery(query), "i")) >= 0;
  });

  return (
    <>
      <TextField
        value={query}
        variant="outlined"
        onChange={handleChange}
        placeholder={"Search addresses"}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        inputProps={{ className: classes.searchInput }}
      />
      <VerticalSpacer spacing={2} />
      <div
        className={classNames(classes.wrapper, {
          [classes.scrollableWrapper]: filteredCustomerAddresses.length > 0
        })}
      >
        {loading ? (
          <Skeleton />
        ) : filteredCustomerAddresses.length === 0 ? (
          <Typography>
            {intl.formatMessage(
              customerAddresses.length
                ? messages.noResultsFound
                : messages.customerHasNoAddresses
            )}
          </Typography>
        ) : (
          filteredCustomerAddresses?.map(address => (
            <React.Fragment key={address.id}>
              <CustomerAddressChoiceCard
                selected={address.id === temporarilySelectedAddress?.id}
                onSelect={() => setTemporaryAddress(address)}
                address={address}
              />
              {filteredCustomerAddresses.length > 1 && (
                <VerticalSpacer spacing={2} />
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </>
  );
};

OrderCustomerAddressesSearch.displayName = "OrderCustomerAddressesSearch";
export default OrderCustomerAddressesSearch;
