import Link from "@dashboard/components/Link";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { customerUrl } from "@dashboard/customers/urls";
import { OrderDetailsFragment, PermissionEnum, SearchCustomersQuery } from "@dashboard/graphql";
import { maybe } from "@dashboard/misc";
import { orderListUrlWithCustomerEmail, orderListUrlWithCustomerId } from "@dashboard/orders/urls";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { CustomerEditForm } from "./CustomerEditForm";
import { CustomerEditData } from "./OrderCustomer";

const AnonymousCustomer = () => (
  <Text>
    <FormattedMessage id="Qovenh" defaultMessage="Anonymous user" />
  </Text>
);

interface CustomerWithEmailProps {
  userEmail: string;
  className?: string;
}

const CustomerWithEmail = ({ userEmail, className }: CustomerWithEmailProps) => (
  <>
    <Text className={className}>{userEmail}</Text>
    <div>
      <Link underline={false} href={orderListUrlWithCustomerEmail(userEmail)}>
        <FormattedMessage id="J4NBVR" defaultMessage="View Orders" description="link" />
      </Link>
    </div>
  </>
);

interface RegisteredCustomerProps {
  user: {
    id: string;
    email: string;
  };
  className?: string;
  onProfileView: () => void;
}

const RegisteredCustomer = ({ user, className, onProfileView }: RegisteredCustomerProps) => (
  <>
    <Text className={className} data-test-id="customer-email">
      {user.email}
    </Text>
    <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_USERS]}>
      <div>
        <Link underline={false} href={customerUrl(user.id)} onClick={onProfileView}>
          <FormattedMessage id="VCzrEZ" defaultMessage="View Profile" description="link" />
        </Link>
      </div>
    </RequirePermissions>
    <div>
      <Link underline={false} href={orderListUrlWithCustomerId(user.id)}>
        <FormattedMessage id="J4NBVR" defaultMessage="View Orders" description="link" />
      </Link>
    </div>
  </>
);

export interface CustomerSectionProps extends Partial<FetchMoreProps> {
  order: OrderDetailsFragment;
  users?: RelayToFlat<SearchCustomersQuery["search"]>;
  loading?: boolean;
  canEditCustomer: boolean;
  fetchUsers?: (query: string) => void;
  onCustomerEdit?: (data: CustomerEditData) => void;
  onProfileView: () => void;
  isInEditMode: boolean;
  toggleEditMode: () => void;
  setUserDisplayName: (name: string) => void;
  userDisplayName: string;
  userEmailClassName?: string;
}

export const CustomerSection: React.FC<CustomerSectionProps> = ({
  order,
  users,
  loading,
  canEditCustomer,
  fetchUsers,
  hasMore: hasMoreUsers,
  onCustomerEdit,
  onFetchMore: onFetchMoreUsers,
  onProfileView,
  isInEditMode,
  toggleEditMode,
  setUserDisplayName,
  userDisplayName,
  userEmailClassName,
}) => {
  const user = maybe(() => order.user);
  const userEmail = maybe(() => order.userEmail);

  if (user === undefined) {
    return <Skeleton />;
  }

  if (isInEditMode && canEditCustomer) {
    return (
      <CustomerEditForm
        user={user}
        userEmail={userEmail ?? null}
        users={users}
        fetchUsers={fetchUsers}
        onCustomerEdit={onCustomerEdit}
        onFetchMore={onFetchMoreUsers}
        hasMore={hasMoreUsers}
        loading={loading}
        toggleEditMode={toggleEditMode}
        setUserDisplayName={setUserDisplayName}
        userDisplayName={userDisplayName}
      />
    );
  }

  if (user === null) {
    if (userEmail === null || userEmail === undefined) {
      return <AnonymousCustomer />;
    }

    return <CustomerWithEmail userEmail={userEmail} className={userEmailClassName} />;
  }

  return (
    <RegisteredCustomer user={user} className={userEmailClassName} onProfileView={onProfileView} />
  );
};

CustomerSection.displayName = "CustomerSection";
