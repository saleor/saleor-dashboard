import {
  CreateWarehouseDialog,
  type CreateWarehouseFormData,
} from "@dashboard/warehouses/components/CreateWarehouseDialog/CreateWarehouseDialog";
import { type ComponentProps, type ReactNode } from "react";

export type CreateWarehouseForChannelFormData = CreateWarehouseFormData;

type CreateWarehouseForChannelDialogProps = Omit<
  ComponentProps<typeof CreateWarehouseDialog>,
  "channelName"
> & {
  channelName: string;
};

export const CreateWarehouseForChannelDialog = ({
  channelName,
  ...props
}: CreateWarehouseForChannelDialogProps): ReactNode => (
  <CreateWarehouseDialog {...props} channelName={channelName} />
);

CreateWarehouseForChannelDialog.displayName = "CreateWarehouseForChannelDialog";
