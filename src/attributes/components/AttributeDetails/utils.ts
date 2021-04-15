import { Choice } from "@saleor/components/SingleSelectField";
import { MeasurementUnitsEnum } from "@saleor/types/globalTypes";

import * as M from "./messages";

export type UnitSystem = "imperial" | "metric";
export type UnitType = "volume" | "weight" | "area" | "distance";

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

export const unitChoices: {
  [key in UnitSystem]: {
    [key in UnitType]: Array<Choice<MeasurementUnitsEnum>>;
  };
} = {
  imperial: {
    volume: [
      { label: M.cubicFoot, value: MeasurementUnitsEnum.CUBIC_FOOT },
      { label: M.cubicInch, value: MeasurementUnitsEnum.CUBIC_INCH },
      { label: M.cubicYard, value: MeasurementUnitsEnum.CUBIC_YARD },
      { label: M.qt, value: MeasurementUnitsEnum.QT },
      { label: M.flOz, value: MeasurementUnitsEnum.FL_OZ },
      { label: M.pint, value: MeasurementUnitsEnum.PINT },
      { label: M.acreInch, value: MeasurementUnitsEnum.ACRE_IN },
      { label: M.acreFt, value: MeasurementUnitsEnum.ACRE_FT }
    ],
    distance: [
      { label: M.ft, value: MeasurementUnitsEnum.FT },
      { label: M.yd, value: MeasurementUnitsEnum.YD },
      { label: M.inch, value: MeasurementUnitsEnum.INCH }
    ],
    weight: [
      { label: M.lbs, value: MeasurementUnitsEnum.LB },
      { label: M.oz, value: MeasurementUnitsEnum.OZ }
    ],
    area: [
      { label: M.squareFt, value: MeasurementUnitsEnum.SQ_FT },
      { label: M.squareYd, value: MeasurementUnitsEnum.SQ_YD },
      { label: M.squareInch, value: MeasurementUnitsEnum.SQ_INCH }
    ]
  },
  metric: {
    volume: [
      {
        label: M.cubicCentimeter,
        value: MeasurementUnitsEnum.CUBIC_CENTIMETER
      },
      { label: M.cubicDecimeter, value: MeasurementUnitsEnum.CUBIC_DECIMETER },
      { label: M.cubicMeter, value: MeasurementUnitsEnum.CUBIC_METER },
      { label: M.liter, value: MeasurementUnitsEnum.LITER }
    ],
    distance: [
      { label: M.centimeter, value: MeasurementUnitsEnum.CM },
      { label: M.meter, value: MeasurementUnitsEnum.M },
      { label: M.kilometer, value: MeasurementUnitsEnum.KM }
    ],
    weight: [
      { label: M.gram, value: MeasurementUnitsEnum.G },
      { label: M.kilogram, value: MeasurementUnitsEnum.KG },
      { label: M.tonne, value: MeasurementUnitsEnum.TONNE }
    ],
    area: [
      { label: M.squareCentimeter, value: MeasurementUnitsEnum.SQ_CM },
      { label: M.squareMeter, value: MeasurementUnitsEnum.SQ_M },
      { label: M.squareKilometer, value: MeasurementUnitsEnum.SQ_KM }
    ]
  }
};
