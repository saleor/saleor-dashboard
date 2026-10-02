import type { E2eConfig } from "../config.ts";
import { adminToken, assertNoMutationErrors, gql } from "../lib/graphql.ts";
import { step } from "../lib/progress.ts";
import type { Scenario } from "./scenario.ts";

/**
 * The default scenario plus the order states the order specs start from.
 *
 * `populatedb` alone cannot serve them: its orders are random (channel, customer, a 10%
 * chance of being unconfirmed, fulfilled whenever they happen to be paid) and its catalogue
 * promotions hit random products. So this scenario brings its own products at known prices,
 * one known customer, one promotion of each kind, and orders a spec can look up by name -
 * see `findOrderId`. Everything lives in one channel.
 *
 * `populatedb`'s own promotions are deleted, so no price here depends on which products
 * its random draw picked.
 */
export const ORDERS_SCENARIO = "orders";

/** Marks orders as paid with a transaction - `populatedb`'s default. */
export const CHANNEL = { slug: "default-channel", name: "Channel-USD" } as const;

export const CUSTOMER = {
  email: "e2e.customer@example.com",
  firstName: "Ada",
  lastName: "Lovelace",
};

const CUSTOMER_ADDRESS = {
  firstName: CUSTOMER.firstName,
  lastName: CUSTOMER.lastName,
  streetAddress1: "69 W 9th Street",
  city: "New York",
  postalCode: "10001",
  country: "US",
  countryArea: "NY",
  phone: "+12125771133",
};

/** Prices in the channel's currency, USD. */
export const PRODUCTS = {
  /** Discounted by the catalogue promotion. */
  tee: { name: "E2E Tee", sku: "e2e-tee", price: 10 },
  hoodie: { name: "E2E Hoodie", sku: "e2e-hoodie", price: 50 },
} as const;

export const PROMOTIONS = {
  catalogue: { name: "E2E Tee sale", percent: 20 },
  order: { name: "E2E big basket", percent: 10, subtotalAtLeast: 30 },
} as const;

/**
 * Orders, keyed by what a spec needs from them. Each carries its key as `e2e` metadata,
 * which is how `findOrderId` finds it - ids differ per build of the dump.
 */
export const SCENARIO_ORDERS = {
  /** One tee, unpaid and unfulfilled. */
  unpaid: { paid: false },
  /** One tee, paid and fulfilled. */
  fulfilled: { paid: true },
} as const;

export type ScenarioOrder = keyof typeof SCENARIO_ORDERS;

type Mutate = <T extends Record<string, unknown>>(
  name: string,
  query: string,
  variables?: Record<string, unknown>,
) => Promise<T>;

/** One mutation, failing on the payload's `errors` - see `assertNoMutationErrors`. */
const mutator =
  (config: E2eConfig, token: string): Mutate =>
  async (name, query, variables = {}) => {
    const data = await gql<Record<string, { errors?: unknown }>>(config, query, variables, token);

    assertNoMutationErrors(name, data[name]?.errors);

    return data[name] as never;
  };

const lookUpShop = async (config: E2eConfig, token: string) => {
  const data = await gql<{
    channel: { id: string };
    categories: { edges: { node: { id: string } }[] };
    promotions: { edges: { node: { id: string } }[] };
    warehouses: {
      edges: {
        node: {
          id: string;
          shippingZones: {
            edges: { node: { countries: { code: string }[]; channels: { slug: string }[] } }[];
          };
        };
      }[];
    };
  }>(
    config,
    `query($channel: String!) {
      channel(slug: $channel) { id }
      categories(first: 1) { edges { node { id } } }
      promotions(first: 100) { edges { node { id } } }
      warehouses(first: 100) {
        edges { node { id shippingZones(first: 100) { edges { node { countries { code } channels { slug } } } } } }
      }
    }`,
    { channel: CHANNEL.slug },
    token,
  );

  /* Stock is only sellable through a zone that covers the address in the order's channel. */
  const warehouse = data.warehouses.edges.find(({ node }) =>
    node.shippingZones.edges.some(
      ({ node: zone }) =>
        zone.countries.some(({ code }) => code === CUSTOMER_ADDRESS.country) &&
        zone.channels.some(({ slug }) => slug === CHANNEL.slug),
    ),
  );

  if (!warehouse) {
    throw new Error(`no warehouse ships to ${CUSTOMER_ADDRESS.country} in ${CHANNEL.slug}`);
  }

  return {
    channelId: data.channel.id,
    categoryId: data.categories.edges[0].node.id,
    promotionIds: data.promotions.edges.map(({ node }) => node.id),
    warehouseId: warehouse.node.id,
  };
};

