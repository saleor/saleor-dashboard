import { commonMessages } from "@saleor/intl";
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

export const messages = defineMessages({
  attributeLabel: {
    defaultMessage: "Default Label",
    description: "attribute's label"
  },
  attributeSlug: {
    defaultMessage: "Attribute Code",
    description: "attribute's slug short code label"
  },
  attributeSlugHelperText: {
    defaultMessage: "This is used internally. Make sure you don’t use spaces",
    description: "attribute slug input field helper text"
  },
  entityType: {
    defaultMessage: "Entity",
    description: "attribute's editor component entity"
  },
  inputType: {
    defaultMessage: "Catalog Input type for Store Owner",
    description: "attribute's editor component"
  },
  valueRequired: {
    defaultMessage: "Value Required",
    description: "check to require attribute to have value"
  }
});

export const inputTypeMessages = defineMessages({
  dropdown: {
    defaultMessage: "Dropdown",
    description: "product attribute type"
  },
  file: {
    defaultMessage: "File",
    description: "file attribute type"
  },
  multiselect: {
    defaultMessage: "Multiple Select",
    description: "product attribute type"
  },
  references: {
    defaultMessage: "References",
    description: "references attribute type"
  },
  text: {
    defaultMessage: "Text",
    description: "text attribute type"
  },
  numeric: {
    defaultMessage: "Numeric",
    description: "numeric attribute type"
  }
});

export const selectUnit = (
  <FormattedMessage
    defaultMessage="Select unit"
    description="check to require numeric attribute unit"
  />
);

export const unitSystem = (
  <FormattedMessage
    defaultMessage="System"
    description="numeric attribute unit system"
  />
);

export const unitOf = (
  <FormattedMessage
    defaultMessage="Units of"
    description="numeric attribute units of"
  />
);

export const unit = (
  <FormattedMessage
    defaultMessage="Unit"
    description="numeric attribute unit"
  />
);

export const required = <FormattedMessage {...commonMessages.requiredField} />;

/**
 * Unit System
 */
export const metric = (
  <FormattedMessage defaultMessage="Metric" description="metric unit system" />
);

export const imperial = (
  <FormattedMessage
    defaultMessage="Imperial"
    description="imperial unit system"
  />
);

/**
 * Unit type
 */
export const volume = (
  <FormattedMessage defaultMessage="Volume" description="volume units types" />
);

export const distance = (
  <FormattedMessage
    defaultMessage="Distance"
    description="distance units type"
  />
);

export const weight = (
  <FormattedMessage defaultMessage="Weight" description="weight units type" />
);

export const area = (
  <FormattedMessage defaultMessage="Area" description="area units type" />
);

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
  pint: <FormattedMessage defaultMessage="pint" description="pint unit" />,
  acreInch: (
    <FormattedMessage defaultMessage="acre-inch" description="acre-inch unit" />
  ),
  acreFt: (
    <FormattedMessage defaultMessage="acre-ft" description="acre-ft unit" />
  ),
  ft: "ft",
  yd: "yd",
  inch: "in",
  oz: "oz",
  lbs: "lbs",
  squareFt: <>ft&sup2;</>,
  squareYd: <>yd&sup2;</>,
  squareInch: <>in&sup2;</>
};
