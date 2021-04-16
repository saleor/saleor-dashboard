import { AttributePageFormData } from "@saleor/attributes/components/AttributePage";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { makeStyles } from "@saleor/theme";
import React, { useEffect, useRef, useState } from "react";

import * as M from "./messages";
import { unitChoices, unitSystemChoices, unitTypeChoices } from "./utils";

const useStyles = makeStyles(
  theme => ({
    unitsRow: {
      columnGap: theme.spacing(2) + "px",
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        flexFlow: "wrap",
        rowGap: theme.spacing(3) + "px"
      }
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      margin: "0.5rem 0",
      width: "100%"
    }
  }),
  { name: "NumericUnits" }
);

interface NumericUnitsProps {
  data: AttributePageFormData;
  disabled: boolean;
  error: string;
  onChange: (event: React.ChangeEvent<any>) => void;
  set: (data: Partial<AttributePageFormData>) => void;
  triggerChange: () => void;
}

export const NumericUnits: React.FC<NumericUnitsProps> = ({
  data,
  disabled,
  onChange,
  set,
  triggerChange,
  error
}) => {
  const classes = useStyles();
  const unitRef = useRef(data.unit);
  const [system, setSystem] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    if (data.unit) {
      Object.entries(unitChoices).find(([system, types]) => {
        const systemMatch = Object.entries(types).find(([type, units]) => {
          const unitMatch = units.find(({ value }) => value === data.unit);
          if (unitMatch) {
            setType(type);
          }
          return unitMatch;
        });
        if (systemMatch) {
          setSystem(system);
        }
        return systemMatch;
      });
    }
  }, []);

  return (
    <div>
      <div className={classes.hr} />
      <ControlledCheckbox
        name="selectUnit"
        label={M.selectUnit}
        checked={data.unit !== null}
        onChange={({ target }) => {
          triggerChange();
          set({ unit: target.value ? unitRef.current ?? undefined : null });
        }}
        disabled={disabled}
      />
      {data.unit !== null && (
        <div className={classes.unitsRow}>
          <SingleSelectField
            label={M.unitSystem}
            choices={unitSystemChoices}
            onChange={({ target }) => setSystem(target.value)}
            value={system}
            disabled={disabled}
          />
          <SingleSelectField
            label={M.unitOf}
            choices={unitTypeChoices}
            onChange={({ target }) => setType(target.value)}
            disabled={!system || disabled}
            value={type}
          />
          <SingleSelectField
            name={"unit" as keyof AttributePageFormData}
            label={M.unit}
            choices={type ? unitChoices[system][type] : []}
            onChange={evt => {
              onChange(evt);
              unitRef.current = evt.target.value;
            }}
            disabled={!type || disabled}
            value={type ? data.unit : undefined}
            hint={error}
            error={!!error}
          />
        </div>
      )}
    </div>
  );
};
