import type { OutputData } from "@editorjs/editorjs";

import { assertNoMutationErrors, gql } from "../lib/graphql.ts";
import { defaultScenario } from "./default.ts";
import type { Scenario } from "./scenario.ts";

interface FullDescriptionEntity {
  kind: "category" | "collection";
  path: "categories" | "collections";
  inputType: "CategoryInput" | "CollectionCreateInput";
  updateOperation: "CategoryUpdate" | "CollectionUpdate";
  translationOperation: "UpdateCategoryTranslations" | "UpdateCollectionTranslations";
}

interface MutationError {
  field: string | null;
  code: string;
}

export const fullDescriptionEntities: FullDescriptionEntity[] = [
  {
    kind: "category",
    path: "categories",
    inputType: "CategoryInput",
    updateOperation: "CategoryUpdate",
    translationOperation: "UpdateCategoryTranslations",
  },
  {
    kind: "collection",
    path: "collections",
    inputType: "CollectionCreateInput",
    updateOperation: "CollectionUpdate",
    translationOperation: "UpdateCollectionTranslations",
  },
];

export const SOURCE_DESCRIPTION = "Original summary";
export const SOURCE_FULL_DESCRIPTION = "Original details";
export const TRANSLATED_DESCRIPTION = "Gespeicherte Zusammenfassung";
export const TRANSLATED_FULL_DESCRIPTION = "Gespeicherte Details";

export const fullDescriptionEntityName = (kind: string, role = "edited"): string =>
  `Full description ${kind} ${role}`;

export const fullDescriptionRichText = (text: string): OutputData => ({
  blocks: [{ type: "paragraph", data: { text } }],
});

export const fullDescriptionsScenario: Scenario = {
  name: "full-descriptions",
  parent: defaultScenario.name,
  build: async (config, adminToken) => {
    const token = await adminToken();

    for (const entity of fullDescriptionEntities) {
      for (const role of ["edited", "empty"]) {
        const { created } = await gql<{
          created: { entity: { id: string } | null; errors: MutationError[] };
        }>(
          config,
          `mutation SeedFullDescription($input: ${entity.inputType}!) {
            created: ${entity.kind}Create(input: $input) {
              entity: ${entity.kind} { id }
              errors { field code }
            }
          }`,
          {
            input: {
              name: fullDescriptionEntityName(entity.kind, role),
              description: JSON.stringify(fullDescriptionRichText(SOURCE_DESCRIPTION)),
              fullDescription: JSON.stringify(fullDescriptionRichText(SOURCE_FULL_DESCRIPTION)),
            },
          },
          token,
        );

        assertNoMutationErrors(`${entity.kind}Create`, created.errors);

        if (!created.entity) {
          throw new Error(`The full description scenario could not create its ${entity.kind}`);
        }

        const { translated } = await gql<{ translated: { errors: MutationError[] } }>(
          config,
          `mutation SeedFullDescriptionTranslation($id: ID!, $input: TranslationInput!) {
            translated: ${entity.kind}Translate(id: $id, input: $input, languageCode: DE) {
              errors { field code }
            }
          }`,
          {
            id: created.entity.id,
            input: {
              description: JSON.stringify(
                fullDescriptionRichText(role === "empty" ? "" : TRANSLATED_DESCRIPTION),
              ),
              fullDescription: JSON.stringify(
                fullDescriptionRichText(role === "empty" ? "" : TRANSLATED_FULL_DESCRIPTION),
              ),
            },
          },
          token,
        );

        assertNoMutationErrors(`${entity.kind}Translate`, translated.errors);
      }
    }
  },
};
