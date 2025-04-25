import { MeasurementUnitsEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import React from "react";
import { IntlShape, MessageDescriptor } from "react-intl";

import * as M from "./messages";

export type UnitSystem = "imperial" | "metric";
export type UnitType = "volume" | "weight" | "area" | "distance";

const UNIT_MESSAGES_MAPPING = {
  [MeasurementUnitsEnum.CUBIC_FOOT]: M.units.cubicFoot,
  [MeasurementUnitsEnum.CUBIC_INCH]: M.units.cubicInch,
  [MeasurementUnitsEnum.CUBIC_YARD]: M.units.cubicYard,
  [MeasurementUnitsEnum.QT]: M.units.qt,
  [MeasurementUnitsEnum.FL_OZ]: M.units.flOz,
  [MeasurementUnitsEnum.PINT]: M.units.pint,
  [MeasurementUnitsEnum.ACRE_IN]: M.units.acreInch,
  [MeasurementUnitsEnum.ACRE_FT]: M.units.acreFt,
  [MeasurementUnitsEnum.FT]: M.units.ft,
  [MeasurementUnitsEnum.YD]: M.units.yd,
  [MeasurementUnitsEnum.INCH]: M.units.inch,
  [MeasurementUnitsEnum.LB]: M.units.lbs,
  [MeasurementUnitsEnum.OZ]: M.units.oz,
  [MeasurementUnitsEnum.SQ_FT]: M.units.squareFt,
  [MeasurementUnitsEnum.SQ_YD]: M.units.squareYd,
  [MeasurementUnitsEnum.SQ_INCH]: M.units.squareInch,
  [MeasurementUnitsEnum.CUBIC_MILLIMETER]: M.units.cubicMillimeter,
  [MeasurementUnitsEnum.CUBIC_CENTIMETER]: M.units.cubicCentimeter,
  [MeasurementUnitsEnum.CUBIC_DECIMETER]: M.units.cubicDecimeter,
  [MeasurementUnitsEnum.CUBIC_METER]: M.units.cubicMeter,
  [MeasurementUnitsEnum.LITER]: M.units.liter,
  [MeasurementUnitsEnum.CM]: M.units.centimeter,
  [MeasurementUnitsEnum.DM]: M.units.decimeter,
  [MeasurementUnitsEnum.MM]: M.units.millimeter,
  [MeasurementUnitsEnum.M]: M.units.meter,
  [MeasurementUnitsEnum.KM]: M.units.kilometer,
  [MeasurementUnitsEnum.G]: M.units.gram,
  [MeasurementUnitsEnum.KG]: M.units.kilogram,
  [MeasurementUnitsEnum.TONNE]: M.units.tonne,
  [MeasurementUnitsEnum.SQ_MM]: M.units.squareMillimeter,
  [MeasurementUnitsEnum.SQ_CM]: M.units.squareCentimeter,
  [MeasurementUnitsEnum.SQ_DM]: M.units.squareDecimeter,
  [MeasurementUnitsEnum.SQ_M]: M.units.squareMeter,
  [MeasurementUnitsEnum.SQ_KM]: M.units.squareKilometer,
};

export const getMeasurementUnitMessage = (
  unit: MeasurementUnitsEnum,
  formatMessage: IntlShape["formatMessage"],
): MessageDescriptor | React.ReactNode => {
  const message = UNIT_MESSAGES_MAPPING[unit];

  return typeof message === "string" || React.isValidElement(message)
    ? message
    : formatMessage(message as MessageDescriptor);
};

export const unitSystemChoices = [
  {
    label: M.unitSystemMessages.metric,
    value: "metric",
  },
  {
    label: M.unitSystemMessages.imperial,
    value: "imperial",
  },
];

export const unitTypeChoices = [
  {
    label: M.unitTypeMessages.volume,
    value: "volume",
  },
  {
    label: M.unitTypeMessages.distance,
    value: "distance",
  },
  {
    label: M.unitTypeMessages.weight,
    value: "weight",
  },
  {
    label: M.unitTypeMessages.area,
    value: "area",
  },
];

export const unitMapping = {
  imperial: {
    volume: [
      MeasurementUnitsEnum.CUBIC_FOOT,
      MeasurementUnitsEnum.CUBIC_INCH,
      MeasurementUnitsEnum.CUBIC_YARD,
      MeasurementUnitsEnum.QT,
      MeasurementUnitsEnum.FL_OZ,
      MeasurementUnitsEnum.PINT,
      MeasurementUnitsEnum.ACRE_IN,
      MeasurementUnitsEnum.ACRE_FT,
    ],
    distance: [MeasurementUnitsEnum.FT, MeasurementUnitsEnum.YD, MeasurementUnitsEnum.INCH],
    weight: [MeasurementUnitsEnum.LB, MeasurementUnitsEnum.OZ],
    area: [MeasurementUnitsEnum.SQ_FT, MeasurementUnitsEnum.SQ_YD, MeasurementUnitsEnum.SQ_INCH],
  },
  metric: {
    volume: [
      MeasurementUnitsEnum.CUBIC_MILLIMETER,
      MeasurementUnitsEnum.CUBIC_CENTIMETER,
      MeasurementUnitsEnum.CUBIC_DECIMETER,
      MeasurementUnitsEnum.CUBIC_METER,
      MeasurementUnitsEnum.LITER,
    ],
    distance: [
      MeasurementUnitsEnum.MM,
      MeasurementUnitsEnum.CM,
      MeasurementUnitsEnum.DM,
      MeasurementUnitsEnum.M,
      MeasurementUnitsEnum.KM,
    ],
    weight: [MeasurementUnitsEnum.G, MeasurementUnitsEnum.KG, MeasurementUnitsEnum.TONNE],
    area: [
      MeasurementUnitsEnum.SQ_MM,
      MeasurementUnitsEnum.SQ_CM,
      MeasurementUnitsEnum.SQ_DM,
      MeasurementUnitsEnum.SQ_M,
      MeasurementUnitsEnum.SQ_KM,
    ],
  },
};

const extractTypeChoices = (
  typeEnums: {
    [key in UnitType]: MeasurementUnitsEnum[];
  },
  formatMessage: IntlShape["formatMessage"],
) =>
  Object.entries(typeEnums).reduce(
    (acc, [type, units]) => ({
      ...acc,
      [type]: units.map(unit => ({
        value: unit,
        label: getMeasurementUnitMessage(unit, formatMessage),
      })),
    }),
    {},
  );

export const getUnitChoices = (
  formatMessage: IntlShape["formatMessage"],
): {
  [key in UnitSystem]: {
    [key in UnitType]: Option[];
  };
} =>
  Object.entries(unitMapping).reduce(
    (acc, [system, typeEnums]) => ({
      ...acc,
      [system]: extractTypeChoices(typeEnums, formatMessage),
    }),
    {},
  ) as {
    [key in UnitSystem]: {
      [key in UnitType]: Option[];
    };
  };
