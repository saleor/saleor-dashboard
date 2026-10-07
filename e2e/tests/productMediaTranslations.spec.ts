import type { Page } from "@playwright/test";

import { e2eConfig } from "../config.ts";
import { expect, test as base } from "../fixtures/test.ts";
import { credentialsFor } from "../lib/actors.ts";
import { gql, signIn } from "../lib/graphql.ts";
import {
  MEDIA_TRANSLATION_PRODUCT,
  ORIGINAL_MEDIA_ALT,
  OTHER_MEDIA_TRANSLATION_PRODUCT,
  productMediaTranslationsScenario,
} from "../scenarios/productMediaTranslations.ts";

interface MediaFixture {
  productId: string;
  otherProductId: string;
  mediaId: string;
  otherMediaId: string;
  token: string;
}

interface TranslatableProduct {
  name: string;
  productId: string;
  product: { media: Array<{ id: string; alt: string }> | null } | null;
}

const config = e2eConfig();
const test = base.extend<{ mediaFixture: MediaFixture }>({
  mediaFixture: async ({ actor, seed }, provide) => {
    void seed;

    const { email, password } = credentialsFor(actor);
    const { token } = await signIn(config, email, password);
    const { translations } = await gql<{
      translations: { edges: Array<{ node: TranslatableProduct }> } | null;
    }>(
      config,
      `query MediaTranslationProducts {
        translations(kind: PRODUCT, first: 100) {
          edges {
            node {
              ... on ProductTranslatableContent {
                name
                productId
                product { media { id alt } }
              }
            }
          }
        }
      }`,
      {},
      token,
    );
    const product = translations?.edges.find(
      ({ node }) => node.name === MEDIA_TRANSLATION_PRODUCT,
    )?.node;
    const otherProduct = translations?.edges.find(
      ({ node }) => node.name === OTHER_MEDIA_TRANSLATION_PRODUCT,
    )?.node;
    const media = product?.product?.media?.find(({ alt }) => alt === ORIGINAL_MEDIA_ALT);
    const otherMedia = product?.product?.media?.find(({ alt }) => alt === "Original rear view");

    if (!product || !otherProduct || !media || !otherMedia) {
      throw new Error("The media translation scenario is missing its products or media");
    }

    await provide({
      productId: product.productId,
      otherProductId: otherProduct.productId,
      mediaId: media.id,
      otherMediaId: otherMedia.id,
      token,
    });
  },
});

test.use({ scenario: productMediaTranslationsScenario.name });
test.skip(config.stagingSchema, "ProductMedia translations require the stable schema");

const saveAlt = async (page: Page, alt: string): Promise<void> => {
  await page.getByTestId("edit-alt").click();
  await page.getByTestId("translation-field").fill(alt);
  await page.getByTestId("button-bar-confirm").click();
  await expect(page.getByTestId("edit-alt")).toBeVisible();
};

test("saves and clears media alt translations without changing the original #e2e #translations", async ({
  page,
  mediaFixture,
}) => {
  // Arrange
  const { productId, mediaId, otherMediaId, token } = mediaFixture;
  const pageErrors: string[] = [];

  page.on("pageerror", error => pageErrors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("cachedTranslationLocales", JSON.stringify(["DE"]));
  });
  await page.goto(
    `/products/${encodeURIComponent(productId)}/image/${encodeURIComponent(mediaId)}`,
  );

  // Act
  await page.getByTitle("Open translations").click();

  // Assert
  await expect(page).toHaveURL(
    new RegExp(`/translations/DE/products/.+/media/${encodeURIComponent(mediaId)}$`),
  );
  await expect(page.getByTestId("translation-field-alt")).toContainText(ORIGINAL_MEDIA_ALT);

  // Act
  const translatedAlt = "Produktansicht von vorne";

  await saveAlt(page, translatedAlt);
  await page.reload();

  // Assert
  await expect(page.getByTestId("translation-field-alt")).toContainText(translatedAlt);
  await expect(
    page.getByTestId("product-media-translation-preview").locator("img"),
  ).toHaveAttribute("alt", translatedAlt);
  await expect(
    page.getByTestId("product-media-translation-preview").locator("img"),
  ).toHaveJSProperty("complete", true);
  await expect(
    page.getByTestId("product-media-translation-preview").locator("img"),
  ).not.toHaveJSProperty("naturalWidth", 0);

  // Act
  await page.getByRole("combobox", { name: "Choose language" }).fill("French");
  await page.getByRole("option", { name: "French (FR)", exact: true }).click();

  // Assert
  await expect(page).toHaveURL(
    new RegExp(`/translations/FR/products/.+/media/${encodeURIComponent(mediaId)}$`),
  );
  await expect(page.getByTestId("translation-field-alt")).not.toContainText(translatedAlt);

  // Act
  await page.getByRole("combobox", { name: "Choose language" }).fill("German");
  await page.getByRole("option", { name: "German (DE)", exact: true }).click();
  await saveAlt(page, "");
  await page.reload();

  // Assert
  const { translation } = await gql<{
    translation: { alt: string; translation: { alt: string } };
  }>(
    config,
    `query MediaTranslation($id: ID!) {
      translation(kind: PRODUCT_MEDIA, id: $id) {
        ... on ProductMediaTranslatableContent {
          alt
          translation(languageCode: DE) { alt }
        }
      }
    }`,
    { id: mediaId },
    token,
  );

  expect(translation).toEqual({ alt: ORIGINAL_MEDIA_ALT, translation: { alt: "" } });
  await expect(page.getByTestId("translation-field-alt")).not.toContainText(translatedAlt);

  // Act
  await page.getByRole("combobox", { name: "Translating" }).fill("rear view");
  await page.getByRole("option", { name: "Media 2: Original rear view", exact: true }).click();

  // Assert
  await expect(page).toHaveURL(new RegExp(`/media/${encodeURIComponent(otherMediaId)}$`));
  await expect(page.getByTestId("translation-field-alt")).toContainText("Original rear view");
  expect(pageErrors).toEqual([]);
});

