import { type PermissionFragment } from "@dashboard/graphql";
import { useMemo } from "react";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";

import { type CustomExtensionFormData } from "../AddCustomExtension";
import { getAllPermissionsObject, getNoPermissionsObject } from "../utils";

export const useFullAccessToggle = ({
  permissions,
  control,
  setValue,
}: {
  permissions: PermissionFragment[];
  control: Control<CustomExtensionFormData>;
  setValue: UseFormSetValue<CustomExtensionFormData>;
}) => {
  const selectedPermissions = useWatch({ name: "permissions", control });

  const isFullAccess = useMemo(() => {
    const list = Object.values(selectedPermissions);

    // Wait until permissions are loaded
    if (list.length === 0) {
      return false;
    }

    return list.every(value => value);
  }, [selectedPermissions]);

  const toggleFullAccess = () => {
    if (isFullAccess) {
      setValue("permissions", getNoPermissionsObject(permissions));
    } else {
      setValue("permissions", getAllPermissionsObject(permissions));
    }
  };

  return {
    isFullAccess,
    toggleFullAccess,
  };
};
