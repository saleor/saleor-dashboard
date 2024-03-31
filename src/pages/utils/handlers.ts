// @ts-strict-ignore
import { PageMediaCreateMutationVariables } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";

export function createPageTypeSelectHandler(
  setPageType: (pageTypeId: string) => void,
  triggerChange: () => void,
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    const id = event.target.value;
    setPageType(id);
    triggerChange();
  };
}

export function createImageUploadHandler(
  id: string,
  createPageImage: (variables: PageMediaCreateMutationVariables) => void,
) {
  return (file: File) =>
    createPageImage({
      alt: "",
      image: file,
      page: id,
    });
}
