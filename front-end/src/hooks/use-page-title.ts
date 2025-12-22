import { useEffect } from 'react';
import capitalizeWords from '@/lib/capitalize-words';
/**
 * Custom hook for updating document.title
 * 
 * @param {string} titlePart - Dynamic part of the title (e.g., "Login", "Signup", "Dashboard")
 * @param {string} [suffix="Acme"] - Fixed part at the end (default is "Acme")
 * @param {boolean} [showSuffix=true] - Whether to show the suffix (e.g., home page might just show "Acme")
 */
function usePageTitle(titlePart, suffix = 'Acme', showSuffix = true) {
  useEffect(() => {
    if (!titlePart) {
      document.title = suffix;
      return;
    }

    const newTitle = showSuffix ? `${titlePart} | ${suffix}` : titlePart;
    document.title = capitalizeWords(newTitle);

    // Optional: Cleanup when component unmount
    // return () => {
    //   document.title = suffix;
    // };
  }, [titlePart, suffix, showSuffix]);
}

export default usePageTitle;