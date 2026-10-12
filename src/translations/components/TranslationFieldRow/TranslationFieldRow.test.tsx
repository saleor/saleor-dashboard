import { type TranslationField, TranslationFieldType } from "@dashboard/translations/types";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { TranslationFieldRow } from "./TranslationFieldRow";

const blankNameField: TranslationField = {
  displayName: "Name",
  name: "name",
  nullable: true,
  translation: "",
  type: TranslationFieldType.SHORT,
  value: "Original name",
};

const renderRow = ({
  isEditing,
  showBlankTranslationHint,
}: {
  isEditing: boolean;
  showBlankTranslationHint: boolean;
}) =>
  render(
    <Wrapper>
      <TranslationFieldRow
        field={blankNameField}
        sourceUsesOriginalLabel
        targetLanguageCode="PL"
        isEditing={isEditing}
        showPerFieldActions
        showBlankTranslationHint={showBlankTranslationHint}
        disabled={false}
        saveButtonState="default"
        richTextResetKey="PL"
        onEdit={jest.fn()}
        onDiscard={jest.fn()}
        onSubmit={jest.fn().mockResolvedValue([])}
      />
    </Wrapper>,
  );

describe("TranslationFieldRow", () => {
  it("explains how to fix a stored blank outside edit mode", () => {
    // Arrange & Act
    renderRow({ isEditing: false, showBlankTranslationHint: true });

    // Assert
    expect(screen.getByText(/Edit and save to show the original/)).toBeInTheDocument();
  });

  it("says saving resets a stored blank while editing", () => {
    // Arrange & Act
    renderRow({ isEditing: true, showBlankTranslationHint: true });

    // Assert
    expect(screen.getByText(/Saving resets it to the original/)).toBeInTheDocument();
  });

  it("shows no blank hint when the field does not need resetting", () => {
    // Arrange & Act
    renderRow({ isEditing: false, showBlankTranslationHint: false });

    // Assert
    expect(screen.queryByText(/Saved as empty/)).not.toBeInTheDocument();
  });
});