type Shop = Awaited<ReturnType<typeof lookUpShop>>;

const createProducts = async (mutate: Mutate, shop: Shop) => {
  const { productType } = await mutate<{ productType: { id: string } }>(
    "productTypeCreate",
    `mutation($input: ProductTypeInput!) {
      productTypeCreate(input: $input) { productType { id } errors { field code message } }
    }`,
    {
      input: { name: "E2E Simple", kind: "NORMAL", hasVariants: false, isShippingRequired: true },
    },
  );
  const variantIds: Record<keyof typeof PRODUCTS, string> = { tee: "", hoodie: "" };

  for (const [key, product] of Object.entries(PRODUCTS) as [
    keyof typeof PRODUCTS,
    (typeof PRODUCTS)[keyof typeof PRODUCTS],
  ][]) {
    const created = await mutate<{ product: { id: string } }>(
      "productCreate",
      `mutation($input: ProductCreateInput!) {
        productCreate(input: $input) { product { id } errors { field code message } }
      }`,
      { input: { name: product.name, productType: productType.id, category: shop.categoryId } },
    );
    const { productVariant } = await mutate<{ productVariant: { id: string } }>(
      "productVariantCreate",
      `mutation($input: ProductVariantCreateInput!) {
        productVariantCreate(input: $input) { productVariant { id } errors { field code message } }
      }`,
      {
        input: {
          product: created.product.id,
          sku: product.sku,
          attributes: [],
          trackInventory: true,
          stocks: [{ warehouse: shop.warehouseId, quantity: 1000 }],
        },
      },
    );

    await mutate(
      "productChannelListingUpdate",
      `mutation($id: ID!, $input: ProductChannelListingUpdateInput!) {
        productChannelListingUpdate(id: $id, input: $input) { errors { field code message } }
      }`,
      {
        id: created.product.id,
        input: {
          updateChannels: [
            {
              channelId: shop.channelId,
              isPublished: true,
              visibleInListings: true,
              isAvailableForPurchase: true,
              addVariants: [productVariant.id],
            },
          ],
        },
      },
    );
    await mutate(
      "productVariantChannelListingUpdate",
      `mutation($id: ID!, $input: [ProductVariantChannelListingAddInput!]!) {
        productVariantChannelListingUpdate(id: $id, input: $input) { errors { field code message } }
      }`,
      {
        id: productVariant.id,
        input: [{ channelId: shop.channelId, price: product.price }],
      },
    );

    variantIds[key] = productVariant.id;
  }

  return variantIds;
};

const createPromotions = async (mutate: Mutate, shop: Shop, teeProductId: string) => {
  if (shop.promotionIds.length > 0) {
    await mutate(
      "promotionBulkDelete",
      `mutation($ids: [ID!]!) { promotionBulkDelete(ids: $ids) { errors { field code message } } }`,
      { ids: shop.promotionIds },
    );
  }

  const create = (input: Record<string, unknown>) =>
    mutate(
      "promotionCreate",
      `mutation($input: PromotionCreateInput!) {
        promotionCreate(input: $input) { errors { field code message } }
      }`,
      { input },
    );

  await create({
    name: PROMOTIONS.catalogue.name,
    type: "CATALOGUE",
    rules: [
      {
        channels: [shop.channelId],
        rewardValueType: "PERCENTAGE",
        rewardValue: PROMOTIONS.catalogue.percent,
        cataloguePredicate: { productPredicate: { ids: [teeProductId] } },
      },
    ],
  });
  await create({
    name: PROMOTIONS.order.name,
    type: "ORDER",
    rules: [
      {
        channels: [shop.channelId],
        rewardType: "SUBTOTAL_DISCOUNT",
        rewardValueType: "PERCENTAGE",
        rewardValue: PROMOTIONS.order.percent,
        orderPredicate: {
          discountedObjectPredicate: {
            baseSubtotalPrice: { range: { gte: PROMOTIONS.order.subtotalAtLeast } },
          },
        },
      },
    ],
  });
};

