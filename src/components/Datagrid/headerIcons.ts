import { SpriteMap } from "@glideapps/glide-data-grid";

export const headerIcons: SpriteMap = {
  arrowUp:
    p => `<svg width="20" height="20"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
          fill="${p.fgColor}"
          d="M8.067 14h7.865a.5.5 0 0 0 .385-.82l-3.933-4.72a.5.5 0 0 0-.768 0l-3.933 4.72a.5.5 0 0 0 .384.82Z"
        />
       </svg>`,
  arrowDown:
    p => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
      fill="${p.fgColor}"
      d="M15.932 10H8.067a.5.5 0 0 0-.384.82l3.933 4.72a.5.5 0 0 0 .768 0l3.933-4.72a.5.5 0 0 0-.385-.82Z"
      />
    </svg>`,
  gripVertical:
    p => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="5" r="1.5" fill="${p.fgColor}" />
      <circle cx="9" cy="12" r="1.5" fill="${p.fgColor}" />
      <circle cx="9" cy="19" r="1.5" fill="${p.fgColor}" />
      <circle cx="15" cy="5" r="1.5" fill="${p.fgColor}" />
      <circle cx="15" cy="12" r="1.5" fill="${p.fgColor}" />
      <circle cx="15" cy="19" r="1.5" fill="${p.fgColor}" />
    </svg>`,
};
