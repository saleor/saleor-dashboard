import { type ApolloClient } from "@apollo/client";

import {
  fetchProductDoctorShippingZones,
  MAX_PRODUCT_DOCTOR_SHIPPING_ZONE_PAGES,
  ProductDoctorShippingZonesFetchError,
} from "./fetchProductDoctorShippingZones";

interface ZonePage {
  ids: string[];
  hasNextPage: boolean;
  endCursor: string | null;
}

interface QueryResponse {
  data: { shippingZones: unknown };
  errors?: Array<{ message: string }>;
}

const zonePage = ({ ids, hasNextPage, endCursor }: ZonePage): QueryResponse => ({
  data: {
    shippingZones: {
      pageInfo: { hasNextPage, endCursor },
      edges: ids.map(id => ({
        node: { id, name: id, channels: [{ id: "ch-de" }], warehouses: [], countries: [] },
      })),
    },
  },
});

const createClient = (responses: QueryResponse[]): ApolloClient<object> => {
  let call = 0;

  return {
    query: jest.fn().mockImplementation(async () => {
      const response = responses[Math.min(call, responses.length - 1)];

      call += 1;

      return response;
    }),
  } as unknown as ApolloClient<object>;
};

describe("fetchProductDoctorShippingZones", () => {
  it("walks every page and filters by the given channels", async () => {
    // Arrange
    const client = createClient([
      zonePage({ ids: ["z1", "z2"], hasNextPage: true, endCursor: "c1" }),
      zonePage({ ids: ["z3"], hasNextPage: false, endCursor: "c2" }),
    ]);

    // Act
    const zones = await fetchProductDoctorShippingZones(client, ["ch-de"]);

    // Assert
    expect(zones?.map(zone => zone.id)).toEqual(["z1", "z2", "z3"]);
    expect(client.query).toHaveBeenCalledTimes(2);
    expect((client.query as jest.Mock).mock.calls[1][0].variables).toEqual({
      channels: ["ch-de"],
      first: 100,
      after: "c1",
    });
  });

  it("returns null when the API hides shipping zones", async () => {
    // Arrange
    const client = createClient([
      { data: { shippingZones: null }, errors: [{ message: "You need MANAGE_SHIPPING" }] },
    ]);

    // Act
    const zones = await fetchProductDoctorShippingZones(client, ["ch-de"]);

    // Assert
    expect(zones).toBeNull();
  });

  it("throws when zones disappear after the first page", async () => {
    // Arrange
    const client = createClient([
      zonePage({ ids: ["z1"], hasNextPage: true, endCursor: "c1" }),
      { data: { shippingZones: null }, errors: [{ message: "Internal error" }] },
    ]);

    // Act & Assert
    await expect(fetchProductDoctorShippingZones(client, ["ch-de"])).rejects.toThrow(
      ProductDoctorShippingZonesFetchError,
    );
  });

  it("throws when the cursor does not advance", async () => {
    // Arrange
    const client = createClient([zonePage({ ids: ["z1"], hasNextPage: true, endCursor: "c1" })]);

    // Act & Assert
    await expect(fetchProductDoctorShippingZones(client, ["ch-de"])).rejects.toThrow(
      "Pagination cursor did not advance",
    );
  });

  it("throws after the page cap", async () => {
    // Arrange
    let page = 0;
    const client = {
      query: jest.fn().mockImplementation(async () => {
        page += 1;

        return zonePage({ ids: [`z${page}`], hasNextPage: true, endCursor: `c${page}` });
      }),
    } as unknown as ApolloClient<object>;

    // Act & Assert
    await expect(fetchProductDoctorShippingZones(client, ["ch-de"])).rejects.toThrow(
      `Exceeded ${MAX_PRODUCT_DOCTOR_SHIPPING_ZONE_PAGES} pages`,
    );
  });
});
