import { AppTypeEnum, JobStatusEnum } from "../types/globalTypes";
import { AppsInstallations_appsInstallations } from "./types/AppsInstallations";
import { AppsList_apps_edges } from "./types/AppsList";

export const appsList: AppsList_apps_edges[] = [
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      appUrl: "http://localhost:8888/app",
      configurationUrl: "htpp://localhost:8888/configuration",
      created: "2020-05-01T11:24:54.937261+00:00",
      homepageUrl: "http://localhost:8888/homepage",
      id: "QXBwOjE3Ng==",
      isActive: true,
      metadata: [],
      name: "app",
      privateMetadata: [],
      supportUrl: "http://localhost:8888/support",
      type: AppTypeEnum.EXTERNAL,
      version: "1.0.0",
      webhooks: []
    }
  },
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      appUrl: "http://localhost:8888/app",
      configurationUrl: "htpp://localhost:8888/configuration",
      created: "2020-06-01T11:24:54.937261+00:00",
      homepageUrl: "http://localhost:8888/homepage",
      id: "QXBwOjE3Ng==",
      isActive: false,
      metadata: [],
      name: "app1",
      privateMetadata: [],
      supportUrl: "http://localhost:8888/support",
      type: AppTypeEnum.EXTERNAL,
      version: "1.0.0",
      webhooks: []
    }
  }
];

export const customAppsList: AppsList_apps_edges[] = [
  {
    __typename: "AppCountableEdge",
    node: {
      __typename: "App",
      appUrl: "http://localhost:8888/app",
      configurationUrl: "htpp://localhost:8888/configuration",
      created: "2020-05-02T11:24:54.937261+00:00",
      homepageUrl: "http://localhost:8888/homepage",
      id: "QXBwOjE3Ng==",
      isActive: true,
      metadata: [],
      name: "app custom",
      privateMetadata: [],
      supportUrl: "http://localhost:8888/support",
      type: AppTypeEnum.CUSTOM,
      version: "1.0.0",
      webhooks: []
    }
  }
];

export const appsInProgress: AppsInstallations_appsInstallations[] = [
  {
    __typename: "AppInstallation",
    appName: "app",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Failed to connect to app. Try later or contact with app support.",
    status: JobStatusEnum.FAILED
  },
  {
    __typename: "AppInstallation",
    appName: "app pending",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Pending.",
    status: JobStatusEnum.PENDING
  },
  {
    __typename: "AppInstallation",
    appName: "app success",
    id: "QXBwSW5zdGFsbGF0aW9uOjk2",
    manifestUrl: "http://localhost:3000/manifest",
    message: "Success.",
    status: JobStatusEnum.SUCCESS
  }
];
