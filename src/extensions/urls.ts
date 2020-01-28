import urlJoin from "url-join";
import { stringify as stringifyQs } from "qs";
import { Pagination } from "@saleor/types";

export const extensionSection = "/extensions/";

export const extensionListPath = extensionSection;
export type ExtensionListUrlQueryParams = Pagination;
export const extensionListUrl = (
  params?: ExtensionListUrlQueryParams
): string => extensionListPath + "?" + stringifyQs(params);
export const extensionPath = (id: string) => urlJoin(extensionSection, id);
export const extensiontUrl = (id: string) =>
  extensionPath(encodeURIComponent(id));
