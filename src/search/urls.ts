import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

export const globalSearchUrl = (params?: { query?: string; scope?: string; trigger?: boolean }) =>
  urlJoin(
    "/search",
    "?" + stringifyQs({ q: params?.query, scope: params?.scope, t: params?.trigger }),
  );
