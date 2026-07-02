import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "AP312F",
    defaultMessage: "Create attribute",
    description: "create attribute dialog header",
  },
  createAndAssignButton: {
    id: "1SwKZV",
    defaultMessage: "Create and assign",
    description: "create attribute and assign to model type button",
  },
  createdAndAssigned: {
    id: "3CvgrU",
    defaultMessage: "Attribute created and assigned",
    description: "success notification",
  },
  createFailed: {
    id: "9/IJiM",
    defaultMessage: "Failed to create attribute",
    description: "error when attribute create returns no id",
  },
  introHint: {
    id: "y/ImBd",
    defaultMessage:
      "Attributes store extra fields on models of this type, such as materials or care instructions.",
    description: "create attribute dialog step one intro for model types",
  },
  introHintProduct: {
    id: "fF9jx2",
    defaultMessage:
      "Attributes store extra fields on products of this type, such as material or size.",
    description: "create attribute dialog step one intro for product types",
  },
  stepTwoIntro: {
    id: "sglKoA",
    defaultMessage:
      "Add the choices merchants can pick from and set how this attribute behaves on models.",
    description: "create attribute dialog step two intro for model types",
  },
  stepTwoIntroProduct: {
    id: "n4wLTL",
    defaultMessage:
      "Add the choices merchants can pick from and set how this attribute behaves on products.",
    description: "create attribute dialog step two intro for product types",
  },
  stepGeneral: {
    id: "opSGsa",
    defaultMessage: "General",
    description: "create attribute dialog step one label",
  },
  stepAttributeValues: {
    id: "J8lwWh",
    defaultMessage: "Attribute values",
    description: "create attribute dialog step two label",
  },
  nextButton: {
    id: "9ruUqf",
    defaultMessage: "Next",
    description: "create attribute dialog next step button",
  },
});
