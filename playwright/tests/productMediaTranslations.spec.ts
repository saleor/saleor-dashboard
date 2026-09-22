import { USER_PERMISSION } from "@data/userPermissions";
import { type APIRequestContext, expect, type Page, test as base } from "@playwright/test";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import path from "path";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface MutationError {
  field: string | null;
  message: string | null;
}

interface LoginResult {
  tokenCreate: {
    token: string;
    refreshToken: string;
    errors: MutationError[];
  };
}

interface MediaFixture {
  productId: string;
  otherProductId: string;
  mediaId: string;
  otherMediaId: string;
  originalAlt: string;
  token: string;
}

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error("API_URL is required for media translation tests");
}

const graphql = async <T>(
  request: APIRequestContext,
  query: string,
  variables: Record<string, unknown>,
  token?: string,
): Promise<T> => {
  const response = await request.post(apiUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    data: { query, variables },
  });
  const result: GraphQLResponse<T> = await response.json();

  expect(response.ok()).toBe(true);
  expect(result.errors).toBeUndefined();

  if (!result.data) {
    throw new Error("The GraphQL response did not contain data");
  }

  return result.data;
};

const test = base.extend<{ mediaFixture: MediaFixture }>({
  mediaFixture: async ({ request, context }, provideFixture) => {
    const { tokenCreate } = await graphql<LoginResult>(
      request,
      `
        mutation Login($email: String!, $password: String!) {
          tokenCreate(email: $email, password: $password) {
            token
            refreshToken
            errors {
              field
              message
            }
          }
        }
      `,
      { email: process.env.E2E_USER_NAME, password: process.env.E2E_USER_PASSWORD },
    );

    expect(tokenCreate.errors).toEqual([]);

    await context.addInitScript(refreshToken => {
      localStorage.setItem("_saleorRefreshToken", refreshToken);
      localStorage.setItem("cachedTranslationLocales", JSON.stringify(["DE"]));
    }, tokenCreate.refreshToken);

    const { token } = tokenCreate;
    const name = `Media translations ${randomUUID()}`;
    const { productTypeCreate } = await graphql<{
      productTypeCreate: { productType: { id: string }; errors: MutationError[] };
    }>(
      request,
      `
        mutation CreateType($input: ProductTypeInput!) {
          productTypeCreate(input: $input) {
            productType {
              id
            }
            errors {
              field
              message
            }
          }
        }
      `,
      { input: { name, isShippingRequired: false } },
      token,
    );

    expect(productTypeCreate.errors).toEqual([]);

    let productId: string | undefined;
    let otherProductId: string | undefined;

    try {
      const { productCreate, otherProductCreate } = await graphql<{
        productCreate: { product: { id: string }; errors: MutationError[] };
        otherProductCreate: { product: { id: string }; errors: MutationError[] };
      }>(
        request,
        `
          mutation CreateProducts($input: ProductCreateInput!, $otherInput: ProductCreateInput!) {
            productCreate(input: $input) {
              product {
                id
              }
              errors {
                field
                message
              }
            }
            otherProductCreate: productCreate(input: $otherInput) {
              product {
                id
              }
              errors {
                field
                message
              }
            }
          }
        `,
        {
          input: { name, productType: productTypeCreate.productType.id },
          otherInput: { name: `${name} other`, productType: productTypeCreate.productType.id },
        },
        token,
      );

      expect(productCreate.errors).toEqual([]);
      productId = productCreate.product.id;
      expect(otherProductCreate.errors).toEqual([]);
      otherProductId = otherProductCreate.product.id;

      const originalAlt = "Original front view";
      const mediaIds: string[] = [];

      for (const alt of [originalAlt, "Original rear view"]) {
        const response = await request.post(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
          multipart: {
            operations: JSON.stringify({
              query: `mutation CreateMedia($input: ProductMediaCreateInput!) {
                productMediaCreate(input: $input) { media { id } errors { field message } }
              }`,
              variables: { input: { product: productId, alt, image: null } },
            }),
            map: JSON.stringify({ "0": ["variables.input.image"] }),
            "0": {
              name: "product.jpg",
              mimeType: "image/jpeg",
              buffer: readFileSync(path.resolve("assets/images/sample-product.jpg")),
            },
          },
        });
        const result: GraphQLResponse<{
          productMediaCreate: { media: { id: string }; errors: MutationError[] };
        }> = await response.json();

        expect(result.errors).toBeUndefined();
        expect(result.data?.productMediaCreate.errors).toEqual([]);

        if (!result.data) {
          throw new Error("Media creation did not return data");
        }

        mediaIds.push(result.data.productMediaCreate.media.id);
      }

      await provideFixture({
        productId,
        otherProductId,
        mediaId: mediaIds[0],
        otherMediaId: mediaIds[1],
        originalAlt,
        token,
      });
    } finally {
      for (const id of [productId, otherProductId].filter(id => id !== undefined)) {
        const { productDelete } = await graphql<{ productDelete: { errors: MutationError[] } }>(
          request,
          `
            mutation DeleteProduct($id: ID!) {
              productDelete(id: $id) {
                errors {
                  field
                  message
                }
              }
            }
          `,
          { id },
          token,
        );

        expect(productDelete.errors).toEqual([]);
      }

      const { productTypeDelete } = await graphql<{
        productTypeDelete: { errors: MutationError[] };
      }>(
        request,
        `
          mutation DeleteType($id: ID!) {
            productTypeDelete(id: $id) {
              errors {
                field
                message
              }
            }
          }
        `,
        { id: productTypeCreate.productType.id },
        token,
      );

      expect(productTypeDelete.errors).toEqual([]);
    }
  },
});

