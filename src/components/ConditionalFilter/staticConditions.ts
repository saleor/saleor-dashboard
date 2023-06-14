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
  collections: [
    { type: "multiselect", label: "is", value: "input-4" },
  ],
  channel: [
    { type: "select", label: "is", value: "input-5" }
  ]
}
