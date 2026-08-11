export default function initAnalytics() {
  try {
    const id = import.meta.env.VITE_GA_ID;
    if (!id) return;
    // Basic GA4 snippet loader if VITE_GA_ID is set
    if (!window.dataLayer) window.dataLayer = [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', id);
  } catch (err) {
    // fail silently in dev
    console.warn('Analytics init failed', err);
  }
}
