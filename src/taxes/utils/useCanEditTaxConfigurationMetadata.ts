import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasOneOfPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";

// Saleor requires one of these to read a tax configuration's private metadata and to
// update either kind. The Taxes pages themselves are open to every staff user.
const taxConfigurationMetadataPermissions = [
  PermissionEnum.HANDLE_TAXES,
  PermissionEnum.MANAGE_TAXES,
];

export const useCanEditTaxConfigurationMetadata = (): boolean =>
  hasOneOfPermissions(useUserPermissions() ?? [], taxConfigurationMetadataPermissions);
