interface SaleorThrobberProps {
  size?: number;
  className?: string;
  "data-test-id"?: string;
}

export function SaleorThrobber({
  size = 40,
  className,
  "data-test-id": dataTestId,
}: SaleorThrobberProps) {
  const vertices = [
    { x: 12, y: 15 },
    { x: 36, y: 15 },
    { x: 30, y: 25 },
    { x: 6, y: 25 },
  ];

  const pathD = `M ${vertices.map(p => `${p.x} ${p.y}`).join(" L ")} Z`;
  const pathLength = 89;
  const beamLength = 20;

  return (
    <div
      className={className}
      data-test-id={dataTestId}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading"
        role="progressbar"
      >
        <style>
          {`
            @keyframes beamMove {
              0% { stroke-dashoffset: ${pathLength}; }
              100% { stroke-dashoffset: 0; }
            }
          `}
        </style>

        {/* Static faint outline */}
        <path
          d={pathD}
          stroke="currentColor"
          strokeWidth={0.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.15}
        />

        {/* Main beam */}
        <path
          d={pathD}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: `${beamLength} ${pathLength - beamLength}`,
            animation: "beamMove 1s linear infinite",
          }}
        />
      </svg>
    </div>
  );
}
