import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField
} from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButton } from "@saleor/components/ConfirmButton";
import CustomerAddressChoiceCard from "@saleor/customers/components/CustomerAddressChoiceCard";
import { CustomerAddresses_user_addresses } from "@saleor/customers/types/CustomerAddresses";
import { buttonMessages } from "@saleor/intl";
import { SearchIcon } from "@saleor/macaw-ui";
import { AddressTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getById } from "../OrderReturnPage/utils";
import { addressSearchMessages as messages } from "./messages";
import { useStyles } from "./styles";
import { parseQuery, stringifyAddress } from "./utils";

export interface OrderCustomerAddressesSearchProps {
  type: AddressTypeEnum;
  selectedCustomerAddressId?: string;
  customerAddresses: CustomerAddresses_user_addresses[];
  onChangeCustomerShippingAddress: (
    customerAddress: CustomerAddresses_user_addresses
  ) => void;
  onChangeCustomerBillingAddress: (
    customerAddress: CustomerAddresses_user_addresses
  ) => void;
  exitSearch();
}

const OrderCustomerAddressesSearch: React.FC<OrderCustomerAddressesSearchProps> = props => {
  const {
    type,
    selectedCustomerAddressId,
    customerAddresses,
    onChangeCustomerShippingAddress,
    onChangeCustomerBillingAddress,
    exitSearch
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const initialAddress = customerAddresses.find(
    getById(selectedCustomerAddressId)
  );

  const [query, setQuery] = React.useState("");
  const [
    temporarySelectedAddress,
    setTemporarySelectedAddress
  ] = React.useState(initialAddress);

  const handleSelect = () => {
    if (type === AddressTypeEnum.SHIPPING) {
      onChangeCustomerShippingAddress(temporarySelectedAddress);
    } else {
      onChangeCustomerBillingAddress(temporarySelectedAddress);
    }
    exitSearch();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredCustomerAddresses = customerAddresses.filter(address => {
    const parsedAddress = stringifyAddress(address);

    return parsedAddress.search(new RegExp(parseQuery(query), "i")) >= 0;
  });

  return (
    <>
      <DialogTitle>
        {type === AddressTypeEnum.SHIPPING ? (
          <FormattedMessage {...messages.shippingTitle} />
        ) : (
          <FormattedMessage {...messages.billingTitle} />
        )}
      </DialogTitle>
      <DialogContent>
        {intl.formatMessage(messages.searchInfo)}
        <CardSpacer />
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
        <CardSpacer />
        <div className={classes.scrollableWrapper}>
          {filteredCustomerAddresses.length === 0
            ? intl.formatMessage(messages.noResultsFound)
            : filteredCustomerAddresses?.map(address => (
                <React.Fragment key={address.id}>
                  <CustomerAddressChoiceCard
                    selected={address.id === temporarySelectedAddress.id}
                    onSelect={() => setTemporarySelectedAddress(address)}
                    address={address}
                  />
                  <CardSpacer />
                </React.Fragment>
              ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => exitSearch()} color="primary">
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
        <ConfirmButton
          variant="primary"
          transitionState="default"
          onClick={handleSelect}
        >
          <FormattedMessage {...buttonMessages.select} />
        </ConfirmButton>
      </DialogActions>
    </>
  );
};

OrderCustomerAddressesSearch.displayName = "OrderCustomerAddressesSearch";
export default OrderCustomerAddressesSearch;
