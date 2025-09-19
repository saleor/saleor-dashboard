import { Combobox } from "@dashboard/components/Combobox";
import Form from "@dashboard/components/Form";
import { SearchCustomersQuery } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import React from "react";
import { useIntl } from "react-intl";

import { CustomerEditData } from "./OrderCustomer";

interface CustomerEditFormProps extends Partial<FetchMoreProps> {
  user: any;
  userEmail: string | null;
  users?: RelayToFlat<SearchCustomersQuery["search"]>;
  fetchUsers?: (query: string) => void;
  onCustomerEdit?: (data: CustomerEditData) => void;
  loading?: boolean;
  toggleEditMode: () => void;
  setUserDisplayName: (name: string) => void;
  userDisplayName: string;
}

export const CustomerEditForm: React.FC<CustomerEditFormProps> = ({
  user,
  userEmail,
  users,
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
            prevUser: user?.id,
            prevUserEmail: userEmail || undefined,
            [value.includes("@") ? "userEmail" : "user"]: value,
          });
          toggleEditMode();
        };

        const userChoices = (users || []).map(user => ({
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
              onFetchMore: onFetchMore || (() => {}),
              hasMore: hasMore || false,
              loading: loading || false,
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
