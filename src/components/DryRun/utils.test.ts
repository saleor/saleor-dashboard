import { getUnavailableObjects } from "./utils";

describe("getUnavailableObjects", () => {
  it("should return unavailable for dry run events from provided query", () => {
    const query = `
    subscription {
      event {
        ... on ProductUpdated {
          __typename
        }
        ... on ProductDeleted {
          __typename
        }
        ... on AddressUpdated {
          __typename
        }
      }
    }`;
    const events = getUnavailableObjects(query);

    expect(events).toEqual(["AddressUpdated"]);
  });
});
