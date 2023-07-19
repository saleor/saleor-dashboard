import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { usePermissionGroupCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { extractMutationErrors } from "@dashboard/misc";
import { PermissionData } from "@dashboard/permissionGroups/components/PermissonGroupDetailsPage";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import {
  PermissionGroupCreateFormData,
  PermissionGroupCreatePage,
} from "../../components/PermissionGroupCreatePage";
import { permissionGroupDetailsUrl } from "../../urls";
import {
  checkIfUserHasRestictedChannels,
  getChannelsOptions,
} from "../../utils";

export const PermissionGroupCreate: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();
  const user = useUser();
  const { availableChannels } = useAppChannel(false);
  const hasUserRestrictedChannels = checkIfUserHasRestictedChannels(user.user);
  const userAvailableChannels = useMemo(
    () => getChannelsOptions(availableChannels, user.user),
    [availableChannels, user.user],
  );

  const [createPermissionGroup, createPermissionGroupResult] =
    usePermissionGroupCreateMutation({
      onCompleted: data => {
        if (data?.permissionGroupCreate?.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage({
              id: "eUjFjW",
              defaultMessage: "Permission group created",
            }),
          });

          if (data?.permissionGroupCreate?.group?.id) {
            navigate(
              permissionGroupDetailsUrl(data.permissionGroupCreate.group.id),
            );
          }
        }
      },
    });

  const errors =
    createPermissionGroupResult?.data?.permissionGroupCreate?.errors || [];

  const onSubmit = (formData: PermissionGroupCreateFormData) => {
    const channelChoices = userAvailableChannels.map(channel => channel.id);

    return extractMutationErrors(
      createPermissionGroup({
        variables: {
          input: {
            addPermissions: formData.permissions,
            addUsers: [],
            name: formData.name,
            addChannels: formData.hasAllChannels
              ? channelChoices
              : formData.channels,
            restrictedAccessToChannels:
              hasUserRestrictedChannels || !formData.hasAllChannels,
          },
        },
      }),
    );
  };

  const userPermissions = user?.user?.userPermissions?.map(p => p.code) || [];

  const permissions: PermissionData[] =
    shop?.permissions.map(
      p =>
        ({
          ...p,
          disabled: !userPermissions.includes(p.code),
          lastSource: false,
        } as PermissionData),
    ) || [];

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "Irflxf",
          defaultMessage: "Create category",
          description: "window title",
        })}
      />
      <PermissionGroupCreatePage
        errors={errors as any}
        disabled={createPermissionGroupResult.loading}
        permissions={permissions}
        channels={userAvailableChannels}
        hasRestrictedChannels={hasUserRestrictedChannels}
        saveButtonBarState={createPermissionGroupResult.status}
        onSubmit={onSubmit}
      />
    </>
  );
};
