/**
 * DEMO review content.
 *
 * There is no reviews backend yet, so product pages draw a deterministic set
 * of sample reviews from this pool (same product, same reviews, every build).
 * Replace `getReviews` with real, verified review data before launch, and
 * only then add individual reviews to structured data.
 */

const POOL = {
  fresh: [
    { title: "Fresher than my market woman's", body: "Came in firm and clean, nothing squashed at the bottom of the bag. I'll stop going to the market on Saturdays." },
    { title: "Exactly as pictured", body: "Good size, good colour. The rider even called before arriving so I could come downstairs." },
    { title: "Lasted the whole week", body: "Kept well in the fridge for six days. Price is fair for the quality." },
  ],
  staple: [
    { title: "No stones, no wahala", body: "Picked through it out of habit and found nothing. That alone is worth it." },
    { title: "Fair price, delivered to my door", body: "Same price as Mile 12 once you add transport, and I didn't lose my Saturday in traffic." },
    { title: "Will order again", body: "Well packed and sealed. Arrived in 90 minutes to Surulere." },
  ],
  protein: [
    { title: "Came cold, cut and clean", body: "Delivered in an ice box and already cut into pieces. Went straight into the pot." },
    { title: "Generous portion", body: "Weighed it at home, slightly more than stated. Very happy." },
    { title: "Good, could be bigger", body: "Quality is good. Pieces were a bit smaller than I expected, but it tasted great." },
  ],
};

const AUTHORS = [
  ["Adaeze O.", "Lekki, Lagos"], ["Ibrahim B.", "Wuse II, Abuja"], ["Chinelo E.", "GRA, Port Harcourt"],
  ["Tunde F.", "Bodija, Ibadan"], ["Ngozi A.", "Ikeja GRA, Lagos"], ["Musa K.", "Gwarinpa, Abuja"],
  ["Funke A.", "Yaba, Lagos"], ["Emeka N.", "Trans Amadi, PH"],
];

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

function poolFor(product) {
  if (product.category === "meat-fish-poultry") return POOL.protein;
  if (product.isFresh) return POOL.fresh;
  return POOL.staple;
}

/** Star distribution consistent with the product's average and count. */
export function ratingBreakdown(product) {
  const r = product.rating;
  const five = Math.max(0, Math.min(0.92, (r - 3.6) / 1.4));
  const four = Math.max(0.05, (1 - five) * 0.62);
  const three = Math.max(0.02, (1 - five - four) * 0.55);
  const two = Math.max(0.01, (1 - five - four - three) * 0.5);
  const one = Math.max(0, 1 - five - four - three - two);
  return [five, four, three, two, one].map((share, index) => ({
    stars: 5 - index,
    share,
    count: Math.round(share * product.reviewCount),
  }));
}

export function getReviews(product, count = 3) {
  const pool = poolFor(product);
  const seed = hash(product.id);
  return Array.from({ length: Math.min(count, pool.length) }, (_, index) => {
    const entry = pool[(seed + index) % pool.length];
    const [author, location] = AUTHORS[(seed + index * 3) % AUTHORS.length];
    const day = 1 + ((seed >> (index + 2)) % 27);
    return {
      id: `${product.id}-${index}`,
      ...entry,
      author,
      location,
      rating: index === 2 && product.rating < 4.7 ? 4 : 5,
      date: `2026-09-${String(day).padStart(2, "0")}`,
      verified: true,
    };
  });
}
