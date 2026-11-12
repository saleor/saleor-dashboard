import { type PromotionWhereInput } from "@dashboard/graphql";

import { getPromotionListWhere } from "./getPromotionListWhere";

const activeFilter: PromotionWhereInput = {
  AND: [{ startDate: { range: { lte: "2026-11-10T12:00:00.000Z" } } }],
};

describe("getPromotionListWhere", () => {
  it("puts the search and the filters into one AND, so no operator sits next to a field", () => {
    // Arrange & Act
    const where = getPromotionListWhere(activeFilter, "Summer");

    // Assert
    expect(where).toEqual({ AND: [activeFilter, { name: { eq: "Summer" } }] });
    expect(Object.keys(where)).toEqual(["AND"]);
  });

  it.each<[string, PromotionWhereInput | null, string | undefined, PromotionWhereInput]>([
    ["only filters", activeFilter, undefined, activeFilter],
    ["only a search", null, "Summer", { name: { eq: "Summer" } }],
    ["neither", null, undefined, {}],
  ])("sends %s as they are", (_case, filters, query, expected) => {
    // Arrange & Act
    const where = getPromotionListWhere(filters, query);

    // Assert
    expect(where).toEqual(expected);
  });
});
