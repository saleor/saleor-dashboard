import { openAsBlob } from "node:fs";

import { assertNoMutationErrors, gql } from "../lib/graphql.ts";
import { repoPath } from "../lib/paths.ts";
import { ensureScenario, restoreScenario } from "../lib/seed.ts";
import { defaultScenario } from "./default.ts";
import type { Scenario } from "./scenario.ts";

interface MutationError {
  field: string | null;
  message: string | null;
}

interface ProductCreateResult {
  product: { id: string } | null;
  errors: MutationError[];
}

export const MEDIA_TRANSLATION_PRODUCT = "Media translations";
export const OTHER_MEDIA_TRANSLATION_PRODUCT = "Media translations other";
export const ORIGINAL_MEDIA_ALT = "Original front view";

export const productMediaTranslationsScenario: Scenario = {
  name: "product-media-translations",
  build: async (config, adminToken) => {
    // Keep the seeded users and JWT keys shared with the cached browser sessions.
    const defaultDump = await ensureScenario(config, defaultScenario.name);

    restoreScenario(config, defaultDump);

    // ProductMedia translations and their UI are available only on the stable schema.
    if (config.stagingSchema) {
      return;
    }

    const token = await adminToken();
    const { productTypeCreate } = await gql<{
      productTypeCreate: {
        productType: { id: string } | null;
        errors: MutationError[];
      };
    }>(
      config,
      `mutation CreateType($input: ProductTypeInput!) {
        productTypeCreate(input: $input) {
          productType { id }
          errors { field message }
        }
      }`,
      { input: { name: MEDIA_TRANSLATION_PRODUCT, isShippingRequired: false } },
      token,
    );

    assertNoMutationErrors("productTypeCreate", productTypeCreate.errors);

    if (!productTypeCreate.productType) {
      throw new Error("Product type creation did not return a product type");
    }

    const { productCreate, otherProductCreate } = await gql<{
      productCreate: ProductCreateResult;
      otherProductCreate: ProductCreateResult;
    }>(
      config,
      `mutation CreateProducts($input: ProductCreateInput!, $otherInput: ProductCreateInput!) {
        productCreate(input: $input) {
          product { id }
          errors { field message }
        }
        otherProductCreate: productCreate(input: $otherInput) {
          product { id }
          errors { field message }
        }
      }`,
      {
        input: {
          name: MEDIA_TRANSLATION_PRODUCT,
          productType: productTypeCreate.productType.id,
        },
        otherInput: {
          name: OTHER_MEDIA_TRANSLATION_PRODUCT,
          productType: productTypeCreate.productType.id,
        },
      },
      token,
    );

    assertNoMutationErrors("productCreate", productCreate.errors);
    assertNoMutationErrors("otherProductCreate", otherProductCreate.errors);

    if (!productCreate.product || !otherProductCreate.product) {
      throw new Error("Product creation did not return both products");
    }

    for (const alt of [ORIGINAL_MEDIA_ALT, "Original rear view"]) {
      const form = new FormData();

      form.set(
        "operations",
        JSON.stringify({
          query: `mutation CreateMedia($input: ProductMediaCreateInput!) {
            productMediaCreate(input: $input) { media { id } errors { field message } }
          }`,
          variables: { input: { product: productCreate.product.id, alt, image: null } },
        }),
      );
      form.set("map", JSON.stringify({ "0": ["variables.input.image"] }));
      form.set(
        "0",
        await openAsBlob(repoPath("assets/images/sample-product.jpg"), { type: "image/jpeg" }),
        "product.jpg",
      );

      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: form,
      });
      const result: {
        data?: {
          productMediaCreate: { media: { id: string } | null; errors: MutationError[] };
        };
        errors?: Array<{ message: string }>;
      } = await response.json();

      if (!response.ok || result.errors?.length || !result.data) {
        throw new Error(`Media upload failed (${response.status}): ${JSON.stringify(result)}`);
      }

      assertNoMutationErrors("productMediaCreate", result.data.productMediaCreate.errors);

      if (!result.data.productMediaCreate.media) {
        throw new Error("Media creation did not return media");
      }
    }
  },
};
