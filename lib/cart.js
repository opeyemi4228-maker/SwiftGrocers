export const CART_KEY = 'swift_grocers_cart';

export function getCart() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // notify UI (Navbar, Cart page) that cart changed
  window.dispatchEvent(new Event('cartUpdated'));
  return cart;
}

export function addItem(product, quantity = 1) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === product.id);
  if (idx > -1) {
    cart[idx].quantity = (cart[idx].quantity || 1) + quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || product.category || '',
      quantity,
      addedAt: new Date().toISOString(),
    });
  }
  return saveCart(cart);
}

export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    return saveCart(cart);
  }
  return cart;
}

export function removeItem(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  return saveCart(cart);
}

export function clearCart() {
  return saveCart([]);
}

export function getItemCount() {
  return getCart().reduce((s, i) => s + (i.quantity || 1), 0);
}

export function getTotal() {
  return getCart().reduce((s, i) => s + (i.price * (i.quantity || 1)), 0);
}