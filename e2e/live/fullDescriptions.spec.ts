import { type OutputData } from "@editorjs/editorjs";
import { expect, type Locator, type Page, test as base } from "@playwright/test";
import { randomUUID } from "node:crypto";

interface Session {
  token: string;
  refreshToken: string;
}

interface MutationError {
  field: string | null;
  code: string;
}

interface EntityDetails {
  name: string;
  description: string | null;
  fullDescription: string | null;
  translation: {
    description: string | null;
    fullDescription: string | null;
  } | null;
}

interface EntityConfig {
  kind: "category" | "collection";
  path: "categories" | "collections";
  create: string;
  details: string;
  translate: string;
  delete: string;
  updateOperation: "CategoryUpdate" | "CollectionUpdate";
  translationOperation: "UpdateCategoryTranslations" | "UpdateCollectionTranslations";
}

const entities: EntityConfig[] = [
  {
    kind: "category",
    path: "categories",
    updateOperation: "CategoryUpdate",
    translationOperation: "UpdateCategoryTranslations",
    create: `mutation LiveCategoryFullDescriptionCreate($input: CategoryInput!) {
      created: categoryCreate(input: $input) {
        entity: category { id }
        errors { field code }
      }
    }`,
    details: `query LiveCategoryFullDescriptionDetails($id: ID!) {
      entity: category(id: $id) {
        id name description fullDescription
        translation(languageCode: DE) { id description fullDescription }
      }
    }`,
    translate: `mutation LiveCategoryFullDescriptionTranslate($id: ID!, $input: TranslationInput!) {
      translated: categoryTranslate(id: $id, input: $input, languageCode: DE) {
        errors { field code }
      }
    }`,
    delete: `mutation LiveCategoryFullDescriptionDelete($id: ID!) {
      deleted: categoryDelete(id: $id) { errors { field code } }
    }`,
  },
  {
    kind: "collection",
    path: "collections",
    updateOperation: "CollectionUpdate",
    translationOperation: "UpdateCollectionTranslations",
    create: `mutation LiveCollectionFullDescriptionCreate($input: CollectionCreateInput!) {
      created: collectionCreate(input: $input) {
        entity: collection { id }
        errors { field code }
      }
    }`,
    details: `query LiveCollectionFullDescriptionDetails($id: ID!) {
      entity: collection(id: $id) {
        id name description fullDescription
        translation(languageCode: DE) { id description fullDescription }
      }
    }`,
    translate: `mutation LiveCollectionFullDescriptionTranslate($id: ID!, $input: TranslationInput!) {
      translated: collectionTranslate(id: $id, input: $input, languageCode: DE) {
        errors { field code }
      }
    }`,
    delete: `mutation LiveCollectionFullDescriptionDelete($id: ID!) {
      deleted: collectionDelete(id: $id) { errors { field code } }
    }`,
  },
];

