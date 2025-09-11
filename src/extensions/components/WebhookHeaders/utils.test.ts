import {
  mapHeaders,
  stringifyHeaders,
} from "@dashboard/custom-apps/components/WebhookHeaders/utils";

export const customHeaders = '{"x-auth-token":"ABC","authorization":"XYZ"}';

const parsedHeaders = [
  {
    name: "x-auth-token",
    value: "ABC",
    error: false,
  },
  {
    name: "authorization",
    value: "XYZ",
    error: false,
  },
];

describe("mapHeaders", () => {
  it("should map customHeaders string to Object", () => {
    const headers = mapHeaders(customHeaders);

    expect(headers).toEqual(parsedHeaders);
  });
});
describe("stringifyHeaders", () => {
  it("should return stringified headers", () => {
    const stringified = stringifyHeaders(parsedHeaders);

    expect(stringified).toEqual(customHeaders);
  });
});
