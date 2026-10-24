/**
 * Routes that render without the site chrome.
 *
 * The account and sign-in areas are focused, self-contained surfaces: no
 * header, no footer, no tab bar, each carries its own back affordance.
 * Keeping the list here means the header, footer and tab bar all agree on
 * which routes are bare.
 */
const BARE_ROUTES = ["/account", "/auth"];

export function isBareRoute(pathname) {
  if (!pathname) return false;
  return BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