test("saves media alt translations in bulk mode #e2e #translations", async ({
  page,
  mediaFixture,
}) => {
  // Arrange
  const { productId, mediaId, token } = mediaFixture;
  const translatedAlt = "Bulk translated front view";

  await page.goto(
    `/translations/DE/products/${encodeURIComponent(productId)}/media/${encodeURIComponent(mediaId)}?bulk=1`,
  );

  // Act
  await page.getByTestId("translation-field").fill(translatedAlt);
  await page.getByTestId("button-bar-confirm").click();

  // Assert
  await expect(page.getByText("All translations saved", { exact: true })).toBeVisible();
  await expect(page.getByTestId("button-bar-confirm")).toBeDisabled();
  await page.reload();
  await expect(page.getByTestId("translation-field")).toHaveValue(translatedAlt);

  const { translation } = await gql<{
    translation: { alt: string; translation: { alt: string } };
  }>(
    config,
    `query MediaTranslation($id: ID!) {
      translation(kind: PRODUCT_MEDIA, id: $id) {
        ... on ProductMediaTranslatableContent {
          alt
          translation(languageCode: DE) { alt }
        }
      }
    }`,
    { id: mediaId },
    token,
  );

  expect(translation).toEqual({ alt: ORIGINAL_MEDIA_ALT, translation: { alt: translatedAlt } });
});

test("rejects overly long alt translations without losing the edit #e2e #translations", async ({
  page,
  mediaFixture,
}) => {
  // Arrange
  const { productId, mediaId } = mediaFixture;
  const invalidAlt = "x".repeat(1000);

  await page.goto(
    `/translations/DE/products/${encodeURIComponent(productId)}/media/${encodeURIComponent(mediaId)}`,
  );
  await page.getByTestId("edit-alt").click();
  await page.getByTestId("translation-field").fill(invalidAlt);
  const mutationResponse = page.waitForResponse(
    response =>
      response.request().method() === "POST" &&
      response.request().postDataJSON()?.operationName === "UpdateProductMediaTranslation",
  );

  // Act
  await page.getByTestId("button-bar-confirm").click();
  const response = await mutationResponse;
  const result: {
    data: { productMediaTranslate: { errors: Array<{ field: string | null; code: string }> } };
  } = await response.json();

  // Assert
  expect(result.data.productMediaTranslate.errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ field: "alt", code: "INVALID" })]),
  );
  await expect(page.getByTestId("translation-field")).toHaveValue(invalidAlt);
  await expect(page.getByTestId("edit-alt")).toHaveCount(0);

  // Act
  await page.getByTestId("translation-field").fill("Corrected front view");
  await page.getByTestId("button-bar-confirm").click();

  // Assert
  await expect(page.getByTestId("edit-alt")).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("translation-field-alt")).toContainText("Corrected front view");
});

test.describe("staff with only translation permissions", () => {
  test.use({ actor: "translations" });

  test("translates unpublished product media with only MANAGE_TRANSLATIONS #e2e #translations", async ({
    page,
    mediaFixture,
  }) => {
    // Arrange
    const { productId, otherProductId, mediaId, otherMediaId, token } = mediaFixture;
    const { me } = await gql<{
      me: { userPermissions: Array<{ code: string }> } | null;
    }>(config, "query TranslatorPermissions { me { userPermissions { code } } }", {}, token);

    expect(me?.userPermissions.map(permission => permission.code)).toEqual(["MANAGE_TRANSLATIONS"]);

    // Act
    await page.goto(
      `/translations/DE/products/${encodeURIComponent(productId)}/media/${encodeURIComponent(mediaId)}`,
    );

    // Assert
    await expect(page.getByTestId("translation-field-alt")).toContainText(ORIGINAL_MEDIA_ALT);

    // Act
    await saveAlt(page, "Translated by a translator");
    await page.reload();

    // Assert
    await expect(page.getByTestId("translation-field-alt")).toContainText(
      "Translated by a translator",
    );

    // Act
    await page.getByRole("combobox", { name: "Translating" }).fill("rear view");
    await page.getByRole("option", { name: "Media 2: Original rear view", exact: true }).click();

    // Assert
    await expect(page).toHaveURL(new RegExp(`/media/${encodeURIComponent(otherMediaId)}$`));
    await expect(page.getByTestId("translation-field-alt")).toContainText("Original rear view");

    // Act
    await page.goto(
      `/translations/DE/products/${encodeURIComponent(otherProductId)}/media/${encodeURIComponent(mediaId)}`,
    );

    // Assert
    await expect(page.getByText("Sorry, the page was not found")).toBeVisible();
    await expect(page.getByTestId("edit-alt")).toHaveCount(0);
  });
});
