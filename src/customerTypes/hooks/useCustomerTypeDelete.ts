import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { type CustomerTypeUrlQueryParams } from "@dashboard/customerTypes/urls";
import { PermissionEnum, useCustomerTypeAssignedCustomersCountQuery } from "@dashboard/graphql";

interface UseCustomerTypeDeleteProps {
  id: string;
  params: CustomerTypeUrlQueryParams;
}

interface UseCustomerTypeDeleteResult {
  isOpen: boolean;
  assignedCustomersCount: number | undefined;
  canCountCustomers: boolean;
}

export const useCustomerTypeDelete = ({
  id,
  params,
}: UseCustomerTypeDeleteProps): UseCustomerTypeDeleteResult => {
  const userPermissions = useUserPermissions();
  const canCountCustomers = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_USERS]);
  const isOpen = params.action === "remove";
  const { data } = useCustomerTypeAssignedCustomersCountQuery({
    variables: { id },
    skip: !isOpen || !canCountCustomers || !id,
  });

  return {
    isOpen,
    assignedCustomersCount: canCountCustomers
      ? (data?.customers?.totalCount ?? undefined)
      : undefined,
    canCountCustomers,
  };
};
