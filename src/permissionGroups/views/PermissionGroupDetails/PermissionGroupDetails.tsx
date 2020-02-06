import React from "react";
import useNavigator from "@saleor/hooks/useNavigator";
import { maybe } from "@saleor/misc";

import { configurationMenuUrl } from "@saleor/configuration";

import PermissionGroupDetailsPage from "../../components/PermissionGroupDetailsPage";

import { usePermissionGroupDetailsQuery } from "../../queries";

import {
  // permissionGroupUrl,
  PermissionGroupDetailsUrlQueryParams
} from "../../urls";

interface PermissionGroupDetailsProps {
  id: string;
  params: PermissionGroupDetailsUrlQueryParams;
}

export const PermissionGroupDetails: React.FC<PermissionGroupDetailsProps> = ({
  id
}) => {
  const navigate = useNavigator();

  const { data, loading } = usePermissionGroupDetailsQuery({
    displayLoader: true,
    variables: { id }
  });

  return (
    <PermissionGroupDetailsPage
      disabled={loading}
      permissionGroup={maybe(() => data.permissionGroup)}
      //   onAdd={() => undefined}
      onBack={() => navigate(configurationMenuUrl)}
      //   onUpdateListSettings={updateListSettings}
      //   onRowClick={id => () => undefined}
      //   onSort={handleSort}
      onDelete={() => undefined}
      onSubmit={() => undefined}
      canEditStatus={true}
      canRemove={true}
      permissions={[]}
      saveButtonBarState={"default"}
    />
  );
};

export default PermissionGroupDetails;
