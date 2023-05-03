import CityDialogForm from "@dashboard/provinces/components/CityDialogForm/CityDialogForm";
import IProvinces, { ICities } from "@dashboard/provinces/models/Provinces";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
export interface CityDialogProps {
  open: boolean;
  onClose: () => void;
  provinces: IProvinces[];
  addCity: (data: ICities) => void;
  editCity: (data: ICities) => void;
  selectedCity: ICities;
  type: string;
}
const CityCreateDialog = (props: CityDialogProps) => {
  const { provinces, addCity, selectedCity, type, editCity } = props;
  const handleSubmit = (data: ICities) => {
    if (type === "add") {
      addCity(data);
    } else {
      editCity(data);
    }
  };
  return (
    <>
      <Dialog onClose={props.onClose} open={props.open} fullWidth maxWidth="sm">
        <DialogTitle disableTypography>
          <FormattedMessage
            id="CsV1NZ"
            defaultMessage="Save city"
            description="save"
          />
        </DialogTitle>
        <DialogContent>
          <CityDialogForm
            provinces={provinces}
            onSubmit={data => handleSubmit(data)}
            onClose={props.onClose}
            selectedCity={selectedCity}
            type={type}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CityCreateDialog;
