import { type TranslationField, TranslationFieldType } from "@dashboard/translations/types";
import { type OutputBlockData, type OutputData } from "@editorjs/editorjs";

import {
  getFieldsProgress,
  getProgressPercentage,
  getSectionsProgress,
  getTranslationCompletion,
  isFieldTranslationComplete,
  isResettableBlankTranslation,
} from "./progress";

interface BlockCompletionCase {
  name: string;
  block: OutputBlockData<string, Record<string, unknown>>;
  complete: boolean;
}

const blockCompletionCases: BlockCompletionCase[] = [
  {
    name: "empty legacy list",
    block: { type: "list", data: { style: "unordered", items: [] } },
    complete: false,
  },
  {
    name: "legacy list with blank items",
    block: { type: "list", data: { style: "ordered", items: ["", "<br>", "&nbsp;"] } },
    complete: false,
  },
  {
    name: "legacy list with text",
    block: { type: "list", data: { style: "unordered", items: ["<b>Translated item</b>"] } },
    complete: true,
  },
  {
    name: "empty nested list with metadata",
    block: {
      type: "list",
      data: {
        style: "checklist",
        meta: { start: 1 },
        items: [{ content: "<br>", meta: { checked: true }, items: [{ content: "", items: [] }] }],
      },
    },
    complete: false,
  },
  {
    name: "nested list with text in a child",
    block: {
      type: "list",
      data: {
        style: "unordered",
        items: [{ content: "", items: [{ content: "Translated child", items: [] }] }],
      },
    },
    complete: true,
  },
  {
    name: "empty legacy checklist",
    block: { type: "checklist", data: { items: [{ text: "", checked: true }] } },
    complete: false,
  },
  {
    name: "legacy checklist with text",
    block: { type: "checklist", data: { items: [{ text: "Translated task", checked: false }] } },
    complete: true,
  },
  {
    name: "table with blank cells",
    block: {
      type: "table",
      data: {
        withHeadings: true,
        content: [
          ["", "<br>"],
          ["&nbsp;", " "],
        ],
      },
    },
    complete: false,
  },
  {
    name: "table with a translated cell",
    block: { type: "table", data: { withHeadings: false, content: [["", "Translated cell"]] } },
    complete: true,
  },
  {
    name: "image with a caption and no file URL",
    block: { type: "image", data: { file: {}, caption: "Caption", stretched: true } },
    complete: false,
  },
  {
    name: "embed with dimensions and no URL",
    block: {
      type: "embed",
      data: { service: "youtube", width: 500, height: 281, caption: "Caption" },
    },
    complete: false,
  },
  {
    name: "embed with a URL and no caption",
    block: { type: "embed", data: { embed: "https://example.com/embed", caption: "" } },
    complete: true,
  },
  {
    name: "embed with a source URL",
    block: { type: "embed", data: { source: "https://example.com/video" } },
    complete: true,
  },
];

describe("isFieldTranslationComplete", () => {
  it.each(blockCompletionCases)("checks the content of a $name", ({ block, complete }) => {
    // Arrange
    const content: OutputData = { blocks: [block] };

    // Act
    const result = isFieldTranslationComplete(JSON.stringify(content), TranslationFieldType.RICH);

    // Assert
    expect(result).toBe(complete);
  });

  it("returns false for null translation", () => {
    // Arrange // Act // Assert
    expect(isFieldTranslationComplete(null, TranslationFieldType.SHORT)).toBe(false);
  });

  it("returns false for empty short text", () => {
    // Arrange // Act // Assert
    expect(isFieldTranslationComplete("   ", TranslationFieldType.SHORT)).toBe(false);
  });

  it("returns true for non-empty short text", () => {
    // Arrange // Act // Assert
    expect(isFieldTranslationComplete("Polish title", TranslationFieldType.SHORT)).toBe(true);
  });

  it("returns false for rich text with empty blocks", () => {
    // Arrange // Act // Assert
    expect(
      isFieldTranslationComplete(JSON.stringify({ blocks: [] }), TranslationFieldType.RICH),
    ).toBe(false);
  });

  it("returns true for rich text with content blocks", () => {
    // Arrange // Act // Assert
    expect(
      isFieldTranslationComplete(
        JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Hello" } }] }),
        TranslationFieldType.RICH,
      ),
    ).toBe(true);
  });

  it.each(["", " \n\t", "<br>", "<b></b>", "<i>&nbsp;&#160;&#xA0;</i>"])(
    "keeps a paragraph with no visible text incomplete: %p",
    text => {
      // Arrange
      const content: OutputData = { blocks: [{ type: "paragraph", data: { text } }] };

      // Act
      const complete = isFieldTranslationComplete(
        JSON.stringify(content),
        TranslationFieldType.RICH,
      );

      // Assert
      expect(complete).toBe(false);
    },
  );

  it("counts visible text after empty paragraphs", () => {
    // Arrange
    const content: OutputData = {
      blocks: [
        { type: "paragraph", data: { text: "" } },
        { type: "paragraph", data: { text: "<b>Translated details</b>" } },
      ],
    };

    // Act
    const complete = isFieldTranslationComplete(JSON.stringify(content), TranslationFieldType.RICH);

    // Assert
    expect(complete).toBe(true);
  });

  it("counts an image without a caption as content", () => {
    // Arrange
    const content: OutputData = {
      blocks: [
        { type: "image", data: { file: { url: "https://example.com/image.png" }, caption: "" } },
      ],
    };

    // Act
    const complete = isFieldTranslationComplete(JSON.stringify(content), TranslationFieldType.RICH);

    // Assert
    expect(complete).toBe(true);
  });

  it.each(["header", "quote"])("keeps an empty %s block incomplete", type => {
    // Arrange
    const content: OutputData = { blocks: [{ type, data: { text: "" } }] };

    // Act
    const complete = isFieldTranslationComplete(JSON.stringify(content), TranslationFieldType.RICH);

    // Assert
    expect(complete).toBe(false);
  });

  it.each([
    "invalid JSON",
    "null",
    "{}",
    '{"blocks":"invalid"}',
    '{"blocks":[null]}',
    '{"blocks":[{}]}',
  ])("keeps malformed rich text incomplete: %p", translation => {
    // Arrange // Act
    const complete = isFieldTranslationComplete(translation, TranslationFieldType.RICH);

    // Assert
    expect(complete).toBe(false);
  });
});

