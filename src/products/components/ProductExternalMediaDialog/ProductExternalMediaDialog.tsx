import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type ProductErrorFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { type DialogProps } from "@dashboard/types";
import { Input } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface FormValues {
  mediaUrl: string;
}

const initialValues: FormValues = {
  mediaUrl: "",
};

export interface ProductExternalMediaDialogProps extends DialogProps {
  onSubmit: (mediaUrl: string) => SubmitPromise<ProductErrorFragment[]>;
}

export const ProductExternalMediaDialog = ({
  open,
  onClose,
  onSubmit,
}: ProductExternalMediaDialogProps): JSX.Element => {
  const intl = useIntl();
  const urlInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);

  useEffect(
    function focusUrlInputWhenDialogOpens() {
      if (!open) {
        return;
      }

      const timeoutId = window.setTimeout(() => {
        urlInputRef.current?.focus();
      }, 50);

      return () => window.clearTimeout(timeoutId);
    },
    [open],
  );

  const handleModalClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  const handleSubmit = async (values: FormValues): Promise<ProductErrorFragment[]> => {
    const errors = await onSubmit(values.mediaUrl);

    if (!errors.length) {
      onClose();
    }

    return errors;
  };

  return (
    <DashboardModal onChange={handleModalClose} open={open}>
      {open ? (
        <Form initial={initialValues} onSubmit={handleSubmit}>
          {({ change, data, submit, isSubmitting }) => {
            isSubmittingRef.current = isSubmitting;

            return (
              <DashboardModal.Content disableAutofocus size="sm">
                <DashboardModal.ContextHeader
                  description={<FormattedMessage {...messages.description} />}
                >
                  <FormattedMessage {...messages.title} />
                </DashboardModal.ContextHeader>

                <DashboardModal.Body>
                  <DashboardModal.Inset>
                    <Input
                      ref={urlInputRef}
                      label={intl.formatMessage(messages.urlLabel)}
                      value={data.mediaUrl}
                      name="mediaUrl"
                      type="url"
                      onChange={change}
                      disabled={isSubmitting}
                      size="small"
                    />
                  </DashboardModal.Inset>
                </DashboardModal.Body>

                <DashboardModal.Actions>
                  <BackButton disabled={isSubmitting} onClick={handleModalClose} />
                  <ConfirmButton
                    data-test-id="submit"
                    disabled={!data.mediaUrl.trim() || isSubmitting}
                    onClick={submit}
                    transitionState={isSubmitting ? "loading" : "default"}
                  >
                    <FormattedMessage {...messages.title} />
                  </ConfirmButton>
                </DashboardModal.Actions>
              </DashboardModal.Content>
            );
          }}
        </Form>
      ) : null}
    </DashboardModal>
  );
};

ProductExternalMediaDialog.displayName = "ProductExternalMediaDialog";
