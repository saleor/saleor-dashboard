import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type PageErrorFragment, usePageTypeCreateMutation } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getMutationErrors } from "@dashboard/misc";
import { useIntl } from "react-intl";

import { type CreateModelTypeFormData } from "../components/CreateModelTypeDialog/CreateModelTypeDialog";
import { messages as createModelTypeMessages } from "../components/CreateModelTypeDialog/messages";
import { pageTypeUrl } from "../urls";

interface UseCreateModelTypeProps {
  onClose: () => void;
}

interface UseCreateModelTypeResult {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: PageErrorFragment[];
  onSubmit: (data: CreateModelTypeFormData) => SubmitPromise<PageErrorFragment[]>;
}

export const useCreateModelType = ({
  onClose,
}: UseCreateModelTypeProps): UseCreateModelTypeResult => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [createPageType, createPageTypeOpts] = usePageTypeCreateMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      if ((data.pageTypeCreate?.errors.length ?? 0) > 0) {
        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage(createModelTypeMessages.created),
      });
      onClose();
      navigate(pageTypeUrl(data.pageTypeCreate?.pageType?.id ?? ""));
    },
  });

  const onSubmit = async ({
    name,
  }: CreateModelTypeFormData): SubmitPromise<PageErrorFragment[]> => {
    const result = await createPageType({
      variables: {
        input: {
          name,
        },
      },
    });
    const errors = getMutationErrors(result);

    return Array.isArray(errors) ? (errors as PageErrorFragment[]) : [];
  };

  return {
    confirmButtonState: createPageTypeOpts.status,
    disabled: createPageTypeOpts.loading,
    errors: createPageTypeOpts.data?.pageTypeCreate?.errors ?? [],
    onSubmit,
  };
};
