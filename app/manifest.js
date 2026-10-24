export default function manifest() {
  return {
    name: "SwiftGrocers | Foodstuff delivered in 2 hours",
    short_name: "SwiftGrocers",
    description: "Fresh foodstuff and groceries delivered in under two hours in Lagos, Abuja, Port Harcourt and Ibadan.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#0f4d3a",
    lang: "en-NG",
    categories: ["shopping", "food"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "This week's deals", url: "/deals" },
      { name: "Soup packs", url: "/market-packs" },
      { name: "My orders", url: "/orders" },
    ],
  };
}
