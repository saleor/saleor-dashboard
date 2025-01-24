import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Textarea } from "@saleor/macaw-ui-next";
import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

interface TimelineNoteEditProps {
  id: string;
  note: string;
  loading: boolean;
  onSubmit: (id: string, message: string) => Promise<void>;
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
    <Box as="form" marginBottom={6} width="100%" onSubmit={handleSubmit(submitHandler)}>
      <Textarea autoFocus fontSize={4} paddingY={2.5} paddingX={4} rows={5} {...register("note")} />
      <Box marginTop={3} display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
        <Button disabled={loading} variant="secondary" onClick={onCancel}>
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
        <ConfirmButton
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
