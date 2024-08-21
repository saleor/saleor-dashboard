import { AppPermissionsDialogMessages } from "@dashboard/apps/components/AppPermissionsDialog/messages";
import { AppPermission } from "@dashboard/apps/components/AppPermissionsDialog/types";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Checkbox, List, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

const messages = AppPermissionsDialogMessages.permissionsPicker;

interface AppPermissionsDialogPermissionPickerProps {
  allPermissions: AppPermission[];
  selected: PermissionEnum[];
  onSubmit: () => void;
  onChange: (codes: PermissionEnum[]) => void;
  onClose: () => void;
}

/**
 * Approximate height that clips list and makes it scrollable.
 * This makes it avaialble on small devices, including horizontal ipad air
 */
const LIST_MAX_HEIGHT = "50vh";

export const AppPermissionsDialogPermissionPicker = ({
  onSubmit,
  onChange,
  allPermissions,
  selected,
  onClose,
}: AppPermissionsDialogPermissionPickerProps) => {
  const intl = useIntl();

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      onChange={e => {
        const formdata = new FormData(e.currentTarget);
        // @ts-expect-error - for some reason TS doesnt see keys, values, entries methods on formdata. TODO
        const values = Array.from(formdata.keys()) as PermissionEnum[];

        onChange(values);
      }}
    >
      <Box overflow={"scroll"} __maxHeight={LIST_MAX_HEIGHT} marginBottom={6}>
        <List>
          {allPermissions.map(perm => {
            const isAssigned = Boolean(selected.find(p => p === perm.code));

            return (
              <List.Item
                key={perm.code}
                padding={4}
                display="flex"
                alignItems="center"
                as="label"
                active={isAssigned}
              >
                <Checkbox name={perm.code} defaultChecked={isAssigned} marginRight={4} />
                <Text fontWeight={isAssigned ? "bold" : "regular"}>{perm.name}</Text>
              </List.Item>
            );
          })}
        </List>
      </Box>

      <DashboardModal.Actions>
        <BackButton onClick={onClose}>{intl.formatMessage(messages.closeButton)}</BackButton>
        <ConfirmButton data-test-id="submit" transitionState="default" type="submit">
          {intl.formatMessage(messages.saveButton)}
        </ConfirmButton>
      </DashboardModal.Actions>
    </form>
  );
};
