import DialogButtons from "@dashboard/components/ActionDialog/DialogButtons";
import SingleSelectField from "@dashboard/components/SingleSelectField";
import IProvinces, { ICities } from "@dashboard/provinces/models/Provinces";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useState } from "react";
export interface CityDialogFormProps {
  provinces: IProvinces[];
  onSubmit: (data: ICities) => void;
  onClose: () => void;
  selectedCity: ICities;
  type: string;
}

const useStyles = makeStyles(
  theme => ({
    select: {
      height: theme.spacing(8),
      width: "100%",
      padding: "6px 0 7px",
      borderRadius: "4px",
      paddingRight: 0,
      background: "none",
      borderColor: "#c7c7c7",
      color: "rgba(37, 41, 41, 1)",
      animationDuration: "10ms",
    },
    input: {
      marginBottom: "20px",
    },
  }),
  { name: "CreateCityForm" },
);
const CityDialogForm = (props: CityDialogFormProps) => {
  const classes = useStyles(props);
  const { provinces, onClose, onSubmit, selectedCity, type } = props;
  const [name, setName] = useState(type === "add" ? "" : selectedCity.name);
  const [provinceId, setProvinceId] = useState(
    type === "add" ? "1" : selectedCity.provinceId,
  );
  const [priority, setPriority] = useState(
    type === "add" ? "" : selectedCity.priority,
  );
  const [cityId] = useState(
    type === "add" ? "id_" + Math.random() : selectedCity.id,
  );

  const handleSubmit = () => {
    onSubmit({ id: cityId, provinceId, name, priority });
    onClose();
  };

  const inputTypeChoices = provinces.map(item => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SingleSelectField
          choices={inputTypeChoices}
          disabled={type === "edit"}
          className={classes.input}
          label={"Province"}
          name="inputType"
          onChange={e => setProvinceId(e.target.value)}
          value={provinceId}
        />
        <TextField
          fullWidth
          className={classes.input}
          autoComplete="name"
          label={"name"}
          name="name"
          onChange={e => setName(e.target.value)}
          value={name}
        />
        <TextField
          fullWidth
          className={classes.input}
          autoComplete="priority"
          label={"priority"}
          name="priority"
          onChange={e => setPriority(e.target.value)}
          value={priority}
        />
        <DialogButtons
          disabled={!priority || !name}
          onConfirm={handleSubmit}
          confirmButtonLabel={"save"}
          confirmButtonState={"default"}
          onClose={onClose}
        />
      </form>
    </>
  );
};

export default CityDialogForm;
