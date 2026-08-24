import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type CreateCustomerTypeFormData } from "@dashboard/customerTypes/components/CreateCustomerTypeDialog/CreateCustomerTypeDialog";
import { messages as createCustomerTypeMessages } from "@dashboard/customerTypes/components/CreateCustomerTypeDialog/messages";
import { customerTypeUrl } from "@dashboard/customerTypes/urls";
import {
  type CustomerTypeCreateErrorFragment,
  useCustomerTypeCreateMutation,
} from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getMutationErrors } from "@dashboard/misc";
import { useIntl } from "react-intl";

interface UseCreateCustomerTypeProps {
  onClose: () => void;
}

interface UseCreateCustomerTypeResult {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: CustomerTypeCreateErrorFragment[];
  onSubmit: (data: CreateCustomerTypeFormData) => SubmitPromise<CustomerTypeCreateErrorFragment[]>;
}

export const useCreateCustomerType = ({
  onClose,
}: UseCreateCustomerTypeProps): UseCreateCustomerTypeResult => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [createCustomerType, createCustomerTypeOpts] = useCustomerTypeCreateMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      if ((data.customerTypeCreate?.errors.length ?? 0) > 0) {
        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage(createCustomerTypeMessages.created),
      });
      onClose();
      navigate(customerTypeUrl(data.customerTypeCreate?.customerType?.id ?? ""));
    },
  });

  const onSubmit = async ({
    name,
  }: CreateCustomerTypeFormData): SubmitPromise<CustomerTypeCreateErrorFragment[]> => {
    const result = await createCustomerType({
      variables: {
        input: {
          name,
        },
      },
    });
    const errors = getMutationErrors(result);

    return Array.isArray(errors) ? (errors as CustomerTypeCreateErrorFragment[]) : [];
  };

  return {
    confirmButtonState: createCustomerTypeOpts.status,
    disabled: createCustomerTypeOpts.loading,
    errors: createCustomerTypeOpts.data?.customerTypeCreate?.errors ?? [],
    onSubmit,
  };
};
