const colors: Record<string, string> = {
  "0": "#6B7280",
  "200": "#10B981",
  "300": "#FBBF24",
  "400": "#DC2626",
  "500": "#DC2626",
}

export const getStatusColor = (status: number = 0): string => {
  const statusCode = String(Math.floor(status / 100) * 100)
  return colors[statusCode] || colors["0"]
}