function requiredEnv(name: "API_URL" | "E2E_USER_NAME" | "E2E_USER_PASSWORD"): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Configure ${name} in .env before running the live E2E tests`);
  }

  return value;
}

async function graphql<T>(
  query: string,
  variables: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const response = await fetch(requiredEnv("API_URL"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const result: { data?: T; errors?: Array<{ message: string }> } = await response.json();

  if (!response.ok || result.errors?.length || !result.data) {
    throw new Error(`Live GraphQL request failed (HTTP ${response.status})`);
  }

  return result.data;
}

const test = base.extend<object, { session: Session }>({
  session: [
    async ({ browserName }, provide): Promise<void> => {
      void browserName;
      const { tokenCreate } = await graphql<{
        tokenCreate: { token: string | null; refreshToken: string | null; errors: MutationError[] };
      }>(
        `
          mutation LiveFullDescriptionsLogin($email: String!, $password: String!) {
            tokenCreate(email: $email, password: $password) {
              token
              refreshToken
              errors {
                field
                code
              }
            }
          }
        `,
        { email: requiredEnv("E2E_USER_NAME"), password: requiredEnv("E2E_USER_PASSWORD") },
      );

      if (tokenCreate.errors.length || !tokenCreate.token || !tokenCreate.refreshToken) {
        throw new Error("Live E2E login failed; check the configured credentials and permissions");
      }

      await provide({ token: tokenCreate.token, refreshToken: tokenCreate.refreshToken });
    },
    { scope: "worker" },
  ],
  storageState: async ({ session, baseURL }, provide) => {
    if (!baseURL) {
      throw new Error("Configure BASE_URL before running live E2E tests");
    }

    await provide({
      cookies: [],
      origins: [
        {
          origin: new URL(baseURL).origin,
          localStorage: [{ name: "_saleorRefreshToken", value: session.refreshToken }],
        },
      ],
    });
  },
});

function richText(text: string): OutputData {
  return { blocks: [{ type: "paragraph", data: { text } }] };
}

function textFromRichText(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const content: OutputData = JSON.parse(value);

  return content.blocks.map(block => block.data.text).join(" ");
}

async function fillEditor(editor: Locator, text: string): Promise<void> {
  const paragraph = editor.locator('[contenteditable="true"]').first();

  await expect(paragraph).toBeVisible();
  await paragraph.fill(text);
  // Editor.js reports edits asynchronously. Leaving the editor flushes the change.
  await paragraph.press("Tab");
}

async function saveMutation(page: Page, operationName: string): Promise<void> {
  const save = page.getByTestId("button-bar-confirm");

  await expect(save).toBeEnabled();
  const pendingResponse = page.waitForResponse(response => {
    const request = response.request();

    return request.method() === "POST" && request.postDataJSON()?.operationName === operationName;
  });

  await save.click();
  const response = await pendingResponse;
  const result: {
    errors?: unknown[];
    data?: Record<string, { errors: MutationError[] }>;
  } = await response.json();

  expect(response.ok()).toBe(true);
  expect(result.errors ?? []).toEqual([]);
  expect(Object.values(result.data ?? {}).flatMap(payload => payload.errors)).toEqual([]);
}

async function readEntity(entity: EntityConfig, id: string, token: string): Promise<EntityDetails> {
  const result = await graphql<{ entity: EntityDetails }>(entity.details, { id }, token);

  return result.entity;
}

for (const entity of entities) {
  test(`${entity.kind}: saves, translates and clears full description #e2e #translations`, async ({
    page,
    session,
  }, testInfo) => {
    // Arrange
    const name = `E2E full description ${randomUUID()}`;
    const description = "Original short description";
    const originalFullDescription = "Original detailed description";
    const translatedDescription = "Kurze Beschreibung";
    const pageErrors: string[] = [];

    page.on("pageerror", error => pageErrors.push(error.message));
    const { created } = await graphql<{
      created: { entity: { id: string } | null; errors: MutationError[] };
    }>(
      entity.create,
      {
        input: {
          name,
          description: JSON.stringify(richText(description)),
          fullDescription: JSON.stringify(richText(originalFullDescription)),
        },
      },
      session.token,
    );

    expect(created.errors).toEqual([]);

    if (!created.entity) {
      throw new Error("Test entity creation did not return an ID");
    }

    const { id } = created.entity;
    const detailUrl = `/${entity.path}/${encodeURIComponent(id)}`;
    const translationUrl = `/translations/DE/${entity.path}/${encodeURIComponent(id)}`;

    try {
      const { translated } = await graphql<{ translated: { errors: MutationError[] } }>(
        entity.translate,
        { id, input: { description: JSON.stringify(richText(translatedDescription)) } },
        session.token,
      );

      expect(translated.errors).toEqual([]);
      await page.goto(detailUrl);
      const fullEditor = page.getByTestId("rich-text-editor-fullDescription");

      // Assert
      await expect(fullEditor).toContainText(originalFullDescription);
      await expect(page.getByTestId("rich-text-editor-description")).toContainText(description);
      await expect(page.getByTestId("button-bar-confirm")).toBeDisabled();

      const announcement = page.getByRole("button", { name: "Dismiss Pulse announcement" });

      if (await announcement.isVisible()) {
        await announcement.click();
      }

      // Act
      const updatedFullDescription = "Updated detailed description";

      await fillEditor(fullEditor, updatedFullDescription);
      await saveMutation(page, entity.updateOperation);
      await expect(page.getByTestId("button-bar-confirm")).toBeDisabled();
      await page.reload();

      // Assert
      await expect(fullEditor).toContainText(updatedFullDescription);
      await expect(page.getByTestId(`${entity.kind}-name-input`)).toBeEnabled();
      expect(textFromRichText((await readEntity(entity, id, session.token)).description)).toBe(
        description,
      );
      await page.screenshot({
        path: testInfo.outputPath(`${entity.kind}-details.png`),
        fullPage: true,
        mask: [page.getByText(requiredEnv("E2E_USER_NAME"), { exact: true })],
      });

      // Act — save a single field translation
      await page.goto(translationUrl);
      const fullTranslation = page.getByTestId("translation-field-fullDescription");

      await expect(fullTranslation).toContainText(updatedFullDescription);
      await page.getByTestId("edit-fullDescription").click();
      await fillEditor(
        fullTranslation.getByTestId("rich-text-editor-translation"),
        "Ausführliche Beschreibung",
      );
      await saveMutation(page, entity.translationOperation);
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();
      await page.reload();

      // Assert
      await expect(fullTranslation).toContainText("Ausführliche Beschreibung");
      await expect(page.getByTestId("translation-context-bar")).toContainText(
        "2 of 6 fields translated",
      );
      let saved = await readEntity(entity, id, session.token);

      expect(textFromRichText(saved.translation?.description ?? null)).toBe(translatedDescription);
      expect(textFromRichText(saved.fullDescription)).toBe(updatedFullDescription);

      // Act — save full description in bulk mode
      await page.locator("button[aria-pressed]").click();
      await fillEditor(
        fullTranslation.getByTestId("rich-text-editor-translation"),
        "Neue ausführliche Beschreibung",
      );
      await saveMutation(page, entity.translationOperation);
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();
      await page.reload();

      // Assert
      await expect(fullTranslation).toContainText("Neue ausführliche Beschreibung");
      await page.screenshot({
        path: testInfo.outputPath(`${entity.kind}-translations.png`),
        fullPage: true,
        mask: [page.getByText(requiredEnv("E2E_USER_NAME"), { exact: true })],
      });

      // Act — clear the translation
      await page.getByTestId("edit-fullDescription").click();
      await fillEditor(fullTranslation.getByTestId("rich-text-editor-translation"), "");
      await saveMutation(page, entity.translationOperation);
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();
      await page.reload();

      // Assert
      saved = await readEntity(entity, id, session.token);
      expect(saved.translation?.fullDescription).toBeNull();
      expect(textFromRichText(saved.translation?.description ?? null)).toBe(translatedDescription);
      expect(textFromRichText(saved.fullDescription)).toBe(updatedFullDescription);

      // Act — clear the original
      await page.goto(detailUrl);
      await fillEditor(fullEditor, "");
      await saveMutation(page, entity.updateOperation);
      await expect(page.getByTestId("button-bar-confirm")).toBeDisabled();
      await page.reload();

      // Assert
      saved = await readEntity(entity, id, session.token);
      expect(saved.fullDescription).toBeNull();
      expect(textFromRichText(saved.description)).toBe(description);

      // Act — enter content into an initially empty full description
      const restoredFullDescription = "Restored detailed description";

      await fillEditor(fullEditor, restoredFullDescription);
      await saveMutation(page, entity.updateOperation);
      await expect(page.getByTestId("button-bar-confirm")).toBeDisabled();
      await page.reload();

      // Assert
      await expect(fullEditor).toContainText(restoredFullDescription);
      saved = await readEntity(entity, id, session.token);
      expect(textFromRichText(saved.fullDescription)).toBe(restoredFullDescription);
      expect(textFromRichText(saved.description)).toBe(description);
      expect(pageErrors).toEqual([]);
    } finally {
      const { deleted } = await graphql<{ deleted: { errors: MutationError[] } }>(
        entity.delete,
        { id },
        session.token,
      );

      expect(deleted.errors).toEqual([]);
    }
  });
}
