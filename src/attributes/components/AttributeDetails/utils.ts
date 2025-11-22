import { MeasurementUnitsEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import * as React from "react";
import { IntlShape, MessageDescriptor } from "react-intl";

import * as M from "./messages";

export type UnitSystem = "imperial" | "metric";
export type UnitType = "volume" | "weight" | "area" | "distance";

const UNIT_MESSAGES_MAPPING = {
  ["CUBIC_FOOT"]: M.units.cubicFoot,
  ["CUBIC_INCH"]: M.units.cubicInch,
  ["CUBIC_YARD"]: M.units.cubicYard,
  ["QT"]: M.units.qt,
  ["FL_OZ"]: M.units.flOz,
  ["PINT"]: M.units.pint,
  ["ACRE_IN"]: M.units.acreInch,
  ["ACRE_FT"]: M.units.acreFt,
  ["FT"]: M.units.ft,
  ["YD"]: M.units.yd,
  ["INCH"]: M.units.inch,
  ["LB"]: M.units.lbs,
  ["OZ"]: M.units.oz,
  ["SQ_FT"]: M.units.squareFt,
  ["SQ_YD"]: M.units.squareYd,
  ["SQ_INCH"]: M.units.squareInch,
  ["CUBIC_MILLIMETER"]: M.units.cubicMillimeter,
  ["CUBIC_CENTIMETER"]: M.units.cubicCentimeter,
  ["CUBIC_DECIMETER"]: M.units.cubicDecimeter,
  ["CUBIC_METER"]: M.units.cubicMeter,
  ["LITER"]: M.units.liter,
  ["CM"]: M.units.centimeter,
  ["DM"]: M.units.decimeter,
  ["MM"]: M.units.millimeter,
  ["M"]: M.units.meter,
  ["KM"]: M.units.kilometer,
  ["G"]: M.units.gram,
  ["KG"]: M.units.kilogram,
  ["TONNE"]: M.units.tonne,
  ["SQ_MM"]: M.units.squareMillimeter,
  ["SQ_CM"]: M.units.squareCentimeter,
  ["SQ_DM"]: M.units.squareDecimeter,
  ["SQ_M"]: M.units.squareMeter,
  ["SQ_KM"]: M.units.squareKilometer,
};

const getMeasurementUnitMessage = (
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

const unitMapping = {
  imperial: {
    volume: [
      "CUBIC_FOOT",
      "CUBIC_INCH",
      "CUBIC_YARD",
      "QT",
      "FL_OZ",
      "PINT",
      "ACRE_IN",
      "ACRE_FT",
    ],
    distance: ["FT", "YD", "INCH"],
    weight: ["LB", "OZ"],
    area: ["SQ_FT", "SQ_YD", "SQ_INCH"],
  },
  metric: {
    volume: [
      "CUBIC_MILLIMETER",
      "CUBIC_CENTIMETER",
      "CUBIC_DECIMETER",
      "CUBIC_METER",
      "LITER",
    ],
    distance: [
      "MM",
      "CM",
      "DM",
      "M",
      "KM",
    ],
    weight: ["G", "KG", "TONNE"],
    area: [
      "SQ_MM",
      "SQ_CM",
      "SQ_DM",
      "SQ_M",
      "SQ_KM",
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
