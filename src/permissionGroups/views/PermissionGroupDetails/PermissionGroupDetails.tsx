import React from "react";
import urlJoin from "url-join";

import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
// import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
// import { useIntl } from "react-intl";

// import SaveFilterTabDialog, {
//   SaveFilterTabDialogFormData
// } from "@saleor/components/SaveFilterTabDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";

// import { APP_MOUNT_URI } from "@saleor/config";
import { configurationMenuUrl } from "@saleor/configuration";
// import useShop from "@saleor/hooks/useShop";
// import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import { getSortParams } from "@saleor/utils/sort";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
// import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
// import StaffAddMemberDialog, {
//   FormData as AddStaffMemberForm
// } from "../../components/StaffAddMemberDialog";
// import StaffListPage from "../../components/StaffListPage";
import PermissionGroupDetailsPage from "../../components/PermissionGroupDetailsPage";

// import { TypedStaffMemberAddMutation } from "../../mutations";

import {
  usePermissionGroupDetailsQuery,
  TypedPermissionGroupDetailsQuery
} from "../../queries";
// import { StaffMemberAdd } from "../../types/StaffMemberAdd";
import {
  permissionGroupUrl,
  permissionGroupDetailsUrl,
  PermissionGroupDetailsUrlQueryParams
} from "../../urls";
// import { getSortQueryVariables } from "./sort";

interface PermissionGroupDetailsProps {
  id: string;
  params: PermissionGroupDetailsUrlQueryParams;
}

export const PermissionGroupDetails: React.FC<PermissionGroupDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  // const notify = useNotifier();
  //   const paginate = usePaginator();
  //   const { updateListSettings, settings } = useListSettings(
  //     ListViews.PERMISSION_GROUP_LIST
  //   );
  // const intl = useIntl();
  // const shop = useShop();

  //   const paginationState = createPaginationState(settings.rowNumber, params);
  //   const queryVariables = React.useMemo(
  //     () => ({
  //       ...paginationState,
  //     //   sort: getSortQueryVariables(params)
  //     }),
  //     [params]
  //   );
  //   const { data, loading } = usePermissionGroupDetailsQuery({
  //     displayLoader: true
  //   });

  //   const [
  //     changeFilters,
  //     resetFilters,
  //     handleSearchChange
  //   ] = createFilterHandlers({
  //     createUrl: staffListUrl,
  //     getFilterQueryParam,
  //     navigate,
  //     params
  //   });

  //   const [openModal, closeModal] = createDialogActionHandlers<
  //     StaffListUrlDialog,
  //     StaffListUrlQueryParams
  //   >(navigate, staffListUrl, params);

  //   const handleStaffMemberAddSuccess = (data: StaffMemberAdd) => {
  //     if (data.staffCreate.errors.length === 0) {
  //       notify({
  //         text: intl.formatMessage(commonMessages.savedChanges)
  //       });
  //       navigate(staffMemberDetailsUrl(data.staffCreate.user.id));
  //     }
  //   };
  //   const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
  //     maybe(() => data.permissionGroup.users),
  //     paginationState,
  //     params
  //   );

  //   const handleSort = createSortHandler(navigate, PermissionGroupDetailsUrl, params);

  return (
    <TypedPermissionGroupDetailsQuery
      displayLoader
      variables={{ id }}
      require={["permissionGroup"]}
    >
      {({ data, loading }) => (
        <PermissionGroupDetailsPage
          disabled={loading}
          permissionGroup={undefined}
          //   onAdd={() => undefined}
          onBack={() => navigate(configurationMenuUrl)}
          //   onUpdateListSettings={updateListSettings}
          //   onRowClick={id => () => undefined}
          //   onSort={handleSort}

          onDelete={() => undefined}
          onSubmit={() => undefined}
          canEditPreferences={true}
          canEditStatus={true}
          canRemove={true}
          permissions={[]}
          saveButtonBarState={"default"}
        />
      )}
    </TypedPermissionGroupDetailsQuery>
  );
};

export default PermissionGroupDetails;
