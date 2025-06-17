import { prepareFormValues } from "@dashboard/extensions/new-tab-actions";

describe("prepareFormValues", () => {
  it("Renders flat array of tuples with key and value", () => {
    const record = {
      productId: "product-1",
      orderIds: ["o1", "o2"],
      customerId: undefined,
    };

    expect(prepareFormValues(record)).toEqual([
      ["productId", "product-1"],
      ["orderIds", "o1"],
      ["orderIds", "o2"],
    ]);
  });
});
