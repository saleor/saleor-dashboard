import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import { Select } from "@dashboard/components/Select";
import { type MeasurementUnitsEnum } from "@dashboard/graphql";
import { type UseFormResult } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { Box, Checkbox, type Option, Paragraph, Text } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import * as M from "./messages";
import styles from "./NumericUnits.module.css";
import {
  getUnitChoices,
  type ResolvedUnitData,
  resolveUnitDataFromExistingUnit,
  type UnitSystem,
  unitSystemChoices,
  type UnitType,
  unitTypeChoices,
} from "./utils";

interface NumericUnitsProps
  extends Pick<
    UseFormResult<AttributePageFormData>,
    "setError" | "data" | "errors" | "clearErrors"
  > {
  disabled: boolean;
  onUnitChange: (unit: AttributePageFormData["unit"]) => void;
}

const getInitialUnitData = (
  unit: MeasurementUnitsEnum | null | undefined,
  formatMessage: ReturnType<typeof useIntl>["formatMessage"],
): ResolvedUnitData => {
  if (!unit) {
    return { unit: unit ?? null };
  }

  return resolveUnitDataFromExistingUnit(unit, getUnitChoices(formatMessage));
};

export const NumericUnits = ({
  data,
  disabled,
  errors,
  setError,
  clearErrors,
  onUnitChange,
}: NumericUnitsProps) => {
  const { formatMessage } = useIntl();
  const [unitData, setUnitData] = useState<ResolvedUnitData>(() =>
    getInitialUnitData(data.unit, formatMessage),
  );
  const { unit, system, type } = unitData;
  const errorProps = {
    error: !!errors.unit,
    hint: formatMessage(commonMessages.requiredField),
  };
  const [typeChoices, systemChoices, unitChoices] = useMemo(
    () => [
      unitTypeChoices.map<Option>(choice => ({
        ...choice,
        label: formatMessage(choice.label),
      })),
      unitSystemChoices.map<Option>(choice => ({
        ...choice,
        label: formatMessage(choice.label),
      })),
      getUnitChoices(formatMessage),
    ],
    [formatMessage],
  );

  useEffect(
    function syncUnitToForm() {
      const normalizedUnit = unit ?? null;

      if ((data.unit ?? null) !== normalizedUnit) {
        onUnitChange(normalizedUnit);
      }
    },
    [data.unit, onUnitChange, unit],
  );

  useEffect(
    function validateUnitSelection() {
      if (unit === undefined && !errors.unit) {
        setError("unit", formatMessage(commonMessages.requiredField));
      }

      if (errors.unit && (unit || unit === null)) {
        clearErrors("unit");
      }
    },
    [clearErrors, errors.unit, formatMessage, setError, unit],
  );

  return (
    <Box marginTop={5}>
      <Box className={styles.propertyControl}>
        <Checkbox
          data-test-id="numeric-with-unit"
          name="selectUnit"
          checked={unit !== null}
          onCheckedChange={checked => setUnitData({ unit: checked ? undefined : null })}
          disabled={disabled}
        >
          <Paragraph fontWeight="medium" fontSize={3} margin={0}>
            <FormattedMessage {...M.messages.selectUnit} />
            <Text size={2} color="default2" display="block">
              <FormattedMessage {...M.messages.selectUnitCaption} />
            </Text>
          </Paragraph>
        </Checkbox>
      </Box>
      {unit !== null && (
        <Box display="flex" gap={4} justifyContent="space-between" marginTop={4}>
          <Box width="100%">
            <Select
              error={!system && errorProps.error}
              helperText={!system && errorProps.hint}
              data-test-id="unit-system"
              disabled={disabled}
              label={formatMessage(M.messages.unitSystem)}
              name="system"
              onChange={({ target }) => {
                setUnitData(current => ({
                  ...current,
                  system: target.value as UnitSystem,
                }));
              }}
              value={system ?? null}
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
              onChange={({ target }) => {
                setUnitData(current => ({
                  ...current,
                  type: target.value as UnitType,
                }));
              }}
              value={type ?? null}
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
              name="unit"
              onChange={({ target }) =>
                setUnitData(current => ({
                  ...current,
                  unit: target.value as MeasurementUnitsEnum,
                }))
              }
              value={unit as string}
              options={(type && system ? (unitChoices?.[system]?.[type] ?? []) : []) as Option[]}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
