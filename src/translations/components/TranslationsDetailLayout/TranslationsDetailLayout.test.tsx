import ExitFormDialogProvider from "@dashboard/components/Form/ExitFormDialogProvider";
import { SavebarRefProvider, useSavebarRef } from "@dashboard/components/Savebar/SavebarRefContext";
import { LanguageCodeEnum } from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import { createBulkSubmitResult } from "@dashboard/translations/bulkSubmitResult";
import { useTranslationSaveFeedback } from "@dashboard/translations/hooks/useTranslationSaveFeedback";
import { buildTranslationDetailQueryString } from "@dashboard/translations/translationQueryParams";
import {
  TranslationFieldType,
  type TranslationSectionConfig,
  type TranslationsEntitiesPageProps,
  TranslationSubmitScope,
} from "@dashboard/translations/types";
import { ThemeWrapper } from "@test/themeWrapper";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useHistory, useLocation } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { TranslationsDetailLayout } from "./TranslationsDetailLayout";

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => jest.fn(),
}));

const sections: TranslationSectionConfig[] = [
  {
    id: "general",
    title: "General",
    submitScope: TranslationSubmitScope.entity,
    fields: [
      {
        name: "name",
        displayName: "Name",
        type: TranslationFieldType.SHORT,
        value: "Source name",
        translation: "Saved name",
      },
      {
        name: "seoTitle",
        displayName: "SEO title",
        type: TranslationFieldType.SHORT,
        value: "Source SEO title",
        translation: "Saved SEO title",
      },
    ],
  },
];

const submitSibling = async (): Promise<unknown[]> => [];
const submitField: TranslationsEntitiesPageProps["onSubmit"] = async () => [];
const submitBulk: NonNullable<TranslationsEntitiesPageProps["onBulkSubmit"]> = async () =>
  createBulkSubmitResult([]);

const SavebarAnchor = (): JSX.Element => {
  const { setAnchor } = useSavebarRef();

  return <div ref={setAnchor} />;
};

interface TestPageProps {
  onSubmit?: TranslationsEntitiesPageProps["onSubmit"];
  onBulkSubmit?: NonNullable<TranslationsEntitiesPageProps["onBulkSubmit"]>;
  sections?: TranslationSectionConfig[];
}

const TestPage = ({
  onSubmit = submitField,
  onBulkSubmit = submitBulk,
  sections: translationSections = sections,
}: TestPageProps): JSX.Element => {
  const sibling = useForm({ draft: "" }, submitSibling, { confirmLeave: true });
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeFields = params.getAll("activeField");
  const bulk = params.get("bulk") === "1";
  const feedback = useTranslationSaveFeedback({ refetch: jest.fn() });

  return (
    <>
      <input
        aria-label="Other draft"
        value={sibling.data.draft}
        onChange={event => sibling.change({ target: { name: "draft", value: event.target.value } })}
      />
      <button onClick={() => history.push("/elsewhere")}>Leave page</button>
      <output data-test-id="location">{location.pathname + location.search}</output>
      <TranslationsDetailLayout
        sections={translationSections}
        activeField={activeFields}
        bulk={bulk}
        disabled={false}
        languageCode="DE"
        languages={[
          { __typename: "LanguageDisplay", code: LanguageCodeEnum.DE, language: "German" },
        ]}
        saveButtonState="default"
        fieldErrors={feedback.fieldErrors}
        onBulkChange={() => history.replace("/translations")}
        onEdit={jest.fn()}
        onDiscard={fieldName => {
          const remaining = activeFields.filter(name => name !== fieldName);
          const query = buildTranslationDetailQueryString({ activeField: remaining });

          history.replace(`/translations${query ? `?${query}` : ""}`);
        }}
        onSubmit={async (field, value) =>
          feedback.completeSingleFieldSave(await onSubmit(field, value))
        }
        onBulkSubmit={async values => feedback.completeBulkSave(await onBulkSubmit(values))}
      />
    </>
  );
};

const renderPage = (initialEntry: string, props: TestPageProps = {}): void => {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeWrapper>
        <SavebarRefProvider>
          <SavebarAnchor />
          <ExitFormDialogProvider>
            <TestPage {...props} />
          </ExitFormDialogProvider>
        </SavebarRefProvider>
      </ThemeWrapper>
    </MemoryRouter>,
  );
};

const editField = (name: string, value: string): void => {
  fireEvent.change(
    within(screen.getByTestId(`translation-field-${name}`)).getByTestId("translation-field"),
    {
      target: { value },
    },
  );
};

