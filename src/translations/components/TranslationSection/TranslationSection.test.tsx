import { getBulkFieldState } from "@dashboard/translations/bulkFieldDirty";
import {
  type TranslationField,
  TranslationFieldType,
  type TranslationSectionConfig,
  TranslationSubmitScope,
} from "@dashboard/translations/types";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { TranslationSection } from "./TranslationSection";

const blankNameField: TranslationField = {
  displayName: "Name",
  name: "name",
  nullable: true,
  translation: "",
  type: TranslationFieldType.SHORT,
  value: "Original name",
};

const renderEditingSection = (field: TranslationField) => {
  const section: TranslationSectionConfig = {
    id: "general",
    submitScope: TranslationSubmitScope.entity,
    title: "General",
    fields: [field],
  };

  render(
    <Wrapper>
      <TranslationSection
        section={section}
        sourceUsesOriginalLabel
        targetLanguageCode="PL"
        targetLanguageLabel="Polish"
        bulk={false}
        activeField={field.name}
        disabled={false}
        getFieldState={candidate => getBulkFieldState(candidate, undefined)}
        saveButtonState="default"
        richTextResetKey="PL"
        onEdit={jest.fn()}
        onDiscard={jest.fn()}
        onSubmit={jest.fn().mockResolvedValue([])}
      />
    </Wrapper>,
  );
};

describe("TranslationSection", () => {
  it("enables Save on an unchanged blank that saving would reset", () => {
    // Arrange & Act
    renderEditingSection(blankNameField);

    // Assert
    expect(screen.getByRole("button", { name: /save/i })).toBeEnabled();
    expect(screen.getByText(/Saving resets it to the original/)).toBeInTheDocument();
  });

  it("keeps Save disabled on an unchanged blank that cannot be reset", () => {
    // Arrange & Act
    renderEditingSection({ ...blankNameField, nullable: false });

    // Assert
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
    expect(screen.getByText(/can't be reset to the original yet/)).toBeInTheDocument();
  });
});
