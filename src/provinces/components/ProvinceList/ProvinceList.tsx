import IProvinces, { ICities } from "@dashboard/provinces/models/Provinces";
import EditIcon from "@material-ui/icons/Edit";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  DeleteIcon,
  ExpandIcon,
  IconButton,
  makeStyles,
} from "@saleor/macaw-ui";
import React, { useState } from "react";

export interface ProvinceListPageProps {
  provinceList: IProvinces[] | undefined;
  onRemove: (city: ICities) => void;
  onEdit: (city: ICities) => void;
}

const useStyles = makeStyles(
  theme => ({
    children: {
      padding: theme.spacing(0, 7),
      width: "100%",
    },
    header: {
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
    },
    expanded: {
      fontWeight: "bold",
    },
    section: {
      "&:first-child": {
        marginLeft: "70px",
      },
    },
    cities: {
      padding: theme.spacing(3, 6),
      fontSize: "14px",
      fontWeight: 500,
      borderBottom: "1px solid #e3e2e2",
    },
    cityItem: {
      display: "inline-block",
      width: "150px",
      textAlign: "center",
    },
    deleteButton: {
      marginRight: theme.spacing(1),
    },
  }),
  { name: "ProvinceList" },
);

export const ProvinceList = (props: ProvinceListPageProps) => {
  const classes = useStyles(props);
  const [openedAcc, setOpenedAcc] = useState("");

  const handleAccordionOpen = (item: IProvinces) => {
    // debugger;
    if (openedAcc !== item.id) {
      setOpenedAcc(item.id);
    } else {
      setOpenedAcc("");
    }
  };
  return (
    <>
      {props.provinceList.map(item => (
        <Accordion
          expanded={item.id === openedAcc}
          onChange={() => handleAccordionOpen(item)}
        >
          <AccordionSummary
            expandIcon={<ExpandIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            className={item.id === openedAcc ? classes.expanded : ""}
          >
            <div className={classes.header}>
              <div className={classes.section}> {item.priority}</div>
              <div className={classes.section}> استان {item.name}</div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <ul className={classes.children}>
              {item.cities.map(city => (
                <li key={city.id} className={classes.cities}>
                  <span className={classes.cityItem}>{city.priority}</span>
                  <span className={classes.cityItem}>{city.name}</span>
                  <IconButton
                    variant="secondary"
                    onClick={() => props.onEdit(city)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className={classes.deleteButton}
                    variant="secondary"
                    onClick={() => props.onRemove(city)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};
