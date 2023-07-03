import { AppPermissionsDialogMessages } from "@dashboard/apps/components/AppPermissionsDialog/messages";
import { AppPermission } from "@dashboard/apps/components/AppPermissionsDialog/types";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Button, Checkbox, List, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

const messages = AppPermissionsDialogMessages.permissionsPicker;

interface AppPermissionsDialogPermissionPickerProps {
  allPermissions: AppPermission[];
  selected: PermissionEnum[];
  onSubmit(): void;
  onChange(codes: PermissionEnum[]): void;
  onClose(): void;
}

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
      <List>
        {allPermissions.map(perm => {
          const isAssigned = Boolean(selected.find(p => p === perm.code));

          return (
            <List.Item
              key={perm.code}
              paddingY={1}
              paddingX={2}
              display={"flex"}
              alignItems={"center"}
              as={"label"}
              backgroundColor={
                isAssigned ? "decorativeSurfaceSubdued3" : undefined
              }
            >
              <Checkbox
                name={perm.code}
                defaultChecked={isAssigned}
                marginRight={4}
              />
              <Text variant={isAssigned ? "bodyStrong" : "body"}>
                {perm.name}
              </Text>
            </List.Item>
          );
        })}
      </List>
      <Box display={"flex"} justifyContent={"flex-end"} gap={2}>
        <Button onClick={onClose} type={"button"} variant={"tertiary"}>
          {intl.formatMessage(messages.closeButton)}
        </Button>
        <Button type={"submit"}>
          {intl.formatMessage(messages.saveButton)}
        </Button>
      </Box>
    </form>
  );
};
