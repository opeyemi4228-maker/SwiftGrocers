/**
 * Single source of truth for pricing rules. The cart page, the mini cart and
 * the checkout summary all derive their numbers from here, so a change to the
 * delivery threshold can never disagree between screens.
 */

export const FREE_DELIVERY_THRESHOLD = 25000;
export const STANDARD_DELIVERY_FEE = 1500;
export const SERVICE_FEE_RATE = 0; // reserved for future platform fees

export const PROMO_CODES = {
  FRESH2000: { type: "fixed", value: 2000, label: "₦2,000 off your order" },
  SAVE10: { type: "percent", value: 10, label: "10% off your order" },
  WELCOME20: { type: "percent", value: 20, label: "20% welcome discount" },
  FREESHIP: { type: "shipping", value: 0, label: "Free delivery" },
};

export function findPromo(code) {
  if (!code) return null;
  const key = String(code).trim().toUpperCase();
  return PROMO_CODES[key] ? { code: key, ...PROMO_CODES[key] } : null;
}

/**
 * @param {number} subtotal
 * @param {{code:string,type:string,value:number}|null} promo
 * @returns {{subtotal:number,discount:number,delivery:number,total:number,freeDeliveryRemaining:number}}
 */
export function priceOrder(subtotal, promo = null) {
  const discount =
    promo?.type === "percent"
      ? Math.round((subtotal * promo.value) / 100)
      : promo?.type === "fixed"
        ? Math.min(promo.value, subtotal)
        : 0;

  const discountedSubtotal = Math.max(0, subtotal - discount);

  const qualifiesFreeDelivery =
    promo?.type === "shipping" || discountedSubtotal >= FREE_DELIVERY_THRESHOLD;

  const delivery = subtotal === 0 || qualifiesFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;

  return {
    subtotal,
    discount,
    delivery,
    total: discountedSubtotal + delivery,
    freeDeliveryRemaining: Math.max(0, FREE_DELIVERY_THRESHOLD - discountedSubtotal),
  };
}

/** Delivery-window copy shared by product cards, cart and checkout. */
export function deliveryEstimate(date = new Date()) {
  const cutoffHour = 18;
  const isSameDay = date.getHours() < cutoffHour;
  return isSameDay ? "Today, within 2 hours" : "Tomorrow, from 8:00 AM";
}
