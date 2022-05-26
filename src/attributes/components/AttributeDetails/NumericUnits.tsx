import { AttributePageFormData } from "@saleor/attributes/components/AttributePage";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { MeasurementUnitsEnum } from "@saleor/graphql";
import { UseFormResult } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import * as M from "./messages";
import {
  getUnitChoices,
  unitMapping,
  UnitSystem,
  unitSystemChoices,
  UnitType,
  unitTypeChoices,
} from "./utils";

const useStyles = makeStyles(
  theme => ({
    unitsRow: {
      columnGap: theme.spacing(2),
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        flexFlow: "wrap",
        rowGap: theme.spacing(3),
      },
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      margin: "0.5rem 0",
      width: "100%",
    },
  }),
  { name: "NumericUnits" },
);

interface UnitData {
  unit?: MeasurementUnitsEnum;
  system?: UnitSystem;
  type?: UnitType;
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
  clearErrors,
}) => {
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const [unitData, setUnitData] = useState<UnitData>({
    unit: data.unit ?? null,
  });

  const { unit, system, type } = unitData;
  const errorProps = {
    error: !!errors.unit,
    hint: formatMessage(commonMessages.requiredField),
  };
  const [typeChoices, systemChoices, unitChoices] = useMemo(
    () => [
      unitTypeChoices.map(choice => ({
        ...choice,
        label: formatMessage(choice.label),
      })),
      unitSystemChoices.map(choice => ({
        ...choice,
        label: formatMessage(choice.label),
      })),
      getUnitChoices(formatMessage),
    ],
    [],
  );

  useEffect(() => set({ unit }), [unit]);

  useEffect(() => {
    if (data.unit) {
      const selectInitialUnitData = () => {
        const initialData: UnitData = { unit: data.unit };

        Object.entries(unitChoices).some(([system, types]) => {
          const systemMatch = Object.entries(types).some(([type, units]) => {
            const unitMatch = units.some(({ value }) => value === data.unit);
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

        return initialData;
      };

      setUnitData(selectInitialUnitData());
    }
  }, []);

  useEffect(() => {
    if (unit === undefined && !errors.unit) {
      setError("unit", formatMessage(commonMessages.requiredField));
    }
    if (errors.unit && (unit || unit === null)) {
      clearErrors("unit");
    }
  }, [unitData, errors]);

  return (
    <div>
      <div className={classes.hr} />
      <ControlledCheckbox
        data-test-id="numeric-with-unit"
        name="selectUnit"
        label={formatMessage(M.messages.selectUnit)}
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
            label={formatMessage(M.messages.unitSystem)}
            choices={systemChoices}
            onChange={({ target }: React.ChangeEvent<HTMLSelectElement>) =>
              setUnitData({ system: target.value as UnitSystem })
            }
            value={system}
            disabled={disabled}
          />
          <SingleSelectField
            {...(system && !type && errorProps)}
            testId="unit-of"
            label={formatMessage(M.messages.unitOf)}
            choices={typeChoices}
            onChange={({ target }: React.ChangeEvent<HTMLSelectElement>) =>
              setUnitData(({ system }) => ({
                system,
                type: target.value as UnitType,
              }))
            }
            disabled={!system || disabled}
            value={type}
          />
          <SingleSelectField
            {...(type && !unit && errorProps)}
            testId="unit"
            label={formatMessage(M.messages.unit)}
            choices={type ? unitChoices[system][type] : []}
            onChange={({ target }: React.ChangeEvent<HTMLSelectElement>) =>
              setUnitData(data => ({
                ...data,
                unit: target.value as MeasurementUnitsEnum,
              }))
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
