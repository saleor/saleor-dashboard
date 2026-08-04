import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type CollectionErrorFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { type OutputData } from "@editorjs/editorjs";
import { Box, Input, Text, Textarea } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface CreateCollectionFormData {
  name: string;
  description: string;
}

interface CreateCollectionDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  errors: CollectionErrorFragment[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: OutputData | null;
  }) => SubmitPromise<CollectionErrorFragment[]>;
}

const plainTextToEditorJsData = (text: string): OutputData | null => {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  return {
    blocks: [
      {
        type: "paragraph",
        data: { text: trimmed },
      },
    ],
  };
};

export const CreateCollectionDialog = ({
  open,
  confirmButtonState,
  disabled = false,
  errors: apiErrors,
  onClose,
  onSubmit,
}: CreateCollectionDialogProps): JSX.Element => {
  const intl = useIntl();
  const [submitErrors, setSubmitErrors] = useState<CollectionErrorFragment[]>([]);
  // Ignore Apollo's last mutation result until this open session submits again.
  const [showApiErrors, setShowApiErrors] = useState(false);
  // null = not synced yet, so the first open (including mount-with-open) still resets.
  const [prevOpen, setPrevOpen] = useState<boolean | null>(null);
  const initialForm: CreateCollectionFormData = {
    name: "",
    description: "",
  };

  // Clear submit errors while rendering when `open` changes — resetting from an
  // effect that also remounts Form flashes the modal for a frame.
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (prevOpen !== open) {
    setPrevOpen(open);
    setSubmitErrors([]);
    setShowApiErrors(false);
  }

  const fieldErrors = [...(showApiErrors ? apiErrors : []), ...submitErrors]
    .map(error => error.message)
    .filter(Boolean)
    .join(" ");

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open ? (
        <Form
          initial={initialForm}
          onSubmit={async data => {
            setShowApiErrors(true);

            const errors = await onSubmit({
              name: data.name.trim(),
              description: plainTextToEditorJsData(data.description),
            });

            setSubmitErrors(errors ?? []);

            return errors;
          }}
          disabled={disabled}
        >
          {({ change, data, submit }) => (
            <DashboardModal.Content size="sm" data-test-id="create-collection-dialog">
              <DashboardModal.ContextHeader
                description={<FormattedMessage {...messages.description} />}
              >
                <FormattedMessage {...messages.title} />
              </DashboardModal.ContextHeader>

              <DashboardModal.Body>
                <DashboardModal.Inset>
                  <Box display="flex" flexDirection="column" gap={4}>
                    <Input
                      name="name"
                      label={intl.formatMessage(messages.name)}
                      value={data.name}
                      onChange={change}
                      disabled={disabled}
                      data-test-id="collection-name-input"
                      autoFocus
                    />
                    <Textarea
                      name="description"
                      label={intl.formatMessage(messages.descriptionField)}
                      value={data.description}
                      onChange={change}
                      disabled={disabled}
                      rows={4}
                      data-test-id="collection-description-input"
                    />
                    {fieldErrors ? (
                      <Text size={2} color="critical1" as="p">
                        {fieldErrors}
                      </Text>
                    ) : null}
                  </Box>
                </DashboardModal.Inset>
              </DashboardModal.Body>

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  transitionState={confirmButtonState}
                  onClick={submit}
                  disabled={disabled || !data.name.trim()}
                  data-test-id="submit"
                >
                  <FormattedMessage {...buttonMessages.create} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Content>
          )}
        </Form>
      ) : null}
    </DashboardModal>
  );
};
