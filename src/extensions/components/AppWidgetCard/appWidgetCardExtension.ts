export interface AppWidgetCardExtension {
  label: string;
  app: {
    id: string;
    name: string | null;
    brand?: { logo: { default: string } } | null;
  };
}
