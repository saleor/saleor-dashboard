import urlJoin from "url-join";

export const appSection = "/apps/";

export const appPath = (id: string) => urlJoin(appSection, id);
export const apptUrl = (id: string) => appPath(encodeURIComponent(id));
