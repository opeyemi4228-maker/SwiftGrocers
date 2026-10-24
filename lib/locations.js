/**
 * Delivery coverage.
 *
 * One list drives the area picker, checkout, the city landing pages and the
 * sitemap, so a new zone only has to be added here. `eta` is the typical
 * door-to-door time in minutes from that zone's nearest dark store.
 */

export const CITIES = [
  {
    slug: "lagos",
    name: "Lagos",
    state: "Lagos State",
    hub: "Ikeja & Lekki dark stores",
    image: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?auto=format&fit=crop&q=70&w=1600",
    geo: { lat: 6.5244, lng: 3.3792 },
    zones: [
      { name: "Lekki Phase 1", eta: 75 },
      { name: "Victoria Island", eta: 75 },
      { name: "Ikoyi", eta: 80 },
      { name: "Ajah", eta: 100 },
      { name: "Ikeja GRA", eta: 70 },
      { name: "Maryland", eta: 80 },
      { name: "Yaba", eta: 90 },
      { name: "Surulere", eta: 95 },
      { name: "Gbagada", eta: 85 },
      { name: "Magodo", eta: 90 },
      { name: "Festac", eta: 110 },
      { name: "Ikorodu", eta: 120 },
    ],
  },
  {
    slug: "abuja",
    name: "Abuja",
    state: "FCT",
    hub: "Wuse II dark store",
    image: "https://images.unsplash.com/photo-1785094165709-54fef69c2c4d?auto=format&fit=crop&q=70&w=1600",
    geo: { lat: 9.0765, lng: 7.3986 },
    zones: [
      { name: "Wuse II", eta: 60 },
      { name: "Maitama", eta: 65 },
      { name: "Garki", eta: 70 },
      { name: "Asokoro", eta: 75 },
      { name: "Jabi", eta: 70 },
      { name: "Gwarinpa", eta: 90 },
      { name: "Lugbe", eta: 105 },
      { name: "Kubwa", eta: 110 },
    ],
  },
  {
    slug: "port-harcourt",
    name: "Port Harcourt",
    state: "Rivers State",
    hub: "GRA Phase 2 dark store",
    image: "https://images.unsplash.com/photo-1734255026082-82fdc81991f0?auto=format&fit=crop&q=70&w=1600",
    geo: { lat: 4.8156, lng: 7.0498 },
    zones: [
      { name: "GRA Phase 2", eta: 65 },
      { name: "Old GRA", eta: 70 },
      { name: "Trans-Amadi", eta: 80 },
      { name: "Rumuola", eta: 85 },
      { name: "Peter Odili Road", eta: 90 },
      { name: "Choba", eta: 110 },
    ],
  },
  {
    slug: "ibadan",
    name: "Ibadan",
    state: "Oyo State",
    hub: "Bodija dark store",
    image: "https://images.unsplash.com/photo-1585540083814-ea6ee8af9e4f?auto=format&fit=crop&q=70&w=1600",
    geo: { lat: 7.3775, lng: 3.947 },
    zones: [
      { name: "Bodija", eta: 70 },
      { name: "Jericho", eta: 80 },
      { name: "Ring Road", eta: 85 },
      { name: "Akobo", eta: 95 },
      { name: "Challenge", eta: 90 },
    ],
  },
];

/** Cities on the waitlist. Shown honestly as "coming soon", never as live. */
export const COMING_SOON = ["Enugu", "Benin City", "Kano", "Uyo", "Abeokuta"];

export const DEFAULT_LOCATION = { city: "lagos", zone: "Lekki Phase 1" };

export const getCity = (slug) => CITIES.find((city) => city.slug === slug) ?? null;

export function resolveLocation(location) {
  const city = getCity(location?.city) ?? getCity(DEFAULT_LOCATION.city);
  const zone =
    city.zones.find((entry) => entry.name === location?.zone) ??
    city.zones.find((entry) => entry.name === DEFAULT_LOCATION.zone) ??
    city.zones[0];
  return { city, zone };
}
