import { Combobox } from "@dashboard/components/Combobox";
import Form from "@dashboard/components/Form";
import { OrderDetailsFragment, SearchCustomersQuery } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerEditData } from "./OrderCustomer";

interface CustomerEditFormProps extends FetchMoreProps {
  currentUser: OrderDetailsFragment["user"] | null;
  currentUserEmail: string | null;
  allUsers?: RelayToFlat<SearchCustomersQuery["search"]>;
  fetchUsers?: (query: string) => void;
  onCustomerEdit?: (data: CustomerEditData) => void;
  toggleEditMode: () => void;
  setUserDisplayName: (name: string) => void;
  userDisplayName: string;
}

export const CustomerEditForm: React.FC<CustomerEditFormProps> = ({
  currentUser,
  currentUserEmail,
  allUsers,
  fetchUsers,
  onCustomerEdit,
  onFetchMore,
  hasMore,
  loading,
  toggleEditMode,
  setUserDisplayName,
  userDisplayName,
}) => {
  const intl = useIntl();

  return (
    <Form confirmLeave initial={{ query: "" }}>
      {({ change, data }) => {
        const handleChange = (event: ChangeEvent<string>) => {
          change(event);

          const value = event.target.value;

          if (!value) {
            return;
          }

          onCustomerEdit?.({
            prevUser: currentUser?.id,
            prevUserEmail: currentUserEmail || undefined,
            [value.includes("@") ? "userEmail" : "user"]: value,
          });
          toggleEditMode();
        };

        const userChoices = (allUsers || []).map(user => ({
          label: user.email,
          value: user.id,
        }));

        const handleUserChange = createSingleAutocompleteSelectHandler(
          handleChange,
          setUserDisplayName,
          userChoices,
        );

        return (
          <Combobox
            data-test-id="select-customer"
            allowCustomValues={true}
            label={intl.formatMessage({
              id: "hkSkNx",
              defaultMessage: "Search Customers",
            })}
            options={userChoices}
            fetchMore={{
              onFetchMore: onFetchMore,
              hasMore: hasMore,
              loading: loading,
            }}
            fetchOptions={fetchUsers || (() => {})}
            name="query"
            value={{
              label: userDisplayName,
              value: data.query,
            }}
            onChange={handleUserChange}
          />
        );
      }}
    </Form>
  );
};

CustomerEditForm.displayName = "CustomerEditForm";
