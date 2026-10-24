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

/* --- Delivery windows ------------------------------------------------------
   Every time shown to a shopper is computed in Lagos time (WAT, UTC+1, no
   daylight saving) from the real cutoff. Urgency copy is only ever derived
   from that cutoff, never from an invented countdown. */

export const OPENING_HOUR = 7;
export const SAME_DAY_CUTOFF_HOUR = 19;
const WAT_OFFSET_MINUTES = 60;

/** Minutes since midnight, Lagos time. */
function watMinutes(date) {
  return (date.getUTCHours() * 60 + date.getUTCMinutes() + WAT_OFFSET_MINUTES) % 1440;
}

function clockLabel(minutes) {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function durationLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * The next delivery slot for an order placed now.
 * @param {Date} date
 * @param {number} etaMinutes typical door-to-door time for the shopper's zone
 */
export function nextDeliverySlot(date = new Date(), etaMinutes = 120) {
  const now = watMinutes(date);
  const open = OPENING_HOUR * 60;
  const cutoff = SAME_DAY_CUTOFF_HOUR * 60;

  if (now < open) {
    const arrive = Math.ceil((open + etaMinutes) / 15) * 15;
    return {
      sameDay: true,
      label: `Today by ${clockLabel(arrive)}`,
      short: clockLabel(arrive),
      cutoffNote: "Pickers start at 7:00 AM",
      minutesLeft: null,
    };
  }

  if (now < cutoff) {
    const arrive = Math.ceil((now + etaMinutes) / 15) * 15;
    const minutesLeft = cutoff - now;
    return {
      sameDay: true,
      label: `Today by ${clockLabel(arrive)}`,
      short: clockLabel(arrive),
      cutoffNote: `Order in the next ${durationLabel(minutesLeft)} for same day delivery`,
      minutesLeft,
    };
  }

  const arrive = Math.ceil((open + etaMinutes) / 15) * 15;
  return {
    sameDay: false,
    label: `Tomorrow by ${clockLabel(arrive)}`,
    short: `Tomorrow ${clockLabel(arrive)}`,
    cutoffNote: "Same day orders reopen at 7:00 AM",
    minutesLeft: null,
  };
}

/** Delivery-window copy shared by product cards, cart and checkout. */
export function deliveryEstimate(date = new Date(), etaMinutes = 120) {
  return nextDeliverySlot(date, etaMinutes).label;
}

/** Checkout windows, derived from the same clock as everything else. */
export function deliveryWindows(date = new Date(), etaMinutes = 120) {
  const slot = nextDeliverySlot(date, etaMinutes);
  const now = watMinutes(date);
  const windows = [
    { id: "asap", label: slot.sameDay ? "Express" : "First slot tomorrow", detail: slot.label, fee: 0 },
  ];
  if (now < 17 * 60) {
    windows.push({ id: "evening", label: "This evening", detail: "Between 6:00 and 9:00 PM", fee: 0 });
  }
  windows.push({ id: "tomorrow-am", label: "Tomorrow morning", detail: "Between 8:00 and 11:00 AM", fee: 0 });
  windows.push({ id: "tomorrow-pm", label: "Tomorrow afternoon", detail: "Between 1:00 and 4:00 PM", fee: 0 });
  return windows;
}

/* --- Loyalty ---------------------------------------------------------------
   SwiftPoints: 1 point per ₦100 spent, each point worth ₦1 off a later order.
   Showing the points a basket will earn before checkout turns the reward into
   something the shopper already "has", and is reluctant to give up. */

export const POINTS_PER_NAIRA = 1 / 100;
export const POINT_VALUE = 1;
export const REFERRAL_REWARD = 2000;

export const pointsFor = (amount) => Math.floor(Math.max(0, amount) * POINTS_PER_NAIRA);

/* --- Subscribe & save ---------------------------------------------------- */

export const SUBSCRIBE_DISCOUNT = 0.05;

export const SUBSCRIPTION_CADENCES = [
  { id: "weekly", label: "Every week" },
  { id: "fortnightly", label: "Every 2 weeks" },
  { id: "monthly", label: "Every month" },
];

/* --- Payments ------------------------------------------------------------- */

export const PAYMENT_METHODS = [
  { id: "card", label: "Card", detail: "Visa, Mastercard and Verve, secured by Paystack" },
  { id: "transfer", label: "Bank transfer", detail: "Pay into a one time account number, confirmed instantly" },
  { id: "ussd", label: "USSD", detail: "*737#, *894#, *919# and other bank codes, no data needed" },
  { id: "pod", label: "Pay on delivery", detail: "Cash, transfer or POS when the rider arrives" },
];

/** Shareable WhatsApp link with a prefilled message. */
export const WHATSAPP_NUMBER = "2349087206986";
export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
