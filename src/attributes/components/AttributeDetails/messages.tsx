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
  embeddedAttributeLabel: {
    id: "bFb5U5",
    defaultMessage: "Label",
    description: "attribute label field in embedded create form",
  },
  embeddedAttributeLabelPlaceholder: {
    id: "RFbzxF",
    defaultMessage: "e.g. Gift wrap style",
    description: "attribute label placeholder in embedded create form",
  },
  embeddedAttributeLabelHelper: {
    id: "7/0owK",
    defaultMessage: "Shown to merchants when editing models of this type.",
    description: "attribute label helper in embedded create form",
  },
  embeddedAttributeSlug: {
    id: "CN3QZu",
    defaultMessage: "Code",
    description: "attribute slug field in embedded create form",
  },
  embeddedAttributeSlugHelper: {
    id: "JbRIRr",
    defaultMessage:
      "Used in the API. Generated from the label — change only if you need a specific slug.",
    description: "attribute slug helper in embedded create form",
  },
  embeddedInputType: {
    id: "VNHzIF",
    defaultMessage: "Input type",
    description: "attribute input type field in embedded create form",
  },
  embeddedInputTypeHelper: {
    id: "b6J/B9",
    defaultMessage: "How merchants enter values for this attribute.",
    description: "attribute input type helper in embedded create form",
  },
  entityType: {
    id: "LnRlch",
    defaultMessage: "Entity",
    description: "attribute's editor component entity",
  },
  entityTypeHelper: {
    id: "mN/S07",
    defaultMessage: "Which type of record merchants can link to.",
    description: "attribute entity type helper on full attribute form",
  },
  embeddedEntityTypeHelper: {
    id: "+SlRlz",
    defaultMessage: "Which kind of record merchants can link to.",
    description: "attribute entity type helper in embedded create form",
  },
  inputType: {
    id: "oIvtua",
    defaultMessage: "Catalog Input type for Store Owner",
    description: "attribute's editor component",
  },
  selectUnit: {
    id: "PiSXjb",
    defaultMessage: "Select unit",
    description: "check to require numeric attribute unit",
  },
  selectUnitCaption: {
    id: "g1KZlx",
    defaultMessage:
      "If enabled, values for this attribute will be stored together with a measurement unit (e.g. kg, cm).",
    description: "caption explaining numeric attribute unit",
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
  plainTextTruncated: {
    id: "A02NDR",
    defaultMessage: "Attribute value too long and truncated at {length} characters.",
    description: "plain text attribute value was truncated",
  },
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
  singleReference: {
    id: "OZc365",
    defaultMessage: "Single Reference",
    description: "single reference attribute type",
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
    id: "g8lXTL",
    defaultMessage: "Swatch",
    description: "swatch attribute",
  },
  swatchType: {
    id: "ztvvcm",
    defaultMessage: "Swatch type",
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

const unitMessages = defineMessages({
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
  cubicMillimeter: <>mm&sup3;</>,
  cubicCentimeter: <>cm&sup3;</>,
  cubicDecimeter: <>dm&sup3;</>,
  cubicMeter: <>m&sup3;</>,
  liter: "l",
  centimeter: "cm",
  decimeter: "dm",
  meter: "m",
  millimeter: "mm",
  kilometer: "km",
  gram: "g",
  kilogram: "kg",
  tonne: "t",
  squareMillimeter: <>mm&sup2;</>,
  squareCentimeter: <>cm&sup2;</>,
  squareDecimeter: <>dm&sup2;</>,
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
