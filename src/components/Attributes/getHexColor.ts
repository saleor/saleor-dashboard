const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export const getHexColor = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();

  return trimmed && HEX_COLOR_PATTERN.test(trimmed) ? trimmed : null;
};