describe("getTranslationCompletion", () => {
  it("counts fields using type-aware completion rules", () => {
    // Arrange & Act
    const progress = getTranslationCompletion([
      { translation: "Name", type: TranslationFieldType.SHORT },
      { translation: JSON.stringify({ blocks: [] }), type: TranslationFieldType.RICH },
    ]);

    // Assert
    expect(progress).toEqual({ completed: 1, total: 2 });
  });
});

describe("getFieldsProgress", () => {
  it("keeps empty description paragraphs out of the six-field detail counter", () => {
    // Arrange
    const emptyParagraph: OutputData = {
      blocks: [{ type: "paragraph", data: { text: "" } }],
    };
    const fields: TranslationField[] = [
      ...["name", "slug", "seoTitle", "seoDescription"].map(name => ({
        name,
        displayName: name,
        translation: null,
        type: name === "seoDescription" ? TranslationFieldType.LONG : TranslationFieldType.SHORT,
        value: "Source text",
      })),
      ...["description", "fullDescription"].map(name => ({
        name,
        displayName: name,
        translation: JSON.stringify(emptyParagraph),
        type: TranslationFieldType.RICH,
        value: "Source description",
      })),
    ];

    // Act
    const progress = getFieldsProgress(fields);

    // Assert
    expect(progress).toEqual({ completed: 0, total: 6 });
    expect(getProgressPercentage(progress)).toBe(0);
  });

  it("calculates completed fields", () => {
    // Arrange
    const fields: TranslationField[] = [
      {
        displayName: "Name",
        name: "name",
        translation: "Translated",
        type: TranslationFieldType.SHORT,
        value: "Original",
      },
      {
        displayName: "Description",
        name: "description",
        translation: null,
        type: TranslationFieldType.RICH,
        value: "{}",
      },
    ];

    // Act
    const progress = getFieldsProgress(fields);

    // Assert
    expect(progress).toEqual({ completed: 1, total: 2 });
    expect(getProgressPercentage(progress)).toBe(50);
  });
});

describe("getSectionsProgress", () => {
  it("aggregates progress across sections", () => {
    // Arrange
    const sections = [
      {
        fields: [
          {
            displayName: "Name",
            name: "name",
            translation: "Translated",
            type: TranslationFieldType.SHORT,
            value: "Original",
          },
        ],
      },
      {
        fields: [
          {
            displayName: "SEO",
            name: "seoTitle",
            translation: null,
            type: TranslationFieldType.SHORT,
            value: "SEO",
          },
        ],
      },
    ];

    // Act // Assert
    expect(getSectionsProgress(sections)).toEqual({ completed: 1, total: 2 });
  });
});

describe("isResettableBlankTranslation", () => {
  type ResettableInput = Parameters<typeof isResettableBlankTranslation>[0];

  const blankName: ResettableInput = {
    nullable: true,
    translation: "",
    type: TranslationFieldType.SHORT,
    value: "Original name",
  };
  const blankRich: ResettableInput = {
    nullable: true,
    translation: JSON.stringify({ blocks: [] }),
    type: TranslationFieldType.RICH,
    value: JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Original" } }] }),
  };

  it("returns true for a nullable text field stored as an empty or whitespace string", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation(blankName)).toBe(true);
    expect(isResettableBlankTranslation({ ...blankName, translation: "  " })).toBe(true);
  });

  it("returns true for a nullable rich-text field stored as an empty document", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation(blankRich)).toBe(true);
  });

  it("returns false for rich text that is not an empty EditorJS document", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation({ ...blankRich, translation: "not json" })).toBe(false);
    expect(isResettableBlankTranslation({ ...blankRich, translation: '{"html":""}' })).toBe(false);
    expect(isResettableBlankTranslation({ ...blankRich, translation: "null" })).toBe(false);
  });

  it("returns false when the translation is removed, filled, or not nullable", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation({ ...blankName, translation: null })).toBe(false);
    expect(isResettableBlankTranslation({ ...blankName, translation: "Nazwa" })).toBe(false);
    expect(isResettableBlankTranslation({ ...blankName, nullable: undefined })).toBe(false);
  });

  it("returns false when the original is empty too, since resetting changes nothing", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation({ ...blankName, value: "" })).toBe(false);
  });

  it("returns false when an app draft would be saved instead of the reset", () => {
    // Arrange & Act & Assert
    expect(isResettableBlankTranslation({ ...blankName, editInitial: "Nazwa z aplikacji" })).toBe(
      false,
    );
  });
});
