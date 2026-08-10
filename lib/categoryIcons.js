import {
  Baby,
  Beef,
  Carrot,
  Cookie,
  CookingPot,
  Croissant,
  CupSoda,
  HeartPulse,
  Milk,
  ShoppingBasket,
  SprayCan,
  Sparkles,
  Wheat,
} from "lucide-react";

/**
 * One icon per department, keyed by category slug.
 *
 * Import this from client components only. A component reference cannot be
 * passed as a prop from a server component to a client one, so server code
 * should render an icon inline rather than hand it across the boundary.
 */
export const CATEGORY_ICONS = {
  "fruits-vegetables": Carrot,
  bakery: Croissant,
  "dairy-eggs": Milk,
  "meat-seafood": Beef,
  "grains-pasta": Wheat,
  pantry: CookingPot,
  beverages: CupSoda,
  snacks: Cookie,
  household: SprayCan,
  baby: Baby,
  health: HeartPulse,
  "personal-care": Sparkles,
};

export const categoryIcon = (slug) => CATEGORY_ICONS[slug] ?? ShoppingBasket;
