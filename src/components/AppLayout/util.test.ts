import { extractQueryParams } from "./util";

describe("extractQueryParams", () => {
  test("parses a query string with an explicitly indexed list into an object of key-value pairs", () => {
    const queryString = "q=apple&color[0]=red&color[1]=green&shape[]=round&shape[]=oval";
    const expected = {
      q: "apple",
      color: ["red", "green"],
      shape: ["round", "oval"],
    };
    expect(extractQueryParams(queryString)).toEqual(expected);
  });
  test("parses a query string into an object of key-value pairs (overwrites non array elements!)", () => {
    const queryString = "q=apple&color=red&color=green&shape[]=round&shape[]=oval";
    const expected = {
      q: "apple",
      color: "green",
      shape: ["round", "oval"],
    };
    expect(extractQueryParams(queryString)).toEqual(expected);
  });
});
