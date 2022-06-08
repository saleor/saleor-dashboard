import urlJoin from "url-join";

export const taxSection = "/taxes/";
export const taxTabSectionUrl = (tab: string) => urlJoin(taxSection, tab);

export const channelsListUrl = (id?: string) =>
  id ? urlJoin(taxTabSectionUrl("channels"), id) : taxTabSectionUrl("channels");

export const countriesListUrl = (id?: string) =>
  id
    ? urlJoin(taxTabSectionUrl("countries"), id)
    : taxTabSectionUrl("countries");