const saveName = async (): Promise<void> => {
  await act(async () => {
    fireEvent.click(
      within(screen.getByTestId("translation-field-name")).getByTestId("button-bar-confirm"),
    );
  });
};

const closePendingWarning = (): void => {
  const keepEditing = screen.queryByRole("button", { name: "Keep editing" });

  if (keepEditing) {
    fireEvent.click(keepEditing);
  }
};

describe("translation form ownership", () => {
  const sectionsWithBlankTranslation: TranslationSectionConfig[] = sections.map(section => ({
    ...section,
    fields: section.fields.map(field =>
      field.name === "seoTitle" ? { ...field, nullable: true, translation: "" } : field,
    ),
  }));

  it("does not warn for an untouched blank translation after saving another field", async () => {
    // Arrange
    renderPage("/translations?activeField=name&activeField=seoTitle", {
      sections: sectionsWithBlankTranslation,
    });
    editField("name", "Updated name");

    // Act
    await saveName();

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("activeField=seoTitle"),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(true);
  });

  it("saves an unchanged blank translation in bulk without requiring a draft", async () => {
    // Arrange
    const onBulkSubmit = jest.fn(submitBulk);

    renderPage("/translations?bulk=1", {
      onBulkSubmit,
      sections: sectionsWithBlankTranslation,
    });

    // Act
    fireEvent.click(screen.getByTestId("button-bar-confirm"));

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent(/^\/translations$/),
    );
    expect(onBulkSubmit).toHaveBeenCalledWith([
      expect.objectContaining({ field: expect.objectContaining({ name: "seoTitle" }), data: "" }),
    ]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes a successfully saved field without showing an exit warning", async () => {
    // Arrange
    renderPage("/translations?activeField=name");
    editField("name", "Updated name");

    // Act
    await saveName();

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent(/^\/translations$/),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(true);
  });

  it("preserves another form's exit warning after a successful field save", async () => {
    // Arrange
    const onSubmit = jest.fn(submitField);

    renderPage("/translations?activeField=name", { onSubmit });
    fireEvent.change(screen.getByRole("textbox", { name: "Other draft" }), {
      target: { value: "Unsaved sibling" },
    });
    editField("name", "Updated name");

    // Act
    await saveName();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    closePendingWarning();
    fireEvent.click(screen.getByRole("button", { name: "Leave page" }));

    // Assert
    expect(await screen.findByRole("dialog")).toHaveTextContent("Leave without saving changes?");
    expect(screen.getByLabelText("Other draft")).toHaveValue("Unsaved sibling");
    expect(screen.getByTestId("location")).not.toHaveTextContent("elsewhere");
  });

  it("keeps the other edited translation protected when one field is saved", async () => {
    // Arrange
    const onSubmit = jest.fn(submitField);

    renderPage("/translations?activeField=name&activeField=seoTitle", { onSubmit });
    editField("name", "Updated name");
    editField("seoTitle", "Unsaved SEO title");

    // Act
    await saveName();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    closePendingWarning();
    fireEvent.click(screen.getByRole("button", { name: "Leave page" }));

    // Assert
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("translation-field-seoTitle")).getByTestId("translation-field"),
    ).toHaveValue("Unsaved SEO title");
  });

  it("does not warn for unchanged fields left open after a successful save", async () => {
    // Arrange
    renderPage("/translations?activeField=name&activeField=seoTitle");
    editField("name", "Updated name");

    // Act
    await saveName();

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("activeField=seoTitle"),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(true);
  });

  it("keeps pending translations protected after a partially successful bulk save", async () => {
    // Arrange
    const onBulkSubmit = jest.fn(async () =>
      createBulkSubmitResult([{ fieldName: "seoTitle", message: "SEO title could not be saved" }]),
    );

    renderPage("/translations?bulk=1", { onBulkSubmit });
    editField("name", "Updated name");
    editField("seoTitle", "Unsaved SEO title");

    // Act
    fireEvent.click(screen.getByTestId("button-bar-confirm"));
    await screen.findByText("SEO title could not be saved");
    fireEvent.click(screen.getByRole("button", { name: "Leave page" }));

    // Assert
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("translation-field-seoTitle")).getByTestId("translation-field"),
    ).toHaveValue("Unsaved SEO title");
    expect(screen.getByTestId("location")).toHaveTextContent("bulk=1");
  });

  it("closes bulk editing after all pending translations are saved", async () => {
    // Arrange
    renderPage("/translations?bulk=1");
    editField("name", "Updated name");
    editField("seoTitle", "Updated SEO title");

    // Act
    fireEvent.click(screen.getByTestId("button-bar-confirm"));

    // Assert
    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent(/^\/translations$/),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(true);
  });
});
