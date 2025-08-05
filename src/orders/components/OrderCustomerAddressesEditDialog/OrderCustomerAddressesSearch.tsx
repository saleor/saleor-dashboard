// @ts-strict-ignore
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import CustomerAddressChoiceCard from "@dashboard/customers/components/CustomerAddressChoiceCard";
import { AddressFragment, AddressTypeEnum } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { Checkbox, FormControlLabel, InputAdornment, TextField } from "@material-ui/core";
import { Button, SearchIcon } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { dialogMessages as messages } from "./messages";
import { useStyles } from "./styles";
import { parseQuery, stringifyAddress } from "./utils";

export interface OrderCustomerAddressesSearchProps {
  type: AddressTypeEnum;
  cloneAddress: boolean;
  formChange: FormChange;
  openFromCustomerChange: boolean;
  transitionState: ConfirmButtonTransitionState;
  selectedCustomerAddressId: string;
  customerAddresses: AddressFragment[];
  onChangeCustomerShippingAddress: (customerAddress: AddressFragment) => void;
  onChangeCustomerBillingAddress: (customerAddress: AddressFragment) => void;
  exitSearch: () => any;
}

const OrderCustomerAddressesSearch = (props: OrderCustomerAddressesSearchProps) => {
  const {
    type,
    cloneAddress,
    formChange,
    transitionState,
    openFromCustomerChange,
    selectedCustomerAddressId,
    customerAddresses,
    onChangeCustomerShippingAddress,
    onChangeCustomerBillingAddress,
    exitSearch,
  } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const initialAddress = customerAddresses.find(getById(selectedCustomerAddressId));
  const [query, setQuery] = React.useState("");
  const [temporarySelectedAddress, setTemporarySelectedAddress] = React.useState(initialAddress);
  const handleSelect = () => {
    if (type === AddressTypeEnum.SHIPPING) {
      onChangeCustomerShippingAddress(temporarySelectedAddress);
    } else {
      onChangeCustomerBillingAddress(temporarySelectedAddress);
    }

    if (openFromCustomerChange) {
      exitSearch();
    }
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
      {intl.formatMessage(messages.searchInfo)}

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
          ),
        }}
        inputProps={{ className: classes.searchInput }}
      />

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
              </React.Fragment>
            ))}
      </div>

      {!openFromCustomerChange && filteredCustomerAddresses.length !== 0 && (
        <FormControlLabel
          control={
            <Checkbox
              checked={cloneAddress}
              name="cloneAddress"
              onChange={() =>
                formChange({
                  target: {
                    name: "cloneAddress",
                    value: !cloneAddress,
                  },
                })
              }
            />
          }
          label={intl.formatMessage(
            type === AddressTypeEnum.SHIPPING
              ? messages.billingSameAsShipping
              : messages.shippingSameAsBilling,
          )}
        />
      )}

      <DashboardModal.Actions>
        <Button onClick={exitSearch} variant="secondary">
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
        <ConfirmButton
          variant="primary"
          transitionState={transitionState}
          type={openFromCustomerChange ? undefined : "submit"}
          onClick={handleSelect}
        >
          <FormattedMessage {...buttonMessages.select} />
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};

OrderCustomerAddressesSearch.displayName = "OrderCustomerAddressesSearch";
export default OrderCustomerAddressesSearch;
