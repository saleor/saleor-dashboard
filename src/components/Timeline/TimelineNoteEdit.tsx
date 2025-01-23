import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Textarea } from "@saleor/macaw-ui-next";
import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl/lib";

interface TimelineNoteEditProps {
  id: string;
  note: string;
  onSubmit: (id: string, dmessage: string) => void;
  onCancel: () => void;
}

interface TimelineNoteEditData {
  note: string;
}

export const TimelineNoteEdit = ({ onCancel, note, onSubmit, id }: TimelineNoteEditProps) => {
  const { handleSubmit, register } = useForm<TimelineNoteEditData>({
    defaultValues: {
      note,
    },
  });

  const submitHandler = (data: TimelineNoteEditData) => {
    onSubmit(id, data.note);
  };

  return (
    <Box as="form" marginBottom={6} width="100%" onSubmit={handleSubmit(submitHandler)}>
      <Textarea padding={4} rows={5} {...register("note")} />
      <Box marginTop={3} display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
        <Button variant="secondary" onClick={onCancel}>
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
        <Button variant="primary" type="button" onClick={handleSubmit(submitHandler)}>
          <FormattedMessage {...buttonMessages.save} />
        </Button>
      </Box>
    </Box>
  );
};
