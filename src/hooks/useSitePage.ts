import { useEffect, useState } from 'react';
import { hashToPage, pageToHash, type SitePage } from '../data/siteNav';

export function useSitePage() {
  const [page, setPage] = useState<SitePage>(() => hashToPage(window.location.hash));

  useEffect(() => {
    const onHash = () => setPage(hashToPage(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (next: SitePage) => {
    const hash = pageToHash(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      setPage(next);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return { page, navigate };
}
