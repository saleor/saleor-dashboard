import { Extension } from "@dashboard/extensions/types";
import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { Fragment } from "react";

export interface AppWidgetsProps {
  extensions: Extension[];
  params?: AppDetailsUrlMountQueryParams;
}

export const AppWidgets = ({ extensions }: AppWidgetsProps) => {
  const widgetExtensions = extensions.filter(ext => ext.target === "WIDGET");

  if (widgetExtensions.length === 0) {
    return null;
  }

  return (
    <Fragment>
      {widgetExtensions.map(extension => (
        <div key={extension.id}>
          {/* Widget content would be rendered here */}
          {/* For now, this is a placeholder - the actual widget rendering
              would depend on the extension's configuration */}
          <div data-testid={`widget-${extension.id}`}>
            {/* Widget iframe or content would go here */}
          </div>
        </div>
      ))}
    </Fragment>
  );
};
