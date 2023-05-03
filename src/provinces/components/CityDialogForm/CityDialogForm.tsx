import DialogButtons from "@dashboard/components/ActionDialog/DialogButtons";
import IProvinces, { ICities } from "@dashboard/provinces/models/Provinces";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useState } from "react";
export interface CityDialogFormProps {
  provinces: IProvinces[];
  selectedProvince: IProvinces;
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
  const [provinceId, setProvinceId] = useState(
    type === "add" ? 1 : selectedCity.provinceId,
  );
  const [name, setName] = useState(type === "add" ? "" : selectedCity.name);
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Province</label>
        <select
          value={provinceId}
          name="provinceId"
          className={classes.select + " " + classes.input}
          onChange={e => setProvinceId(+e.target.value)}
          disabled={type === "edit"}
        >
          {provinces.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <TextField
          fullWidth
          className={classes.input}
          autoComplete="name"
          label={"name"}
          name="name"
          onChange={e => setName(e.target.value)}
          value={name}
          inputProps={{
            "data-test-id": "name",
            spellCheck: false,
          }}
        />
        <TextField
          fullWidth
          className={classes.input}
          autoComplete="priority"
          label={"priority"}
          name="priority"
          onChange={e => setPriority(e.target.value)}
          value={priority}
          inputProps={{
            "data-test-id": "priority",
            spellCheck: false,
          }}
        />
        <DialogButtons
          disabled={false}
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
