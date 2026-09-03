import { Tooltip, UnStyledButton, type useDragResize, usePluginContext } from "@graphiql/react";

import { useDashboardTheme } from "./styles";

/**
 * The sidebar buttons that toggle each registered GraphiQL plugin (doc
 * explorer, history, ...). Shared by both GraphiQL variants.
 */
export const PluginSidebarSection = ({
  pluginResize,
}: {
  pluginResize: ReturnType<typeof useDragResize>;
}) => {
  const pluginContext = usePluginContext();

  return (
    <div className="graphiql-sidebar-section">
      {pluginContext?.plugins.map(plugin => {
        const isVisible = plugin === pluginContext.visiblePlugin;
        const label = `${isVisible ? "Hide" : "Show"} ${plugin.title}`;
        const Icon = plugin.icon;

        return (
          <Tooltip key={plugin.title} label={label}>
            <UnStyledButton
              type="button"
              className={isVisible ? "active" : ""}
              onClick={() => {
                if (isVisible) {
                  pluginContext.setVisiblePlugin(null);
                  pluginResize.setHiddenElement("first");
                } else {
                  pluginContext.setVisiblePlugin(plugin);
                  pluginResize.setHiddenElement(null);
                }
              }}
              aria-label={label}
            >
              <Icon aria-hidden="true" />
            </UnStyledButton>
          </Tooltip>
        );
      })}
    </div>
  );
};

/**
 * GraphiQL sizes CodeMirror through CSS variables that its own stylesheet sets
 * on `.graphiql-container`. CodeMirror renders tooltips into portals outside
 * that container, so the variables have to be re-declared globally to keep the
 * dashboard font scale.
 */
export const CodeMirrorFontSizeOverrides = () => {
  const { rootStyle } = useDashboardTheme();

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      .graphiql-container, .CodeMirror-info, .CodeMirror-lint-tooltip, reach-portal{
        --font-size-hint: ${rootStyle["--font-size-hint"]} !important;
        --font-size-inline-code: ${rootStyle["--font-size-inline-code"]} !important;
        --font-size-body: ${rootStyle["--font-size-body"]} !important;
        --font-size-h4: ${rootStyle["--font-size-h4"]} !important;
        --font-size-h3: ${rootStyle["--font-size-h3"]} !important;
        --font-size-h2: ${rootStyle["--font-size-h2"]} !important;
      }
    `,
      }}
    />
  );
};
