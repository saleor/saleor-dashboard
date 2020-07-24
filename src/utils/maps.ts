import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { Node } from "@saleor/types";

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
