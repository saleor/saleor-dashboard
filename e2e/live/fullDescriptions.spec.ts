import { type OutputData } from "@editorjs/editorjs";
import { expect, type Locator, type Page, type Route, test as base } from "@playwright/test";
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
    name: string | null;
    slug: string | null;
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

interface TranslationCursorPage {
  translations: {
    edges: Array<{ cursor: string; node: { id: string; entityId: string } }>;
    pageInfo: { endCursor: string | null; hasNextPage: boolean };
  };
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
        translation(languageCode: DE) { id name slug description fullDescription }
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
        translation(languageCode: DE) { id name slug description fullDescription }
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

async function saveMutation(
  page: Page,
  operationName: string,
  save: Locator = page.getByTestId("button-bar-confirm"),
  expectedErrors: MutationError[] = [],
): Promise<Record<string, unknown>> {
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
  expect(
    Object.values(result.data ?? {}).flatMap(payload =>
      payload.errors.map(({ field, code }) => ({ field, code })),
    ),
  ).toEqual(expectedErrors);
  const body: { variables: { input: Record<string, unknown> } } = response.request().postDataJSON();

  return body.variables.input;
}

async function readEntity(entity: EntityConfig, id: string, token: string): Promise<EntityDetails> {
  const result = await graphql<{ entity: EntityDetails }>(entity.details, { id }, token);

  return result.entity;
}

async function findEntityListCursor(
  entity: EntityConfig,
  id: string,
  token: string,
): Promise<string | null> {
  const kind = entity.kind === "category" ? "CATEGORY" : "COLLECTION";
  let after: string | null = null;
  let previousCursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const { translations }: TranslationCursorPage = await graphql<TranslationCursorPage>(
      `
        query LiveTranslationProgressCursor($kind: TranslatableKinds!, $after: String) {
          translations(kind: $kind, first: 100, after: $after) {
            edges {
              cursor
              node {
                ... on CategoryTranslatableContent {
                  id
                  entityId: categoryId
                }
                ... on CollectionTranslatableContent {
                  id
                  entityId: collectionId
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      `,
      { kind, after },
      token,
    );

    for (const edge of translations.edges) {
      if (edge.node.entityId === id) {
        return previousCursor;
      }

      previousCursor = edge.cursor;
    }

    after = translations.pageInfo.endCursor;
    hasNextPage = translations.pageInfo.hasNextPage;
  }

  throw new Error("The test entity was not found in the translation list");
}

async function failSaveRequest(
  page: Page,
  operationName: string,
): Promise<Record<string, unknown>> {
  const save = page.getByTestId("button-bar-confirm");

  await expect(save).toBeEnabled();
  const handleRequest = async (route: Route): Promise<void> => {
    const request = route.request();

    if (request.method() === "POST" && request.postDataJSON()?.operationName === operationName) {
      await route.abort("failed");
      await page.unroute(requiredEnv("API_URL"), handleRequest);

      return;
    }

    await route.continue();
  };

  await page.route(requiredEnv("API_URL"), handleRequest);
  const failedRequest = page.waitForEvent(
    "requestfailed",
    request =>
      request.method() === "POST" && request.postDataJSON()?.operationName === operationName,
  );

  await save.click();
  const request = await failedRequest;
  const body: { variables: { input: Record<string, unknown> } } = request.postDataJSON();

  return body.variables.input;
}

async function injectEditorReadFailure(page: Page): Promise<void> {
  // Fault injection stays at the editor boundary; reads and writes still use the real Core.
  await page.route("**/components/RichTextEditor/ReactEditorJS.tsx*", async route => {
    const response = await route.fetch();
    const source = await response.text();
    const saveMethod = "async save() {";

    expect(source.split(saveMethod)).toHaveLength(2);

    const injectedSave = `${saveMethod}
      await this._editorJS.isReady;
      const holder = this._editorJS.configuration.holder;
      const element = typeof holder === "string" ? document.getElementById(holder) : holder;
      if (!editorReadFailed && element?.closest('[data-test-id="rich-text-editor-fullDescription"]')) {
        editorReadFailed = true;
        await new Promise((resolve, reject) => {
          document.addEventListener("test:reject-editor-read", () => {
            reject(new Error("Controlled editor read failure"));
          }, { once: true });
          document.documentElement.dataset.editorReadPending = "true";
        });
      }
    `;

    await route.fulfill({
      response,
      body: `let editorReadFailed = false;\n${source.replace(saveMethod, injectedSave)}`,
    });
  });
}

