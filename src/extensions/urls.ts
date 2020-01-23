import urlJoin from "url-join";

export const extensionSection = "/extensions/";

export const extensionListPath = extensionSection;
export const extensionListUrl = extensionListPath;
export const extensionPath = (id: string) => urlJoin(extensionSection, id);
export const extensiontUrl = (id: string) =>
  extensionPath(encodeURIComponent(id));
