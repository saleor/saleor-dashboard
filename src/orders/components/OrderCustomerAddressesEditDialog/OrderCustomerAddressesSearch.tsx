// @ts-strict-ignore
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import CustomerAddressChoiceCard from "@dashboard/customers/components/CustomerAddressChoiceCard";
import { type AddressFragment, AddressTypeEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { Checkbox, FormControlLabel, InputAdornment, TextField } from "@material-ui/core";
import { Button, SearchIcon } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import * as React from "react";
import { createContext, useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { dialogMessages as messages } from "./messages";
import { useStyles } from "./styles";
import { ORDER_CUSTOMER_ADDRESSES_EDIT_FORM_ID } from "./types";
import { parseQuery, stringifyAddress } from "./utils";

interface OrderCustomerAddressesSearchProps {
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
  children: React.ReactNode;
}

interface OrderCustomerAddressesSearchContextValue {
  exitSearch: () => void;
  handleSelect: () => void;
  openFromCustomerChange: boolean;
  transitionState: ConfirmButtonTransitionState;
  hasSearchResults: boolean;
}

const OrderCustomerAddressesSearchContext =
  createContext<OrderCustomerAddressesSearchContextValue | null>(null);

const useOrderCustomerAddressesSearchContext = (): OrderCustomerAddressesSearchContextValue => {
  const context = useContext(OrderCustomerAddressesSearchContext);

  if (!context) {
    throw new Error(
      "OrderCustomerAddressesSearch components must be used within OrderCustomerAddressesSearch",
    );
  }

  return context;
};

const useOrderCustomerAddressesSearchState = ({
  type,
  cloneAddress,
  formChange,
  openFromCustomerChange,
  transitionState,
  selectedCustomerAddressId,
  customerAddresses,
  onChangeCustomerShippingAddress,
  onChangeCustomerBillingAddress,
  exitSearch,
}: Omit<OrderCustomerAddressesSearchProps, "children">) => {
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

  const contextValue: OrderCustomerAddressesSearchContextValue = {
    exitSearch,
    handleSelect,
    openFromCustomerChange,
    transitionState,
    hasSearchResults: filteredCustomerAddresses.length > 0,
  };

  const contentContextValue: OrderCustomerAddressesSearchContentContextValue = {
    cloneAddress,
    filteredCustomerAddresses,
    formChange,
    handleChange,
    query,
    setTemporarySelectedAddress,
    temporarySelectedAddress,
    type,
  };

  return { contentContextValue, contextValue };
};

export const OrderCustomerAddressesSearchProvider = ({
  children,
  ...props
}: OrderCustomerAddressesSearchProps) => {
  const { contentContextValue, contextValue } = useOrderCustomerAddressesSearchState(props);

  return (
    <OrderCustomerAddressesSearchContext.Provider value={contextValue}>
      <OrderCustomerAddressesSearchContentContext.Provider value={contentContextValue}>
        {children}
      </OrderCustomerAddressesSearchContentContext.Provider>
    </OrderCustomerAddressesSearchContext.Provider>
  );
};

const OrderCustomerAddressesSearch = ({
  children,
  ...props
}: OrderCustomerAddressesSearchProps) => {
  return (
    <OrderCustomerAddressesSearchProvider {...props}>
      {children}
    </OrderCustomerAddressesSearchProvider>
  );
};

interface OrderCustomerAddressesSearchContentContextValue {
  cloneAddress: boolean;
  filteredCustomerAddresses: AddressFragment[];
  formChange: FormChange;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  setTemporarySelectedAddress: React.Dispatch<React.SetStateAction<AddressFragment | undefined>>;
  temporarySelectedAddress: AddressFragment | undefined;
  type: AddressTypeEnum;
}

const OrderCustomerAddressesSearchContentContext =
  createContext<OrderCustomerAddressesSearchContentContextValue | null>(null);

const useOrderCustomerAddressesSearchContentContext =
  (): OrderCustomerAddressesSearchContentContextValue => {
    const context = useContext(OrderCustomerAddressesSearchContentContext);

    if (!context) {
      throw new Error(
        "OrderCustomerAddressesSearch.Content must be used within OrderCustomerAddressesSearch",
      );
    }

    return context;
  };

const OrderCustomerAddressesSearchContent = () => {
  const intl = useIntl();
  const classes = useStyles({});
  const { openFromCustomerChange } = useOrderCustomerAddressesSearchContext();
  const {
    cloneAddress,
    filteredCustomerAddresses,
    formChange,
    handleChange,
    query,
    setTemporarySelectedAddress,
    temporarySelectedAddress,
    type,
  } = useOrderCustomerAddressesSearchContentContext();

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <TextField
        value={query}
        variant="outlined"
        onChange={handleChange}
        placeholder={"Search addresses"}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
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
                  selected={address.id === temporarySelectedAddress?.id}
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
    </Box>
  );
};

const OrderCustomerAddressesSearchActions = () => {
  const { exitSearch, handleSelect, hasSearchResults, openFromCustomerChange, transitionState } =
    useOrderCustomerAddressesSearchContext();

  return (
    <DashboardModal.Actions>
      <Button onClick={exitSearch} variant="secondary">
        <FormattedMessage {...buttonMessages.cancel} />
      </Button>
      <ConfirmButton
        variant="primary"
        transitionState={transitionState}
        form={openFromCustomerChange ? undefined : ORDER_CUSTOMER_ADDRESSES_EDIT_FORM_ID}
        type={openFromCustomerChange ? undefined : "submit"}
        onClick={handleSelect}
        disabled={!hasSearchResults}
      >
        <FormattedMessage {...buttonMessages.select} />
      </ConfirmButton>
    </DashboardModal.Actions>
  );
};

OrderCustomerAddressesSearch.displayName = "OrderCustomerAddressesSearch";
OrderCustomerAddressesSearchContent.displayName = "OrderCustomerAddressesSearchContent";
OrderCustomerAddressesSearchActions.displayName = "OrderCustomerAddressesSearchActions";

OrderCustomerAddressesSearch.Content = OrderCustomerAddressesSearchContent;
OrderCustomerAddressesSearch.Actions = OrderCustomerAddressesSearchActions;

export default OrderCustomerAddressesSearch;
