/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: AppsInstallations
// ====================================================

export interface AppsInstallations_appsInstallations {
  __typename: "AppInstallation";
  status: JobStatusEnum;
  message: string | null;
  appName: string;
  manifestUrl: string;
  id: string;
}

export interface AppsInstallations {
  appsInstallations: AppsInstallations_appsInstallations[];
}
