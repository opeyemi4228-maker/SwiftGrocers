import {
  Baby,
  Banana,
  Bean,
  Carrot,
  Croissant,
  CupSoda,
  Droplet,
  Egg,
  Fish,
  ShoppingBasket,
  Soup,
  SprayCan,
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
  "tubers-plantain": Banana,
  "rice-beans-grains": Bean,
  "garri-flour-swallow": Wheat,
  "soup-spices": Soup,
  "oils-cooking": Droplet,
  "meat-fish-poultry": Fish,
  "dairy-eggs-breakfast": Egg,
  drinks: CupSoda,
  "snacks-bakery": Croissant,
  household: SprayCan,
  "baby-personal-care": Baby,
};

export const categoryIcon = (slug) => CATEGORY_ICONS[slug] ?? ShoppingBasket;
