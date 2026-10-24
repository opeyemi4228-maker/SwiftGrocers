import { CONTACT_DETAILS } from "@/lib/navigation";
import { CITIES } from "@/lib/locations";

/**
 * Site identity and JSON-LD builders. Structured data is generated from the
 * same catalogue the page renders, so the price Google shows can never drift
 * from the price on screen.
 */
export const SITE = {
  name: "SwiftGrocers",
  url: "https://swiftgrocers.com.ng",
  locale: "en_NG",
  description:
    "Order fresh foodstuff and groceries online in Lagos, Abuja, Port Harcourt and Ibadan. Market fresh tomatoes, rice, yam, garri, palm oil and more, delivered in under 2 hours. Pay on delivery.",
  twitter: "@swiftgrocers",
};

export const absoluteUrl = (path = "/") => new URL(path, SITE.url).toString();

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icon"),
    email: CONTACT_DETAILS.email,
    telephone: CONTACT_DETAILS.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Prime Mall, Plot C110, 69 Road, 6th Avenue",
      addressLocality: "Abuja",
      addressCountry: "NG",
    },
    areaServed: CITIES.map((city) => ({ "@type": "City", name: city.name })),
    currenciesAccepted: "NGN",
    paymentAccepted: "Cash, Bank transfer, Card, USSD, POS",
    sameAs: ["https://instagram.com/swiftgrocers", "https://x.com/swiftgrocers", "https://facebook.com/swiftgrocers"],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-NG",
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/shop?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

export function faqLd(entries) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}

export function productLd(product, reviews = []) {
  const validUntil = new Date(Date.UTC(new Date().getUTCFullYear() + 1, 0, 1)).toISOString().slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/product/${product.slug}#product`),
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    category: product.categoryLabel,
    countryOfOrigin: product.origin,
    aggregateRating: product.reviewCount
      ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount }
      : undefined,
    review: reviews.slice(0, 3).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      reviewBody: review.body,
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
    })),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "NGN",
      price: product.price,
      priceValidUntil: validUntil,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE.url}/#organization` },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "NG" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "NG",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 1,
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

export function itemListLd(items, path) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.href ?? `/product/${item.slug}`),
      name: item.name,
    })),
  };
}

export function localBusinessLd(city) {
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "@id": absoluteUrl(`/delivery/${city.slug}#store`),
    name: `${SITE.name} ${city.name}`,
    url: absoluteUrl(`/delivery/${city.slug}`),
    image: city.image,
    telephone: CONTACT_DETAILS.phone,
    priceRange: "₦₦",
    address: { "@type": "PostalAddress", addressLocality: city.name, addressRegion: city.state, addressCountry: "NG" },
    geo: { "@type": "GeoCoordinates", latitude: city.geo.lat, longitude: city.geo.lng },
    areaServed: city.zones.map((zone) => ({ "@type": "Place", name: `${zone.name}, ${city.name}` })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "21:00",
    },
    parentOrganization: { "@id": `${SITE.url}/#organization` },
  };
}
