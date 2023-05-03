import ActionDialog from "@dashboard/components/ActionDialog";
import { ICities } from "@dashboard/provinces/models/Provinces";
import { DialogContentText } from "@material-ui/core";
import React from "react";

export interface CityDeleteDialogProps {
  city: ICities;
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ICities) => void;
}
const CityDeleteDialog = (props: CityDeleteDialogProps) => {
  const { city, open, onClose, onConfirm } = props;
  return (
    <ActionDialog
      confirmButtonState={"default"}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(city)}
      title={"Delete City"}
      variant="delete"
    >
      <DialogContentText data-test-id="dialog-content">
        <span>
          Are You Sure You Want To Delete{" "}
          <span style={{ color: "red" }}>{city?.name}</span>?
        </span>
      </DialogContentText>
    </ActionDialog>
  );
};

export default CityDeleteDialog;
