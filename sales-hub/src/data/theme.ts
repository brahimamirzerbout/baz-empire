export const chartPalette = {
  violet: '#6c3fe0',
  violetLight: '#8b6ae8',
  violetDark: '#5429c0',
  ember: '#ff6b35',
  emberLight: '#ff8f66',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  grid: '#1f1a38',
  axis: '#6b7280',
  tooltipBg: '#140e28',
  tooltipBorder: '#2e2848',
  tooltipText: '#e5e7eb',
}

export const tooltipStyle = {
  background: chartPalette.tooltipBg,
  border: `1px solid ${chartPalette.tooltipBorder}`,
  borderRadius: 12,
  color: chartPalette.tooltipText,
}

export const eventColors: Record<string, string> = {
  campaign: chartPalette.violet,
  post: chartPalette.violetLight,
  email: chartPalette.success,
  meeting: chartPalette.warning,
  deadline: chartPalette.danger,
}