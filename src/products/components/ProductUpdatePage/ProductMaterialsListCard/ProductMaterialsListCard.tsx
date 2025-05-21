import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import { Box, convertSizeToScale, Input, Multiselect, Option, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import messages from "./messages";
import { ProductMaterialEnum, ProductMaterialError, ProductMaterialsComposition } from "./types";
import {
  getMaterialCompositionRowId,
  mapProductMaterialsToOptions,
  mapProductMaterialToMessage,
} from "./utils";

type Props = {
  materialsComposition: ProductMaterialsComposition;
  errors: ProductMaterialError[];
  onChange: (value: ProductMaterialsComposition) => void;
};

export const ProductMaterialsListCard: React.FC<Props> = ({
  materialsComposition,
  errors,
  onChange,
}) => {
  const intl = useIntl();
  const [selectedMaterials, setSelectedMaterials] = React.useState<Option[]>(
    materialsComposition
      ? Object.keys(materialsComposition).map(material => ({
          label: mapProductMaterialToMessage(intl, material as ProductMaterialEnum),
          value: material,
        }))
      : [],
  );

  useEffect(() => {
    const newSelectedMaterials = Object.keys(materialsComposition).map(material => ({
      label: mapProductMaterialToMessage(intl, material as ProductMaterialEnum),
      value: material,
    }));

    setSelectedMaterials(newSelectedMaterials);
  }, [materialsComposition, intl]);

  const handleSelectedMaterialsChange = (materials: Option[]) => {
    const newMaterialsComposition: ProductMaterialsComposition = materials.reduce(
      (acc, material) => ({
        ...acc,
        [material.value as ProductMaterialEnum]:
          materialsComposition[material.value as ProductMaterialEnum] || "",
      }),
      {},
    );

    onChange(newMaterialsComposition);
  };

  const genericError = errors.find(e => e.field === "material");

  return (
    <Box
      paddingX={6}
      gap={2}
      paddingTop={6}
      paddingBottom={4}
      display="flex"
      flexDirection="column"
    >
      <Text size={5} fontWeight="bold">
        {intl.formatMessage(messages.title)}
      </Text>
      <ProductMaterialsSelect
        selectedMaterials={selectedMaterials}
        handleSelectedMaterialsChange={handleSelectedMaterialsChange}
      />
      <ProductMaterialValueList
        errors={errors}
        materialsComposition={materialsComposition}
        onChange={onChange}
      />
      {genericError && (
        <Box>
          <Text size={convertSizeToScale("small")} color={"critical1"}>
            {genericError.message}
          </Text>
        </Box>
      )}
    </Box>
  );
};

const ProductMaterialsSelect: React.FC<{
  selectedMaterials: Option[];
  handleSelectedMaterialsChange: (materials: Option[]) => void;
}> = ({ selectedMaterials, handleSelectedMaterialsChange }) => {
  const intl = useIntl();

  return (
    <BasicAttributeRow label={intl.formatMessage(messages.selectMaterials)}>
      <Multiselect
        disabled={false}
        name={"materialsSelect"}
        error={false}
        options={mapProductMaterialsToOptions(intl)}
        value={selectedMaterials}
        onChange={handleSelectedMaterialsChange}
        placeholder={intl.formatMessage(messages.addMaterial)}
      />
    </BasicAttributeRow>
  );
};

const ProductMaterialValueList: React.FC<
  Pick<Props, "onChange" | "materialsComposition" | "errors">
> = ({ materialsComposition, errors, onChange }) => {
  const handleSingleValueChange = (material: ProductMaterialEnum, value: string) => {
    const updatedMaterialsComposition = {
      ...materialsComposition,
      [material]: value,
    };

    onChange(updatedMaterialsComposition);
  };

  return (
    <>
      {Object.keys(materialsComposition).flatMap(material => {
        const rowId = getMaterialCompositionRowId(
          ProductMaterialEnum[material as ProductMaterialEnum],
        );
        const error = errors.find(e => e.field === rowId);

        const value = materialsComposition[material as ProductMaterialEnum];

        if (value === undefined) {
          return [];
        }

        return (
          <ProductMaterialValue
            key={material}
            material={material as ProductMaterialEnum}
            value={value}
            error={error}
            onChange={handleSingleValueChange}
          />
        );
      })}
    </>
  );
};

const ProductMaterialValue: React.FC<{
  material: ProductMaterialEnum;
  value: string;
  error?: ProductMaterialError;
  onChange: (material: ProductMaterialEnum, value: string) => void;
}> = ({ material, error, value, onChange }) => {
  const intl = useIntl();
  const rowId = getMaterialCompositionRowId(material);

  return (
    <BasicAttributeRow label={`${mapProductMaterialToMessage(intl, material)} %`}>
      <Input
        label=""
        name={rowId}
        id={rowId}
        error={!!error}
        onChange={event => onChange(material, event.target.value)}
        type="number"
        value={value}
        size="small"
        helperText={error?.message}
      />
    </BasicAttributeRow>
  );
};
