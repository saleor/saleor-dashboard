import {
  type BlankTranslationHint,
  type TranslationField,
  TranslationFieldType,
} from "@dashboard/translations/types";
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
  blankTranslationHint,
}: {
  isEditing: boolean;
  blankTranslationHint?: BlankTranslationHint;
}) =>
  render(
    <Wrapper>
      <TranslationFieldRow
        field={blankNameField}
        sourceUsesOriginalLabel
        targetLanguageCode="PL"
        isEditing={isEditing}
        showPerFieldActions
        blankTranslationHint={blankTranslationHint}
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
    renderRow({ isEditing: false, blankTranslationHint: "resettable" });

    // Assert
    expect(screen.getByText(/Edit and save to show the original/)).toBeInTheDocument();
  });

  it("says saving resets a stored blank while editing", () => {
    // Arrange & Act
    renderRow({ isEditing: true, blankTranslationHint: "resettable" });

    // Assert
    expect(screen.getByText(/Saving resets it to the original/)).toBeInTheDocument();
  });

  it("shows no blank hint when the field does not need resetting", () => {
    // Arrange & Act
    renderRow({ isEditing: false });

    // Assert
    expect(screen.queryByText(/Saved as empty/)).not.toBeInTheDocument();
  });

  it("warns that a blank field which cannot be reset may show on the storefront", () => {
    // Arrange & Act
    renderRow({ isEditing: false, blankTranslationHint: "unresettable" });

    // Assert
    expect(screen.getByText(/can't be reset to the original yet/)).toBeInTheDocument();
    expect(screen.queryByText(/Edit and save to show the original/)).not.toBeInTheDocument();
  });

  it("warns before saving an empty value into a field which cannot be reset", () => {
    // Arrange & Act
    renderRow({ isEditing: true, blankTranslationHint: "unresettable" });

    // Assert
    expect(screen.getByText(/Saving it empty may show a blank/)).toBeInTheDocument();
  });
});
