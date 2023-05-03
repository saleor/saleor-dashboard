import CityCreateDialog from "@dashboard/provinces/components/CityCreateDialog/CityCreateDialog";
import CityDeleteDialog from "@dashboard/provinces/components/CityDeleteDialog/CityDeleteDialog";
import ProvinceHeader from "@dashboard/provinces/components/ProvinceHeader/ProvinceHeader";
import { ProvinceList } from "@dashboard/provinces/components/ProvinceList/ProvinceList";
import provinceList from "@dashboard/provinces/mockData/data";
import { ICities } from "@dashboard/provinces/models/Provinces";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useState } from "react";

const useStyles = makeStyles(
  theme => ({
    provinceList: {
      margin: theme.spacing(4, 4),
      direction: "rtl",
      fontFamily: "sans-serif",
    },
  }),
  { name: "Provinces" },
);

const Provinces = props => {
  const classes = useStyles(props);
  const [provinces] = useState(provinceList);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [city, setCity] = useState<ICities>();
  const [formType, setFormType] = useState("");

  const handleRemove = (city: ICities) => {
    setCity(city);
    setOpenDelDialog(true);
  };

  function remove(city: ICities) {
    const prov = findProvince(city);
    const index = prov.cities.indexOf(city);
    prov.cities.splice(index, 1);
    setOpenDelDialog(false);
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormType("add");
  };

  const addCity = (data: ICities) => {
    const prov = findProvince(data);
    prov.cities.push(data);
  };

  const handleEdit = (city: ICities) => {
    setCity(city);
    setFormType("edit");
    setOpenDialog(true);
  };

  const editCity = (data: ICities) => {
    const prov = findProvince(data);
    const foundIndex = prov.cities.findIndex(x => x.id === data.id);
    prov.cities[foundIndex] = data;
  };

  const findProvince = (data: ICities) =>
    provinces.find(item => item.id === data.provinceId);

  return (
    <>
      <ProvinceHeader onOpenDialog={handleOpenDialog} />
      <div className={classes.provinceList}>
        <ProvinceList
          provinceList={provinceList}
          onRemove={city => handleRemove(city)}
          onEdit={city => handleEdit(city)}
        />
      </div>

      <CityCreateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        provinces={provinceList}
        addCity={data => addCity(data)}
        editCity={data => editCity(data)}
        selectedCity={city}
        type={formType}
      />
      <CityDeleteDialog
        city={city}
        open={openDelDialog}
        onClose={() => setOpenDelDialog(false)}
        onConfirm={city => remove(city)}
      />
    </>
  );
};

export default Provinces;
