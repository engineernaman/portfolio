export type SitePage = 'home' | 'music' | 'cyberchef';

export const TOOL_PAGES: { id: SitePage; label: string; hash: string }[] = [
  { id: 'music', label: 'Music', hash: '#music' },
  { id: 'cyberchef', label: 'CyberChef', hash: '#cyberchef' },
];

export function hashToPage(hash: string): SitePage {
  const h = hash.replace(/^#/, '').toLowerCase();
  if (h === 'music') return 'music';
  if (h === 'cyberchef' || h === 'chef') return 'cyberchef';
  return 'home';
}

export function pageToHash(page: SitePage): string {
  if (page === 'music') return '#music';
  if (page === 'cyberchef') return '#cyberchef';
  return '#home';
}
