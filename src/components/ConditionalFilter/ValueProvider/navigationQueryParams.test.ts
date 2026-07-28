import { stringify } from "qs";

import {
  getAttributeListNavigationQueryParams,
  stripNavigationQueryParams,
} from "./navigationQueryParams";
import { TokenArray } from "./TokenArray";

describe("navigationQueryParams", () => {
  it("should strip model type tab params before tokenizing attribute list URLs", () => {
    // Arrange
    const locationSearch = `?${stringify(
      {
        0: { "s0.attributeType": "PAGE_TYPE" },
        typeIds: ["page-type-1"],
        activeTab: "2",
        sort: "name",
        asc: true,
      },
      { arrayFormat: "indices" },
    )}`;
    const params = new URLSearchParams(locationSearch);

    params.delete("asc");
    params.delete("sort");
    params.delete("activeTab");
    params.delete("query");
    params.delete("before");
    params.delete("after");
    stripNavigationQueryParams(params, "attributes");

    // Act
    const tokens = new TokenArray(params.toString()).asFlatArray();

    // Assert
    expect(tokens.map(token => token.name)).toEqual(["attributeType"]);
    expect(getAttributeListNavigationQueryParams(locationSearch)).toEqual({
      typeIds: ["page-type-1"],
    });
  });

  it("should preserve legacy pageTypes navigation params for bookmarks", () => {
    // Arrange
    const locationSearch = `?${stringify(
      {
        0: { "s0.attributeType": "PAGE_TYPE" },
        pageTypes: ["page-type-1"],
      },
      { arrayFormat: "indices" },
    )}`;

    // Act
    const navigationParams = getAttributeListNavigationQueryParams(locationSearch);

    // Assert
    expect(navigationParams).toEqual({
      pageTypes: ["page-type-1"],
    });
  });

  it("should not strip pageTypes for page filter provider URLs", () => {
    // Arrange
    const locationSearch = `?${stringify(
      {
        0: { "s0.pageTypes": "blog" },
        activeTab: "1",
      },
      { arrayFormat: "indices" },
    )}`;
    const params = new URLSearchParams(locationSearch);

    stripNavigationQueryParams(params, "page");

    // Act
    const tokens = new TokenArray(params.toString()).asFlatArray();

    // Assert
    expect(tokens.map(token => token.name)).toEqual(["pageTypes"]);
  });
});
