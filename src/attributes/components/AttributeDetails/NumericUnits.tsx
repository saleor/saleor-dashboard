import { AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import { MeasurementUnitsEnum } from "@dashboard/graphql";
import { UseFormResult } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Option, Select } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import * as M from "./messages";
import { getUnitChoices, UnitSystem, unitSystemChoices, UnitType, unitTypeChoices } from "./utils";

const useStyles = makeStyles(
  theme => ({
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
  unit: MeasurementUnitsEnum | null | undefined;
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
        onChange={({ target }) => setUnitData({ unit: target.value ? undefined : null })}
        disabled={disabled}
      />
      {data.unit !== null && (
        <Box display="flex" gap={4} justifyContent="space-between">
          <Box width="100%">
            <Select
              error={!system && errorProps.error}
              helperText={!system && errorProps.hint}
              data-test-id="unit-system"
              disabled={disabled}
              label={formatMessage(M.messages.unitSystem)}
              name="system"
              onChange={(value: Option) => {
                setUnitData(data => ({
                  ...data,
                  system: value.value as UnitSystem,
                }));
              }}
              value={{
                label: system ? systemChoices.find(c => c.value === system)?.label : "",
                value: system,
              }}
              options={systemChoices}
            />
          </Box>

          <Box width="100%">
            <Select
              error={system && !type && errorProps.error}
              helperText={system && !type && errorProps.hint}
              data-test-id="unit-of"
              disabled={!system || disabled}
              label={formatMessage(M.messages.unitOf)}
              name="type"
              onChange={(value: Option) => {
                setUnitData(data => ({
                  ...data,
                  type: value.value as UnitType,
                }));
              }}
              value={{
                label: type ? typeChoices.find(c => c.value === type)?.label : "",
                value: type,
              }}
              options={typeChoices}
            />
          </Box>

          <Box width="100%">
            <Select
              error={type && !unit && errorProps.error}
              helperText={type && !unit && errorProps.hint}
              data-test-id="unit"
              disabled={!type || disabled}
              label={formatMessage(M.messages.unit)}
              name="type"
              onChange={(value: Option) =>
                setUnitData(data => ({
                  ...data,
                  unit: value.value as MeasurementUnitsEnum,
                }))
              }
              value={{
                label:
                  unit && type && system
                    ? (unitChoices[system][type].find(c => c.value === unit)?.label as string)
                    : "",
                value: unit,
              }}
              options={(type && system ? unitChoices[system][type] ?? [] : []) as Option[]}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};
