import { AppPermission } from "@dashboard/apps/components/AppPermissionsDialog/types";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Button, Checkbox, List, Text } from "@saleor/macaw-ui/next";
import React from "react";

interface Props {
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
}: Props) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
    onChange={e => {
      const formdata = new FormData(e.currentTarget);

      // @ts-ignore - todo why TS doesnt get it?
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
        Close
      </Button>
      <Button type={"submit"}>Save</Button>
    </Box>
  </form>
);
