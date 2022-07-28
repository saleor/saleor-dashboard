import React from "react";
import { defineMessages } from "react-intl";

export const messages = defineMessages({
  attributeLabel: {
    id: "xOEZjV",
    defaultMessage: "Default Label",
    description: "attribute's label",
  },
  attributeSlug: {
    id: "P79U4b",
    defaultMessage: "Attribute Code",
    description: "attribute's slug short code label",
  },
  attributeSlugHelperText: {
    id: "Q7uuDr",
    defaultMessage: "This is used internally. Make sure you don’t use spaces",
    description: "attribute slug input field helper text",
  },
  entityType: {
    id: "LnRlch",
    defaultMessage: "Entity",
    description: "attribute's editor component entity",
  },
  inputType: {
    id: "oIvtua",
    defaultMessage: "Catalog Input type for Store Owner",
    description: "attribute's editor component",
  },
  valueRequired: {
    id: "njBulj",
    defaultMessage: "Value Required",
    description: "check to require attribute to have value",
  },
  selectUnit: {
    id: "PiSXjb",
    defaultMessage: "Select unit",
    description: "check to require numeric attribute unit",
  },
  unitSystem: {
    id: "ghje1I",
    defaultMessage: "System",
    description: "numeric attribute unit system",
  },

  unitOf: {
    id: "zWM89r",
    defaultMessage: "Units of",
    description: "numeric attribute units of",
  },
  unit: {
    id: "Orgqv4",
    defaultMessage: "Unit",
    description: "numeric attribute unit",
  },
});

export const inputTypeMessages = defineMessages({
  dropdown: {
    id: "bZksto",
    defaultMessage: "Dropdown",
    description: "product attribute type",
  },
  file: {
    id: "z1y9oL",
    defaultMessage: "File",
    description: "file attribute type",
  },
  multiselect: {
    id: "cKjFfl",
    defaultMessage: "Multiple Select",
    description: "product attribute type",
  },
  references: {
    id: "5dLpx0",
    defaultMessage: "References",
    description: "references attribute type",
  },
  plainText: {
    id: "HLr8KQ",
    defaultMessage: "Plain Text",
    description: "plain text attribute type",
  },
  richText: {
    id: "kEAjZV",
    defaultMessage: "Rich Text",
    description: "rich text attribute type",
  },
  numeric: {
    id: "SNiyXb",
    defaultMessage: "Numeric",
    description: "numeric attribute type",
  },
  boolean: {
    id: "l5V0QT",
    defaultMessage: "Boolean",
    description: "boolean attribute type",
  },
  date: {
    id: "fU+a9k",
    defaultMessage: "Date",
    description: "date attribute type",
  },
  dateTime: {
    id: "DzPVnj",
    defaultMessage: "Date Time",
    description: "date time attribute type",
  },
  swatch: {
    id: "gx4wCT",
    defaultMessage: "Swatch",
    description: "swatch attribute type",
  },
});

export const unitSystemMessages = defineMessages({
  metric: {
    id: "ZayvsI",
    defaultMessage: "Metric",
    description: "metric unit system",
  },
  imperial: {
    id: "YgE6ga",
    defaultMessage: "Imperial",
    description: "imperial unit system",
  },
});

export const unitTypeMessages = defineMessages({
  volume: {
    id: "cy8sV7",
    defaultMessage: "Volume",
    description: "volume units types",
  },

  distance: {
    id: "k/mTEl",
    defaultMessage: "Distance",
    description: "distance units type",
  },
  weight: {
    id: "Vdy5g7",
    defaultMessage: "Weight",
    description: "weight units type",
  },
  area: {
    id: "A9QSur",
    defaultMessage: "Area",
    description: "area units type",
  },
});

export const unitMessages = defineMessages({
  pint: { id: "B0PaVS", defaultMessage: "pint", description: "pint unit" },
  acreInch: {
    id: "jBu2yj",
    defaultMessage: "acre-inch",
    description: "acre-inch unit",
  },
  acreFt: {
    id: "5XG1CO",
    defaultMessage: "acre-ft",
    description: "acre-ft unit",
  },
});

export const units = {
  cubicCentimeter: <>cm&sup3;</>,
  cubicDecimeter: <>dm&sup3;</>,
  cubicMeter: <>m&sup3;</>,
  liter: "l",
  centimeter: "cm",
  meter: "m",
  kilometer: "km",
  gram: "g",
  kilogram: "kg",
  tonne: "t",
  squareCentimeter: <>cm&sup2;</>,
  squareMeter: <>m&sup2;</>,
  squareKilometer: <>km&sup2;</>,
  cubicFoot: <>ft&sup3;</>,
  cubicInch: <>in&sup3;</>,
  cubicYard: <>yd&sup3;</>,
  qt: "qt",
  flOz: "fl. oz",
  pint: unitMessages.pint,
  acreInch: unitMessages.acreInch,
  acreFt: unitMessages.acreFt,
  ft: "ft",
  yd: "yd",
  inch: "in",
  oz: "oz",
  lbs: "lbs",
  squareFt: <>ft&sup2;</>,
  squareYd: <>yd&sup2;</>,
  squareInch: <>in&sup2;</>,
};
