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

/**
 * Units
 */

export const cubicCentimeter = (
  <FormattedMessage
    defaultMessage="Cubic centimeter"
    description="Cubic centimeter unit"
  />
);

export const cubicDecimeter = (
  <FormattedMessage
    defaultMessage="Cubic decimeter"
    description="Cubic decimeter unit"
  />
);

export const cubicMeter = (
  <FormattedMessage
    defaultMessage="Cubic meter"
    description="Cubic meter unit"
  />
);

export const liter = (
  <FormattedMessage defaultMessage="Liter" description="liter unit" />
);

export const centimeter = (
  <FormattedMessage defaultMessage="Centimeter" description="centimeter unit" />
);

export const meter = (
  <FormattedMessage defaultMessage="Meter" description="meter unit" />
);

export const kilometer = (
  <FormattedMessage defaultMessage="Kilometer" description="kilometer unit" />
);

export const gram = (
  <FormattedMessage defaultMessage="Gram" description="gram unit" />
);

export const kilogram = (
  <FormattedMessage defaultMessage="Kilogram" description="kilogram unit" />
);

export const tonne = (
  <FormattedMessage defaultMessage="Tonne" description="tonne unit" />
);

export const squareCentimeter = (
  <FormattedMessage
    defaultMessage="Square centimeter"
    description="square centimeter unit"
  />
);

export const squareMeter = (
  <FormattedMessage
    defaultMessage="Square meter"
    description="square meter unit"
  />
);

export const squareKilometer = (
  <FormattedMessage
    defaultMessage="Square kilometer"
    description="square kilometer unit"
  />
);

export const cubicFoot = (
  <FormattedMessage defaultMessage="Cubic foot" description="cubic foot unit" />
);

export const cubicInch = (
  <FormattedMessage defaultMessage="Cubic inch" description="cubic inch unit" />
);

export const cubicYard = (
  <FormattedMessage defaultMessage="Cubic yard" description="cubic yard unit" />
);

export const qt = (
  <FormattedMessage defaultMessage="Qt" description="qt unit" />
);

export const flOz = (
  <FormattedMessage defaultMessage="Fl.Oz" description="fl.oz unit" />
);

export const pint = (
  <FormattedMessage defaultMessage="Pint" description="pint unit" />
);

export const acreInch = (
  <FormattedMessage defaultMessage="Acre-inch" description="acre-inch unit" />
);

export const acreFt = (
  <FormattedMessage defaultMessage="Acre-ft" description="acre-ft unit" />
);

export const ft = (
  <FormattedMessage defaultMessage="Ft" description="ft unit" />
);

export const yd = (
  <FormattedMessage defaultMessage="Yd" description="yd unit" />
);

export const inch = (
  <FormattedMessage defaultMessage="Inch" description="inch unit" />
);

export const oz = (
  <FormattedMessage defaultMessage="Oz" description="oz unit" />
);

export const lbs = (
  <FormattedMessage defaultMessage="Lbs" description="lbs unit" />
);

export const squareFt = (
  <FormattedMessage defaultMessage="Square-Ft" description="square-ft unit" />
);

export const squareYd = (
  <FormattedMessage defaultMessage="Square-Yd" description="square-yd unit" />
);

export const squareInch = (
  <FormattedMessage
    defaultMessage="Square-Inch"
    description="square-inch unit"
  />
);
