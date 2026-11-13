import type { OutputData } from "@editorjs/editorjs";
import type { Locator, Page } from "@playwright/test";

import { ADMIN, e2eConfig } from "../config.ts";
import { expect, test as base } from "../fixtures/test.ts";
import { adminToken, gql } from "../lib/graphql.ts";
import {
  fullDescriptionEntities,
  fullDescriptionEntityName,
  fullDescriptionRichText as richText,
  fullDescriptionsScenario,
  SOURCE_DESCRIPTION,
  SOURCE_FULL_DESCRIPTION,
  TRANSLATED_DESCRIPTION,
  TRANSLATED_FULL_DESCRIPTION,
} from "../scenarios/fullDescriptions.ts";

type EntityConfig = (typeof fullDescriptionEntities)[number];

interface EntityFixture {
  id: string;
  emptyId: string;
}

interface FullDescriptionFixture {
  token: string;
  category: EntityFixture;
  collection: EntityFixture;
}

interface MutationError {
  field: string | null;
  code: string;
}

interface EntityDetails {
  description: string | null;
  fullDescription: string | null;
  translation: {
    description: string | null;
    fullDescription: string | null;
  } | null;
}

interface TranslationCursorPage {
  translations: {
    edges: Array<{ cursor: string; node: { entityId: string } }>;
    pageInfo: { endCursor: string | null; hasNextPage: boolean };
  };
}

const config = e2eConfig();

async function findEntities(entity: EntityConfig, token: string): Promise<EntityFixture> {
  const { entities } = await gql<{
    entities: { edges: Array<{ node: { id: string; name: string } }> };
  }>(
    config,
    `query FullDescriptionEntities {
      entities: ${entity.path}(first: 100, filter: { search: "Full description" }) {
        edges { node { id name } }
      }
    }`,
    {},
    token,
  );
  const edited = entities.edges.find(
    ({ node }) => node.name === fullDescriptionEntityName(entity.kind),
  )?.node;
  const empty = entities.edges.find(
    ({ node }) => node.name === fullDescriptionEntityName(entity.kind, "empty"),
  )?.node;

  if (!edited || !empty) {
    throw new Error(`The full description scenario is missing its ${entity.path}`);
  }

  return { id: edited.id, emptyId: empty.id };
}

const test = base.extend<{ fullDescriptions: FullDescriptionFixture }>({
  fullDescriptions: async ({ seed }, provide) => {
    void seed;

    const token = await adminToken(config);
    const [category, collection] = await Promise.all(
      fullDescriptionEntities.map(entity => findEntities(entity, token)),
    );

    await provide({ token, category, collection });
  },
});

test.use({ scenario: fullDescriptionsScenario.name, trace: "off", video: "off" });
test.setTimeout(90_000);

const graphql = <T>(query: string, variables: Record<string, unknown>, token: string): Promise<T> =>
  gql<T>(config, query, variables, token);

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
  // Editor.js publishes changes asynchronously after the field loses focus.
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
  const { entity: result } = await graphql<{ entity: EntityDetails }>(
    `query FullDescriptionDetails($id: ID!) {
      entity: ${entity.kind}(id: $id) {
        description fullDescription
        translation(languageCode: DE) { description fullDescription }
      }
    }`,
    { id },
    token,
  );

  return result;
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

