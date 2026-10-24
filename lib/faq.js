import { formatPrice } from "@/lib/utils";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE, REFERRAL_REWARD } from "@/lib/commerce";

/**
 * Shared by the on-page FAQ and its FAQPage structured data, so the answers
 * Google may show in results are word-for-word what the page says.
 */
export const HOME_FAQ = [
  {
    q: "How fast is delivery?",
    a: "Most orders arrive in 60 to 120 minutes, depending on your area. Order before 7:00 PM for same day delivery; anything after that goes out first thing the next morning. You can also book a time slot up to a week ahead.",
  },
  {
    q: "Which cities and areas do you deliver to?",
    a: "We deliver across Lagos (Lekki, VI, Ikoyi, Ajah, Ikeja, Yaba, Surulere, Gbagada, Magodo, Festac, Ikorodu), Abuja (Wuse, Maitama, Garki, Asokoro, Jabi, Gwarinpa, Lugbe, Kubwa), Port Harcourt and Ibadan. Enugu, Benin City and Kano are next.",
  },
  {
    q: "How much does delivery cost?",
    a: `Delivery is free on orders over ${formatPrice(FREE_DELIVERY_THRESHOLD)}. Below that it is a flat ${formatPrice(STANDARD_DELIVERY_FEE)} anywhere in our coverage, no surge pricing when it rains.`,
  },
  {
    q: "Can I pay on delivery?",
    a: "Yes. Pay with cash, bank transfer or POS when the rider arrives. You can also pay online by card (Visa, Mastercard, Verve), bank transfer or USSD, no data needed for USSD.",
  },
  {
    q: "What if something arrives bad or the wrong size?",
    a: "Tell us within 24 hours on WhatsApp or in the app and we refund it or replace it, no photos, no argument. If an item is out of stock we call you before substituting anything.",
  },
  {
    q: "Are your prices higher than the market?",
    a: "We buy direct from farms and wholesale markets like Mile 12, Bodija and Dawanau, so most staples cost the same as or less than the market, without the transport, the traffic and the haggling. Every price is shown up front, with no service fee at checkout.",
  },
  {
    q: "Can I order on WhatsApp?",
    a: "Yes. Send your list to our WhatsApp line and a real person builds your order, confirms the total and sends you a payment link, or you pay on delivery.",
  },
  {
    q: "How does SwiftPoints work?",
    a: `You earn 1 point for every ₦100 you spend, and each point is worth ₦1 off a future order. Invite a friend and you both get ${formatPrice(REFERRAL_REWARD)} off when they place their first order.`,
  },
];
