import CityCreateDialog from "@dashboard/provinces/components/CityCreateDialog/CityCreateDialog";
import CityDeleteDialog from "@dashboard/provinces/components/CityDeleteDialog/CityDeleteDialog";
import ProvinceHeader from "@dashboard/provinces/components/ProvinceHeader/ProvinceHeader";
import { ProvinceList } from "@dashboard/provinces/components/ProvinceList/ProvinceList";
import provinceList from "@dashboard/provinces/mockData/data";
import IProvinces, { ICities } from "@dashboard/provinces/models/Provinces";
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
  const [provinces, setProvinces] = useState(provinceList);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [city, setCity] = useState<ICities>();
  const [formType, setFormType] = useState("");

  const handleRemove = (city: ICities) => {
    setCity(city);
    setOpenDelDialog(true);
  };

  function remove(city) {
    const newProvinces: IProvinces[] = provinces.map(pr => {
      if (pr.id === city.provinceId) {
        const index = pr.cities.indexOf(city);
        pr.cities.splice(index, 1);
      }
      return pr;
    });

    setProvinces(newProvinces);
    setOpenDelDialog(false);
  }

  const edit = (city: ICities) => {
    setCity(city);
    setFormType("edit");
    setOpenDialog(true);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormType("add");
  };

  const addCity = (data: ICities) => {
    const newProvinces: IProvinces[] = provinces.map(pr => {
      if (pr.id === data.provinceId) {
        pr.cities.push(data);
      }
      return pr;
    });
    setProvinces(newProvinces);
  };

  const editCity = (data: ICities) => {
    const newProvinces: IProvinces[] = provinces.map(pr => {
      if (pr.id === data.provinceId) {
        const foundIndex = pr.cities.findIndex(x => x.id === data.id);
        pr.cities[foundIndex] = data;
      }
      return pr;
    });
    setProvinces(newProvinces);
  };

  return (
    <>
      <ProvinceHeader onOpenDialog={handleOpenDialog} />
      <div className={classes.provinceList}>
        <ProvinceList
          provinceList={provinceList}
          onRemove={city => handleRemove(city)}
          onEdit={city => edit(city)}
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
