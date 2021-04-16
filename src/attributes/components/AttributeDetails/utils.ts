import { Choice } from "@saleor/components/SingleSelectField";
import { MeasurementUnitsEnum } from "@saleor/types/globalTypes";

import * as M from "./messages";

export type UnitSystem = "imperial" | "metric";
export type UnitType = "volume" | "weight" | "area" | "distance";

export const getMeasurementUnitMessage = (unit: MeasurementUnitsEnum) =>
  ({
    [MeasurementUnitsEnum.CUBIC_FOOT]: M.cubicFoot,
    [MeasurementUnitsEnum.CUBIC_INCH]: M.cubicInch,
    [MeasurementUnitsEnum.CUBIC_YARD]: M.cubicYard,
    [MeasurementUnitsEnum.QT]: M.qt,
    [MeasurementUnitsEnum.FL_OZ]: M.flOz,
    [MeasurementUnitsEnum.PINT]: M.pint,
    [MeasurementUnitsEnum.ACRE_IN]: M.acreInch,
    [MeasurementUnitsEnum.ACRE_FT]: M.acreFt,
    [MeasurementUnitsEnum.FT]: M.ft,
    [MeasurementUnitsEnum.YD]: M.yd,
    [MeasurementUnitsEnum.INCH]: M.inch,
    [MeasurementUnitsEnum.LB]: M.lbs,
    [MeasurementUnitsEnum.OZ]: M.oz,
    [MeasurementUnitsEnum.SQ_FT]: M.squareFt,
    [MeasurementUnitsEnum.SQ_YD]: M.squareYd,
    [MeasurementUnitsEnum.SQ_INCH]: M.squareInch,
    [MeasurementUnitsEnum.CUBIC_CENTIMETER]: M.cubicCentimeter,
    [MeasurementUnitsEnum.CUBIC_DECIMETER]: M.cubicDecimeter,
    [MeasurementUnitsEnum.CUBIC_METER]: M.cubicMeter,
    [MeasurementUnitsEnum.LITER]: M.liter,
    [MeasurementUnitsEnum.CM]: M.centimeter,
    [MeasurementUnitsEnum.M]: M.meter,
    [MeasurementUnitsEnum.KM]: M.kilometer,
    [MeasurementUnitsEnum.G]: M.gram,
    [MeasurementUnitsEnum.KG]: M.kilogram,
    [MeasurementUnitsEnum.TONNE]: M.tonne,
    [MeasurementUnitsEnum.SQ_CM]: M.squareCentimeter,
    [MeasurementUnitsEnum.SQ_M]: M.squareMeter,
    [MeasurementUnitsEnum.SQ_KM]: M.squareKilometer
  }[unit]);

export const unitSystemChoices: Array<Choice<UnitSystem>> = [
  {
    label: M.metric,
    value: "metric"
  },
  {
    label: M.imperial,
    value: "imperial"
  }
];

export const unitTypeChoices: Array<Choice<UnitType>> = [
  {
    label: M.volume,
    value: "volume"
  },
  {
    label: M.distance,
    value: "distance"
  },
  {
    label: M.weight,
    value: "weight"
  },
  {
    label: M.area,
    value: "area"
  }
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
      MeasurementUnitsEnum.ACRE_FT
    ],
    distance: [
      MeasurementUnitsEnum.FT,
      MeasurementUnitsEnum.YD,
      MeasurementUnitsEnum.INCH
    ],
    weight: [MeasurementUnitsEnum.LB, MeasurementUnitsEnum.OZ],
    area: [
      MeasurementUnitsEnum.SQ_FT,
      MeasurementUnitsEnum.SQ_YD,
      MeasurementUnitsEnum.SQ_INCH
    ]
  },
  metric: {
    volume: [
      MeasurementUnitsEnum.CUBIC_CENTIMETER,
      MeasurementUnitsEnum.CUBIC_DECIMETER,
      MeasurementUnitsEnum.CUBIC_METER,
      MeasurementUnitsEnum.LITER
    ],
    distance: [
      MeasurementUnitsEnum.CM,
      MeasurementUnitsEnum.M,
      MeasurementUnitsEnum.KM
    ],
    weight: [
      MeasurementUnitsEnum.G,
      MeasurementUnitsEnum.KG,
      MeasurementUnitsEnum.TONNE
    ],
    area: [
      MeasurementUnitsEnum.SQ_CM,
      MeasurementUnitsEnum.SQ_M,
      MeasurementUnitsEnum.SQ_KM
    ]
  }
};

export const unitChoices = (() =>
  Object.entries(unitMapping).reduce(
    (acc, [system, type]) => ({
      ...acc,
      [system]: Object.entries(type).reduce(
        (acc, [type, units]) => ({
          ...acc,
          [type]: units.map(unit => ({
            value: unit,
            label: getMeasurementUnitMessage(unit)
          }))
        }),
        {}
      )
    }),
    {}
  ))() as {
  [key in UnitSystem]: {
    [key in UnitType]: Array<Choice<MeasurementUnitsEnum>>;
  };
};
