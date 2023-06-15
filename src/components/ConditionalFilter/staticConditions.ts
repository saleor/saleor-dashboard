export const STATIC_CONDITIONS = {
  category: [
    { type: "combobox", label: "is", value: "input-1" },
    { type: "multiselect", label: "in", value: "input-2" },
  ],
  price: [
    { type: "input.number", label: "is", value: "input-1" },
    { type: "input.number", label: "lower", value: "input-2" },
    { type: "input.number", label: "greater", value: "input-3" },
    { type: "range", label: "between", value: "input-4" },
  ],
  collection: [
    { type: "multiselect", label: "in", value: "input-4" },
  ],
  producttype: [
    { type: "multiselect", label: "in", value: "input-4" },
  ],
  channel: [
    { type: "select", label: "is", value: "input-5" }
  ]
}

export const ATTRIBUTE_INPUT_TYPE_CONDITIONS = {
  DROPDOWN: [
    { type: "multiselect", label: "in", value: "input-2" },
  ],
  MULTISELECT: [
    { type: "multiselect", label: "in", value: "input-2" },
  ],
}
