export const COLOR_MAP: Record<string, string> = {
  'White': '#FFFFFF',
  'Black': '#000000',
  'Gray': '#6B7280',
  'Grey': '#6B7280',
  'Brown': '#8B4513',
  'Beige': '#F5F5DC',
  'Blue': '#3B82F6',
  'Navy': '#1E3A8A',
  'Red': '#EF4444',
  'Green': '#10B981',
  'Yellow': '#F59E0B',
  'Pink': '#EC4899',
  'Purple': '#8B5CF6',
  'Orange': '#F97316',
};

export function mapColorsToHex(colors: string[]): Array<{ name: string; hex: string }> {
  return colors.map(color => ({
    name: color,
    hex: COLOR_MAP[color] || color,
  }));
}
