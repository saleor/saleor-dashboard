import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { Pagination, SingleAction } from "../types";

export const webhooksSection = "/webhooks/";

export const webhooksListPath = webhooksSection;
export type WebhooksListUrlQueryParams = Pagination & SingleAction;
export const webhooksListUrl = (params?: WebhooksListUrlQueryParams) =>
  webhooksPath + "?" + stringifyQs(params);

export const webhooksPath = (id: string) => urlJoin(webhooksSection, id);
export type WebhooksUrlQueryParams = SingleAction;
export const webhooksUrl = (id: string, params?: WebhooksUrlQueryParams) =>
  webhooksPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