for (const entity of fullDescriptionEntities) {
  test(`${entity.kind}: previews rich text without time and announces full descriptions #e2e #translations #preview #ripples`, async ({
    page,
    fullDescriptions,
  }, testInfo) => {
    // Arrange
    const { id } = fullDescriptions[entity.kind];
    const saved = await readEntity(entity, id, fullDescriptions.token);
    const contents = [
      saved.description,
      saved.fullDescription,
      saved.translation?.description,
      saved.translation?.fullDescription,
    ];

    for (const content of contents) {
      const parsed: OutputData | null = JSON.parse(content ?? "null");

      expect(parsed).toHaveProperty("blocks");
      expect(parsed).not.toHaveProperty("time");
    }

    // Act
    await page.goto(`/${entity.path}/${encodeURIComponent(id)}`);

    // Assert
    const editor = page.getByTestId("rich-text-editor-fullDescription");
    const descriptionHint = page.getByTestId("full-description-ripple");
    const accountName = page.getByText(ADMIN.email, { exact: true });

    await expect(editor).toContainText(SOURCE_FULL_DESCRIPTION);
    await expect(page.getByTestId("button-bar-confirm")).toBeDisabled();
    await descriptionHint.hover();
    await expect(page.getByRole("tooltip")).toContainText(
      `Add detailed ${entity.kind} content in Full Description`,
    );
    await page.screenshot({
      path: testInfo.outputPath(`${entity.kind}-full-description-hint.png`),
      animations: "disabled",
      mask: [accountName],
    });

    // Act
    await page.getByRole("tooltip").getByRole("button", { name: "OK", exact: true }).click();
    await page.reload();

    // Assert
    await expect(editor).toContainText(SOURCE_FULL_DESCRIPTION);
    await expect(descriptionHint).toBeHidden();
    await expect(page.getByTestId("button-bar-confirm")).toBeDisabled();

    // Act
    await page.goto(`/translations/DE/${entity.path}/${encodeURIComponent(id)}`);

    // Assert
    const summary = page.getByTestId("translation-field-description");
    const details = page.getByTestId("translation-field-fullDescription");

    await expect(page.getByTestId("translation-field-name")).toContainText(
      fullDescriptionEntityName(entity.kind),
    );
    await expect(summary).toContainText(SOURCE_DESCRIPTION);
    await expect(summary).toContainText(TRANSLATED_DESCRIPTION);
    await expect(details).toContainText(SOURCE_FULL_DESCRIPTION);
    await expect(details).toContainText(TRANSLATED_FULL_DESCRIPTION);
    await expect(page.getByTestId("translation-context-bar")).toContainText(
      "2 of 6 fields translated",
    );

    // Act
    const translationHint = details.locator('[data-state="closed"]');

    await expect(translationHint).toHaveCount(1);
    await translationHint.hover();

    // Assert
    await expect(page.getByRole("tooltip")).toContainText(
      "Translate full descriptions for categories and collections",
    );
    await page.screenshot({
      path: testInfo.outputPath(`${entity.kind}-full-description-translation-hint.png`),
      animations: "disabled",
      mask: [accountName],
    });

    // Act
    await page.getByRole("tooltip").getByRole("button", { name: "OK", exact: true }).click();
    await page.reload();

    // Assert
    await expect(details).toContainText(TRANSLATED_FULL_DESCRIPTION);
    await expect(details.locator("[data-state]")).toHaveCount(0);
    await expect(summary).toContainText(TRANSLATED_DESCRIPTION);

    // Act
    const pulseAnnouncement = page.getByTestId("ripple-video-announcement-saleor-pulse");

    if (await pulseAnnouncement.isVisible()) {
      await pulseAnnouncement.getByTestId("ripple-video-announcement-dismiss").click();
    }
    await page.getByText("What's New", { exact: true }).click();

    // Assert
    const changelog = page.getByRole("dialog");

    for (const title of [
      "Category full descriptions",
      "Collection full descriptions",
      "Full description translations",
    ]) {
      await expect(changelog.getByRole("heading", { name: title, exact: true })).toBeVisible();
    }
    await page.screenshot({
      path: testInfo.outputPath(`${entity.kind}-full-description-announcements.png`),
      animations: "disabled",
      mask: [accountName],
    });
    expect(await readEntity(entity, id, fullDescriptions.token)).toEqual(saved);
  });

  test(`${entity.kind}: saves, translates and clears full description #e2e #translations`, async ({
    page,
    fullDescriptions,
  }, testInfo) => {
    // Arrange
    const { id } = fullDescriptions[entity.kind];
    const { token } = fullDescriptions;
    const description = SOURCE_DESCRIPTION;
    const originalFullDescription = SOURCE_FULL_DESCRIPTION;
    const translatedDescription = TRANSLATED_DESCRIPTION;
    const detailUrl = `/${entity.path}/${encodeURIComponent(id)}`;
    const translationUrl = `/translations/DE/${entity.path}/${encodeURIComponent(id)}`;
    const pageErrors: string[] = [];

    page.on("pageerror", error => pageErrors.push(error.message));

    // Act
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
    expect(textFromRichText((await readEntity(entity, id, token)).description)).toBe(description);
    await page.screenshot({
      path: testInfo.outputPath(`${entity.kind}-details.png`),
      fullPage: true,
      mask: [page.getByText(ADMIN.email, { exact: true })],
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
    await page.goto(translationUrl);

    // Assert
    await expect(fullTranslation).toContainText("Ausführliche Beschreibung");
    await expect(page.getByTestId("translation-context-bar")).toContainText(
      "2 of 6 fields translated",
    );
    let saved = await readEntity(entity, id, token);

    expect(textFromRichText(saved.translation?.description ?? null)).toBe(translatedDescription);
    expect(textFromRichText(saved.fullDescription)).toBe(updatedFullDescription);

    // Act — save full description in bulk mode
    await page.locator("button[aria-pressed]").click();
    await fillEditor(
      fullTranslation.getByTestId("rich-text-editor-translation"),
      "Neue ausführliche Beschreibung",
    );
    await saveMutation(page, entity.translationOperation);
    await page.goto(translationUrl);

    // Assert
    await expect(fullTranslation).toContainText("Neue ausführliche Beschreibung");
    await page.screenshot({
      path: testInfo.outputPath(`${entity.kind}-translations.png`),
      fullPage: true,
      mask: [page.getByText(ADMIN.email, { exact: true })],
    });

    // Act — clear the translation
    await page.getByTestId("edit-fullDescription").click();
    await fillEditor(fullTranslation.getByTestId("rich-text-editor-translation"), "");
    await saveMutation(page, entity.translationOperation);
    await page.goto(translationUrl);

    // Assert
    saved = await readEntity(entity, id, token);
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
    saved = await readEntity(entity, id, token);
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
    saved = await readEntity(entity, id, token);
    expect(textFromRichText(saved.fullDescription)).toBe(restoredFullDescription);
    expect(textFromRichText(saved.description)).toBe(description);
    expect(pageErrors).toEqual([]);
  });

  test(`${entity.kind}: excludes empty rich text blocks from translation counters #e2e #translations #progress`, async ({
    page,
    fullDescriptions,
  }) => {
    // Arrange
    const { emptyId: id } = fullDescriptions[entity.kind];
    const { token } = fullDescriptions;
    const name = fullDescriptionEntityName(entity.kind, "empty");
    const description = SOURCE_DESCRIPTION;
    const fullDescription = SOURCE_FULL_DESCRIPTION;
    const emptyParagraph: OutputData = richText("");

    const savedEmpty = await readEntity(entity, id, token);

    // Core must retain the empty paragraphs for this regression to be exercised.
    expect(JSON.parse(savedEmpty.translation?.description ?? "null")).toMatchObject({
      blocks: emptyParagraph.blocks,
    });
    expect(JSON.parse(savedEmpty.translation?.fullDescription ?? "null")).toMatchObject({
      blocks: emptyParagraph.blocks,
    });
    const cursor = await findEntityListCursor(entity, id, token);
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

    // Assert
    await expect(progress).toContainText("1 of 6 fields translated");
    const saved = await readEntity(entity, id, token);

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
        `mutation FullDescriptionTranslation($id: ID!, $input: TranslationInput!) {
          translated: ${entity.kind}Translate(id: $id, input: $input, languageCode: DE) {
            errors { field code }
          }
        }`,
        {
          id,
          input: {
            description: JSON.stringify(content),
            fullDescription: JSON.stringify(content),
          },
        },
        token,
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
  });
}
