import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { MetadataItem } from "@saleor/fragments/types/MetadataItem";
import { Node } from "@saleor/types";
import { MetadataInput } from "@saleor/types/globalTypes";

export function mapCountriesToChoices(
  countries: ShopInfo_shop_countries[]
): Array<SingleAutocompleteChoiceType | MultiAutocompleteChoiceType> {
  return countries.map(country => ({
    label: country.country,
    value: country.code
  }));
}

export function mapNodeToChoice(
  nodes: Array<Node & Record<"name", string>>
): Array<SingleAutocompleteChoiceType | MultiAutocompleteChoiceType> {
  return nodes.map(node => ({
    label: node.name,
    value: node.id
  }));
}

export function mapMetadataItemToInput(item: MetadataItem): MetadataInput {
  return {
    key: item.key,
    value: item.value
  };
}
