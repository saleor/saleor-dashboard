import { type ComponentType } from "react";

/*
  Saleor Cloud features live in the private saleor/cloud-console repository. Cloud builds replace
  this directory with its dashboard-extensions/ contents, whose index.ts must provide these
  exports. Here they render nothing.
*/
export const EnvironmentSwitcher: ComponentType = () => null;