test.setTimeout(90_000);

const saveAlt = async (page: Page, alt: string): Promise<void> => {
  await page.getByTestId("edit-alt").click();
  await page.getByTestId("translation-field").fill(alt);
  await page.getByTestId("button-bar-confirm").click();
  await expect(page.getByTestId("edit-alt")).toBeVisible();
};

test("saves and clears media alt translations without changing the original #e2e #translations", async ({
  page,
  request,
  mediaFixture,
}) => {
  // Arrange
  const { productId, mediaId, otherMediaId, originalAlt, token } = mediaFixture;
  const pageErrors: string[] = [];

  page.on("pageerror", error => pageErrors.push(error.message));
  await page.goto(
    `/products/${encodeURIComponent(productId)}/image/${encodeURIComponent(mediaId)}`,
  );

  // Act
  await page.getByTitle("Open translations").click();

  // Assert
  await expect(page).toHaveURL(
    new RegExp(`/translations/DE/products/.+/media/${encodeURIComponent(mediaId)}$`),
  );
  await expect(page.getByTestId("translation-field-alt")).toContainText(originalAlt);

  // Act
  const translatedAlt = "Produktansicht von vorne";

  await saveAlt(page, translatedAlt);
  await page.reload();

  // Assert
  await expect(page.getByTestId("translation-field-alt")).toContainText(translatedAlt);
  await expect(
    page.getByTestId("product-media-translation-preview").locator("img"),
  ).toHaveAttribute("alt", translatedAlt);

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
  const { translation } = await graphql<{
    translation: { alt: string; translation: { alt: string } };
  }>(
    request,
    `
      query MediaTranslation($id: ID!) {
        translation(kind: PRODUCT_MEDIA, id: $id) {
          ... on ProductMediaTranslatableContent {
            alt
            translation(languageCode: DE) {
              alt
            }
          }
        }
      }
    `,
    { id: mediaId },
    token,
  );

  expect(translation).toEqual({ alt: originalAlt, translation: { alt: "" } });
  await expect(page.getByTestId("translation-field-alt")).not.toContainText(translatedAlt);

  // Act
  await page.getByRole("combobox", { name: "Translating" }).fill("rear view");
  await page.getByRole("option", { name: "Media 2: Original rear view", exact: true }).click();

  // Assert
  await expect(page).toHaveURL(new RegExp(`/media/${encodeURIComponent(otherMediaId)}$`));
  await expect(page.getByTestId("translation-field-alt")).toContainText("Original rear view");
  expect(pageErrors).toEqual([]);
});

test("translates unpublished product media with only MANAGE_TRANSLATIONS #e2e #translations", async ({
  browser,
  request,
  mediaFixture,
}) => {
  // Arrange
  const { productId, otherProductId, mediaId, otherMediaId, originalAlt } = mediaFixture;
  const { tokenCreate } = await graphql<{
    tokenCreate: LoginResult["tokenCreate"] & {
      user: { userPermissions: Array<{ code: string }> };
    };
  }>(
    request,
    `
      mutation TranslatorLogin($email: String!, $password: String!) {
        tokenCreate(email: $email, password: $password) {
          token
          refreshToken
          errors {
            field
            message
          }
          user {
            userPermissions {
              code
            }
          }
        }
      }
    `,
    { email: USER_PERMISSION.translations, password: process.env.E2E_PERMISSIONS_USERS_PASSWORD },
  );

  expect(tokenCreate.errors).toEqual([]);
  expect(tokenCreate.user.userPermissions.map(permission => permission.code)).toEqual([
    "MANAGE_TRANSLATIONS",
  ]);

  const context = await browser.newContext({ baseURL: process.env.BASE_URL });

  try {
    await context.addInitScript(refreshToken => {
      localStorage.setItem("_saleorRefreshToken", refreshToken);
    }, tokenCreate.refreshToken);

    const page = await context.newPage();
    const mediaUrl = `/translations/DE/products/${encodeURIComponent(productId)}/media/${encodeURIComponent(mediaId)}`;

    // Act
    await page.goto(mediaUrl);

    // Assert
    await expect(page.getByTestId("translation-field-alt")).toContainText(originalAlt);

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
  } finally {
    await context.close();
  }
});
