export const STATIC_CONDITIONS = {
  category: [
    { type: "combobox", label: "is", value: "input-1" },
    { type: "multiselect", label: "in", value: "input-2" },
  ],
  price: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-2" },
    { type: "number", label: "greater", value: "input-3" },
    { type: "number.range", label: "between", value: "input-4" },
  ],
  collection: [{ type: "multiselect", label: "in", value: "input-4" }],
  producttype: [{ type: "multiselect", label: "in", value: "input-4" }],
  channel: [{ type: "select", label: "is", value: "input-5" }],
};

export const ATTRIBUTE_INPUT_TYPE_CONDITIONS = {
  DROPDOWN: [{ type: "multiselect", label: "in", value: "input-2" }],
  MULTISELECT: [{ type: "multiselect", label: "in", value: "input-2" }],
  BOOLEAN: [{ type: "select", label: "is", value: "input-5" }],
  NUMERIC: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-2" },
    { type: "number", label: "greater", value: "input-3" },
    { type: "number.range", label: "between", value: "input-4" },
  ],
  DATE_TIME: [{ type: "date", label: "is", value: "input-1" }],
  DATE: [{ type: "date", label: "is", value: "input-1" }],
  SWATCH: [{ type: "multiselect", label: "in", value: "input-2" }],
};
