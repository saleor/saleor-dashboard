import { prepareQs } from "./qs";

describe("Filters: preapreQS", () => {
  it("should remove activeTab, action, sort, asc from query string", () => {
    const qs = prepareQs("?category=1&activeTab=1&channel=usa&action=save-search&sort=name&asc=4");

    expect(qs).toEqual({
      activeTab: "1",
      parsedQs: {
        category: "1",
        channel: "usa",
      },
    });
  });
});
