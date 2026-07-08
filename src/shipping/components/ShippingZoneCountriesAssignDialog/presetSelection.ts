export function getAvailablePresetCountryCodes(
  presetCountryCodes: readonly string[],
  availableCountryCodes: readonly string[],
): string[] {
  const availableSet = new Set(availableCountryCodes);

  return presetCountryCodes.filter(code => availableSet.has(code));
}

export function isPresetFullySelected(
  presetCountryCodes: readonly string[],
  selectedCountryIds: readonly string[],
  availableCountryCodes: readonly string[],
): boolean {
  const availablePresetCountryCodes = getAvailablePresetCountryCodes(
    presetCountryCodes,
    availableCountryCodes,
  );

  if (availablePresetCountryCodes.length === 0) {
    return false;
  }

  const selectedSet = new Set(selectedCountryIds);

  return availablePresetCountryCodes.every(code => selectedSet.has(code));
}

export function togglePresetSelection(
  selectedCountryIds: string[],
  presetCountryCodes: readonly string[],
  availableCountryCodes: readonly string[],
  checked: boolean,
): string[] {
  const availablePresetCountryCodes = getAvailablePresetCountryCodes(
    presetCountryCodes,
    availableCountryCodes,
  );

  if (availablePresetCountryCodes.length === 0) {
    return selectedCountryIds;
  }

  if (checked) {
    return [...new Set([...selectedCountryIds, ...availablePresetCountryCodes])];
  }

  const presetSet = new Set(availablePresetCountryCodes);

  return selectedCountryIds.filter(code => !presetSet.has(code));
}
