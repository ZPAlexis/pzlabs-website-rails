export const trackEvent = (eventName, options = { syncToApi: false }) => {
  if (typeof window.clarity === "function") window.clarity('event', eventName);
  if (typeof window.gtag === "function") window.gtag('event', eventName);
}
