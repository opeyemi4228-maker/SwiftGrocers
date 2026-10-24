import { products, scoreProduct } from "@/lib/products";

/**
 * Turns a free-text market list into basket lines.
 *
 * People write lists the way they talk: "2 tubers of yam", "ata rodo 500g",
 * "1 paint garri", "crayfish". Each line is split into a quantity, an optional
 * size ("50kg", "5L") and the thing itself, which is matched against product
 * names and their local-language aliases.
 */

const NUMBER_WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, half: 1 };

/* Containers and counts that describe how much, not what. */
const FILLER = new Set([
  "of", "some", "fresh", "big", "small", "medium", "large", "and", "the", "x", "pcs", "pieces", "piece",
  "tuber", "tubers", "bunch", "bunches", "crate", "crates", "paint", "paints", "bucket", "bag", "bags",
  "pack", "packs", "carton", "cartons", "tin", "tins", "bottle", "bottles", "litre", "litres", "liter",
  "liters", "kg", "kilo", "kilos", "g", "l", "cl", "ml", "derica", "mudu", "basket", "please", "plus",
]);

const SIZE = /(\d+(?:\.\d+)?)\s*(kg|kilo|g|l|litre|liter|cl|ml)\b/i;

function parseLine(raw) {
  let text = raw.toLowerCase().replace(/[,,•*\-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return null;

  let quantity = 1;
  let size = null;

  const sizeMatch = text.match(SIZE);
  if (sizeMatch) {
    const amount = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2].toLowerCase();
    size = unit.startsWith("g") ? { amount: amount / 1000, unit: "kg" } : unit === "cl" ? { amount: amount / 100, unit: "L" } : unit === "ml" ? { amount: amount / 1000, unit: "L" } : { amount, unit: unit.startsWith("k") ? "kg" : "L" };
    text = text.replace(sizeMatch[0], " ");
  }

  const countMatch = text.match(/(?:^|\s)(?:x\s*)?(\d{1,3})(?:\s*x)?(?=\s|$)/);
  if (countMatch) {
    quantity = Math.max(1, Math.min(50, parseInt(countMatch[1], 10)));
    text = text.replace(countMatch[0], " ");
  } else {
    const first = text.split(" ")[0];
    if (NUMBER_WORDS[first]) {
      quantity = NUMBER_WORDS[first];
      text = text.slice(first.length);
    }
  }

  const words = text.split(/[^a-z]+/).filter((word) => word && !FILLER.has(word));
  const term = words.join(" ").trim();
  return term ? { raw: raw.trim(), term, words, quantity, size } : null;
}

function rank(term, words) {
  const scores = new Map();
  const consider = (query, weight) => {
    if (!query || query.length < 2) return;
    for (const product of products) {
      const score = scoreProduct(product, query) * weight;
      if (score > 0) scores.set(product.id, Math.max(scores.get(product.id) ?? 0, score));
    }
  };

  consider(term, 2);
  // Longer words carry more meaning than "rice" in "ofada rice", so they count more.
  for (const word of words) consider(word, 1 + Math.min(word.length, 8) / 10);

  return [...scores.entries()]
    .map(([id, score]) => ({ product: products.find((entry) => entry.id === id), score }))
    .sort((a, b) => b.score - a.score || b.product.soldLastWeek - a.product.soldLastWeek);
}

/** Prefer the pack size the shopper asked for: "rice 50kg" means the 50 kg bag. */
function preferSize(candidates, size) {
  if (!size || candidates.length < 2) return candidates;
  const top = candidates[0].score;
  const close = candidates.filter((entry) => entry.score >= top * 0.6);
  const exact = close.find(
    (entry) => entry.product.measure?.unit === size.unit && Math.abs(entry.product.measure.amount - size.amount) < 0.01
  );
  return exact ? [exact, ...candidates.filter((entry) => entry !== exact)] : candidates;
}

export function parseList(text) {
  return text
    .split(/\n|,|;/)
    .map(parseLine)
    .filter(Boolean)
    .slice(0, 40)
    .map((line, index) => {
      const candidates = preferSize(rank(line.term, line.words), line.size);
      return {
        key: `${index}-${line.raw}`,
        raw: line.raw,
        quantity: line.quantity,
        match: candidates[0]?.product ?? null,
        alternatives: candidates.slice(1, 4).map((entry) => entry.product),
      };
    });
}

export const SAMPLE_LIST = `2 tubers of yam
ata rodo 500g
1 paint garri
tomatoes x2
crayfish
palm oil 5L
crate of eggs
rice 50kg
agege bread`;
