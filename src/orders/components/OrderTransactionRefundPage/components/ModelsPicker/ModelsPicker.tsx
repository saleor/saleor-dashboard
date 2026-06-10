import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { Select } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
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
    skip: skip || disabled,
  });

  const options = useMemo(() => {
    const edges = [...(data?.pages?.edges ?? [])];

    if (sortByName) {
      edges.sort((a, b) => a.node.title.localeCompare(b.node.title));
    }

    return [
      { value: "", label: emptyOptionLabel },
      ...edges.map(model => ({
        value: model.node.id,
        label: model.node.title,
      })),
    ];
  }, [data, sortByName, emptyOptionLabel]);

  return <Select disabled={disabled || loading} options={options} {...field} />;
};
