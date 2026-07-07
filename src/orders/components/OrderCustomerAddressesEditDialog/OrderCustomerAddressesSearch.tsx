// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ChannelsAvailabilitySearchField } from "@dashboard/components/ChannelsAvailabilityDialog/ChannelsAvailabilitySearchField";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { ModalDivider } from "@dashboard/components/Modal/ModalDivider";
import { CustomerAddressChoiceCard } from "@dashboard/customers/components/CustomerAddressChoiceCard";
import { type AddressFragment, AddressTypeEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import * as React from "react";
import { createContext, useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useOrderCustomerAddressesEditFormContext } from "./form";
import { dialogMessages as messages } from "./messages";
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
  exitSearch: () => void;
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

  React.useEffect(() => {
    const address = customerAddresses.find(getById(selectedCustomerAddressId));

    if (address) {
      setTemporarySelectedAddress(address);
    }
  }, [customerAddresses, selectedCustomerAddressId]);

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

  const onQueryChange = (value: string) => {
    setQuery(value);
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
    onQueryChange,
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
  onQueryChange: (query: string) => void;
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
        "Address search components must be used within OrderCustomerAddressesSearchProvider",
      );
    }

    return context;
  };

export const AddressSearchToolbar = () => {
  const intl = useIntl();
  const { onQueryChange, query } = useOrderCustomerAddressesSearchContentContext();

  return (
    <ChannelsAvailabilitySearchField
      query={query}
      onQueryChange={onQueryChange}
      label={intl.formatMessage(messages.searchLabel)}
      placeholder={intl.formatMessage(messages.searchPlaceholder)}
      inputTestId="address-search-input"
    />
  );
};

export const AddressSearchList = () => {
  const intl = useIntl();
  const { filteredCustomerAddresses, setTemporarySelectedAddress, temporarySelectedAddress } =
    useOrderCustomerAddressesSearchContentContext();

  if (filteredCustomerAddresses.length === 0) {
    return intl.formatMessage(messages.noResultsFound);
  }

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {filteredCustomerAddresses.map(address => (
        <CustomerAddressChoiceCard
          key={address.id}
          selected={address.id === temporarySelectedAddress?.id}
          onSelect={() => setTemporarySelectedAddress(address)}
          address={address}
        />
      ))}
    </Box>
  );
};

export const AddressSearchFooter = () => {
  const intl = useIntl();
  const { openFromCustomerChange } = useOrderCustomerAddressesSearchContext();
  const { cloneAddress, filteredCustomerAddresses, formChange, type } =
    useOrderCustomerAddressesSearchContentContext();

  if (openFromCustomerChange || filteredCustomerAddresses.length === 0) {
    return null;
  }

  return (
    <Box __flexShrink={0}>
      <ModalDivider />
      <DashboardModal.Inset paddingY={2}>
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
      </DashboardModal.Inset>
    </Box>
  );
};

export const AddressSearchActionsButtons = () => {
  const { exitSearch, handleSelect, hasSearchResults, openFromCustomerChange, transitionState } =
    useOrderCustomerAddressesSearchContext();
  const { submit } = useOrderCustomerAddressesEditFormContext();

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleSelect();

    if (!openFromCustomerChange) {
      submit(event);
    }
  };

  return (
    <>
      <BackButton onClick={exitSearch}>
        <FormattedMessage {...buttonMessages.cancel} />
      </BackButton>
      <ConfirmButton
        variant="primary"
        transitionState={transitionState}
        onClick={handleConfirm}
        disabled={!hasSearchResults}
      >
        <FormattedMessage {...buttonMessages.select} />
      </ConfirmButton>
    </>
  );
};

AddressSearchToolbar.displayName = "AddressSearchToolbar";
AddressSearchList.displayName = "AddressSearchList";
AddressSearchFooter.displayName = "AddressSearchFooter";
AddressSearchActionsButtons.displayName = "AddressSearchActionsButtons";
OrderCustomerAddressesSearch.displayName = "OrderCustomerAddressesSearch";
