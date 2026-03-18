export type Tag = 'question' | 'for_sale' | 'lost_found' | 'event' | 'general' | 'service' | 'surf';
export type ServiceType = 'offering' | 'looking_for';
export type ServiceCategory = 'Airport Transfer' | 'Surf Lessons' | 'Accommodation' | 'Board Rental' | 'Guide/Tour' | 'Other';

const TAG_LABELS: Record<Tag, string> = {
  question: 'Question',
  for_sale: 'For Sale',
  lost_found: 'Lost & Found',
  event: 'Event',
  general: 'General',
  service: 'Service',
  surf: 'Surf',
};

const TAG_COLORS: Record<Tag, { bg: string; text: string }> = {
  question: { bg: 'bg-ocean/10', text: 'text-ocean' },
  for_sale: { bg: 'bg-terracotta/10', text: 'text-terracotta' },
  lost_found: { bg: 'bg-mred/10', text: 'text-mred' },
  event: { bg: 'bg-mgreen/10', text: 'text-mgreen' },
  general: { bg: 'bg-dark/10', text: 'text-dark/70' },
  service: { bg: 'bg-mgreen/10', text: 'text-mgreen' },
  surf: { bg: 'bg-ocean/10', text: 'text-ocean' },
};

export function getTagLabel(tag: Tag) { return TAG_LABELS[tag]; }
export function getTagColors(tag: Tag) { return TAG_COLORS[tag]; }

export function getRepBadge(rep: number): string {
  if (rep >= 50) return '\u2B50';
  if (rep >= 20) return '\uD83C\uDF0A';
  if (rep >= 5) return '\uD83C\uDFC4';
  return '\uD83D\uDC2A';
}
