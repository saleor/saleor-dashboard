import { newPasswordUrl } from "@dashboard/auth/urls";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { useStaffMemberAddMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import usePermissionGroupSearch from "@dashboard/searches/usePermissionGroupSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getAppMountUriForRedirect } from "@dashboard/utils/urls";
import { useOnboarding } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext";
import { useCallback, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import urlJoin from "url-join";

import { type AddMemberFormData } from "../components/StaffAddMemberDialog/StaffAddMemberDialog";

interface UseStaffInviteOptions {
  onSuccess?: (userId: string) => void;
}

export const useStaffInvite = ({ onSuccess }: UseStaffInviteOptions = {}) => {
  const notify = useNotifier();
  const intl = useIntl();
  const { markOnboardingStepAsCompleted } = useOnboarding();
  const onSuccessRef = useRef(onSuccess);

  useEffect(
    function syncOnSuccessRef() {
      onSuccessRef.current = onSuccess;
    },
    [onSuccess],
  );

  const [addStaffMember, addStaffMemberData] = useStaffMemberAddMutation({
    // Field errors (e.g. duplicate email) are shown inline on the invite dialog.
    disableErrorHandling: true,
    onCompleted: data => {
      if (data?.staffCreate?.errors?.length === 0) {
        markOnboardingStepAsCompleted("invite-staff");
        notify({
          status: "success",
          title: intl.formatMessage({
            id: "8a7vg2",
            defaultMessage: "Staff member invited",
          }),
          text: intl.formatMessage({
            id: "DACqZK",
            defaultMessage: "They should check their email and use the link to set a password.",
          }),
        });

        const userId = data.staffCreate?.user?.id;

        if (userId) {
          onSuccessRef.current?.(userId);
        }
      }
    },
    onError: () => {
      notify({
        status: "error",
        title: intl.formatMessage({
          id: "SEC9dj",
          defaultMessage: "Couldn’t send invite",
        }),
        text: intl.formatMessage({
          id: "3kJE8G",
          defaultMessage: "Something went wrong. Try again.",
        }),
      });
    },
  });
  const {
    loadMore: loadMorePermissionGroups,
    search: searchPermissionGroups,
    result: searchPermissionGroupsOpts,
  } = usePermissionGroupSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const handleStaffMemberAdd = useCallback(
    (variables: AddMemberFormData) =>
      addStaffMember({
        variables: {
          input: {
            addGroups: variables.permissionGroups.map(group => group.value),
            email: variables.email,
            firstName: variables.firstName,
            lastName: variables.lastName,
            redirectUrl: urlJoin(
              window.location.origin,
              getAppMountUriForRedirect(),
              newPasswordUrl().replace(/\?/, ""),
            ),
          },
        },
      }),
    [addStaffMember],
  );

  return {
    addStaffMemberData,
    availablePermissionGroups: mapEdgesToItems(searchPermissionGroupsOpts?.data?.search) ?? [],
    fetchMorePermissionGroups: {
      hasMore: searchPermissionGroupsOpts.data?.search?.pageInfo?.hasNextPage ?? false,
      loading: searchPermissionGroupsOpts.loading,
      onFetchMore: loadMorePermissionGroups,
    },
    handleStaffMemberAdd,
    searchPermissionGroups,
  };
};
