import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { Select, Skeleton } from "@saleor/macaw-ui-next";
import { type ControllerRenderProps } from "react-hook-form";

interface ModelsPickerProps {
  referenceModelTypeId: string;
  disabled: boolean;

  field: ControllerRenderProps<any, any>;
  emptyOptionLabel: string;
  sortByName?: boolean;
  skip?: boolean;
}

export const ModelsPicker = ({
  referenceModelTypeId,
  disabled,
  field,
  emptyOptionLabel,
  sortByName = false,
  skip = false,
}: ModelsPickerProps) => {
  const { data, loading } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: referenceModelTypeId,
    },
    skip,
  });

  if (loading) {
    return <Skeleton />;
  }

  const edges = [...(data?.pages?.edges ?? [])];

  if (sortByName) {
    edges.sort((a, b) => a.node.title.localeCompare(b.node.title));
  }

  const options = edges.map(model => ({
    value: model.node.id,
    label: model.node.title,
  }));

  const optionsWithEmpty = [{ value: "", label: emptyOptionLabel }, ...options];

  return <Select disabled={disabled} options={optionsWithEmpty} {...field} />;
};
