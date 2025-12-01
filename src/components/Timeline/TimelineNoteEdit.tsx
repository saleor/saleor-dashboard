import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Textarea, vars } from "@saleor/macaw-ui-next";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

// CSS for white background on textarea in edit mode
const editTextareaStyles = `
  .timeline-edit-textarea,
  .timeline-edit-textarea > div,
  .timeline-edit-textarea textarea {
    background-color: ${vars.colors.background.default1} !important;
  }
`;

// Inject styles once
if (typeof document !== "undefined") {
  const styleId = "timeline-edit-textarea-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");

    style.id = styleId;
    style.textContent = editTextareaStyles;
    document.head.appendChild(style);
  }
}

interface TimelineNoteEditProps {
  id: string;
  note: string;
  loading: boolean;
  onSubmit: (id: string, message: string) => Promise<unknown>;
  onCancel: () => void;
}

interface TimelineNoteEditData {
  note: string;
}

export const TimelineNoteEdit = ({
  onCancel,
  note,
  onSubmit,
  id,
  loading,
}: TimelineNoteEditProps) => {
  const { handleSubmit, register } = useForm<TimelineNoteEditData>({
    defaultValues: {
      note,
    },
  });

  const submitHandler = async (data: TimelineNoteEditData) => {
    await onSubmit(id, data.note);
    onCancel();
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(submitHandler)}>
      <Textarea
        autoFocus
        width="100%"
        rows={3}
        className="timeline-edit-textarea"
        {...register("note")}
      />
      <Box marginTop={2} display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
        <Button disabled={loading} variant="secondary" onClick={onCancel}>
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
        <ConfirmButton
          data-test-id="save-note"
          disabled={loading}
          transitionState={loading ? "loading" : "default"}
          variant="primary"
          type="button"
          onClick={handleSubmit(submitHandler)}
        >
          <FormattedMessage {...buttonMessages.save} />
        </ConfirmButton>
      </Box>
    </Box>
  );
};
