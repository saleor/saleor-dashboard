import { AttributePageFormData } from "@saleor/attributes/components/AttributePage";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { UseFormResult } from "@saleor/hooks/useForm";
import { makeStyles } from "@saleor/theme";
import { MeasurementUnitsEnum } from "@saleor/types/globalTypes";
import React, { useEffect, useState } from "react";

import * as M from "./messages";
import {
  unitChoices,
  unitMapping,
  UnitSystem,
  unitSystemChoices,
  UnitType,
  unitTypeChoices
} from "./utils";

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

interface UnitData {
  unit: MeasurementUnitsEnum;
  system: UnitSystem;
  type: UnitType;
}

interface NumericUnitsProps
  extends Pick<
    UseFormResult<AttributePageFormData>,
    "set" | "setError" | "data" | "errors" | "clearErrors"
  > {
  disabled: boolean;
}

export const NumericUnits: React.FC<NumericUnitsProps> = ({
  data,
  disabled,
  errors,
  set,
  setError,
  clearErrors
}) => {
  const classes = useStyles();
  const [unitData, setUnitData] = useState<Partial<UnitData>>({
    unit: data.unit
  });

  const { unit, system, type } = unitData;
  const errorProps = { error: !!errors.unit, hint: M.required };

  useEffect(() => set({ unit }), [unit]);

  useEffect(() => {
    if (data.unit) {
      const initialData = { unit: data.unit } as UnitData;

      Object.entries(unitChoices).find(([system, types]) => {
        const systemMatch = Object.entries(types).find(([type, units]) => {
          const unitMatch = units.find(({ value }) => value === data.unit);
          if (unitMatch) {
            initialData.type = type as UnitType;
          }
          return unitMatch;
        });
        if (systemMatch) {
          initialData.system = system as UnitSystem;
        }
        return systemMatch;
      });
      setUnitData(initialData);
    }
  }, []);

  useEffect(() => {
    if (unit === undefined && !errors.unit) {
      setError("unit", M.required);
    }
    if (errors.unit && (unit || unit === null)) {
      clearErrors("unit");
    }
  }, [unitData, errors]);

  return (
    <div>
      <div className={classes.hr} />
      <ControlledCheckbox
        data-test="numeric-with-unit"
        name="selectUnit"
        label={M.selectUnit}
        checked={data.unit !== null}
        onChange={({ target }) =>
          setUnitData({ unit: target.value ? undefined : null })
        }
        disabled={disabled}
      />
      {data.unit !== null && (
        <div className={classes.unitsRow}>
          <SingleSelectField
            {...(!system && errorProps)}
            testId="unit-system"
            label={M.unitSystem}
            choices={unitSystemChoices}
            onChange={({ target }) => setUnitData({ system: target.value })}
            value={system}
            disabled={disabled}
          />
          <SingleSelectField
            {...(system && !type && errorProps)}
            testId="unit-of"
            label={M.unitOf}
            choices={unitTypeChoices}
            onChange={({ target }) =>
              setUnitData(({ system }) => ({ system, type: target.value }))
            }
            disabled={!system || disabled}
            value={type}
          />
          <SingleSelectField
            {...(type && !unit && errorProps)}
            testId="unit"
            label={M.unit}
            choices={type ? unitChoices[system][type] : []}
            onChange={({ target }) =>
              setUnitData(p => ({ ...p, unit: target.value }))
            }
            disabled={!type || disabled}
            value={
              type && unitMapping[system][type].includes(unit)
                ? unit
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
};
