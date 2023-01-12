import { AppsInstallationsQuery } from "@saleor/graphql";

const tunnelKeywords = [".ngrok.io", ".saleor.live"];

export const isAppInTunnel = (manifestUrl: string) =>
  Boolean(tunnelKeywords.find(keyword => manifestUrl.includes(keyword)));

export const getAppInProgressName = (
  id: string,
  collection?: AppsInstallationsQuery["appsInstallations"],
) => collection?.find(app => app.id === id)?.appName || id;
