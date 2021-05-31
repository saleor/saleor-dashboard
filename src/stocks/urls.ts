import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

const stockSectionUrl = "/stocks";
export const stockListPath = stockSectionUrl;
export const stockListUrl = (params?: any): string => {
  const stockList = stockListPath;
  if (params === undefined) {
    return stockList;
  } else {
    return urlJoin(stockList, "?" + stringifyQs(params));
  }
};

export const stockTransferRequestPath = urlJoin(
  stockSectionUrl,
  "transfer-request"
);

export const stockTransferRequestUrl = (params?: any): string => {
  const stockTransferRequest = stockTransferRequestPath;
  if (params === undefined) {
    return stockTransferRequest;
  } else {
    return urlJoin(stockTransferRequest, "?" + stringifyQs(params));
  }
};
