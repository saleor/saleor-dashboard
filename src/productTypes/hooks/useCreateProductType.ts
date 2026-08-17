import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import {
  type ProductErrorFragment,
  ProductTypeKindEnum,
  useProductTypeCreateMutation,
} from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getMutationErrors } from "@dashboard/misc";
import { useIntl } from "react-intl";

import { type CreateProductTypeFormData } from "../components/CreateProductTypeDialog/CreateProductTypeDialog";
import { messages as createProductTypeMessages } from "../components/CreateProductTypeDialog/messages";
import { productTypeUrl } from "../urls";

interface UseCreateProductTypeProps {
  onClose: () => void;
}

interface UseCreateProductTypeResult {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  errors: ProductErrorFragment[];
  onSubmit: (data: CreateProductTypeFormData) => SubmitPromise<ProductErrorFragment[]>;
}

export const useCreateProductType = ({
  onClose,
}: UseCreateProductTypeProps): UseCreateProductTypeResult => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [createProductType, createProductTypeOpts] = useProductTypeCreateMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      if ((data.productTypeCreate?.errors.length ?? 0) > 0) {
        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage(createProductTypeMessages.created),
      });
      onClose();
      navigate(productTypeUrl(data.productTypeCreate?.productType?.id ?? ""));
    },
  });

  const onSubmit = async ({
    name,
    kind,
  }: CreateProductTypeFormData): SubmitPromise<ProductErrorFragment[]> => {
    const result = await createProductType({
      variables: {
        input: {
          name,
          kind,
          hasVariants: false,
          isShippingRequired: kind !== ProductTypeKindEnum.GIFT_CARD,
        },
      },
    });
    const errors = getMutationErrors(result);

    return Array.isArray(errors) ? (errors as ProductErrorFragment[]) : [];
  };

  return {
    confirmButtonState: createProductTypeOpts.status,
    disabled: createProductTypeOpts.loading,
    errors: createProductTypeOpts.data?.productTypeCreate?.errors ?? [],
    onSubmit,
  };
};