for (const entity of entities) {
  test(`${entity.kind}: excludes empty rich text blocks from translation counters #e2e #translations #progress`, async ({
    page,
    session,
  }) => {
    // Arrange
    const name = `E2E empty translation ${randomUUID()}`;
    const description = "Original summary";
    const fullDescription = "Original detailed description";
    const emptyParagraph: OutputData = richText("");
    const { created } = await graphql<{
      created: { entity: { id: string } | null; errors: MutationError[] };
    }>(
      entity.create,
      {
        input: {
          name,
          description: JSON.stringify(richText(description)),
          fullDescription: JSON.stringify(richText(fullDescription)),
        },
      },
      session.token,
    );

    expect(created.errors).toEqual([]);

    if (!created.entity) {
      throw new Error("Test entity creation did not return an ID");
    }

    const { id } = created.entity;

    try {
      const { translated } = await graphql<{ translated: { errors: MutationError[] } }>(
        entity.translate,
        {
          id,
          input: {
            description: JSON.stringify(emptyParagraph),
            fullDescription: JSON.stringify(emptyParagraph),
          },
        },
        session.token,
      );

      expect(translated.errors).toEqual([]);
      const savedEmpty = await readEntity(entity, id, session.token);

      // Core must retain the empty paragraphs for this regression to be exercised.
      expect(JSON.parse(savedEmpty.translation?.description ?? "null")).toMatchObject({
        blocks: emptyParagraph.blocks,
      });
      expect(JSON.parse(savedEmpty.translation?.fullDescription ?? "null")).toMatchObject({
        blocks: emptyParagraph.blocks,
      });
      const cursor = await findEntityListCursor(entity, id, session.token);
      const listUrl = `/translations/DE?tab=${entity.path}${cursor ? `&after=${encodeURIComponent(cursor)}` : ""}`;

      // Act
      await page.goto(listUrl);
      const row = page.getByRole("row").filter({ hasText: name });

      // Assert
      await expect(row).toContainText("0 of 6");

      // Act
      await row.click();

      // Assert
      const progress = page.getByTestId("translation-context-bar");
      const fullField = page.getByTestId("translation-field-fullDescription");

      await expect(page.getByTestId("translation-field-name")).toContainText(name);
      await expect(progress).toContainText("0 of 6 fields translated");
      await expect(progress).toContainText("0%");
      await expect(fullField).toContainText("Needs translation");
      await expect(page.getByTestId("translation-field-description")).toContainText(
        "Needs translation",
      );

      // Act
      const translatedDetails = "Übersetzte Details";

      await page.getByTestId("edit-fullDescription").click();
      await fillEditor(fullField.getByTestId("rich-text-editor-translation"), translatedDetails);
      await saveMutation(page, entity.translationOperation);
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();

      // Assert
      await expect(progress).toContainText("1 of 6 fields translated");
      const saved = await readEntity(entity, id, session.token);

      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(translatedDetails);
      expect(JSON.parse(saved.translation?.description ?? "null")).toMatchObject({
        blocks: emptyParagraph.blocks,
      });
      expect(textFromRichText(saved.description)).toBe(description);
      expect(textFromRichText(saved.fullDescription)).toBe(fullDescription);

      // Act
      await page.goto(listUrl);

      // Assert
      await expect(row).toContainText("1 of 6");

      const emptyNonTextContents: OutputData[] = [
        { blocks: [{ type: "list", data: { style: "unordered", items: ["", "<br>"] } }] },
        { blocks: [{ type: "table", data: { withHeadings: true, content: [["", "&nbsp;"]] } }] },
      ];

      for (const content of emptyNonTextContents) {
        // Act
        const { translated } = await graphql<{ translated: { errors: MutationError[] } }>(
          entity.translate,
          {
            id,
            input: {
              description: JSON.stringify(content),
              fullDescription: JSON.stringify(content),
            },
          },
          session.token,
        );

        // Assert
        expect(translated.errors).toEqual([]);

        // Act
        await page.goto(listUrl);

        // Assert
        await expect(row).toContainText("0 of 6");

        // Act
        await row.click();

        // Assert
        await expect(page.getByTestId("translation-field-name")).toContainText(name);
        await expect(progress).toContainText("0 of 6 fields translated");
        await expect(fullField).toContainText("Needs translation");
      }
    } finally {
      const { deleted } = await graphql<{ deleted: { errors: MutationError[] } }>(
        entity.delete,
        { id },
        session.token,
      );

      expect(deleted.errors).toEqual([]);
    }
  });

  test(`${entity.kind}: retries a rejected editor read without losing the full description #e2e #editor-read`, async ({
    page,
    session,
  }) => {
    // Arrange
    const name = `E2E editor read retry ${randomUUID()}`;
    const description = "Original summary";
    const originalFullDescription = "Original details";
    const draft = "Full description retained after an editor read failure";
    const pageErrors: string[] = [];
    let updateCount = 0;

    page.on("pageerror", error => pageErrors.push(error.message));
    page.on("request", request => {
      if (
        request.method() === "POST" &&
        request.postDataJSON()?.operationName === entity.updateOperation
      ) {
        updateCount += 1;
      }
    });
    await injectEditorReadFailure(page);
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

    try {
      await page.goto(`/${entity.path}/${encodeURIComponent(id)}`);
      const editor = page.getByTestId("rich-text-editor-fullDescription");
      const save = page.getByTestId("button-bar-confirm");

      await expect(editor).toContainText(originalFullDescription, { timeout: 30_000 });
      await fillEditor(editor, draft);
      await expect(save).toBeEnabled();

      // Act
      await save.click();
      await expect(page.locator("html")).toHaveAttribute("data-editor-read-pending", "true");

      // Assert
      expect(updateCount).toBe(0);
      expect(
        await page.evaluate(
          () => !window.dispatchEvent(new Event("beforeunload", { cancelable: true })),
        ),
      ).toBe(true);

      // Act
      await page.getByTestId("app-header-back-button").click();

      // Assert
      await expect(page.getByRole("dialog")).toContainText("Leave without saving changes?");

      // Act
      await page.getByRole("button", { name: "Keep editing" }).click();
      const readFailure = page.waitForEvent(
        "pageerror",
        error => error.message === "Controlled editor read failure",
      );

      await page.evaluate(() => document.dispatchEvent(new Event("test:reject-editor-read")));
      await readFailure;

      // Assert
      await expect(editor).toContainText(draft);
      await expect(save).toBeEnabled();
      expect(updateCount).toBe(0);
      expect(textFromRichText((await readEntity(entity, id, session.token)).fullDescription)).toBe(
        originalFullDescription,
      );

      // Act
      await page.getByTestId(`${entity.kind}-name-input`).fill(`${name} updated`);
      await saveMutation(page, entity.updateOperation);
      await expect(save).toBeDisabled();

      // Assert
      let saved = await readEntity(entity, id, session.token);

      expect(saved.name).toBe(`${name} updated`);
      expect(textFromRichText(saved.fullDescription)).toBe(draft);
      expect(textFromRichText(saved.description)).toBe(description);

      // Act
      await page.getByTestId(`${entity.kind}-name-input`).fill(`${name} renamed`);
      const nameOnlyRequest = page.waitForRequest(
        request =>
          request.method() === "POST" &&
          request.postDataJSON()?.operationName === entity.updateOperation,
      );

      await saveMutation(page, entity.updateOperation);
      const body: { variables: { input: Record<string, unknown> } } = (
        await nameOnlyRequest
      ).postDataJSON();

      // Assert
      expect(body.variables.input).not.toHaveProperty("fullDescription");
      saved = await readEntity(entity, id, session.token);
      expect(textFromRichText(saved.fullDescription)).toBe(draft);
      expect(pageErrors).toEqual(["Controlled editor read failure"]);
    } finally {
      const { deleted } = await graphql<{ deleted: { errors: MutationError[] } }>(
        entity.delete,
        { id },
        session.token,
      );

      expect(deleted.errors).toEqual([]);
    }
  });

  test(`${entity.kind}: keeps another translation draft protected after saving one field #e2e #translations`, async ({
    page,
    session,
  }) => {
    // Arrange
    const name = `E2E translation guard ${randomUUID()}`;
    const description = "Original summary";
    const fullDescription = "Original detailed text";
    const originalTranslation = "Gespeicherte Details";
    const translatedName = "Gespeicherter neuer Name";
    const translatedDraft = "Noch nicht gespeicherte Details";
    const { created } = await graphql<{
      created: { entity: { id: string } | null; errors: MutationError[] };
    }>(
      entity.create,
      {
        input: {
          name,
          description: JSON.stringify(richText(description)),
          fullDescription: JSON.stringify(richText(fullDescription)),
        },
      },
      session.token,
    );

    expect(created.errors).toEqual([]);

    if (!created.entity) {
      throw new Error("Test entity creation did not return an ID");
    }

    const { id } = created.entity;

    try {
      const { translated } = await graphql<{ translated: { errors: MutationError[] } }>(
        entity.translate,
        {
          id,
          input: {
            name: "Gespeicherter Name",
            fullDescription: JSON.stringify(richText(originalTranslation)),
          },
        },
        session.token,
      );

      expect(translated.errors).toEqual([]);
      await page.goto(
        `/translations/DE/${entity.path}/${encodeURIComponent(id)}?activeField=name&activeField=fullDescription`,
      );
      const nameField = page.getByTestId("translation-field-name");
      const fullField = page.getByTestId("translation-field-fullDescription");
      const editor = fullField.getByTestId("rich-text-editor-translation");
      const fullSave = fullField.getByTestId("button-bar-confirm");

      await expect(editor).toContainText(originalTranslation);
      await fillEditor(editor, translatedDraft);
      await expect(fullSave).toBeEnabled();
      await nameField.locator("input").fill(translatedName);

      // Act
      await saveMutation(
        page,
        entity.translationOperation,
        nameField.getByTestId("button-bar-confirm"),
      );
      await expect(page.getByTestId("edit-name")).toBeVisible();

      // Assert
      await expect(editor).toContainText(translatedDraft);
      await expect(fullSave).toBeEnabled();
      let saved = await readEntity(entity, id, session.token);

      expect(saved.translation?.name).toBe(translatedName);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(
        originalTranslation,
      );
      expect(
        await page.evaluate(
          () => !window.dispatchEvent(new Event("beforeunload", { cancelable: true })),
        ),
      ).toBe(true);

      // Act
      await page.getByTestId("app-header-back-button").click();

      // Assert
      await expect(page.getByRole("dialog")).toContainText("Leave without saving changes?");

      // Act
      await page.getByRole("button", { name: "Keep editing" }).click();
      await expect(editor).toContainText(translatedDraft);
      await saveMutation(page, entity.translationOperation, fullSave);
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();

      // Assert
      saved = await readEntity(entity, id, session.token);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(translatedDraft);
      expect(saved.translation?.name).toBe(translatedName);
      expect(saved.name).toBe(name);
      expect(textFromRichText(saved.description)).toBe(description);
      expect(textFromRichText(saved.fullDescription)).toBe(fullDescription);
      expect(
        await page.evaluate(
          () => !window.dispatchEvent(new Event("beforeunload", { cancelable: true })),
        ),
      ).toBe(false);
    } finally {
      const { deleted } = await graphql<{ deleted: { errors: MutationError[] } }>(
        entity.delete,
        { id },
        session.token,
      );

      expect(deleted.errors).toEqual([]);
    }
  });

  test(`${entity.kind}: preserves translation drafts after slug validation errors #e2e #translations #validation`, async ({
    page,
    session,
  }) => {
    // Arrange
    const identifier = randomUUID();
    const name = `E2E translation validation ${identifier}`;
    const description = "Source summary";
    const fullDescription = "Source detailed text";
    const originalSummary = "Gespeicherte Zusammenfassung";
    const originalDetails = "Gespeicherte Details";
    const detailsDraft = "Neue Details nach Validierungsfehler";
    const conflictingSlug = `e2e-conflict-${identifier}`;
    const originalSlug = `e2e-original-${identifier}`;
    const correctedSlug = `e2e-corrected-${identifier}`;
    const createdIds: string[] = [];
    const validationErrors: MutationError[] = [{ field: "slug", code: "UNIQUE" }];

    try {
      // Both the edited object and the conflicting translation belong to this test.
      for (const role of ["edited", "conflicting"]) {
        const { created } = await graphql<{
          created: { entity: { id: string } | null; errors: MutationError[] };
        }>(
          entity.create,
          {
            input: {
              name: `${name} ${role}`,
              description: JSON.stringify(richText(description)),
              fullDescription: JSON.stringify(richText(fullDescription)),
            },
          },
          session.token,
        );

        if (created.entity) {
          createdIds.push(created.entity.id);
        }

        expect(created.errors).toEqual([]);

        if (!created.entity) {
          throw new Error("Test entity creation did not return an ID");
        }

        const { translated } = await graphql<{ translated: { errors: MutationError[] } }>(
          entity.translate,
          {
            id: created.entity.id,
            input: {
              slug: role === "edited" ? originalSlug : conflictingSlug,
              description: JSON.stringify(richText(originalSummary)),
              fullDescription: JSON.stringify(richText(originalDetails)),
            },
          },
          session.token,
        );

        expect(translated.errors).toEqual([]);
      }

      const id = createdIds[0];

      await page.goto(`/translations/DE/${entity.path}/${encodeURIComponent(id)}`);
      const slugField = page.getByTestId("translation-field-slug");
      const slugInput = slugField.locator("input");
      const detailsField = page.getByTestId("translation-field-fullDescription");
      const detailsEditor = detailsField.getByTestId("rich-text-editor-translation");
      const detailsSave = detailsField.getByTestId("button-bar-confirm");
      const slugSave = slugField.getByTestId("button-bar-confirm");

      await expect(slugField).toContainText(originalSlug);
      // Open the supported multi-field route after loading the saved translation.
      await page.evaluate(() => {
        window.history.pushState(
          window.history.state,
          "",
          "?activeField=slug&activeField=fullDescription",
        );
        window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
      });
      await expect(detailsEditor).toContainText(originalDetails);
      await expect(slugInput).toBeVisible();
      await fillEditor(detailsEditor, detailsDraft);
      await expect(detailsSave).toBeEnabled();
      await slugInput.fill(conflictingSlug);

      // Act — a real Core error in one field must preserve the other editors.
      const failedSingleInput = await saveMutation(
        page,
        entity.translationOperation,
        slugSave,
        validationErrors,
      );

      // Assert
      expect(failedSingleInput).toEqual({ slug: conflictingSlug });
      await expect(detailsEditor).toContainText(detailsDraft);
      await expect(detailsSave).toBeEnabled();
      let saved = await readEntity(entity, id, session.token);

      expect(saved.translation?.slug).toBe(originalSlug);
      expect(textFromRichText(saved.translation?.description ?? null)).toBe(originalSummary);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(originalDetails);
      expect(
        await page.evaluate(
          () => !window.dispatchEvent(new Event("beforeunload", { cancelable: true })),
        ),
      ).toBe(true);

      // Act
      await slugInput.fill(correctedSlug);
      await saveMutation(page, entity.translationOperation, slugSave);
      await expect(page.getByTestId("edit-slug")).toBeVisible();
      const retriedDetails = await saveMutation(page, entity.translationOperation, detailsSave);

      // Assert
      expect(textFromRichText(String(retriedDetails.fullDescription))).toBe(detailsDraft);
      expect(retriedDetails).not.toHaveProperty("description");
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();

      // Act
      await page.locator("button[aria-pressed]").click();
      const bulkSave = page.getByTestId("button-bar-confirm");
      const bulkDraft = "Details aus fehlgeschlagener Sammelspeicherung";

      await expect(bulkSave).toBeDisabled();
      await expect(slugInput).toBeEnabled();
      await expect(detailsEditor).toContainText(detailsDraft);
      await fillEditor(detailsEditor, bulkDraft);
      await expect(bulkSave).toBeEnabled();
      await slugInput.fill(conflictingSlug);
      const failedBulkInput = await saveMutation(
        page,
        entity.translationOperation,
        bulkSave,
        validationErrors,
      );

      // Assert
      expect(failedBulkInput.slug).toBe(conflictingSlug);
      expect(textFromRichText(String(failedBulkInput.fullDescription))).toBe(bulkDraft);
      await expect(detailsEditor).toContainText(bulkDraft);
      await expect(bulkSave).toBeEnabled();
      saved = await readEntity(entity, id, session.token);
      expect(saved.translation?.slug).toBe(correctedSlug);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(detailsDraft);

      // Act — the visible draft and the submitted bulk value must stay in sync.
      await slugInput.fill(`${correctedSlug}-bulk`);
      const retriedBulkInput = await saveMutation(page, entity.translationOperation, bulkSave);

      // Assert
      expect(textFromRichText(String(retriedBulkInput.fullDescription))).toBe(bulkDraft);
      expect(retriedBulkInput).not.toHaveProperty("description");
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();
      await expect(detailsField).toContainText(bulkDraft);
      saved = await readEntity(entity, id, session.token);
      expect(saved.translation?.slug).toBe(`${correctedSlug}-bulk`);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(bulkDraft);
      expect(textFromRichText(saved.translation?.description ?? null)).toBe(originalSummary);
      expect(saved.name).toBe(`${name} edited`);
      expect(textFromRichText(saved.description)).toBe(description);
      expect(textFromRichText(saved.fullDescription)).toBe(fullDescription);
    } finally {
      for (const id of createdIds) {
        const { deleted } = await graphql<{ deleted: { errors: MutationError[] } }>(
          entity.delete,
          { id },
          session.token,
        );

        expect(deleted.errors).toEqual([]);
      }
    }
  });

  test(`${entity.kind}: retries full-description saves after a network failure #e2e #translations`, async ({
    page,
    session,
  }) => {
    // Arrange
    const name = `E2E save retry ${randomUUID()}`;
    const description = "Original summary";
    const originalFullDescription = "Original details";
    const translatedDescription = "Ursprüngliche Zusammenfassung";
    const originalTranslation = "Ursprüngliche Details";
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

    try {
      const { translated } = await graphql<{ translated: { errors: MutationError[] } }>(
        entity.translate,
        {
          id,
          input: {
            description: JSON.stringify(richText(translatedDescription)),
            fullDescription: JSON.stringify(richText(originalTranslation)),
          },
        },
        session.token,
      );

      expect(translated.errors).toEqual([]);
      await page.goto(`/${entity.path}/${encodeURIComponent(id)}`);
      const fullEditor = page.getByTestId("rich-text-editor-fullDescription");
      const save = page.getByTestId("button-bar-confirm");
      const draft = "Detailed text kept for retry";

      await expect(fullEditor).toContainText(originalFullDescription);

      // Act
      await fillEditor(fullEditor, draft);
      await failSaveRequest(page, entity.updateOperation);

      // Assert
      await expect(save).not.toHaveAttribute("aria-busy", "true");
      await expect(save).toBeEnabled();
      await expect(save).not.toHaveAttribute("data-test-state", "success");
      await expect(fullEditor).toContainText(draft);
      expect(textFromRichText((await readEntity(entity, id, session.token)).fullDescription)).toBe(
        originalFullDescription,
      );
      expect(
        await page.evaluate(
          () => !window.dispatchEvent(new Event("beforeunload", { cancelable: true })),
        ),
      ).toBe(true);

      // Act — another field change must not omit the unsaved full description.
      await page.getByTestId(`${entity.kind}-name-input`).fill(`${name} updated`);
      await saveMutation(page, entity.updateOperation);
      await expect(save).toBeDisabled();
      await page.reload();

      // Assert
      await expect(fullEditor).toContainText(draft);
      let saved = await readEntity(entity, id, session.token);

      expect(saved.name).toBe(`${name} updated`);
      expect(textFromRichText(saved.fullDescription)).toBe(draft);
      expect(textFromRichText(saved.description)).toBe(description);

      // Act — a failed translation must stay editable and be retried with its draft.
      await page.goto(`/translations/DE/${entity.path}/${encodeURIComponent(id)}`);
      const translationField = page.getByTestId("translation-field-fullDescription");
      const translationEditor = translationField.getByTestId("rich-text-editor-translation");
      const translatedDraft = "Übersetzung nach Netzwerkfehler";

      await page.getByTestId("edit-fullDescription").click();
      await fillEditor(translationEditor, translatedDraft);
      await failSaveRequest(page, entity.translationOperation);

      // Assert
      await expect(page.getByTestId("edit-fullDescription")).toBeHidden();
      await expect(translationEditor).toContainText(translatedDraft);
      await expect(save).toBeEnabled();
      saved = await readEntity(entity, id, session.token);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(
        originalTranslation,
      );

      // Act
      await saveMutation(page, entity.translationOperation);
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();
      await page.reload();

      // Assert
      saved = await readEntity(entity, id, session.token);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(translatedDraft);
      expect(textFromRichText(saved.translation?.description ?? null)).toBe(translatedDescription);
      expect(textFromRichText(saved.fullDescription)).toBe(draft);

      // Act — bulk retries must preserve every pending field.
      await page.locator("button[aria-pressed]").click();
      const bulkDraft = "Mehrere Felder nach Netzwerkfehler";
      const translatedName = "Übersetzter Name nach Netzwerkfehler";
      const translatedNameInput = page.getByTestId("translation-field-name").locator("input");

      await expect(save).toBeDisabled();
      // fill() can type through the editor's CSS lock, so wait for data loading to finish.
      await expect(translatedNameInput).toBeEnabled();
      await expect(translationEditor).toContainText(translatedDraft);
      await fillEditor(translationEditor, bulkDraft);
      // Wait for Editor.js to publish its draft before a plain field enables Save.
      await expect(save).toBeEnabled();
      await translatedNameInput.fill(translatedName);
      const failedInput = await failSaveRequest(page, entity.translationOperation);

      // Assert
      expect(textFromRichText(String(failedInput.fullDescription))).toBe(bulkDraft);
      expect(failedInput.name).toBe(translatedName);
      await expect(save).not.toHaveAttribute("aria-busy", "true");
      await expect(save).toBeEnabled();
      await expect(translationEditor).toContainText(bulkDraft);
      saved = await readEntity(entity, id, session.token);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(translatedDraft);

      // Act
      await saveMutation(page, entity.translationOperation);
      await expect(page.getByTestId("edit-fullDescription")).toBeVisible();
      await page.reload();

      // Assert
      saved = await readEntity(entity, id, session.token);
      expect(textFromRichText(saved.translation?.fullDescription ?? null)).toBe(bulkDraft);
      expect(saved.translation?.name).toBe(translatedName);
      expect(saved.name).toBe(`${name} updated`);
      expect(textFromRichText(saved.translation?.description ?? null)).toBe(translatedDescription);
      expect(textFromRichText(saved.fullDescription)).toBe(draft);
    } finally {
      const { deleted } = await graphql<{ deleted: { errors: MutationError[] } }>(
        entity.delete,
        { id },
        session.token,
      );

      expect(deleted.errors).toEqual([]);
    }
  });

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
