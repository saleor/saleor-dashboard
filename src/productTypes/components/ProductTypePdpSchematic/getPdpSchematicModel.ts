export interface PdpSchematicNamedAttribute {
  id: string;
  name: string;
  sampleValue: string | null;
}

interface SchematicChoiceConnection {
  edges?: Array<{
    node?: { name?: string | null } | null;
  } | null> | null;
}

interface AssignedVariantAttributeInput {
  variantSelection: boolean;
  attribute: {
    id: string;
    name?: string | null;
    choices?: SchematicChoiceConnection | null;
  };
}

interface ProductAttributeInput {
  id: string;
  name?: string | null;
  choices?: SchematicChoiceConnection | null;
}

interface GetPdpSchematicModelArgs {
  hasVariants: boolean;
  productAttributes: ProductAttributeInput[] | null | undefined;
  assignedVariantAttributes: AssignedVariantAttributeInput[] | null | undefined;
  selectedVariantAttributeIds: string[];
}

export interface PdpSchematicModel {
  optionAttributes: PdpSchematicNamedAttribute[];
  badgeAttributes: PdpSchematicNamedAttribute[];
  specAttributes: PdpSchematicNamedAttribute[];
}

/** One example from the type — long choice names must not blow the miniature PDP. */
export const SCHEMATIC_SAMPLE_MAX_CHARS = 16;

export const truncateSchematicSample = (value: string): string => {
  const trimmed = value.trim();

  if (trimmed.length <= SCHEMATIC_SAMPLE_MAX_CHARS) {
    return trimmed;
  }

  return `${trimmed.slice(0, SCHEMATIC_SAMPLE_MAX_CHARS - 1)}…`;
};

export const firstAttributeChoiceName = (
  choices: SchematicChoiceConnection | null | undefined,
): string | null => {
  const name = choices?.edges?.[0]?.node?.name;

  if (!name?.trim()) {
    return null;
  }

  return truncateSchematicSample(name);
};

const namedAttribute = (
  id: string,
  name: string | null | undefined,
  choices: SchematicChoiceConnection | null | undefined,
): PdpSchematicNamedAttribute | null => {
  if (!name) {
    return null;
  }

  return { id, name, sampleValue: firstAttributeChoiceName(choices) };
};

/**
 * Split type attributes the way Paper's PDP does:
 * - variant selection → interactive pickers in the buy box
 * - other variant attributes → informational badges
 * - product attributes → read-only details under the photos (immersive layout)
 *
 * `selectedVariantAttributeIds` is the live form state for the "variant selection"
 * checkboxes. Empty means no pickers — do not fall back to saved flags, or
 * unchecking every box would still draw shopper picks.
 *
 * Sample values are the first defined choice on the attribute (if any) — never
 * invented copy. Plain-text attributes have no choices, so sampleValue is null.
 */
export const getPdpSchematicModel = ({
  hasVariants,
  productAttributes,
  assignedVariantAttributes,
  selectedVariantAttributeIds,
}: GetPdpSchematicModelArgs): PdpSchematicModel => {
  const specAttributes = (productAttributes ?? [])
    .map(attribute => namedAttribute(attribute.id, attribute.name, attribute.choices))
    .filter((attribute): attribute is PdpSchematicNamedAttribute => attribute != null);

  if (!hasVariants) {
    return { optionAttributes: [], badgeAttributes: [], specAttributes };
  }

  const assigned = assignedVariantAttributes ?? [];
  const pickerIds = new Set(selectedVariantAttributeIds);

  const optionAttributes: PdpSchematicNamedAttribute[] = [];
  const badgeAttributes: PdpSchematicNamedAttribute[] = [];

  assigned.forEach(item => {
    const named = namedAttribute(item.attribute.id, item.attribute.name, item.attribute.choices);

    if (!named) {
      return;
    }

    if (pickerIds.has(item.attribute.id)) {
      optionAttributes.push(named);
    } else {
      badgeAttributes.push(named);
    }
  });

  return { optionAttributes, badgeAttributes, specAttributes };
};

export const isColorAttributeName = (name: string): boolean =>
  /^(color|colour)$/i.test(name.trim());