const createOrder = async (
  mutate: Mutate,
  {
    ref,
    channelId,
    customerId,
    variantId,
    warehouseId,
    paid,
  }: {
    ref: ScenarioOrder;
    channelId: string;
    customerId: string;
    variantId: string;
    warehouseId: string;
    paid: boolean;
  },
) => {
  const { order: draft } = await mutate<{
    order: { id: string; shippingMethods: { id: string }[] };
  }>(
    "draftOrderCreate",
    `mutation($input: DraftOrderCreateInput!) {
      draftOrderCreate(input: $input) {
        order { id shippingMethods { id } }
        errors { field code message }
      }
    }`,
    {
      input: {
        channelId,
        user: customerId,
        lines: [{ variantId, quantity: 1 }],
        shippingAddress: CUSTOMER_ADDRESS,
        billingAddress: CUSTOMER_ADDRESS,
        metadata: [{ key: "e2e", value: ref }],
      },
    },
  );

  await mutate(
    "draftOrderUpdate",
    `mutation($id: ID!, $input: DraftOrderInput!) {
      draftOrderUpdate(id: $id, input: $input) { errors { field code message } }
    }`,
    { id: draft.id, input: { shippingMethod: draft.shippingMethods[0].id } },
  );

  const { order } = await mutate<{ order: { id: string; lines: { id: string }[] } }>(
    "draftOrderComplete",
    `mutation($id: ID!) {
      draftOrderComplete(id: $id) { order { id lines { id } } errors { field code message } }
    }`,
    { id: draft.id },
  );

  if (!paid) {
    return;
  }

  await mutate(
    "orderMarkAsPaid",
    `mutation($id: ID!) { orderMarkAsPaid(id: $id) { errors { field code message } } }`,
    { id: order.id },
  );
  await mutate(
    "orderFulfill",
    `mutation($order: ID!, $input: OrderFulfillInput!) {
      orderFulfill(order: $order, input: $input) { errors { field code message } }
    }`,
    {
      order: order.id,
      input: {
        notifyCustomer: false,
        lines: order.lines.map(line => ({
          orderLineId: line.id,
          stocks: [{ warehouse: warehouseId, quantity: 1 }],
        })),
      },
    },
  );
};

export const ordersScenario: Scenario = {
  name: ORDERS_SCENARIO,
  parent: "default",
  build: async (config, getAdminToken) => {
    const token = await getAdminToken();
    const mutate = mutator(config, token);
    const shop = await lookUpShop(config, token);

    const variantIds = await step("creating products", () => createProducts(mutate, shop));
    const teeProductId = (
      await gql<{ productVariant: { product: { id: string } } }>(
        config,
        `query($id: ID!) { productVariant(id: $id) { product { id } } }`,
        { id: variantIds.tee },
        token,
      )
    ).productVariant.product.id;

    await step("replacing the promotions", () => createPromotions(mutate, shop, teeProductId));

    const { user } = await mutate<{ user: { id: string } }>(
      "customerCreate",
      `mutation($input: UserCreateInput!) {
        customerCreate(input: $input) { user { id } errors { field code message } }
      }`,
      {
        input: {
          ...CUSTOMER,
          defaultShippingAddress: CUSTOMER_ADDRESS,
          defaultBillingAddress: CUSTOMER_ADDRESS,
        },
      },
    );

    await step("creating orders", async () => {
      for (const [ref, { paid }] of Object.entries(SCENARIO_ORDERS)) {
        await createOrder(mutate, {
          ref: ref as ScenarioOrder,
          channelId: shop.channelId,
          customerId: user.id,
          variantId: variantIds.tee,
          warehouseId: shop.warehouseId,
          paid,
        });
      }
    });
  },
};

/**
 * The id of one of `SCENARIO_ORDERS` in the restored database. A read, so it is safe at
 * test time; ids are not constants because every build of the dump mints new ones.
 */
export const findOrderId = async (config: E2eConfig, ref: ScenarioOrder): Promise<string> => {
  const data = await gql<{ orders: { edges: { node: { id: string } }[] } }>(
    config,
    `query($ref: String!) {
      orders(first: 1, filter: { metadata: [{ key: "e2e", value: $ref }] }) { edges { node { id } } }
    }`,
    { ref },
    await adminToken(config),
  );
  const [order] = data.orders.edges;

  if (!order) {
    throw new Error(`the "${ORDERS_SCENARIO}" scenario has no order "${ref}"`);
  }

  return order.node.id;
};
