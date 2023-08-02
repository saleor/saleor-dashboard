// @ts-strict-ignore
import { taxClasses } from "@dashboard/taxes/fixtures";
import React from "react";

import TaxClassesPage from "./TaxClassesPage";

const props = {
  taxClasses,
  selectedTaxClassId: taxClasses[0].id,
  handleTabChange: () => undefined,
  savebarState: "default" as const,
  disabled: false,
  onCreateNewButtonClick: () => undefined,
  onTaxClassUpdate: () => undefined,
  onTaxClassCreate: () => undefined,
  onTaxClassDelete: () => undefined,
};

export default {
  title: "Taxes / Tax classes view",
};

export const Loading = () => (
  <TaxClassesPage {...props} taxClasses={undefined} />
);
